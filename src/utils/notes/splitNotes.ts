/**
 * Notes 切分与元数据解析
 *
 * 约定：
 *   - 单文件存放所有速记，文件顶部可用 YAML frontmatter 定义整页 title / description
 *   - 每条 Note 使用二级标题（##）作为标题与边界
 *   - 标题后紧邻可用 HTML 注释写元数据，两种写法都支持：
 *       <!-- date: 2026-11-01 -->   与   <!-- tags: a, b -->
 *       <!-- date: 2026-11-01 | tags: a, b -->
 *   - 元数据均可省略；缺省时 date 为 null、tags 为 []，不报错
 *   - 顺序保持文件中的实际排列，可手动调整位置
 */
import { parseFrontmatter } from "@astrojs/markdown-remark";
import { slugifyStr } from "@/utils/slugify";

export type ParsedNote = {
  /** Note 标题（二级标题文本） */
  title: string;
  /** 锚点，按标题生成（顺序变化不影响锚点稳定） */
  slug: string;
  /** 日期，YYYY-MM-DD；未填写为 null */
  date: string | null;
  /** 标签；未填写为空数组 */
  tags: string[];
  /** 正文 Markdown 源（已去掉标题行与元数据注释） */
  body: string;
  /** 原文中的顺序，从 0 开始 */
  order: number;
};

export type ParsedNotes = {
  frontmatter: {
    title?: string;
    description?: string;
  };
  notes: ParsedNote[];
};

/** 匹配一整个 HTML 注释行 */
const COMMENT_LINE = /^<!--\s*([\s\S]*?)\s*-->\s*$/;
/** 匹配 fenced code block 起始（``` 或 ~~~，允许缩进与 info string） */
const FENCE_START = /^\s*(`{3,}|~{3,})/;
/** 匹配二级标题 */
const HEADING_2 = /^##\s+(.+?)\s*#*\s*$/;

/** 从注释内容里解析 date / tags */
function parseMetaComment(content: string) {
  const dateMatch = content.match(/date\s*:\s*(\d{4}-\d{2}-\d{2})/);
  const tagsMatch = content.match(/tags\s*:\s*([^|]*)/);

  const tags = tagsMatch
    ? tagsMatch[1]
        .split(",")
        .map(t => t.trim())
        .filter(Boolean)
    : [];

  return {
    date: dateMatch ? dateMatch[1] : null,
    tags,
  } satisfies Pick<ParsedNote, "date" | "tags">;
}

/**
 * 把整篇 Markdown 切分为 Notes。
 * 使用行扫描 + 代码块状态机，确保 fenced code 内的 `##` 不会被误切。
 */
export function splitNotes(raw: string): ParsedNotes {
  const { content, frontmatter } = parseFrontmatter(raw);

  const lines = content.split("\n");

  // 先找出所有 Note 的起始行（非代码块内的 ##）
  const starts: number[] = [];
  let fenceMarker: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fence = line.match(FENCE_START);
    if (fence) {
      const marker = fence[1][0]; // ` 或 ~
      if (fenceMarker === null) {
        fenceMarker = marker;
      } else if (fenceMarker === marker) {
        fenceMarker = null;
      }
      continue;
    }

    if (fenceMarker === null && HEADING_2.test(line)) {
      starts.push(i);
    }
  }

  const notes: ParsedNote[] = [];
  const usedSlugs = new Map<string, number>();

  for (let n = 0; n < starts.length; n++) {
    const startLine = starts[n];
    const endLine = n + 1 < starts.length ? starts[n + 1] : lines.length;

    const title = lines[startLine].match(HEADING_2)?.[1]?.trim() ?? "";

    // 标题之后：跳过紧随其后的空行与 HTML 注释行，提取元数据
    let cursor = startLine + 1;
    let date: string | null = null;
    const tags: string[] = [];

    while (cursor < endLine) {
      const line = lines[cursor];
      if (line.trim() === "") {
        cursor++;
        continue;
      }
      const comment = line.match(COMMENT_LINE);
      if (!comment) break;

      const meta = parseMetaComment(comment[1]);
      if (meta.date) date = meta.date;
      tags.push(...meta.tags);
      cursor++;
    }

    const body = lines.slice(cursor, endLine).join("\n").trim();

    // 按标题生成锚点，重复标题追加序号保证唯一
    const baseSlug = slugifyStr(title) || `note-${n + 1}`;
    const seen = usedSlugs.get(baseSlug) ?? 0;
    usedSlugs.set(baseSlug, seen + 1);
    const slug = seen === 0 ? baseSlug : `${baseSlug}-${seen + 1}`;

    notes.push({
      title,
      slug,
      date,
      tags,
      body,
      order: n,
    });
  }

  return {
    frontmatter: frontmatter as ParsedNotes["frontmatter"],
    notes,
  };
}
