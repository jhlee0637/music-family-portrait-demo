import { GENRES, planFor } from "./shared/analysis.mjs";
import { generateImage } from "./images.mjs";

const $ = id => document.getElementById(id);
const roster = Array.from({ length: 7 }, () => ({ name: "", group: "Unclassified" }));
const exampleRoster = ["John Lennon", "Paul McCartney", "George Harrison", "Ringo Starr"];

function selectedPlan() {
 const members = roster.filter(member => member.name);
 return members.length ? planFor(members, `${$("layout").value}-1`) : null;
}

function rosterChanged() {
 const plan = selectedPlan();
 $("counts").textContent = `${plan?.members.length ?? 0} / 최대 7명`;
 $("selection").textContent = plan?.groups.map(group =>
  group.members.map(member => member.name).join(" · ")).join(" | ") ?? "한 명 이상 입력하세요.";
 $("generate").disabled = !plan;
}

const rosterFields = [];
for (const [index, member] of roster.entries()) {
 const row = document.createElement("div");
 row.className = "artist";
 const label = document.createElement("label");
 label.textContent = `멤버 ${index + 1}`;
 const input = document.createElement("input");
 input.maxLength = 100;
 label.append(input);
 const select = document.createElement("select");
 select.setAttribute("aria-label", `멤버 ${index + 1} 장르`);
 for (const genre of GENRES) select.add(new Option(genre === "Unclassified" ? "미분류" : genre, genre));
 select.value = member.group;
 input.addEventListener("input", () => {
  member.name = input.value.trim();
  rosterChanged();
 });
 select.addEventListener("change", () => {
  member.group = select.value;
  rosterChanged();
 });
 rosterFields.push({ input, select });
 row.append(label, select);
 $("artists").append(row);
}
$("fillExample").addEventListener("click", () => {
 for (const [index, member] of roster.entries()) {
  const { input, select } = rosterFields[index];
  input.value = member.name = exampleRoster[index] ?? "";
  select.value = member.group = member.name ? "Rock" : "Unclassified";
 }
 rosterChanged();
});
$("layout").addEventListener("change", rosterChanged);

$("generate").addEventListener("click", async () => {
 const plan = selectedPlan();
 if (!plan) return;
 const result = $("result");
 const data = await generateImage({
  mode: plan.mode, variant: plan.variant, groupSizes: plan.groups.map(group => group.members.length),
 });
 const image = document.createElement("img");
 image.src = data.dataUrl;
 image.alt = `${plan.members.length}인 가족사진 배치 미리보기`;
 const save = document.createElement("a");
 save.href = data.dataUrl;
 save.download = "music-family-portrait.svg";
 save.textContent = "미리보기 저장";
 result.replaceChildren(image, save);
 result.hidden = false;
});
rosterChanged();
