/**
 * vendor-logos.mjs — 厂商品牌 logo 映射（官方站点 favicon/apple-touch-icon 彩色原标）。
 * 文件存于 assets/logos/<vendor_id>.<ext>，构建时拷入 dist/assets/logos/。
 * vendorMark() 返回 <img> 引用；logoBase 为页面相对的资产目录前缀。
 */

export const LOGO_EXT = {
  openai: "png",
  anthropic: "png",
  google: "png",
  xai: "png",
  meta: "jpg",
  mistral: "png",
  kimi: "png",
  deepseek: "png",
  glm: "png",
  minimax: "png",
  qwen: "png",
  doubao: "png",
  xiaomi: "svg",
  tencent: "png",
  stepfun: "png",
  microsoft: "png",
};

export function vendorMark(vendorId, size = 16, logoBase = "/assets/logos/") {
  const ext = LOGO_EXT[vendorId];
  if (!ext) return "";
  const base = logoBase.endsWith("/") ? logoBase : logoBase + "/";
  return `<img class="vlogo-img" src="${base}${vendorId}.${ext}" width="${size}" height="${size}" alt="" loading="lazy">`;
}
