const data = {
  brandTitle: "TO. COFFEE HAUS",
  productNo: "NO.1",
  productName: "DAILY",
  productDescLines: [
    "가볍고 산뜻한 고소함",
    ", 마시기 편안한 소프트 데일리 커피"
  ],
  cupNote: "캐슈넛 · 카라멜 · 밀크초콜렛",
  origin: "브라질 · 과테말라 · 에티오피아",
  roastText: "미디엄 로스팅",
  roastLevel: 55, // 0~100

  url1: "https://melodious-fox-9c45d7.netlify.app/?id=blend-no1-daily",
  url2: "https://tchbook.netlify.app/",

  backDescription: `산뜻한 고소함과 깔끔한 마무리. 매일 마셔도 질리지 않게,
누구에게나 익숙하지만 디테일이 남는 흐름으로 설계된 데일리 블렌드.

레시피/추천 추출/보관 팁도 여기에 적어두면 좋아.`
};

// === helpers
function $(id){ return document.getElementById(id); }
function escapeHtml(str){
  return str.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}
function setText(id, value){ const el=$(id); if(el) el.textContent=value; }
function setHTML(id, html){ const el=$(id); if(el) el.innerHTML=html; }

// === content setters
function setDesc(lines){
  setHTML("productDesc", lines.map(t => `<div class="kr desc-line">${escapeHtml(t)}</div>`).join(""));
}
function setRoast(level){
  const fill = $("roastFill");
  if(fill) fill.style.width = `${Math.max(0, Math.min(100, level))}%`;
}
function makeQR(targetId, text){
  const target = $(targetId);
  if(!target) return;
  target.innerHTML = "";
  new QRCode(target, {
    text,
    width: 160,
    height: 160,
    correctLevel: QRCode.CorrectLevel.M
  });
}

// === view switching
function showFace(which){
  const faces = [
    { id:"cardFront", btn:"btnFront" },
    { id:"cardBack", btn:"btnBack" },
    { id:"sleeveSim", btn:"btnSim" },
  ];
  faces.forEach(f => {
    const el = $(f.id);
    const b = $(f.btn);
    if(!el || !b) return;
    const active = (f.id === which);
    el.classList.toggle("is-active", active);
    b.classList.toggle("active", active);
  });

  // 시뮬 진입 시: front를 복제해서 simCardInner에 넣기
  if(which === "sleeveSim"){
    mountSimCard();
  }
}

// === guides
function setGuides(on){
  const g = $("guidesFront");
  if(g) g.style.display = on ? "block" : "none";
}

// === simulation
function mountSimCard(){
  const host = $("simCardInner");
  const front = $("cardFront");
  if(!host || !front) return;

  // front의 safe 내부만 복제해서 시뮬 카드에 넣기(가이드 제외)
  const safe = front.querySelector(".safe");
  if(!safe) return;

  const clone = safe.cloneNode(true);

  // clone에서 guides 제거
  const guides = clone.querySelector(".guides");
  if(guides) guides.remove();

  // clone에서 "window-note"도 필요 없으면 제거 가능 (일단 유지)
  host.innerHTML = "";
  host.appendChild(clone);

  // 시뮬 라벨 업데이트
  const simLabel = $("simLabel");
  if(simLabel) simLabel.textContent = `${data.productNo} · ${data.productName}`;

  // 시뮬에서 카드 폭/높이는 CSS 변수로 이미 고정됨
}

// === init
function init(){
  setText("brandTitle", data.brandTitle);
  setText("productNo", data.productNo);
  setText("productName", data.productName);
  setDesc(data.productDescLines);

  setText("cupNote", data.cupNote);
  setText("origin", data.origin);
  setText("roastText", data.roastText);
  setRoast(data.roastLevel);

  setText("backTitle", `${data.productNo} — ${data.productName}`);
  setHTML(
    "backDescription",
    data.backDescription
      .split("\n\n")
      .map(p => `<p class="kr">${escapeHtml(p)}</p>`)
      .join("")
  );

  makeQR("qr1", data.url1);
  makeQR("qr2", data.url2);

  // default guides ON
  setGuides(true);
}

// === events
$("btnFront")?.addEventListener("click", () => showFace("cardFront"));
$("btnBack")?.addEventListener("click", () => showFace("cardBack"));
$("btnSim")?.addEventListener("click", () => showFace("sleeveSim"));

$("toggleGuides")?.addEventListener("change", (e) => {
  setGuides(e.target.checked);
});

$("btnPrint")?.addEventListener("click", () => window.print());

// 시뮬 카드 위치 조절 (mm 단위)
$("simOffset")?.addEventListener("input", (e) => {
  const v = Number(e.target.value); // -18 ~ 18
  // mm로 변환해서 CSS 변수에 적용
  document.documentElement.style.setProperty("--simOffset", `${v}mm`);
});

// 아트(별자리) 미세 조정도 가능하게(필요하면 UI 추가해줄게)
// 지금은 기본 0mm
document.documentElement.style.setProperty("--artOffset", `0mm`);

init();
