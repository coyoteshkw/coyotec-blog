---
pubDatetime: 2026-06-21T18:26:20.000+08:00
title: 从零到上线，我把博客迁移到Astro时遇到的坑与解法
featured: true
draft: false
tags:
  - Astro
  - 博客
description: 这篇神秘的文章记录了使用Astro框架重建个人博客的全过程，包括博客改造、如何挑选域名、配置DNS解析，以及解决部署时常见的301重定向问题。
---

## Table of contents

从下载到部署到cloudflare，从购买域名到重定向到谷歌收录，新手一站通。

决定正经搭一次博客，而且要写详细点

## 为什么是Astro
Astro 是一个集多功能于一体的 Web 框架。访问速度快，内容驱动。

- 高情商：和React类似易修改，静态博客哪都能用部署快，无后台不会因为没做好防护就让你的服务器炸掉
- 低情商：看到的第一个喜欢的主题是Astro写的，于是收编

## Astro Paper
[Github地址在这里](https://github.com/satnaing/astro-paper)。极简风格，SEO友好（虽然在发布的时候我的站点还在遥远的沙盒里挂着，但我如此坚信），速度快，过渡效果优秀不出错。

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781589362764_image.png)

**过渡效果优秀**这一点值得单独提一下，因为我的另一个站点[萨查周记](https://coyotec-weekly.pages.dev)本来是打算用[Astro Cactus](https://astro-cactus.chriswilliams.dev/)这个主题的，但是在Vibe Coding改造后，发现在本地运行时暗黑模式下，链接跳转会全屏放闪光弹，给所有人吃高闪。

部署到cloudflare后有所好转，随心情放闪光弹，经过多次修复仍然无法解决，要么彻底放弃它的过渡效果，要么就期望用户不会在一个深夜不开灯地打开这个网站然后被闪瞎眼，于是只得放弃，改用和主站一样的Paper主题，保障用户眼睛健康

## 下载
有几种方式。我直接在GitHub上把仓库注册为模板
![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781589787922_image.png)
也可以用官方提供的方法，通过astro模板命令创建

```bash
# pnpm
pnpm create astro@latest --template satnaing/astro-paper

# npm
npm create astro@latest -- --template satnaing/astro-paper

# yarn
yarn create astro --template satnaing/astro-paper

# bun
bun create astro@latest -- --template satnaing/astro-paper
```

下载完成后安装依赖并启动，测试是否能正常运作。这里以pnpm为例

```
pnpm install
pnpm dev
```

## 改造

### 1. 基础部分
基础部分在官方Readme上说的很清楚，要修改的地方集中在`astro-paper.config.ts`和`astro.config.ts`两个文件，没什么难点。第一次使用的话，可能要注意一下SEO友好，也别彻底放飞自我瞎写（说的我自己，博客园的副标题一直用的写点啥，结果到现在还是写点啥，你倒是写点啥啊！）

url我默认填了cloudflare的地址，第一次用的还没有地址，也没想好要放在哪里托管的话，可以先不填。其他需要地址的地方同理。

`lang`处先保持默认的`en`，否则尝试启动项目时会出错，后续再进行处理。

```ts file="astro-paper.config.ts"
import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://coyotec-blog.pages.dev/",
    title: "萨查日志",
    description: "我的个人记录,编程,折腾,游戏,什么都有",
    author: "coyoteshkw",
    profile: "https://coyoteshkw.github.io/tiddlylog",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
    googleVerification: "your-google-verification",

  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/coyoteshkw/coyotec-blog/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/coyoteshkw" },
    { name: "mail",     url: "mailto:coyoteshkw@proton.me" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});

```

features的editPost属性指的是文章页面的`Edit post`按钮，填对了以后点击会跳转到Github上这篇文章的编辑页面，前提是你是仓库的使用者并且已经登录。

```js file="astro-paper.config.ts"
editPost: {
      enabled: true,
      url: "https://github.com/yourname/your-blog/edit/main/",
},
```

基本格式是`https://github.com/username/仓库名/edit/正在使用的仓库/"

`astro.config.ts` 部分可以做本地化，默认只有英文。在`locales`处先添加`zh-CN`

```ts
  i18n: {
    locales: ["en", "zh-CN"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },

```

### 2. 启动项目
`pnpm dev`启动项目。在大陆，受限于网络环境，在启动时很可能遇到谷歌字体狂转圈的情况。虽然在上线后没有影响，但是不方便调试。

我的方法是，先把需要的字体`Google Sans Code`下载安装到本地，然后添加一个USE_LOCAL_FONTS变量，在`Layout.astro`和`Fonts.css`处根据变量是否启用来决定是否使用网络字体。

```js file="src/layouts/Layout.astro"
---
const useLocalFonts = process.env.USE_LOCAL_FONTS === "true";
---

<head>
    <!-- 条件渲染字体引用 -->
    {
      useLocalFonts ? (
        <>
          <link
            rel="preload"
            href="/fonts/google-sans-code.woff2"
            as="font"
            type="font/woff2"
            crossorigin="anonymous"
          />
          <link rel="stylesheet" href="/fonts/fonts.css" />
        </>
      ) : (
        <Font
          cssVariable="--font-google-sans-code"
          preload={[{ subset: "latin", weight: 400, style: "normal" }]}
        />
      )
    }

</head>
```

```js file="astro.config.ts"
fonts:
  process.env.USE_LOCAL_FONTS === "true"
    ? undefined
    : [
        {
          name: "Google Sans Code",
          cssVariable: "--font-google-sans-code",
          provider: fontProviders.google(),
          fallbacks: ["monospace"],
          weights: [300, 400, 500, 600, 700],
          styles: ["normal", "italic"],
          formats: ["woff", "ttf"],
        },
        {
          name: "Noto Sans SC",
          cssVariable: "--font-og-cjk",
          provider: fontProviders.google(),
          fallbacks: ["sans-serif"],
          weights: [400, 700],
          styles: ["normal"],
        },
      ],

```

```css file="public/fonts/fonts.css"
/* Local font declarations — used when USE_LOCAL_FONTS=true */
/* Google Sans Code — variable font, single file covers weights 300-700 */

@font-face {
  font-family: "Google Sans Code";
  src: url("/fonts/google-sans-code.woff2") format("woff2-variations"),
       url("/fonts/google-sans-code.ttf") format("truetype-variations");
  font-weight: 300 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Google Sans Code";
  src: url("/fonts/google-sans-code-italic.woff2") format("woff2-variations"),
       url("/fonts/google-sans-code-italic.ttf") format("truetype-variations");
  font-weight: 300 700;
  font-style: italic;
  font-display: swap;
}

:root {
  --font-google-sans-code: "Google Sans Code", monospace;
}

```

之后本地调试时只需要这样写，就能跳过网络字体的步骤，调试舒服多了

```
USE_LOCAL_FONTS=true pnpm dev
```

### 3. 中文本地化
官方支持i18n，但是没有自带的多语言翻译，得自己写。

我觉得默认的英文字体很好看，引入中文字体一个没弄好容易拖慢网页加载速度，所以没有在主站使用。但是在weekly周记站点我修改了部分英文。具体方法：在`src/i18n/lang`文件夹下添加`zh-CN.ts`文件，对照`en.ts`一比一翻译成中文。

但是也有很不好汉化的地方，默认的目录生成方式是在需要生成的地方输入一个二级标题`##Table of contents`，但是它在生成以后也叫这个，无法直接翻译，要翻译得改这个组件的源代码，我觉得没必要，就保留了。

### 4. 动态OG图片中文修复
**什么是动态OG图片？**

动态 OG 图片（OG 是 Open Graph 的缩写）指在网页分享时自动抓取的动态封面图，通常为 GIF 格式，用于提升社交平台（如微信、微博）的分享吸引力。**简而言之，在某些平台上，你分享出去除了一个干巴巴的链接，还会显示一个标题、你填写的简介和你的封面，这样别人就会更愿意点进这个链接，而不会怀疑你是一个钓鱼网站准备从中骗走money**

![一张分享到社交媒体网站的OG图片和OG标题、简介实例](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781690966165_0e23bf13c57f4af704412721814b4666_720.png)

理论上，你可以在每篇文章中自己做一个OG图片，这样就不需要动态OG图了。但是我用的cloudflare+telegram图床在这方面有加载速度上的劣势，有时网站因为图片半天没加载出来，默认了我没有这张图然后白屏，就很抓狂。这个时候发现还不如用动态OG图呢，好歹人真的看得见。或者，你不担心图片在仓库中膨胀，也可以直接在仓库中放封面图，同样也没有这个问题。

说这么多是因为，在解决这个问题上花了不少时间，有一些没必要的挫折。你同样做一遍，可能不值得。或者你clone一份我的代码也可以解决这个问题

其实在项目文档中已经提到过中文字体的问题，Google Sans Code没有适配中文字符，渲染成OG图片后所有的中文都会变成口口。但是开发者认为的解决方式是直接不用Google Sans Code字体了，用本地所有机器上都会使用的、大家都知道的前端那一套适配字体，但我就是想要GS好看的效果，~~怎么了我们拆那人就不能用好看的英文字体吗~~

最终的解决方案是OG图片换用Noto Sans SC生成，cloudflare上有这个字体，所以没有影响

```
fonts: [
  { name: "Noto Sans SC", data: regularData, weight: 400, style: "normal" },
  { name: "Noto Sans SC", data: boldData, weight: 700, style: "normal" },
],

```

 新增`src/utils/getGoogleFontCss.ts`，从 Google Fonts API 拉取 CSS，解析出字体文 
 件 URL，返回给 Satori 使用。不依赖 Astro 的 <Font> 组件（那个只在模  
 板里生效，Satori 是服务端渲染用不上）。
 
```js file="src/utils/getGoogleFontCss.ts"
/**
 * Fetch Google Fonts CSS and return the raw CSS text.
 * Used to obtain font-file URLs for Satori without relying on
 * Astro’s Font component (which only downloads fonts referenced in templates).
 */
export async function getGoogleFontCss(
  family: string,
  weights: number[],
): Promise<string> {
  const wght = weights.join(";");
  const url = `https://fonts.googleapis.com/css2?family=${
    encodeURIComponent(family)
  }:wght@${wght}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch Google Font CSS for "${family}": ${res.status} ${res.statusText}`,
    );
  }

  return res.text();
}

/**
 * Parse a Google Fonts CSS string and return an array of { weight, url }
 * for each @font-face src entry.
 */
export function parseFontUrls(css: string): { weight: number; url: string }[] {
  const result: { weight: number; url: string }[] = [];
  const blocks = css.split("}");

  for (const block of blocks) {
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/url\(([^)]+)\)/);
    if (weightMatch && urlMatch) {
      result.push({
        weight: parseInt(weightMatch[1]),
        url: urlMatch[1],
      });
    }
  }

  return result;
}

```
 
 两个导出函数：                                                       
 - getGoogleFontCss(family, weights) — 拉取                           
   https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700 
 - parseFontUrls(css) — 从 CSS 里正则提取 font-weight: 400 + url(...)  配对

生成的图片大概长这样：

![image](https://coyoteshkw.com/posts/games/how-to-set-up-a-minecraft-server/index.png)

### 5. logo，favicon
本来是想让AI生成一个图标，但是它生成的图标都太大了，压缩不下来。网站刚上线，不希望在这些地方花费大量的时间，最终我在 [Svgrepo网站](https://www.svgrepo.com/)挑选了一条小狼图片。很推荐这个网站，图标全都允许商用，而且种类丰富，光wolf就能搜出几十个来

![SVGRepo网站](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781694138163_image.png)

但是这个favicon在上线后，发现虽然在PC浏览器上能看见，在手机上却看不见。一开始以为是缓存问题，换了好几个浏览器，还是一样。最后发现是因为图标用的是svg格式，而*手机浏览器普遍对svg的支持不是很好*，所以没解析出来

解决方案是转换一个32x32大小的png作为备用图标。不会的现在可以直接让AI帮你转换了，没什么难度

```html
<link rel="icon" type="image/svg+xml" href={getAssetPath("favicon.svg")} />
<link rel="icon" type="image/png" sizes="32x32" href={getAssetPath("favicon-32x32.png")} />
```

### 6. 文章中英文空格问题
这也是一个由于Google Sans Code字体闹出的麻烦，等宽字体的空格很大，因此我原本的老方案：在本地写完后丢给Obsidian的Pangu插件添加一下空格再丢回来完事，就变得完全不可用。这个空格实在是太宽了

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781694584371_image.png)

于是让Pi Coding Agent写了一个插件，自动在中英文之间添加一个瘦空格，视觉效果上比等宽空格要好很多，而且不用手动添加空格了

> 缺点是如果你不小心手动添加了空格，那还是这么宽，只能自己多多注意。

这一套是在编译的时候运行的，不会对运行速度产生影响，反正我用的是cloudflare pages没有编译时间限制，随便它编

### 7. Callout踩坑
Paper文档说现在支持了Obsidian的callout格式，我真信了，弄了半天发现，只是说支持了，也没说内置啊！

还是要自己去装，也没有说怎么装，相当于还是现场学一下Astro了

安装库到注册没什么问题，最大的问题出在，样式不生效，不管我干什么，总之没效果

经过大力气后发现，不是真的没生效，而是在「暗黑模式」不生效

rehype-callouts使用  `.dark` 类切换暗色模式，但Paper使用 `data-theme="dark"` 属性。`.dark .callout` 选择器永远匹配不到，导致 `mix-blend-mode: darken` 在暗色模式下仍然生效，将浅色文字混合为深色后融入背景。
    
修复方法：在 `global.css` 的 @layer 外部设置 `.callout { mix-blend-mode: normal }`。必须放在 @layer 外，因为 Obsidian 主题 CSS 不在任何 cascade layer 内，无 layer 样式优先级高于 @layer 内样式。

```css file="src/styles/global.css"
.callout {
  mix-blend-mode: normal;
}
```
    
同时修正 details:not(.callout) 选择器，避免可折叠 callout 内文字被隐藏。

> [!NOTE] 修订记录 
> 这是一条信息
> 所有可用Callout查看[lin-stephanie/rehype-callouts](https://github.com/lin-stephanie/rehype-callouts)

### 8. 点赞按钮

默认页面太平淡了，添加一个点赞按钮好很多（浏览量就不加了）。数据库参考了这篇博客：[实践-给 Astro 静态博客加上浏览量和点赞 - 藤君的小窝](https://blog.stivine.fun/posts/practice-add-view-count-and-likes-to-an-astro-static-blog/)，用了supabase远程数据库，原文用了Svelte写组件，我不想引入额外的内容所以直接让Deepseek用Astro写。点赞按钮样式参考了[这个博客](https://www.bayunmoyu.com/posts/astro-url-slug/)

![supabase这个banner翻译过来怎么是周末建造.jpg](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781793678288_image.png)

supabase免费版用量目前来说够用了。

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781877386322_image.png)

如果你fork了我的仓库，在cloudflare或者你想托管的网站里，创建时需要添加两个环境变量，对应的值如下图

| PUBLIC_SUPABASE_URL | 数据库名 |
| ------- | ------- |
| PUBLIC_SUPABASE_ANON_KEY   | 对应的Key  |

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781877635697_image.png)
![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781877516508_image.png)

原文手机端直接没有点赞了，我写了一个放在文末。再额外写了一个小功能：文章浏览过半时，点赞按钮会弹出一个气泡框鼓励用户交互^\_^，如果用户点击了就会提示谢谢~然后消失。如果什么都不做等10s后也会消失。移动端只有划到底部按钮可视时才会提示可点赞，因为本身就有一个回到顶部+目录按钮，再加一个直接失去美感了

我觉得实际效果还是不错的。目前就这样吧:D

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781793802984_image.png)
![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781793834564_image.png)

## 线上部署：Cloudflare Pages？ Workers？
Cloudflare Pages是一个面向前端的托管平台，而Workers更进一步，是一个Serverless计算平台。Workers可以做到比Pages更多的事情

workers的功能更多，可以为Astro搭建简易博客后端，所以我本来是打算部署workers的。但是部署时出现了报错。

几经波折，发现Astro Paper默认启用的动态OG图片和sitemap功能无法在Workers上生效（SSR），如果想要SSR，必须删除`src/pages/[ogTitle].svg.ts`动态OG图片定义功能，以及在站点地图中自己定义所有路由。否则无法部署Workers。如果不做优选没必要为此大费周章（我的优选😭），所以就用Pages了，期待以后有更好的可以用Workers的Pages主题改版

## Spaceship域名购买
本来是打算使用默认的cloudflare pages域名的，为此特意让域名看起来很好看：`coyotec-blog.pages.dev`和`coyotec-weekly.pages.dev`

但谷歌迟迟不收录我的sitemap文件，显示「无法读取」。在很多的搜索和AI会诊后，有一个可能性浮出水面：默认域名可能意味着它对互联网的重要性不够高，所以会延后收录，即使我的sitemap文件明明填的一点错没有，它仍可能显示无法读取状态数周。最后一根稻草是我有一个Tiddlywiki博客，多个月后也仍是无法读取状态（后续经过沟通，知道了是TW静态站点确实有一个sitemap的问题，和谷歌收录不收录关系不一定很大）

为了提高这种「重要性」，我决定尝试买一个域名，为此我也不接受太昂贵的后缀。所幸spaceship的域名真的很便宜，只要不碰热门的话。

在coyotec和coyoteshkw之间纠结了很久，最后为了 `.com` 还是用了hkw

本来是个很简单的事情，结果因为手机支付宝无法跳转回spaceship卡住，最后换用电脑、关闭代理解决问题。**建议都用电脑买，关代理买**

> 数字.xyz域名优惠价格只要5块一年，经费不足推荐买这个

顺便一提我用自己买的域名去收录的第一天晚上就全收录成功了，至少标是绿了

## 域名托管cloudflare，注册到博客
在Github上创建一个新的仓库，将本地博客上传至云端

打开cloudflare，没注册账号的注册一下。点选侧边栏「workers和pages」

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781876812092_image.png)

