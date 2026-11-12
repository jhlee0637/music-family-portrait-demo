import { mockSvg, parsePortrait } from "./shared/portrait.mjs";

export async function generateImage({ mode, variant, groupSizes }) {
 const svg = mockSvg(parsePortrait({ mode, variant }), groupSizes);
 return { dataUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg) };
}
