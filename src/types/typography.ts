/**
 * 文章排版预设（frontmatter.typography）
 *
 * - `default`：现状，Rubik 无衬线、无首行缩进，不产生任何额外属性与请求
 * - `kai`：仓耳今楷 02 + 首行缩进，按需加载分片字体
 * - `serif`：系统宋体栈 + 首行缩进，不产生字体请求
 */
export const POST_TYPOGRAPHY = ["default", "kai", "serif"] as const;

export type PostTypography = (typeof POST_TYPOGRAPHY)[number];

/**
 * 预设 → 需要额外加载的字体样式表（相对 `public` 的路径）。
 * 未列出的预设不会发出任何字体请求。
 */
export const TYPOGRAPHY_FONT_CSS: Partial<Record<PostTypography, string>> = {
  kai: "fonts/jinkai.css",
};