现在cloudflare大力推Workers，添加Pages得选下面这个：

![选Pages](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1782034561981_2026-06-19T13-48-25-353Z.png)

点击「导入现有Git仓库」，选择对应的存储库，再点击开始设置

构建设置中「框架设置」选Astro，命令改成`pnpm build`

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781877942348_image.png)

点击保存并部署，等待部署完毕即可得到一个上线网站！

## pages自定义域添加域名，开启小黄云
之前添加的域名可以趁早绑定，在侧边栏处选择「域名」「添加域名」

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781878120260_image.png)

点击连接域名，如果对AI有意见的下面的选项记得看一下，然后选择免费套餐。默认情况下会搜索一些你之前配置的DNS什么的，看不懂也可以暂时跳过，直接「前往激活」，会给你两个Cloudflare 名称服务器

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781878356417_image.png)

打开spaceship，进入域名管理器

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781878445698_image.png)

点击名称服务器与DNS

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781878617560_image.png)

更改自定义名称服务器，填入即可

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781878839190_image.png)

保存后回到cloudflare，选择「我已更新名称服务器」，等待一段时间确定域名已经托管给cloudflare。通常在1小时以内完成

域名添加在Pages上就比较简单了，回到项目中选择「自定义域」，添加域名即可。会注册一条DNS记录到Pages自带的网址上

