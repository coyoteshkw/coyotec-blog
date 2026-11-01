---
title: Notes
description: 遇到的问题、解决方案和零碎发现
---

## pnpm/bun patch OR 修改全局包时会发生什么？

<!-- tags: nodejs, pnpm, bun -->

为了快速，pnpm和bun都会用硬链接或mac特有的快速复制来复用已经下载过的包

但这种方式会导致在Win/Linux上，某个项目如果突然心血来潮修改了原包的内容，所有用过这个包的项目都会受影响。MacOS有法子让它在被修改时就独立成不受影响的新包

为解决这个问题，需要用`patch`指令，效果和Mac的一样

## pnpm patch 使用时遇到的问题
<!-- date: 2026-11-01 | tags: pnpm, patch -->

使用 `pnpm patch` 修改依赖时，需要注意补丁目录和最终生成的 patch 文件之间的关系。

### 补充

可以用三级标题组织当前 Note 的内容。

## Astro 中导入 Markdown 文件

<!-- tags: astro, markdown -->

使用 `?raw` 可以将 Markdown 文件作为原始字符串导入，方便交给自定义解析器处理。

## 一个暂时没有标签的发现

这里不需要填写日期或标签，直接记录正文即可







