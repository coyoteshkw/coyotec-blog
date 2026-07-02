import { type CollectionEntry, getCollection } from "astro:content";
import { postFilter } from "./postFilter";

/**
 * 对标题分词，支持中英文混合
 * 使用 Intl.Segmenter 对中文分词，英文按小写处理
 */
function tokenizeTitle(title: string): Set<string> {
  const tokens = new Set<string>();
  const segmenter = new Intl.Segmenter("zh", { granularity: "word" });
  for (const { segment, isWordLike } of segmenter.segment(title)) {
    if (!isWordLike) continue;
    tokens.add(segment.toLowerCase());
  }
  return tokens;
}

/**
 * 计算两个集合的 Jaccard 相似度
 */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * 相关文章分数 = tagMatchScore + titleSimilarityScore + timeFreshnessScore
 */
export async function getRelatedPosts(
  currentPost: CollectionEntry<"posts">,
  maxCount = 5
): Promise<CollectionEntry<"posts">[]> {
  const allPosts = await getCollection("posts");
  const candidates = allPosts
    .filter(postFilter)
    .filter((p) => p.id !== currentPost.id);

  const currentTags = new Set(currentPost.data.tags || []);
  const currentTokens = tokenizeTitle(currentPost.data.title);
  const now = Date.now();

  const scored = candidates.map((post) => {
    const postTags = new Set(post.data.tags || []);

    const tagMatchScore = jaccardSimilarity(currentTags, postTags) * 100;
    const postTokens = tokenizeTitle(post.data.title);
    const titleSimilarityScore =
      jaccardSimilarity(currentTokens, postTokens) * 100;

    const daysSincePublished =
      (now - new Date(post.data.pubDatetime).getTime()) /
      (1000 * 60 * 60 * 24);
    const timeFreshnessScore =
      30 * Math.exp((-Math.LN2 * daysSincePublished) / 180);

    return {
      post,
      totalScore:
        tagMatchScore + titleSimilarityScore + timeFreshnessScore,
      tagMatchScore,
      timeFreshnessScore,
    };
  });

  scored.sort((a, b) => b.totalScore - a.totalScore);

  const withTagMatch = scored.filter((s) => s.tagMatchScore > 0);
  const withoutTagMatch = scored.filter((s) => s.tagMatchScore === 0);

  const result: CollectionEntry<"posts">[] = [];
  for (const s of withTagMatch) {
    if (result.length >= maxCount) break;
    result.push(s.post);
  }
  if (result.length < maxCount) {
    withoutTagMatch.sort(
      (a, b) => b.timeFreshnessScore - a.timeFreshnessScore
    );
    for (const s of withoutTagMatch) {
      if (result.length >= maxCount) break;
      result.push(s.post);
    }
  }

  return result;
}
