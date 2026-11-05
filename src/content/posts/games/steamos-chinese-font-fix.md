---
pubDatetime: 2026-11-05T20:52:20.000+08:00
title: SteamDeck游戏模式下中文字体使用日式字形问题修复
featured: false
draft: false
tags:
  - 游戏
  - steamdeck
  - 字体
description: SteamDeck日常小毛病不断
category: 游戏
---

一次手贱开启「系统」的「使用实验性SteamRT3客户端」后，发现游戏模式下，部分字体例如「好友与聊天」的「与」字很明显不对劲，最后收尾的横杠直接穿字而过，显然不是简体中文的写法

![image.png](https://img.055933.xyz/file/1793884983520_image.png)

快速关闭了实验性客户端，但检查发现系统字体仍然为简体中文，尝试切换到其他字体例如日文再切换回来无用，更新SteamOS系统到最新也无用

上网检索发现网上类似的现象都是Deck的部分字体变成宋体，解决方法是重装或重新生成语言配置，而不是我这种字形变了

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

我的现象是字体变成日文字形而不是宋体，侥幸心态尝试使用上述代码，毫无效果。

经检查发现，游戏模式下系统在选取中文字体时优先使用了`Noto Sans CJK` JP，而且很搞笑的在桌面模式下甚至也使用了韩文字形`Noto Sans KR`，而SteamOS显然没有给我提供重装以外的其他选项让我重置它，这波SteamOS全责

最终解决方案是从Linux入手，创建`~/.config/fontconfig/conf.d/99-cjk-zh.conf`文件，手动修改字体优先级，希望系统更新后不会吞文件

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
# 我通过SSH这样使用
systemctl --user restart steam-launcher.service
```

观察「好友与聊天」的与字，可见字形恢复正常。此项修改会导致系统选用日文或韩文语言时字形也使用简体中文，删除刚才创建的文件并重启Steam即可
