import { toString } from "mdast-util-to-string";
import { readingTime } from "reading-time-estimator";

/**
 * remark 阅读时长插件
 *
 * 使用 mdast-util-to-string 提取 markdown 正文纯文本，
 * 再交给 reading-time-estimator（支持中文分词）计算阅读时长。
 * 结果写入 frontmatter.minutesRead，供页面渲染。
 *
 * 参考：https://docs.astro.build/zh-cn/recipes/reading-time/
 */
export function remarkReadingTime() {
  return function (
    tree: unknown,
    { data }: { data: { astro?: { frontmatter?: Record<string, unknown> } } }
  ) {
    const textOnPage = toString(tree as Parameters<typeof toString>[0]);
    const { minutes } = readingTime(textOnPage, {
      wordsPerMinute: 300, // 中文阅读速度，约 300 字/分钟
    });
    if (data.astro?.frontmatter) {
      // 展示为 "5 min read" 样式，至少 1 分钟
      const min = Math.max(1, Math.round(minutes));
      data.astro.frontmatter.minutesRead = `${min} min read`;
      data.astro.frontmatter.minutes = min;
    }
  };
}
