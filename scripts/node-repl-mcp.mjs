#!/usr/bin/env node
// Persistent Node.js REPL exposed as a Model Context Protocol (MCP) server.
//
// This is the Claude Code equivalent of Codex's bundled `node_repl` tool: it
// keeps a long-lived Node context alive for the duration of the session, so
// variables, `const`/`let`/`function`/`class` declarations, `require`d modules,
// and any other state persist across separate `node_eval` calls. Top-level
// `await` is supported.
//
// Transport: newline-delimited JSON-RPC 2.0 over stdio (the MCP stdio
// transport). stdout is reserved exclusively for protocol messages, so all
// `console` output produced by evaluated code is captured and returned in the
// tool result instead of being written to the real stdout.
//
// Zero runtime dependencies — only Node built-ins.

import vm from 'node:vm';
import util from 'node:util';
import path from 'node:path';
import { Writable } from 'node:stream';
import { createRequire } from 'node:module';

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_INFO = { name: 'node-repl', version: '1.0.0' };

// --- stdout is the JSON-RPC channel; never write anything else to it. ---
function send(message) {
  process.stdout.write(JSON.stringify(message) + '\n');
}

// Captures everything evaluated code prints via console.* into a buffer so it
// can be returned in the tool result rather than corrupting the stdio channel.
let captureBuffer = '';
const captureConsole = new console.Console({
  stdout: new Writable({ write(chunk, _enc, cb) { captureBuffer += chunk.toString(); cb(); } }),
  stderr: new Writable({ write(chunk, _enc, cb) { captureBuffer += chunk.toString(); cb(); } }),
});

// `require` resolved relative to the project root, so evaluated code can pull
// in both Node built-ins and the project's own modules / dependencies.
const projectRequire = createRequire(path.join(process.cwd(), 'index.js'));

// Build (or rebuild) the persistent evaluation context.
let context;
function createContext() {
  const sandbox = {
    console: captureConsole,
    require: projectRequire,
    process,
    Buffer,
    setTimeout, clearTimeout, setInterval, clearInterval,
    setImmediate, clearImmediate, queueMicrotask,
    URL, URLSearchParams, TextEncoder, TextDecoder,
    structuredClone, fetch, AbortController,
    __filename: 'node_eval',
    __dirname: process.cwd(),
  };
  context = vm.createContext(sandbox);
}
createContext();

// Evaluate code in the persistent context. A staged cascade of wrappings is
// tried in order; each candidate is *compiled* first, and only run if it
// compiles, so a candidate that fails to parse never executes (no risk of
// double-running side effects). The forms, in order:
//   1. expression            -> captures the value, lets `{a:1}` parse as object
//   2. async expression      -> same, for a single top-level `await` expression
//   3. statements            -> declarations persist (let/const/var/function)
//   4. async statements      -> statement block containing top-level `await`
async function runEval(code) {
  captureBuffer = '';
  const candidates = [
    { src: `(${code}\n)`, isAsync: false },
    { src: `(async () => (${code}\n))()`, isAsync: true },
    { src: code, isAsync: false },
    { src: `(async () => { ${code}\n })()`, isAsync: true },
  ];

  let lastCompileError;
  for (const candidate of candidates) {
    let script;
    try {
      script = new vm.Script(candidate.src, { filename: 'node_eval' });
    } catch (err) {
      lastCompileError = err; // Doesn't parse in this form — try the next.
      continue;
    }
    try {
      let result = script.runInContext(context);
      if (candidate.isAsync) result = await result;
      return { result, output: captureBuffer };
    } catch (err) {
      // Compiled and ran, but threw — this is a genuine runtime error.
      return { err, output: captureBuffer };
    }
  }
  return { err: lastCompileError, output: captureBuffer };
}

// Strip the server's own frames from an error stack so it reads like a REPL.
function cleanStack(err) {
  const raw = err && err.stack ? err.stack : 'Error: ' + String(err);
  const drop = /node-repl-mcp\.mjs|node:vm|node:internal|Script\.runInContext/;
  return raw
    .split('\n')
    .filter((line) => !drop.test(line))
    .join('\n')
    .trimEnd();
}

function formatResult({ err, result, output }) {
  let text = output || '';
  const sep = () => (text && !text.endsWith('\n') ? '\n' : '');
  if (err) {
    text += sep() + cleanStack(err);
  } else if (result !== undefined) {
    text += sep() + util.inspect(result, { depth: 4, colors: false });
  }
  if (text === '') text = '(no output)';
  return text;
}

const TOOLS = [
  {
    name: 'node_eval',
    description:
      'Evaluate JavaScript / Node.js code in a persistent REPL session. ' +
      'Variables and declarations (const/let/var/function/class) and require()d ' +
      'modules persist across calls, exactly like an interactive Node REPL. ' +
      'Top-level await is supported. Returns captured console output plus the ' +
      'value of the final expression. Note: to keep the result of a top-level ' +
      "await across calls, assign without a declaration keyword (e.g. " +
      '`data = await fetch(url)`) so it lands on the persistent global scope.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'JavaScript source to evaluate.' },
      },
      required: ['code'],
    },
  },
  {
    name: 'node_reset',
    description: 'Discard all REPL state and start a fresh, empty Node context.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function handleToolCall(params) {
  const name = params && params.name;
  const args = (params && params.arguments) || {};
  if (name === 'node_eval') {
    const outcome = await runEval(String(args.code ?? ''));
    return { content: [{ type: 'text', text: formatResult(outcome) }], isError: !!outcome.err };
  }
  if (name === 'node_reset') {
    createContext();
    return { content: [{ type: 'text', text: 'REPL context reset.' }] };
  }
  return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
}

async function handleMessage(line) {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return; // Ignore unparseable input.
  }

  const { id, method, params } = msg;
  const isRequest = id !== undefined && id !== null;

  try {
    switch (method) {
      case 'initialize':
        send({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: (params && params.protocolVersion) || PROTOCOL_VERSION,
            capabilities: { tools: {} },
            serverInfo: SERVER_INFO,
          },
        });
        return;
      case 'tools/list':
        send({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
        return;
      case 'tools/call': {
        const result = await handleToolCall(params);
        send({ jsonrpc: '2.0', id, result });
        return;
      }
      case 'ping':
        send({ jsonrpc: '2.0', id, result: {} });
        return;
      default:
        // Notifications (no id) need no response; requests for unknown methods do.
        if (isRequest) {
          send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
        }
    }
  } catch (err) {
    if (isRequest) {
      send({ jsonrpc: '2.0', id, error: { code: -32603, message: String(err && err.message ? err.message : err) } });
    }
  }
}

// --- Read newline-delimited JSON-RPC from stdin. ---
// Messages are handled strictly in order: each is chained onto the previous
// one's completion so evaluations never interleave or race a reset.
let buffer = '';
let queue = Promise.resolve();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (line) queue = queue.then(() => handleMessage(line));
  }
});
process.stdin.on('end', () => process.exit(0));
