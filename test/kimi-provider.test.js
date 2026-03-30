import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

const filePath = path.join(process.cwd(), "extensions", "kimi-provider.ts");
const source = fs.readFileSync(filePath, "utf8");

function getModelIds() {
  const re = /kimiModel\("([^"]+)",/g;
  const ids = [];
  let match;
  while ((match = re.exec(source)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

function getModelBlock(id) {
  const start = source.indexOf(`kimiModel(\"${id}\",`);
  if (start === -1) {
    return null;
  }
  const end = source.indexOf("}),", start);
  if (end === -1) {
    return null;
  }
  return source.slice(start, end);
}

function parseNumberInBlock(block, key) {
  const re = new RegExp(`${key}:\\s*(\\d+)`, "i");
  const match = block?.match(re);
  return match ? Number(match[1]) : NaN;
}

test("registers kimi provider config", () => {
  assert.ok(source.includes('pi.registerProvider("kimi-coding", {'));
  assert.ok(source.includes('baseUrl: "https://api.kimi.com/coding"'));
  assert.ok(source.includes('api: "anthropic-messages"'));
  assert.ok(source.includes('apiKey: "KIMI_API_KEY"'));
  assert.ok(source.includes('authHeader: true'));
  assert.ok(source.includes('oauth: {'));
  assert.ok(source.includes('name: "Kimi Code (API Key)"'));
  assert.ok(source.includes('callbacks.onPrompt'));
  assert.ok(source.includes('getApiKey(credentials)'));
});

test("registers exactly expected Kimi models", () => {
  const ids = getModelIds();
  const expected = ["kimi-for-coding", "k2p5", "kimi-k2-thinking"];

  assert.deepEqual(ids.sort(), expected.sort());
  assert.equal(new Set(ids).size, ids.length);
});

test("all models have 262144 context and 32768 output", () => {
  for (const id of ["kimi-for-coding", "k2p5", "kimi-k2-thinking"]) {
    const block = getModelBlock(id);
    assert.ok(block, `Missing block for ${id}`);
    assert.equal(parseNumberInBlock(block, "contextWindow"), 262144);
    assert.equal(parseNumberInBlock(block, "maxTokens"), 32768);
  }
});

test("kimi-k2-thinking is text only", () => {
  const block = getModelBlock("kimi-k2-thinking");
  assert.ok(block);
  assert.ok(block.includes('input: ["text"]'));
});

test("all models use shared helper defaults", () => {
  assert.ok(source.includes("reasoning: true"));
  assert.ok(source.includes("cacheRead"));
  assert.ok(source.includes("cacheWrite"));
  const ids = getModelIds();
  for (const id of ids) {
    const block = getModelBlock(id);
    assert.ok(block, `Missing block for ${id}`);
  }
});

test("README documents the same model set", () => {
  const readme = fs.readFileSync(path.join(process.cwd(), "README.md"), "utf8");
  for (const id of ["kimi-for-coding", "k2p5", "kimi-k2-thinking"]) {
    assert.ok(readme.includes(id), `README missing ${id}`);
  }
});
