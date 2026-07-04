---
pubDatetime: 2026-07-04T00:00:00.000+08:00
title: remark-directive-sugar 语法测试
featured: false
draft: false
tags:
  - 测试
  - markdown
description: 测试视频嵌入、图片题注等扩展 markdown 语法
---

## 视频嵌入

### YouTube

::video-youtube[Astro in 100 Seconds]{#gxBkghlglTg}

### Bilibili

::video-bilibili{id=BV1MC4y1c7Kv}

## 图片题注

:::image-figure[这是一张带题注的图片，支持 **Markdown** 语法。]
![](https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg)
:::

## 带链接的图片

:::image-a{href="https://github.com"}
![GitHub](https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg)
:::

## 纯图片容器

:::img-div
![](https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg)
:::

Example 1: :link{#@lin-stephanie}

Example 2: :link{#@lin-stephanie tab=repositories}

Example 3: :link[Vite]{id=@vitejs}

Example 4: :link[Vite]{id=@vitejs tab=org-people}

Example 5: :link{#lin-stephanie/remark-directive-sugar}

Example 6: :link[Astro]{id=withastro/astro}

Example 7: :link{#remark-directive-sugar}

Example 8: :link{id=remark-directive-sugar tab=dependencies}

Example 9: :link{id=https://developer.mozilla.org/en-US/docs/Web/JavaScript}

Example 10: :link[Google]{id=https://www.google.com/}

Example 11: :link[Vite]{id=@vitejs url=https://vite.dev/}

Example 12: :link[Vite]{id=@vitejs img=https://vitejs.dev/logo.svg}


Example 1: :badge[New]
Example 2: :badge[Success]{style="color: black; background-color: #aaf233"}
