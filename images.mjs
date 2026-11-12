import { mockSvg, parsePortrait } from "./shared/portrait.mjs";

export async function imageConfig() {
 return { mockImages: true, imageReady: true };
}

export async function generateImage(request) {
 const svg = mockSvg(parsePortrait(request));
 return { dataUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg), mock: true };
}
