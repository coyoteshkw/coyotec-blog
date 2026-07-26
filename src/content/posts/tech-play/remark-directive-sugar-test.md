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

```
::video-youtube[Astro in 100 Seconds]{#gxBkghlglTg}
```

::video-youtube[Astro in 100 Seconds]{#gxBkghlglTg}

### Bilibili

```
::video-bilibili{id=BV1MC4y1c7Kv}
```

::video-bilibili{id=BV1MC4y1c7Kv}

## 图片题注

```
:::image-figure[这是一张带题注的图片，支持 **Markdown** 语法。]
![](https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg)
:::
```

:::image-figure[这是一张带题注的图片，支持 **Markdown** 语法。]
![](https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg)
:::

## 带链接的图片

```
:::image-a{href="https://github.com"}
![GitHub](https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg)
:::
```

:::image-a{href="https://github.com"}
![GitHub](https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg)
:::

## 纯图片容器

```
:::img-div
![](https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg)
:::
```

:::img-div
![](https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg)
:::

```
:link{#@lin-stephanie}
```

Example 1: :link{#@lin-stephanie}

```
:link{#@lin-stephanie tab=repositories}
```

Example 2: :link{#@lin-stephanie tab=repositories}

```
:link[Vite]{id=@vitejs}
```

Example 3: :link[Vite]{id=@vitejs}

```
:link[Vite]{id=@vitejs tab=org-people}
```

Example 4: :link[Vite]{id=@vitejs tab=org-people}

```
:link{#lin-stephanie/remark-directive-sugar}
```

Example 5: :link{#lin-stephanie/remark-directive-sugar}

```
:link[Astro]{id=withastro/astro}
```

Example 6: :link[Astro]{id=withastro/astro}

```
:link{#remark-directive-sugar}
```

Example 7: :link{#remark-directive-sugar}

```
:link{id=remark-directive-sugar tab=dependencies}
```

Example 8: :link{id=remark-directive-sugar tab=dependencies}

```
:link{id=https://developer.mozilla.org/en-US/docs/Web/JavaScript}
```

Example 9: :link{id=https://developer.mozilla.org/en-US/docs/Web/JavaScript}

```
:link[Google]{id=https://www.google.com/}
```

Example 10: :link[Google]{id=https://www.google.com/}

```
:link[Vite]{id=@vitejs url=https://vite.dev/}
```

Example 11: :link[Vite]{id=@vitejs url=https://vite.dev/}

```
:link[Vite]{id=@vitejs img=https://vitejs.dev/logo.svg}
```

Example 12: :link[Vite]{id=@vitejs img=https://vitejs.dev/logo.svg}


```
:badge[New]
```

Example 1: :badge[New]

```
:badge[Success]{style="color: black; background-color: #aaf233"}
```

Example 2: :badge[Success]{style="color: black; background-color: #aaf233"}

```
:::github{repo="withastro/astro"}
:::
```

:::github{repo="withastro/astro"}