如果不做域名优选，我测试下开启小黄云比不开效果好一点，所以开启了。不确定是否开启就回到域名处确定代理状态

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781879441392_image.png)

> [!NOTE]
> 因为我还有周记，所以还添加了子域名，用作区分
> 子域名是什么：weekly.coyoteshkw.com blog.coyoteshkw.com 这种东西

## 谷歌收录、必应收录
等谷歌和其他搜索引擎自己搜索到我们的网站不知道何年何月，手动催促一下。打开[Google Search Console](https://search.google.com/search-console)。这里选择网址前缀而不是网域，这样可以单独观测不同子域名下的流量动态

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1781880940821_image.png)

Astro Paper在配置文件中提供HTML标记验证法的对应选项，所以我直接选了这种方法。也可以用cloudflare直接验证

```js
export default defineAstroPaperConfig({
  site: {
    googleVerification: "xxxxxxxxxxx",
  },
```

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1782028598467_image.png)
![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1782029091709_image.png)

为了加快文章收录，在「站点地图」处提交我们的sitemap。

> [!WARN] 
> 用Paper主题的话提交 `sitemap-index.xml` 而不是 `sitemap.xml`

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1782029664010_image.png)

由于谷歌的奇妙收录机制，即使提交后状态显示为「无法读取」也不要惊慌，是正常的，只要确定站点地图链接可以正常访问即可。如果有旧文需要搬迁的情况下，可以先把旧文搬运过来，这样会提高索引到的概率（大概，因为我的周记目前只有两篇文章，主站有五六篇，主站一次提交就索引到了全部页面，在一到两周内就可以在搜索结果中被展示，而周记至今仍然只有主页可以被很好地索引到）

