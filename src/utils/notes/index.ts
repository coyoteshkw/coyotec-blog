/**
 * Notes 主入口
 *
 * 读取 src/notes/notes.md，切分为单条 Note 并渲染为 HTML。
 */
import raw from "@/notes/notes.md?raw";
import { splitNotes, type ParsedNote } from "./splitNotes";
import { renderNoteBody } from "./renderNote";
import { slugifyStr } from "@/utils/slugify";

export type RenderedNote = ParsedNote & {
  html: string;
};

export type NotesData = {
  frontmatter: {
    title?: string;
    description?: string;
  };
  notes: RenderedNote[];
  /** 所有标签（去重，按出现次数降序） */
  allTags: { name: string; slug: string; count: number }[];
};

export async function getNotes(): Promise<NotesData> {
  const { frontmatter, notes } = splitNotes(raw);

  const rendered = await Promise.all(
    notes.map(async note => ({
      ...note,
      html: await renderNoteBody(note.body),
    }))
  );

  return {
    frontmatter: {
      title: frontmatter.title ?? "Notes",
      description: frontmatter.description,
    },
    notes: rendered,
    allTags: collectTags(rendered),
  };
}

/** 汇总所有标签：去重、统计出现次数、按次数降序（次数相同按名称） */
function collectTags(notes: RenderedNote[]) {
  const counter = new Map<string, number>();

  for (const note of notes) {
    for (const tag of note.tags) {
      counter.set(tag, (counter.get(tag) ?? 0) + 1);
    }
  }

  return [...counter.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, slug: slugifyStr(name), count }));
}
