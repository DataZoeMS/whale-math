const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const assert = require("node:assert/strict");

const html = readFileSync(join(__dirname, "index.html"), "utf8");
const source = html.match(/<script id="game-script">([\s\S]*?)<\/script>/)[1];
const context = vm.createContext({});
vm.runInContext(source, context);
const { makeFacts, makeChoices, explanation, shuffle, validateSettings, DEFAULTS, LIMITS } = context.WhaleMath;
const operations = ["add", "subtract", "multiply", "divide"];
const config = (limit, ops = operations, focus = [], order = "sequential") => ({ limit, operations: ops, focus, order });

test("defaults are range 10, with all requested operations available", () => {
  assert.equal(DEFAULTS.limit, 10);
  assert.deepEqual(new Set(makeFacts(config(10)).map(f => f.op)), new Set(operations));
});

test("every supported range generates correct, unique, nonnegative integer facts", () => {
  for (const limit of LIMITS) {
    const facts = makeFacts(config(limit));
    assert.ok(facts.length > 0);
    assert.equal(new Set(facts.map(f => f.key)).size, facts.length);
    for (const f of facts) {
      assert.ok([f.a, f.b, f.answer].every(n => Number.isInteger(n) && n >= 0));
      if (f.op === "add") { assert.equal(f.a + f.b, f.answer); assert.ok(f.answer <= limit); }
      if (f.op === "subtract") { assert.equal(f.a - f.b, f.answer); assert.ok(f.a <= limit); }
      if (f.op === "multiply") { assert.equal(f.a * f.b, f.answer); assert.ok(f.a <= limit && f.b <= limit); }
      if (f.op === "divide") { assert.ok(f.b > 0); assert.equal(f.a / f.b, f.answer); assert.ok(f.b <= limit && f.answer <= limit); }
    }
  }
});

test("all facts have four unique numeric choices with exactly one correct answer", () => {
  for (const f of makeFacts(config(20))) {
    for (const random of [() => 0, () => 0.99999, Math.random]) {
      const choices = makeChoices(f, random);
      assert.equal(choices.length, 4);
      assert.equal(new Set(choices).size, 4);
      assert.equal(choices.filter(n => n === f.answer).length, 1);
      assert.ok(choices.every(n => Number.isInteger(n) && n >= 0));
    }
  }
});

test("focus 2 and 4 applies to the added/removed number, multiplier and divisor", () => {
  for (const limit of LIMITS) {
    const facts = makeFacts(config(limit, operations, [4, 2]));
    assert.ok(facts.every(f => f.b === 2 || f.b === 4));
    for (const op of operations) assert.deepEqual(new Set(facts.filter(f => f.op === op).map(f => f.b)), new Set([2, 4]));
  }
});

test("sequential facts are ordered by operation, focus number, then ascending first operand", () => {
  const facts = makeFacts(config(10, ["divide", "subtract", "multiply", "add"], [4, 2]));
  for (let i = 1; i < facts.length; i++) {
    const prev = facts[i - 1], next = facts[i];
    const pi = operations.indexOf(prev.op), ni = operations.indexOf(next.op);
    assert.ok(ni > pi || (ni === pi && (next.b > prev.b || (next.b === prev.b && next.a >= prev.a))));
  }
  const twos = facts.filter(f => f.op === "multiply" && f.b === 2);
  assert.deepEqual(Array.from(twos, f => f.a), Array.from({ length: 11 }, (_, i) => i));
});

test("shuffle preserves the exact selected fact set without mutating or duplicating", () => {
  const facts = makeFacts(config(10, ["multiply", "divide"], [2, 4]));
  const original = facts.map(f => f.key).join(",");
  const mixed = shuffle(facts, () => 0.3);
  assert.equal(facts.map(f => f.key).join(","), original);
  assert.equal(mixed.length, facts.length);
  assert.equal(new Set(mixed.map(f => f.key)).size, facts.length);
  assert.deepEqual(new Set(mixed.map(f => f.key)), new Set(facts.map(f => f.key)));
  assert.notEqual(mixed.map(f => f.key).join(","), original);
});

test("every explanation conserves every whale and gives accurate group sizes", () => {
  for (const f of makeFacts(config(20))) {
    const model = explanation(f);
    const before = model.before.flatMap(g => g.whales);
    const after = model.after.flatMap(g => g.whales);
    assert.equal(before.length, model.total);
    assert.equal(after.length, model.total);
    assert.equal(new Set(before.map(w => w.id)).size, model.total);
    assert.equal(new Set(after.map(w => w.id)).size, model.total);
    assert.equal([...before].sort((a, b) => a.id - b.id).map(w => `${w.id}:${w.species}`).join(","),
      [...after].sort((a, b) => a.id - b.id).map(w => `${w.id}:${w.species}`).join(","));
    if (f.op === "add") {
      assert.equal(model.before[0].whales.length, f.a);
      assert.equal(model.before[1].whales.length, f.b);
      assert.ok(model.before[0].whales.every(w => w.species === "humpback"));
      assert.ok(model.before[1].whales.every(w => w.species === "orca"));
      assert.equal(model.after[0].whales.length, f.answer);
    } else if (f.op === "subtract") {
      assert.equal(model.before[0].whales.length, f.a);
      assert.equal(model.after[0].whales.length, f.answer);
      assert.equal(model.after[1].whales.length, f.b);
      assert.equal(model.after[1].removed, true);
    } else if (f.op === "multiply") {
      assert.equal(model.before.length, Math.max(1, f.a));
      if (f.a) assert.ok(model.before.every(g => g.whales.length === f.b));
      assert.equal(model.after[0].whales.length, f.answer);
    } else {
      assert.equal(model.before[0].whales.length, f.a);
      assert.equal(model.after.length, f.b);
      assert.ok(model.after.every(g => g.whales.length === f.answer));
    }
  }
});

test("zero cases and largest products are represented without dropping whales", () => {
  const facts = makeFacts(config(20));
  for (const op of operations) {
    const zero = facts.find(f => f.op === op && f.answer === 0);
    assert.ok(zero);
    assert.ok(explanation(zero).after.length > 0);
  }
  const max = facts.find(f => f.op === "multiply" && f.a === 20 && f.b === 20);
  assert.equal(explanation(max).total, 400);
});

test("invalid settings fail explicitly", () => {
  for (const bad of [
    null, {}, config(100), config(10, []), config(10, ["bogus"]),
    config(10, ["add", "add"]), config(10, ["add"], [11]),
    config(10, ["add"], [0]), config(10, ["add"], [2, 2]),
    config(10, ["add"], [], "invalid")
  ]) assert.throws(() => validateSettings(bad));
});
