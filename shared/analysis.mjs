export const TESTS = [
  {id:"top7-1",mode:"top7",variant:1,title:"TOP 7 — 클래식"},
  {id:"top7-2",mode:"top7",variant:2,title:"TOP 7 — 캐주얼"},
  {id:"genre-1",mode:"genre",variant:1,title:"장르별 — 클래식"},
  {id:"genre-2",mode:"genre",variant:2,title:"장르별 — 캐주얼"}
];
export const GENRES = ["K-pop","Pop","Rock","Hip-hop","R&B / Soul","Electronic","Jazz","Classical","Indie","Metal","Folk / Country","Unclassified"];
const rules = [
 ["K-pop",/k[- ]?pop|korean pop/i],["Hip-hop",/hip.?hop|rap|trap/i],
 ["R&B / Soul",/r&b|rnb|soul|funk/i],["Electronic",/electro|edm|house|techno|trance|ambient/i],
 ["Jazz",/jazz|swing|bebop/i],["Classical",/classical|orchestra|opera/i],
 ["Metal",/metal|deathcore/i],["Rock",/rock|punk|grunge|shoegaze/i],
 ["Indie",/indie|alternative/i],["Folk / Country",/folk|country|bluegrass/i],
 ["Pop",/pop|ballad/i]
];
export function broadGenre(names=[]) {
  for(const genre of names) for(const [label,rx] of rules) if(rx.test(String(genre))) return label;
  return "Unclassified";
}
export function rankArtists(items=[],limit=7) {
  const map=new Map();
  for(const item of items) for(const a of item?.track?.artists||[]) {
    if(!a?.id || !a?.name) continue;
    const v=map.get(a.id)||{id:a.id,name:a.name,count:0,genres:[],group:"Unclassified"};
    v.count++; map.set(a.id,v);
  }
  return [...map.values()].sort((a,b)=>b.count-a.count || a.name.localeCompare(b.name)).slice(0,limit);
}
export function withGenres(artists,genreLookup={},overrides={}) {
  return artists.map(a=>{
    const genres=genreLookup[a.id]||[];
    const suggested=broadGenre(genres);
    const selected=overrides[a.id];
    const valid=GENRES.includes(selected);
    return {...a,genres,group:valid?selected:suggested,source:valid?"manual":suggested==="Unclassified"?"unknown":"spotify"};
  });
}
export function groupsFor(artists=[]) {
  const map=new Map();
  for(const a of artists) {
    const g=GENRES.includes(a.group)?a.group:"Unclassified";
    if(!map.has(g))map.set(g,[]);
    map.get(g).push(a);
  }
  return [...map].map(([name,members])=>({name,members})).sort((a,b)=>b.members.length-a.members.length||a.name.localeCompare(b.name));
}
export function planFor(artists,id) {
  const test=TESTS.find(t=>t.id===id);
  if(!test)throw Error("Unknown test");
  if(!artists?.length)throw Error("Choose members first");
  const members=artists.slice(0,7);
  return {...test,members,groups:test.mode==="genre"?groupsFor(members):[{name:"Top 7",members}]};
}
