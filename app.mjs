import { generateImage } from "./images.mjs";

const $ = id => document.getElementById(id);
const maxPeople = 7;
const rows = new Map();
let generating = false;

function selection() {
 const groups = new Map();
 let valid = true;
 for (const { genre, count } of rows.values()) {
  const name = genre.value.trim();
  const size = Number(count.value);
  if (!name || !Number.isInteger(size) || size < 1 || size > maxPeople) {
   valid = false;
   continue;
  }
  groups.set(name, (groups.get(name) ?? 0) + size);
 }
 const total = [...groups.values()].reduce((sum, size) => sum + size, 0);
 return { groups, total, valid: valid && total >= 1 && total <= maxPeople };
}

function update() {
 const { groups, total, valid } = selection();
 $("counts").textContent = total > maxPeople ? `현재 ${total}명입니다. 최대 7명까지 선택할 수 있습니다.` :
  `${total} / 최대 7명 · 각 줄에 장르와 인원을 입력하세요.`;
 $("selection").textContent = [...groups].map(([genre, size]) => `${genre} ${size}명`).join(" · ");
 $("generate").disabled = !valid || generating;
}

function addGenre(name = "", size = 1) {
 const row = document.createElement("div");
 row.className = "artist";
 const genreLabel = document.createElement("label");
 genreLabel.textContent = "장르";
 const genre = document.createElement("input");
 genre.placeholder = "예: 재즈";
 genre.value = name;
 genreLabel.append(genre);
 const countLabel = document.createElement("label");
 countLabel.textContent = "인원";
 const count = document.createElement("input");
 count.type = "number";
 count.min = 1;
 count.max = maxPeople;
 count.step = 1;
 count.value = size;
 countLabel.append(count);
 const remove = document.createElement("button");
 remove.type = "button";
 remove.className = "subtle";
 remove.textContent = "장르 삭제";
 remove.addEventListener("click", () => {
  rows.delete(row);
  row.remove();
  update();
 });
 for (const input of [genre, count]) input.addEventListener("input", update);
 row.append(genreLabel, countLabel, remove);
 rows.set(row, { genre, count });
 $("genres").append(row);
 update();
 return genre;
}

$("addGenre").addEventListener("click", () => addGenre().focus());
$("fillExample").addEventListener("click", () => {
 rows.clear();
 $("genres").replaceChildren();
 for (const [genre, size] of [["재즈", 2], ["록", 2], ["소울", 1]]) addGenre(genre, size);
});

$("generate").addEventListener("click", async () => {
 const { groups, total, valid } = selection();
 if (!valid || generating) return;
 generating = true;
 update();
 const result = $("result");
 try {
  const data = await generateImage({
   mode: "genre", variant: 1, groupSizes: [...groups.values()],
  });
  const caption = document.createElement("p");
  caption.textContent = [...groups].map(([genre, size]) => `${genre} ${size}명`).join(" · ");
  const image = document.createElement("img");
  image.src = data.dataUrl;
  image.alt = `${total}인 가족사진 배치 미리보기`;
  const save = document.createElement("a");
  save.href = data.dataUrl;
  save.download = "music-family-portrait.svg";
  save.textContent = "미리보기 저장";
  result.replaceChildren(caption, image, save);
  result.hidden = false;
 } finally {
  generating = false;
  update();
 }
});
addGenre();
