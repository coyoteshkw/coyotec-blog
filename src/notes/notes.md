---
title: Notes
description: 遇到的问题、解决方案和零碎发现
---

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

<!-- tags: steamdeck -->

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








