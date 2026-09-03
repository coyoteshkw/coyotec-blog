import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

type Category = {
  category: string;
  categoryName: string;
};

/**
 * Builds a de-duplicated, sorted category list from posts.
 *
 * - Drafts and scheduled posts are excluded via `postFilter()`
 * - Posts without a `category` are skipped
 * - `category` is the slug used in URLs; `categoryName` is the original label
 * - Uniqueness is based on the slug (so differently-cased labels collapse)
 */
export function getUniqueCategories(posts: CollectionEntry<"posts">[]) {
  const categories: Category[] = posts
    .filter(postFilter)
    .flatMap(post => (post.data.category ? [post.data.category] : []))
    .map(category => ({ category: slugifyStr(category), categoryName: category }))
    .filter(
      (value, index, self) =>
        self.findIndex(c => c.category === value.category) === index
    )
    .sort((a, b) => a.category.localeCompare(b.category));
  return categories;
}
