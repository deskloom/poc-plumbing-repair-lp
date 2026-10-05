(function () {
  const $ = (id) => document.getElementById(id);
  const trouble = $("trouble"), slot = $("slot"), city = $("city");

  LP.TROUBLES.forEach((t) => trouble.add(new Option(t.label, t.id)));
  LP.TIME_SLOTS.forEach((s) => slot.add(new Option(s.label, s.id)));
  $("area-list").textContent = LP.AREAS.join("、");

  function renderEstimate() {
    const e = LP.estimate(trouble.value, slot.value);
    $("est-label").textContent = e.trouble + "・" + e.slot;
    $("est-price").textContent = LP.formatEstimate(e);
  }

  function renderArea() {
    const el = $("area-result");
    const name = city.value.trim();
    if (!name) {
      el.textContent = "市区町村名を入力してください";
      el.className = "";
    } else if (LP.isCovered(name)) {
      el.textContent = name + "は対応エリアです";
      el.className = "ok";
    } else {
      el.textContent = name + "は対応エリア外です。お電話でご相談ください";
      el.className = "ng";
    }
  }

  trouble.addEventListener("change", renderEstimate);
  slot.addEventListener("change", renderEstimate);
  city.addEventListener("input", renderArea);
  renderEstimate();
  renderArea();
})();
