/**
 * Notes 主入口
 *
 * 读取 src/notes/notes.md，切分为单条 Note 并渲染为 HTML。
 */
import raw from "@/notes/notes.md?raw";
import { splitNotes, type ParsedNote } from "./splitNotes";
import { renderNoteBody } from "./renderNote";

export type RenderedNote = ParsedNote & {
  html: string;
};

export type NotesData = {
  frontmatter: {
    title?: string;
    description?: string;
  };
  notes: RenderedNote[];
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
  };
}
