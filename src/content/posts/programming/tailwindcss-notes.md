---
pubDatetime: 2026-07-08T18:45:20.000+08:00
title: TailwindCSS 温习记录
featured: false
draft: false
tags:
  - TailwindCSS
  - 前端
  - 个人笔记
description: 温习小记
---

## Table of contents

## 优点
1. 构建速度更快
2. 方便维护和移植
3. CSS代码量少
4. 比起内联样式，有自己的统一设计系统、支持hover等样式变体、支持响应式布局

**为什么顺序不影响效果**
TW的很多实用类其实只是定义了一个变量的值，所以顺序不同，不同的变量之间只要不是修改了同一个属性(比如都修改了字体大小)，那么就不会互相影响。如果改变了同一个值比如flex grid，会根据最终编译生成的CSS样式文件中排列顺序来，要避免这种不可控情况发生

官方的这篇文章写的很好，介绍了绝大部分用户会感兴趣的东西：[Styling with utility classes - Core concepts - Tailwind CSS](https://tailwindcss.com/docs/styling-with-utility-classes)

**何时使用原生内联样式**

[When to use inline styles 何时使用内联样式](https://tailwindcss.com/docs/styling-with-utility-classes#when-to-use-inline-styles)

1. 用tw写起来太复杂晦涩
2. 数据由数据库传来
3. 由数据库传来的数据其实也可以改成以变量的方式注入，再通过tw书写

**记得ctrl-d多光标修改，很有用。如果在使用框架，就创建一个组件**

## tailwind函数和指令集合

文档：https://tailwindcss.com/docs/functions-and-directives

### @theme 主题变量

主题变量是使用 @theme 指令定义的特殊 CSS 变量，它会影响项目中存在的实用类。

```css
/* 添加新颜色 */
@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
/* 自定义断点 */
@theme {
  --breakpoint-xs: 30rem;
  --breakpoint-2xl: 100rem;
  --breakpoint-3xl: 120rem;
}
/* 完全禁用默认theme */
@theme {
  --*: initial;
}
```

它也会生成一个`--color-mint-500`变量供普通CSS使用（例如`var()`）

重置断点:[Removing default breakpoints 移除默认断点](https://tailwindcss.com/docs/responsive-design#removing-default-breakpoints)

所有@theme可以自定义的东西：[Theme variable namespaces 主题变量命名空间](https://tailwindcss.com/docs/theme#theme-variable-namespaces)

主题变量可以**覆盖**，也可以**新建**

分享主题变量只需要`@import "../brand/theme.css”;`

### layer 更改默认样式/自定义样式

1. **更改默认样式** 如果您想为特定的 HTML 元素添加自己的默认基本样式，请使用 @layer 指令将这些样式添加到 Tailwind 的 base 层：

```css
@layer base {
  h1 {
    font-size: var(--text-2xl);
  }
  h2 {
    font-size: var(--text-xl);
  }
}
```

2. **自定义组件** 存放可复用、语义化的组件样式，将多个工具类组合成一个自定义类，避免 HTML 中反复写一长串类名。对于任何想要添加到项目中且仍然希望能够使用实用程序类覆盖的更复杂的类，请使用 components 层。

components 层也是放置您使用的任何第三方组件的自定义样式的好地方

```css
@layer components {
  .card {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    padding: --spacing(6);
    box-shadow: var(--shadow-xl);
  }
}

<div class="card text-2xl"></div>
```

> 虽然都在@layer下，但base和components的功能是不同的，一个定义HTML元素默认样式，一个是为某些自创组件添加样式集合。components的优先级在base之上

### @apply 为自定义类使用TW实用类

使用 @apply 指令可以将任何现有的实用程序类内联到您自己的自定义 CSS 中

比如上面的`@layer components`里定义了`.card`，既可以用TW自带的变量和函数来实现原生CSS书写，也可以用`@apply`指令

```css
@layer components {
  .card {
    @apply bg-white rounded-lg p-6 shadow-xl
  }
}
```

### 复杂环境下变体 @variant

可以在自定义 CSS 中应用 Tailwind 变体

Tailwind 的行内类名只能作用于当前这一个元素。如果你想实现“深色模式下，容器内所有的 <p> 标签都变白”，行内类名就无能为力了（你不可能给每个 <p> 都手写一遍）

```css
.container p {
  color: black;
  /* 利用 @variant 包裹后代选择器 */
  @variant dark {
    color: white; 
  }
}
```

### 自定义实用类 @utility

使用 @utility 指令可以向项目中添加自定义实用类

```css
@utility content-auto {
  content-visibility: auto;
}
```

除了使用 @utility 指令注册简单的实用程序外，您还可以注册接受参数的函数式实用程序：

```css
@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

高级自定义看[Matching theme values 匹配主题值](https://tailwindcss.com/docs/adding-custom-styles#matching-theme-values)
@layer components

如果您的项目类名与 Tailwind CSS 工具冲突，您可以使用 prefix 选项为所有 Tailwind 生成的类和 CSS 变量添加前缀：

```css
@import "tailwindcss" prefix(tw);
```

## 响应式设计

Tailwind 采用**移动优先（Mobile-First）** 的策略。这意味着**不加前缀的样式对所有屏幕生效**，而加了 `sm:`、`md:` 等前缀的样式，则仅在**等于或大于**该断点宽度的屏幕上生效。

| 断点前缀 | 最小宽度 (px/rem) | 常见设备举例 |
| :--- | :--- | :--- |
| **无前缀** | 0px | 所有屏幕的基础样式，**主要针对手机**（< 640px） |
| **`sm`** | 640px (40rem) | 大屏手机（如 iPhone Plus/Max 系列）、小平板（竖屏） |
| **`md`** | 768px (48rem) | 标准平板（如 iPad 竖屏）、小型笔记本 |
| **`lg`** | 1024px (64rem) | 桌面显示器、平板横屏（如 iPad 横屏）、笔记本 |
| **`xl`** | 1280px (80rem) | 标准台式机显示器（如 1920x1080） |
| **`2xl`** | 1536px (96rem) | 大屏台式机、2K/4K 显示器 |


### 最常用的断点

在实际开发中，**`md`** 和 **`lg`** 是最核心、最常用的两个断点。

* **`md` (768px)**：是区分**手机/平板**与**桌面/笔记本**布局的关键分界线。
* **`lg` (1024px)**：是进一步优化**桌面端**布局，展示更多内容（如多列卡片、侧边栏）的关键分界。

一个典型的响应式设计流程是：
1. **先写移动端样式**（不加前缀），这是所有设备的基础。
2. 在 **`md`** 断点调整布局，适配平板和笔记本。
3. 在 **`lg`** 断点进一步优化，充分利用桌面大屏空间。

*没有前缀的utilities在所有屏幕尺寸上生效*，不要使用`sm`来定位移动设备

让flex布局只在md-xl之间生效

```html
<div class="md:max-xl:flex">
  <!-- ... -->
</div>
```

容器查询是现代 CSS 的一项特性，它允许你根据父元素的大小而不是整个视口的大小来设置样式。这使得组件更易于移植和重用，因为它们可以根据组件实际可用的空间进行调整

```html
<!-- 当container容器大于md高度时，改成flex-row布局 -->
<div class="@container">
  <div class="flex flex-col @md:flex-row">
    <!-- ... -->
  </div>
</div>
```

## 深色模式

**手动切换深色模式**

```css
@custom-variant dark (&:where(.dark, .dark *));
```

之后只要html类上有dark类，那么里面的全部和`:dark`相关的tw类都会生效

**三色切换**

原来三色切换有这么多讲究

```js
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);
// Whenever the user explicitly chooses light mode
localStorage.theme = "light";
// Whenever the user explicitly chooses dark mode
localStorage.theme = "dark";
// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem("theme");
```

## 色板

默认每种颜色包含11个色阶，从50-950，步进100(开头和结尾步进50)

所有可以用调色板调的实用类：bg, text, decoration, border, outline, shadow, insert-shadow, ring, insert-ring, accent, scrollbar-thumb, caret, scrollbar-track, fill, stroke

建议看一下[网站](https://tailwindcss.com/docs/colors)的具体目录

![image.png](https://img.055933.xyz/file/1783410278832_image.png)

### 调整不透明度

您可以使用类似 bg-black/75 的语法调整颜色的不透明度，其中 75 将颜色的 alpha 通道设置为 75%：

```html
<!-- 支持任意值和简写 -->
<div class="bg-pink-500/[71.37%]"><!-- ... --></div>
<div class="bg-cyan-400/(--my-alpha-value)"><!-- ... --></div>
```

## 自定义大全

**自定义主题**

```css
@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  --color-avocado-400: oklch(0.92 0.19 114.08);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-600: oklch(0.53 0.12 118.34);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  /* ... */
}
```

**自定义单位**

https://tailwindcss.com/docs/adding-custom-styles

```html
<div class="w-[123px]"></div>
<!-- /* 如果之间有空格，换成下划线,一定要用使用反斜杠转义
如果你使用的是类似 JSX 这样的技术，其中反斜杠会从渲染后的 HTML 中移除，请使用String.raw() ，这样反斜杠就不会被视为 JavaScript 转义字符*/ -->
<div class="grid grid-cols-[1fr_500px_2fr]">
  <!-- ... -->
</div>
<!-- /* 如果写了很多下划线但是没有空格，那么会默认保留下划线，不要空格 */ -->
<div class="bg-[url('/what_a_rush.png')]">
  <!-- ... -->
</div>
```

## 常用实用类
- display: flex grid inline-flex inline-grid inline block
  	- `<div class="grid grid-cols-3 grid-rows-3 gap-4">`
- padding p-4 px-4 py-3
- margin: m-4
- max-width: max-w-sm mx-auto
  	- max-w-96
  	- max-w-1/2 使用百分比
  	- max-w-full 100%宽度
  	- max-w-dvw 最大宽度-dvw
  	- max-w-min/max 最大宽度min-content/max-content
  	- max-w-fit fit-content;
  	- container
- background-color: bg-white
- border-radius: rounded-xl
- weight, height: w-8 h-6 size-12
- gap: gap-4 gap-x-4
- space:
- font-size: text-xl
- color: text-black(颜色一般给文字类使用，可以这样记)
- font-weight: font-medium font-bold
- table https://tailwindcss.com/docs/display#table
- hidden 从文档中删除元素
- sr-only 正常人看不见，开屏幕阅读器的可以读到，用`not-sr-only`撤销
- 

## 私人笔记
1. 多看看文档的目录会很有启发，特别是当你不知道该用什么类的时候

一些容易忘记的类
- aspect-radio 控制长宽比
- columns 可以在非grid，flex布局下设置列
- box-decoration-break 控制样式渲染是否受到换行的影响
- object-fit 控制图片在容器内的显示方式 contain cover filll none scale-down
- object-position 用于控制被替换元素的内容在其容器内如何定位的实用程序
- inset 是 CSS 中的一个逻辑简写属性，它是 top、right、bottom、left 这四个属性的组合
- visibility 可以在不删除元素的情况下隐藏元素，区别于display，还有collapse值可选（不影响表格布局）
- basis flex-basis，决定在主轴方向上，元素开始收缩或拉伸之前的大小。可以设置固定值/按比例/百分比/语义
- flex-grow 有剩余空间时是否按比例分配额外空间（默认为0否）
- flex-shrink 空间不足时是否按比例压缩元素（默认为1是）
> flex三兄弟，名称晦涩

- flex-wrap 这行
- inline-size 控制宽度
- block-size 控制高度
- font-sans(无衬线体) font-mono font-serif(衬线体，适合)
- 使用诸如 text-sm/6 和 text-lg/7 之类的工具可以同时设置元素的字体大小和行高
- font-stretch 拉伸字体


`object-fit` 属性决定了**替换元素**（如 `<img>`、`<video>`）的内容如何在指定尺寸的容器内“呈现”。

| Tailwind 类 | CSS 值 | 一句话解释 | 是否保持宽高比？ | 是否填满容器？ | 是否会裁剪？ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `object-fill` | `fill` | **拉伸填满**（默认值） | ❌ 会变形 | ✅ 完全填满 | ❌ 不会 |
| `object-contain` | `contain` | **完整显示**（留白边） | ✅ 保持 | ❌ 可能留白 | ❌ 不会 |
| `object-cover` | `cover` | **裁剪覆盖**（最常用） | ✅ 保持 | ✅ 完全填满 | ✅ 会裁剪 |
| `object-none` | `none` | **原始尺寸**（原地不动） | ✅ 保持 | ❌ 可能溢出 | ❌ 可能溢出 |
| `object-scale-down` | `scale-down` | **取小值**（安全显示） | ✅ 保持 | ❌ 视情况 | ❌ 不会 |

---

重要联动：`object-position`

需要特别注意的是，使用 `object-cover` 或 `object-contain` 时，默认裁剪或留白的位置是**正中心**。

如果你想调整裁剪或留白的位置，需要配合 `object-position` 属性（Tailwind 中为 `object-top`、`object-left`、`object-[position]`）。

比如：`<img class="object-cover object-top" ... />` 表示裁剪时**优先保留图片的顶部**，这在新闻或人物照片中非常常用（防止把人物的头裁掉）。
