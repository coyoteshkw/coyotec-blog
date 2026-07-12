---
pubDatetime: 2026-07-12T22:06:20.000+08:00
title: 问答网站、Github随机仓库卡片、天气应用开发笔记
featured: false
draft: false
tags:
  - TailwindCSS
  - 前端
  - 个人笔记
description: 小东西，开发笔记三合一
---

## Table of contents

## Quiz App笔记

问答题，考验你的MC知识！提供单选题，选错时利用颜色不同展示不同的选项背景色，每道题提供7秒的作答时间，未作答自动判错并下一题。支持本地存储，退出重进时保存答题进度并重置7秒倒计时。答题完成提供总结信息，支持重做

![image.png](https://img.055933.xyz/file/1783865413954_image.png)

### 利用嵌套三元表达式做条件判断

```html
<label
  v-for="option in currentQuestion.options"
  :key="option"
  class="flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors duration-200"
  :class="
    getOptionState(option) === 'correct'
      ? 'bg-green-500 text-white'     /* 正确答案：绿底白字 */
      : getOptionState(option) === 'wrong'
        ? 'bg-red-500 text-white'       /* 用户选错：红底白字 */
        : 'bg-blue-200 hover:bg-blue-400' /* 默认：蓝底，悬停加深 */
  "
  @click="selectAnswer(option)"
>
```

相当于

```js
if (getOptionState(option) === 'correct') {
  return 'bg-green-500 text-white'          // 正确答案 → 绿底白字
} else {
  // 这里的 else 里面又是一个三元
  if (getOptionState(option) === 'wrong') {
    return 'bg-red-500 text-white'            // 用户选错的那项 → 红底白字
  } else {
    return 'bg-blue-200 hover:bg-blue-400'    // 其余未选中的选项 → 默认蓝底
  }
}
```

**对象语法**

还可以写成这样，根据`:`后面的方法判断是否使用前面的类

```css
:class="{
  'bg-green-500 text-white':       getOptionState(option) === 'correct',
  'bg-red-500 text-white':         getOptionState(option) === 'wrong',
  'bg-blue-200 hover:bg-blue-400': getOptionState(option) === ''
}"

```

### input radio类型的name
- 同一个 `name` 下的 radio 才是一组，一组内只能选一个
- 不同 `name` 的 radio 互不干扰

所以需要通过index，给不同的radio不同的的name，避免在切换题目后，上一题的选中状态仍然在新一题中出现

### TS语法

**定义类型**

1. 方便自己知道这是什么类型
2. 现代编辑器补全效果

```ts
interface Question {
  question: string
  options: string[]
  answer: string
}

const questions = ref<Question>([]);
```

### tabular-nums类
使用 `tabular-nums` 保持数字宽度稳定，秒数不会抖动
否则字体有时候变大变小，导致卡片抖动

### 实现动态进度条

```html
<!-- 倒计时进度条 -->
<div class="flex items-center gap-2 mb-1">
  <div class="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
    <div
      class="h-full rounded-full transition-all duration-1000"
      :class="timeLeft <= 3 ? 'bg-red-500' : 'bg-yellow-500'"
      :style="{ width: (timeLeft / TIMER_DURATION * 100) + '%' }"
    ></div>
  </div>
  <span
    class="text-sm font-mono tabular-nums"
    :class="timeLeft <= 3 ? 'text-red-500 font-bold' : 'text-gray-600'"
  >
    {{ timeLeft }}s
  </span>
</div>
```

**重点部分：** `:style="{ width: (timeLeft / TIMER_DURATION * 100) + '%' }"`

为什么我开始理解不到，因为我下意识按照分数去理解，看成了`timeLeft / (TIMER_DURATION * 100)`，但其实是 7/7 * 100 = 100%这样

### Pinia
Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态

### localStorage对象存取
localStorage只能存字符串，不能直接存对象，浏览器会隐式调用toString()导致对象存取失败

转成stringify()就是转成了字符串，再存取就没有问题。在加载的时候再将字符串转换为对象json.parse

## Github随机仓库

根据Github API，获取对应语言的随机仓库，点击按钮切换不同仓库。支持报错重试、响应式设计、暗黑模式

![image.png](https://img.055933.xyz/file/1783693810401_image.png)

### 页面加载时调用

这个项目是vanilla的，没有vue。

```js
// 方式一：DOMContentLoaded（推荐，在DOM树构建完成后触发）
document.addEventListener('DOMContentLoaded', function() {
  fetchLanguages();
});

// 方式二：window.onload（等所有资源加载完才触发，较慢）
// window.onload = function() {
//   fetchLanguages();
// };
```

### 确定元素存在时的非空断言
`wait` id明确存在，但是TS语法仍旧怀疑它可能为空，可以使用`!`符号来断言。有几种方法

```js
/* 1 */
document.querySelector('#wait')!.textContent = 'Loading, please wait...'
/* 2，我用的这种 */
const waitCard = document.querySelector('#wait')!
waitCard.textContent = 'Loading, please wait...'

```

### 防抖处理
如果用户快速切换语言或连点 Refresh，会同时发起多个请求，做简单的防抖`isLoading`

```js
let isLoading = false

async function fetchRandomRepo(lang: string) {
  if (isLoading) return   // ← 请求中，忽略重复点击
  isLoading = true
  try {
    // ... 现有逻辑
  } finally {
    isLoading = false
  }
}
```

### fronted-design skill
联系的时候自己写，写完后让skill写一个好看的版本hhh

没什么要记住的，只要记得用就行。现在的Agent很智能，可能还会自动向你请求调用skill

不过我因为没特意写要用tailwindcss，它给我把tw都删了换成了传统语义式代码，但是就算了。本来就是让手热起来的项目


## Weather-App

<img src="https://img.055933.xyz/file/1783865518470_image.png" class="w-1/3">

### 需求问题
有些问题是有经验才会明晰的，这个时候可以使用AI帮助辅助。比如利用openstreet拿经纬度定位具体位置，如果显示地址是直接具体到最具体这样就没事，但如果是湖北，武汉这样，可能会遇到重复问题（北京市，北京市），所以要处理去重

天气Api容易过载，可以先用本地数据
