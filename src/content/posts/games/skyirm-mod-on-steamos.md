---
pubDatetime: 2025-07-07T12:00:20.000+08:00
title: 上古卷轴5在SteamDeck上安装mod(SteamOS)
featured: false
draft: false
tags:
  - 游戏
  - steamdeck
description: 在基于Arch Linux的SteamOS系统上为老滚打mod
---

## Table of contents


> 这里专指**在基于 Arch Linux 的 SteamOS 系统上为老滚打 mod，如果是双系统，在 Windows 上安装和普通 PC 用户安装别无二致**。写这篇是因为我想要在 SteamOS 上玩，经过我的尝试，在 Win 上安装然后 SteamOS 上启动 MO 2 的方法没用，也可能是我操作有误，但总之是没成功 😢

目标：多年后补票，还是更想先体验原版，而且考虑到 SD 的机能，只打算安装简中汉化和 SkyUI，但是希望保留 mod 框架，方便后续扩展（根据 ProtonDB 评论的说法，安百来个 mod 其实也没啥问题，就是不知道那老哥具体安了啥）。不打算降级，也就是使用 steam 上的最新 1.6 版本

## 准备工作

1. 一台 SteamDeck（没有的话你看这个作甚）
2. 基本了解 SteamOS 桌面模式的操作方法，或者懂得外接键鼠
3. 桌面模式下通过系统自带商城安装了 Firefox 浏览器和 Protontricks，如果安装不下来，请搜索「SteamOS 商店换源」
4. 科学上网环境，没有的请自行解决
5. （可选）在 PC 上通过 N 网或各种地方下载好需要的 mod 压缩包，通过数据线或无线方法（推荐使用桌面自带的 KDE Connect）传输到 SD 中。我使用 MacOS 遇到了无法传输文件的问题，最后是通过 SSH 解决的，如果你也使用 Mac 且遇到了同样的问题，请搜索「SteamDeck SSH 连接」

## 安装 MO 2

1. 启动 SteamDeck，如果安装过游戏还没启动过的，先进一次游戏。然后切换到桌面模式

2. 打开桌面模式的 Steam，在老滚 5 设置中选择查看一下本地文件，可以记一下这个路径，之后安装好了可以在这里查看是否安装成功

3. 在各种选项中最终选择了使用在 ProtonDB 找到的[安装脚本](https://github.com/rockerbacon/modorganizer2-linux-installer)，其在 25 年 1 月已经归档，但经测试仍然可以正常使用。在浏览器中打开链接，下载 realease 的最新版，可以看到最新发布是 24 年 5 月，MO 2 在 N 网最新更新日期是 24 年 8 月，版本差得还不算特别多。下载路径随意，后续的安装路径与之无关

4. 下载完成后用系统自带的解压缩工具解压，可以看到目录下有一个 `install.sh` 文件，在文件管理器里右键选择在终端中打开此目录，输入 `./install.sh` 启动安装程序。程序会弹出 GUI 界面要求选择需要安装 mo 2 的游戏，选择 skyirm special edition 继续

5. 跟随教程检查游戏完整性，如果之前没有修改过可以跳过。然后选择安装位置，之前尝试安装到 Windows 互通盘弹出安装失败，所以建议就安装到它提供的默认路径，可以截图记一下，之后不会提醒你的 😢

6. 走完有点漫长的安装流程后，检查游戏本地文件位置，如果出现 MO 2 相关目录（只是一个放了 txt 的空文件夹）和 SKSE 相关文件，再检查安装 MO 2 的位置确认有新文件，就安装成功了。从桌面端的 Steam 尝试启动游戏，应该会弹出 MO 2 的界面了，但是你操作的时候会发现一点就闪退，没关系，这是给游戏模式用的，切模式再开就不闪退了

> 脚本作者建议不要以开始游戏之外的方式启动 MO 2，可能会造成一些问题。
>
> 此外，这个安装脚本会顺带安装 SKSE，不需要手动下载

7. 切回游戏模式启动游戏，可以发现自动打开的 MO 2 没法用触控板，按住 Steam 键可以强制移动，或者直接触摸屏/外接键鼠。选择好需要的 mod 直接老滚启动。如果安装的 mod 有顺序问题可以看参考链接第一篇，讲得很好，我安装的 mod 很少只调整了几个顺序

尝试安装了和光汉化、SkyUI，非官方补丁及一些材质 mod，都 OK，直接载整合包什么的还是以后再尝试吧:D

感谢所有小黑盒老哥的热心回复，所有的回复凝聚成这篇帖子。方案并不完美，但至少符合我的轻度要求。BethINI 正常安装后在 MO 2 中可加载为可执行文件，不过我还没有尝试修改过，所以我不保证它能否正常安装使用，但在 SteamDeckHQ 上搜索到一篇文章提到包括 1500+ mod 的 SD 天际整合（链接在最下面），我认为它们作为大型整合应该使用到了这些程序，问题不大

## 参考链接

- [从零开始打MOD-上古卷轴天际MOD安装完全指南](https://fkmods.com/d/1638) 非常棒的教程，不过对我的诉求来说目前略显冗余，需要复杂安装的所有用户都应该阅读
- [protondb上古卷轴5评价页](https://www.protondb.com/app/489830?device=steamDeck) GitHub 上的安装脚本就是在这里找到的，里面还有很多对 SD 用户和 Linux 用户价值连城的帖子，建议仔细阅读
- [一键安装脚本](https://github.com/rockerbacon/modorganizer2-linux-installer) 程序员拯救世界
- [系统设置指南](https://stepmodifications.org/wiki/Guide:System_Setup_Guide) 干净卸载老滚，验证游戏完整性等一系列设置
- [SkyrimSE-v2.3-step-modifications教程](https://stepmodifications.org/wiki/SkyrimSE:2.3) 由盒友推荐的最详细的打 mod 说明，其中的各种详述结合第一篇参考链接可以解决绝大多数疑难杂症
- [SteamDeckHQ对于这个整合包的介绍](https://steamdeckhq.com/news/theres-a-skyrim-modpack-built-for-steam-deck/)
- [SD整合包链接](https://github.com/Omni-guides/Tuxborn) 这个整合包上个月还在更新，可惜是英文，不然我都想弄下来尝尝咸淡

**我安装的 mod 列表：**

- [和光汉化](https://www.nexusmods.com/skyrimspecialedition/mods/139134)
- [成就解锁](https://www.nexusmods.com/skyrimspecialedition/mods/245)
- [非官方天际特别版补丁](https://www.nexusmods.com/skyrimspecialedition/mods/266?tab=description)
- [和它的汉化，和光版本](https://www.nexusmods.com/skyrimspecialedition/mods/266?tab=description)
