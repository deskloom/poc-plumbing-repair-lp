const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const LP = require("../docs/lp.js");

const html = () => fs.readFileSync(path.join(__dirname, "../docs/index.html"), "utf8");

test("日中のトイレのつまりは基本料金の範囲をそのまま返す", () => {
  const e = LP.estimate("toilet", "day");
  assert.deepStrictEqual([e.min, e.max], [8000, 20000]);
});

test("深夜・早朝は下限と上限の両方に4000円が加算される", () => {
  const e = LP.estimate("faucet", "midnight");
  assert.deepStrictEqual([e.min, e.max], [9000, 19000]);
});

test("夕方・夜は下限と上限の両方に1500円が加算される", () => {
  const e = LP.estimate("drain", "evening");
  assert.deepStrictEqual([e.min, e.max], [11500, 31500]);
});

test("存在しない症状や時間帯を渡すとnullを返す", () => {
  assert.strictEqual(LP.estimate("unknown", "day"), null);
  assert.strictEqual(LP.estimate("toilet", "unknown"), null);
});

test("すべての症状で下限が上限より小さい", () => {
  for (const t of LP.TROUBLES) assert.ok(t.min < t.max, t.id);
});

test("料金の表示は桁区切りと「〜」で整形される", () => {
  assert.strictEqual(LP.formatEstimate(LP.estimate("toilet", "day")), "8,000円〜20,000円");
});

test("対応エリアの市区町村は対応可と判定される", () => {
  assert.strictEqual(LP.isCovered("みなと市"), true);
  assert.strictEqual(LP.isCovered("  あおば区 "), true);
});

test("対応エリア外や空欄は対応不可と判定される", () => {
  assert.strictEqual(LP.isCovered("そらの村"), false);
  assert.strictEqual(LP.isCovered(""), false);
  assert.strictEqual(LP.isCovered(undefined), false);
});

test("ページに電話ボタンと料金目安・対応エリアの区画が含まれている", () => {
  const h = html();
  assert.ok(h.includes('href="tel:'));
  assert.ok(h.includes('id="estimate"'));
  assert.ok(h.includes('id="area"'));
});

test("ページが外部のURLを読み込んでいない", () => {
  assert.ok(!/(src|href)="https?:/.test(html()));
});
