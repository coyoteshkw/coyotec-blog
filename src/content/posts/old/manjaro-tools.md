---
pubDatetime: 2018-10-03T00:00:00.000+08:00
title: Manjaro 所需要的各种工具（防止自己忘记）
featured: false
draft: false
tags:
  - 旧文
  - linux
  - manjaro
description: Manjaro Linux 下的包管理器和常用软件备忘
---

> [!NOTE] 2018 年写的文章，搬运留念

## 安装篇

### 原装正版大家都爱的 pacman

这不用说大家都懂吧？

优点：原版自带，调用方便，设置好国内源之后速度爆表。

缺点：在我的电脑上总是出现各种小毛病，目前 yaourt 以及 yay 以及一些比较著名的软件总是装不上，不知道是我的问题还是官方不再维护，但那也不该不能下载啊？

![文件损坏](https://s1.ax1x.com/2018/10/03/i3rpcR.png)

### 没怎么用过的 pip

不得不说 pacman 尽管在这我这里有诸多毛病，但是我还是最喜欢用它，也许只是习惯了吧，又或者毕竟配了那么久的源出了那么多的事，系统重装了 2 次，不用用简直对不起自己的良心。

![配图](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538575717824&di=42bb42ca5053e39649d167c4422aeb12&imgtype=0&src=http%3A%2F%2F02.imgmini.eastday.com%2Fmobile%2F20170808%2F20170808221127_90f921b1804643312e9673869cc8c8c8_8.jpeg)

但真实原因是我高估了 arch 系统，一直以为 pip 无法使用，不过事实证明完全可以，我拿来安装了一个命令行版本的网易云，不过由于是命令行版本，所以其他系统上能使用的别的软件这里是否会导致死机我拿不准。

### 孤儿 yaourt

我一直没能启用成功，挺遗憾的，不过听说了最近似乎 yaourt 停止维护了，但还是记录一下，也许以后换其他 linux 系统我能装上。

### 新秀 aurman

Python 编写的 AUR 工具，用它实现了朝思暮想的 VSCode 的安装。

优点：使用同 pacman 一样方便，而且无需前缀 sudo，更方便，搜索功能也很好用。

缺点：有的国内软件无法搜索到，速度较 pacman 配置源后略慢。

## 使用篇

### 神奇的命令行搜索工具 fzf

在下不才，还没能参透多少功能，所以这里恭恭敬敬的贴上链接：

- [Shell 必备利器 fzf 模糊搜索](http://xingaiming.com/2018/04/shell%E5%BF%85%E5%A4%87%E5%88%A9%E5%99%A8-fzf-%E6%A8%A1%E7%B3%8A%E6%90%9C%E7%B4%A2/)
- [fzf 使用指南](https://blog.csdn.net/qq3401247010/article/details/78148294)

### 代码工具

**1. VSCode**

VSCode 的 Python 插件还好用，在这个系统上的启用速度更快了，调试也比较方便，不过我想使用 Anaconda 似乎还没有成功，界面友好，有中文很方便。

**2. PyCharm**

另外就是 PyCharm 了，没有找到社区版本，只有必须付费版，最近剁手了无奈只能使用 host 再调用激活码，但还是很好用的，不过还是更喜欢 VSCode，网上已经有 linux 版本的汉化方法了，不过一直没去尝试，PyCharm 的设置中英文量巨大，没有汉化真的很伤。

**3. Vim**

作为编程新手，这令我畏惧的名词还是出现了，偶尔在遇到问题需要跟着大牛们的教程一步步解决的时候会撞上它，无奈只能搜索使用教程，毕竟大名鼎鼎，也许终有一天我也会用上它吧。

**4. Sublime Text 3**

Windows 系统上常用，后来运行出错了闲置，在 Manjaro 中用来替代原文件编辑工具。

### 放松用软件

**1. 网易云音乐**

官方版本和命令行版都下载了，命令行版本很炫酷但是目前我还没法让他发声，有时间会慢慢找原因。

评论偶尔致癌，但是依然是一个用来放松的好东西，我也不怎么听热门曲，版权问题对我的影响不是很大，有版权需求的建议上 QQ 音乐。

[命令行版本地址](https://github.com/darknessomi/musicbox)

**2. Steam**

不多解释。

![还我血汗钱](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538577181813&di=660e5efbcb54d9bbe11b24dbcc7aa221&imgtype=0&src=http%3A%2F%2Fimg0.178.com%2Fnews%2F201603%2F250972361654%2F250972638312.jpg)

**3. Bilibili**

是网页，偶尔看看喜欢的 up 主和学习知识，就这样。

> 引用：
> - [CSDN 文章](https://blog.csdn.net/was172/article/details/82826607)
> - [简书文章](https://www.jianshu.com/p/6e9eb98c0494)
> - 以及在推荐 fzf 时所链接的地址
