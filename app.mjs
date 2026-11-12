import { TESTS, GENRES, planFor } from "./shared/analysis.mjs";
import { generateImage, imageConfig } from "./images.mjs";

const $ = id => document.getElementById(id);
const roster = Array.from({ length: 7 }, () => ({ name: "", group: "Unclassified" }));
const records = [];
const pending = new Set();
const cfg = await imageConfig();
$("imageStatus").textContent = cfg.mockImages ? "모의 이미지 모드 (무료)" :
 cfg.imageReady ? "실제 이미지 모드 · 생성마다 API 과금 가능" : "이미지 생성 설정이 필요합니다.";

function rosterChanged() {
 const count = roster.filter(member => member.name).length;
 $("counts").textContent = `${count} / 7명 입력`;
 renderCards();
}

const exampleRoster = [
 ["달빛", "Jazz"], ["파도", "Pop"], ["별무리", "Jazz"],
 ["새벽", "R&B / Soul"], ["노을", "Pop"], ["하늘", "Rock"], ["바람", "R&B / Soul"],
];
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
  if (member.name) continue;
  const [name, group] = exampleRoster[index];
  const { input, select } = rosterFields[index];
  input.value = member.name = name;
  if (member.group === "Unclassified") select.value = member.group = group;
 }
 rosterChanged();
});
function renderCards(){
 const root=$("cards");root.replaceChildren();
 for(const t of TESTS){
  const card=document.createElement("article");card.className="card";
  const h=document.createElement("h3");h.textContent=t.title;
  const names=document.createElement("p");
  const p=roster.every(member => member.name)?planFor(roster,t.id):null;
  names.textContent=p?(t.mode==="genre"?p.groups.map(g=>g.name+": "+g.members.map(m=>m.name).join(", ")).join(" | "):p.members.map(a=>a.name).join(" · ")):"멤버 7명을 입력하면 생성할 수 있습니다.";
  const pic=document.createElement("div");const button=document.createElement("button");button.textContent="이 사진 생성";button.disabled=!p||!cfg.imageReady||pending.has(t.id);
  if(pending.has(t.id))button.textContent="생성 중…";
  const output=records.find(r=>r.id===t.id&&r.dataUrl);
  if(output){const img=document.createElement("img");img.src=output.dataUrl;img.alt=t.title+" 가상 가족사진";pic.append(img);const save=document.createElement("button");save.className="subtle";save.textContent="이미지 저장";save.onclick=()=>downloadData(output.dataUrl,t.id+(output.mock?".svg":".png"));pic.append(save);}
  button.addEventListener("click",async()=>{
   if(pending.has(t.id))return;
   pending.add(t.id);
   renderCards();
   const entry={id:t.id,time:new Date().toISOString(),mode:t.mode,variant:t.variant,memberCount:p.members.length,groups:p.groups.map(g=>({name:g.name,count:g.members.length}))};
   try{
    const data = await generateImage({ mode: t.mode, variant: t.variant });
    entry.result="success";entry.mock=data.mock;entry.dataUrl=data.dataUrl;
   }catch(error){entry.result="failure";entry.error=error.message;alert(error.message);}
   pending.delete(t.id);
   const previous = records.findIndex(record => record.id === t.id);
   if(previous !== -1) records.splice(previous, 1);
   records.push(entry);
   renderCards();
   renderLog();
  });
  card.append(h,names,pic,button);root.append(card);
 }
}
function downloadData(src,name){const a=document.createElement("a");a.href=src;a.download=name;a.click();}
function renderLog(){$("log").textContent=JSON.stringify(records.map(({dataUrl,...rest})=>rest),null,2)||"[]";}
$("downloadLog").onclick=()=>{const blob=new Blob([JSON.stringify(records.map(({dataUrl,...rest})=>rest),null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);downloadData(url,"music-family-test-log.json");setTimeout(()=>URL.revokeObjectURL(url),2000);};
rosterChanged();
renderLog();