提交后要做的事情就就只有努力写文章、提交文章和等待

## 附录1：重定向
我提交cloudflare自带域名的时间有点早，所以通过301重定向的方式先把流量分过去，以后再删除默认域名。

cloudflare提供批量重定向方式，可以将某个域名和其下的所有资源全部重定向到另一个url

打开cf面板「交付与性能」下第一项，先添加一个批量重定向列表

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1782030794841_image.png)

点击下一步后可能会发现CF抽风显示一个你没保存，其实保存了不用管，直接确定进下一步，选择手动添加URL重定向。在编辑参数中勾选全部

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1782031027700_image.png)

然后你要再创建一个「批量重定向规则」（刚才那个是批量重定向规则「列表」），选择刚才创建的列表，保存并部署即可。几分钟后可以测试是否成功

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1782031196734_image.png)

## 附录2：图床推荐

我自己用的是这个项目[MarSeventh/CloudFlare-ImgBed](https://github.com/MarSeventh/CloudFlare-ImgBed)，把telegram作为图床，速度一般+随缘，但是不花钱。在我的[周记](https://weekly.coyoteshkw.com/posts/2026/6/0607/)中进行了简略介绍

如果更看重稳定性，可以用阿里云或腾讯云的对象存储服务，再用[PicGo](https://picgo.app)方便上传

不过很有趣的是在搬迁旧文的过程中，我发现我18年写的小文章，里面的图片居然还能访问，由此找到了这个[路过图床](https://imgchr.com/)，我认为在8年过后还可访问证明了它的实力，但各种性能就自行判断吧

![image.png](https://a692b0fb.cloudflare-imgbed-czl.pages.dev/file/1782032532524_image.png)

## 附录3：个人写文章流程
基本过程：**files.md内写完 → neovim内看排版 → 博客内格式精修 → 发布**

files.md是一个浏览器内markdown软件，可同步到本地。非常轻量。要知道这些流程能够出现的主要原因是这台8G的Mac很难支持我在后台一直开着Obsidian然后用Aerospace卡顿地切来切去

但是因为很精简，也没有显示行数的功能，有些细碎的排版比如图片上下空一行，很难看出来，在neovim里面过一遍更好，如果懒就直接让AI加空格

发布后时不时回看一下博客，如果有发现错字或需要补充的内容，通过`Edit`按钮在博客内精修，有大量内容的话补充回原文章（复制） → git push → 如果在Github上修改了，本地先pull一下再push。如果没有pull就提交了，那就pull --rebase

> files.md更像是我的个人记事本，而blog项目内都是真的要发布的文章，所以它们之间是我手动同步的，而不是用同一个仓库
