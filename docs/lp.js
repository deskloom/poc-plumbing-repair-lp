(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.LP = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const TROUBLES = [
    { id: "toilet", label: "トイレのつまり", min: 8000, max: 20000 },
    { id: "faucet", label: "蛇口の水漏れ", min: 5000, max: 15000 },
    { id: "drain", label: "排水管のつまり", min: 10000, max: 30000 },
    { id: "pipe", label: "水道管の破裂・漏水", min: 15000, max: 50000 },
  ];

  const TIME_SLOTS = [
    { id: "day", label: "日中（8時〜18時）", surcharge: 0 },
    { id: "evening", label: "夕方・夜（18時〜22時）", surcharge: 1500 },
    { id: "midnight", label: "深夜・早朝（22時〜翌8時）", surcharge: 4000 },
  ];

  const AREAS = [
    "みなと市", "あおば区", "さくら台", "こがね町", "ひので市", "つばき区",
    "ふじが丘", "はまかぜ市",
  ];

  function estimate(troubleId, slotId) {
    const t = TROUBLES.find((x) => x.id === troubleId);
    const s = TIME_SLOTS.find((x) => x.id === slotId);
    if (!t || !s) return null;
    return { min: t.min + s.surcharge, max: t.max + s.surcharge, trouble: t.label, slot: s.label };
  }

  function isCovered(city) {
    const name = String(city || "").trim();
    return name !== "" && AREAS.includes(name);
  }

  function yen(n) {
    return n.toLocaleString("ja-JP") + "円";
  }

  function formatEstimate(e) {
    return e ? yen(e.min) + "〜" + yen(e.max) : "";
  }

  return { TROUBLES, TIME_SLOTS, AREAS, estimate, isCovered, formatEstimate, yen };
});
