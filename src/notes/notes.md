---
title: Notes
description: 遇到的问题、解决方案和零碎发现
---

## Apple Music音乐转网易云

<!-- tags: 音乐 -->

网上找到的大都是网易转AM

[soundiiz](https://soundiiz.com/)支持免费转移歌单，但**也只有歌单**，而我用AM的时候基本上没创建过，都是直接红心歌曲随机听，导致转移困难，可恶的soundiiz只要不是歌单哪怕一首歌曲都不给转移

最简单的办法是：

1. 把官方创建的歌单直接分享链接粘贴到网易云「我的」→「音乐栏目右上角省略号」→「一键导入外部音乐」→ 粘贴歌单
2. 全部歌曲的话，AM的「播放列表」被定义为歌单，手动创建一个播放列表，然后手动把全部歌曲都添加到这个列表，然后用网易云的官方导入即可

千万不要用soundiiz导入播放列表，只免费前200首，也不给反选，后100多首只能先手动**一首首**取消前面勾选过的，再**一首首勾选新的**，给我累死才发现方法2

## Neovim gitsigns vs mini.statuscolumn

<!-- tags: nvim -->

遇到了很蠢的情况，gitsigns插件之前被AI改过，擅自修改了gitsigns的符号，我没有意识到这种更改的后果，一直保持着更改状态没遇到问题，直到今天我安装了mini.statuscolumn插件，它为软换行状态在左侧行号栏中添加了换行符号，但加入后我的gitsigns状态就一直与行号间隔太近，我终于意识到这个符号其实就是Nerd Fonts后尝试为它添加前空格，却发现一直有一个淡绿色的提交与我修改的内容错开，总之就是丑的没边

最后检查出来是因为我被AI修改了gitsigns的符合，但只修改了一半，已提交状态没修改，我哪知道它给我改的设置居然不是默认设置而是不知道从哪里找来的其他符号

一口气全删了，就好了

## Neovide使用

<!-- tags: 字体, nerd-font -->

neovide官方想要的使用方式是在终端里`neovide xxx.js`，但是改变默认工作目录可以拿来写写博客

修改`~/.config/neovide/config.toml`，添加以下行

```toml
title-hidden = true
chdir = "~/Documents/blog/"

[font]
normal = ['Maple Mono NF CN'] # Will use the bundled Fira Code Nerd Font by default
size = 16.0
```

## 终端的Nerd图标大小不一不等宽

<!-- tags: 字体, nerd-font -->

现象：我使用`Maple Mono NF CN`字体，在一些利用了Nerd Fonts的程序例如nvim和yazi中，很容易就会发现NF字体大小不统一

![没瞎就能看出来](https://img.055933.xyz/file/1794138185685_image.png)

排查后发现并非终端问题，而是Maple字体的NF字体就是不等宽，换成CodeNewRoman的NF版本就正常了，Maple其他东西都是等宽的，但这个不是，很奇怪

作者提供了一个编译选项可以编译[等宽版本](https://github.com/subframe7536/maple-font/issues/507)，但默认仍然不是等宽

不过重新编译感觉很麻烦，而且非等宽版本的图标看起来比较大，与字体大小更和谐(部分NF字体NF部分和字体部分的大小很不一样，NF看起来很小而普通字符此时已经很大了)，所以就这样吧

## Neovim编写中文文档时，居中或scrolloff无法正常操作

<!-- tags: vim, nvim, 中文问题 -->

在用Vim编写长文时，为了方便编辑，需要使用`gj`和`gk`来移动，但如果一段话太长以致于换行，在换行中无法正常居中

```
Pellentesque habitant morbi tristique senectus et netus. Phasellus laoreet lorem vel dolor tempus vehicula. Paullum deliquit, ponderibus modulisque suis ratio utitur.
```

以上这段话根据屏幕宽度不同，可能分为2-x行，利用gj和gk在行内移动，并使用`zz`尝试居中，无果

这是已知问题，现有插件都无法解决。可以设置更大的scrolloff来尽量保持居中

```vim
set scrolloff=999
```

`C-E`和`C-Y`指令在这种状况下移动会更舒服，或者在Neovide里写，过渡动画效果优秀时很多问题都不是问题

## SteamDeck插件推荐

<!-- tags: steamdeck, decky -->

- [dmitrii-galantsev/VaporType](https://github.com/dmitrii-galantsev/VaporType) - 有ctrl/alt/esc的键盘，桌面模式和游戏模式双支持
- [hostsrc/decky-prysm](https://github.com/hostsrc/decky-prysm) - 将SteamDeck屏幕串流到浏览器，方便直播给朋友，很不错的插件，功耗目前体验不错

## SteamDeck键盘/其他东西焦点不正确

<!-- tags: steamdeck, decky -->

现象：在游戏模式下如果启动了游戏，就无法在同时在媒体界面中移动，也无法回到桌面搜索东西

网络上有很多类似现象，但通常是时有效时无效，我是一直无效。最终怀疑对象是Decky Loader的某插件

利用Disabled功能排除得到是0.8.0版本的Decky Translator导致，即使出于关闭状态下它也会导致焦点不正确，升级到最新0.9版本已经恢复正常

## SteamDeck游戏模式下中文字体使用日式字形

<!-- tags: steamdeck, 中文问题 -->

现象：在一次手贱开启「系统」的「使用实验性SteamRT3客户端」后出现，部分字体例如「好友与聊天」的「与」字很明显不对劲。检查发现系统字体仍然为简体中文，切换到其他字体再切换回来无用

网上类似的现象是Deck的部分字体变成宋体，解决方法是重装或重新生成语言配置

```bash
# 感谢小黑盒的Eki_1盒友
sudo steamos-readonly disable
sudo pacman-key --init
sudo pacman-key --populate archlinux holo
# 编辑/etc/locale.gen文件，取消zh_CN.UTF-8行的注释
# 重新生成语言配置
sudo locale-gen
# 重新安装字体包
sudo pacman -S noto-fonts-cjk
```

但对我无效。我的现象是字体变成日文字形而不是宋体，使用上述代码没有任何效果。系统在选取中文字体时使用了Noto Sans CJK JP，这是一个优先级问题。SteamOS全责

最终解决方案是创建`~/.config/fontconfig/conf.d/99-cjk-zh.conf`文件，手动修改字体优先级

```xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  <description>Prefer Simplified Chinese Noto CJK faces for generic families</description>

  <alias>
    <family>sans-serif</family>
    <prefer>
      <family>Noto Sans</family>
      <family>Noto Sans CJK SC</family>
    </prefer>
  </alias>
  <alias>
    <family>serif</family>
    <prefer>
      <family>Noto Serif</family>
      <family>Noto Serif CJK SC</family>
    </prefer>
  </alias>
  <alias>
    <family>monospace</family>
    <prefer>
      <family>Noto Sans Mono</family>
      <family>Noto Sans Mono CJK SC</family>
    </prefer>
  </alias>
</fontconfig>
```

对桌面模式和游戏模式同时生效，重启游戏模式的Steam启动器即可恢复

```bash
systemctl --user restart steam-launcher.service
```

观察「好友与聊天」的与字，可见字形恢复正常。此项修改会导致系统选用日文或韩文语言时字形也使用简体中文，删除刚才创建的文件并重启Steam即可

## SteamDeck重启时一直显示“正在登录”

<!-- tags: steamdeck -->

现象：没有征兆地，SD重启时一直显示正在登录，等待数小时也不会进入

如果过去使用过SteamCommunity302，可能会在某刻发生这个。需要先临时删除302。

SD系统更新后无法再在正在登录状态下进入桌面模式方便地删除302。按下「...」按钮关闭WIFI，将SD锁屏至少两分钟，再次亮屏后稍等会进入SteamOS。重新打开WIFI，进入桌面模式，此时桌面模式的Steam不会启动，不要等，直接删除302的启动程序，放入回收站并重启机器即可

可能会出现需要重新登录的情况，这个就自求多福吧，正在登录状态可以使用插件，我用Clash辅助了一下

一直不使用302可能会出现重启后频繁要求登录的情况，两种方案，一个是重新把302开起来，另一个是有一个好的国际网络环境下对Clash插件使用开机自启。重新安装302(最好是最新版)并启动即可

## Neovim内置插件管理器vim.pack开发者好文推荐

<!-- tags: nvim -->

[A Guide to vim.pack (Neovim built-in plugin manager) – Evgeni Chasnovski](https://echasnovski.com/blog/2026-03-13-a-guide-to-vim-pack)

## pnpm/bun patch OR 修改全局包时会发生什么？

<!-- tags: nodejs, pnpm, bun -->

为了快速，pnpm和bun都会用硬链接或mac特有的快速复制来复用已经下载过的包

但这种方式会导致在Win/Linux上，某个项目如果突然心血来潮修改了原包的内容，所有用过这个包的项目都会受影响。MacOS有法子让它在被修改时就独立成不受影响的新包

为解决这个问题，需要用`patch`指令，效果和Mac的一样

## Astro 中导入 Markdown 文件

<!-- tags: astro, markdown -->

使用 `?raw` 可以将 Markdown 文件作为原始字符串导入，方便交给自定义解析器处理。








