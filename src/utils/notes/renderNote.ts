/**
 * Notes 正文渲染
 *
 * 使用 @astrojs/markdown-remark 的 createMarkdownProcessor 独立渲染，
 * 复用站点的 Shiki 主题与中文排版插件，但不挂 remarkToc / remarkReadingTime
 * 等只适用于博客文章的插件。
 */
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { remarkCjkSpacing } from "@/utils/remarkCjkSpacing";

type Processor = Awaited<ReturnType<typeof createMarkdownProcessor>>;

let processorPromise: Promise<Processor> | null = null;

function getProcessor(): Promise<Processor> {
  processorPromise ??= createMarkdownProcessor({
    gfm: true,
    shikiConfig: {
      // 与 astro.config.ts 保持一致，保证代码块配色统一
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
    },
    remarkPlugins: [remarkCjkSpacing],
  });

  return processorPromise;
}

export async function renderNoteBody(body: string): Promise<string> {
  if (!body.trim()) return "";

  const processor = await getProcessor();
  const { code } = await processor.render(body);
  return code;
}
