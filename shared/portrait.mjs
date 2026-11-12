export function parsePortrait(body){
  if(!body || typeof body!=="object" || Array.isArray(body)) throw Error("Invalid request");
  if(!["top7","genre"].includes(body.mode)) throw Error("Invalid mode");
  if(![1,2].includes(body.variant)) throw Error("Invalid variant");
  if(Object.keys(body).some(k=>!["mode","variant"].includes(k))) throw Error("Unsupported field");
  return {mode:body.mode,variant:body.variant};
}
export function promptFor({mode,variant}){
  const setting=variant===1?"a warm vintage family portrait in a photography studio":"a cheerful candid family gathering in a sunlit living room";
  const layout=mode==="genre"?"Arrange seven fictional adult people into visually distinct clusters, with small spaces between each group.":"Arrange seven fictional adult people in one close-knit group.";
  return "Create a sophisticated, photorealistic picture of seven FICTIONAL adult people, no celebrities, no logos, no typography. Scene: "+setting+". "+layout+" Diverse appearances and ages (all adults), natural expressions, clearly visible seven faces, landscape 3:2 composition.";
}
export function mockSvg({mode,variant}){
  const bg=variant===1?"#e0c9b1":"#a9d8d0";
  const xs=mode==="genre"?[160,265,370,535,640,745,850]:[185,300,415,530,645,760,875];
  return '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="682" viewBox="0 0 1024 682"><rect width="1024" height="682" fill="'+bg+'"/><text x="512" y="78" font-size="28" text-anchor="middle" font-family="sans-serif" fill="#253a40">MOCK IMAGE · '+mode.toUpperCase()+' '+variant+'</text>'+xs.map((x,i)=>'<circle cx="'+x+'" cy="'+(i%2?296:274)+'" r="43" fill="#735b55"/><rect x="'+(x-55)+'" y="335" width="110" height="180" rx="42" fill="'+(i%2?"#415b69":"#b47c6f")+'"/>').join("")+'<text x="512" y="625" text-anchor="middle" font-family="sans-serif" font-size="23" fill="#253a40">API test placeholder — no paid image generated</text></svg>';
}
