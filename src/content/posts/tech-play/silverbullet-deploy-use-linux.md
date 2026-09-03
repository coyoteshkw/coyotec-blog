---
pubDatetime: 2026-08-16T18:05:00.000+08:00
title: 又一个网页版Obsidian？SilverBullet自部署和试用
featured: false
draft: false
tags:
  - silverbullet
  - 笔记应用
  - 部署
  - cloudflare
description: 坦白了说，除了在我的电脑上很卡以及有一些我很不喜欢的默认细节，Obsidian很好，很难超过，但有那么些许的“不满意”就够开发者们搞鼓一款新软件了
category: 折腾
---

坦白了说，除了在我的电脑上很卡以及有一些我很不喜欢的默认细节，Obsidian很好，很难超过，但有那么些许的“不满意”就够开发者们搞鼓一款新软件了

随着给Obsidian套上的插件数量越来越多，也是时候开始反思“md纯文本主义”是否真的被坚守。Obsidian不是开源软件，插件有无法使用或过时的一天，当那些只有依赖插件才能实现的“纯文本渲染”真的到了只能脑补渲染的那一天，人们又该怎么办呢？自己做一款笔记？而如果坚守真正的纯文本主义，那么Obsidian的竞争力又在哪里呢。我的意思是，我认为Obsidian的护城河，其实也是其他软件很容易拥有的，并非具有唯一性

相信有不少人带着这样的想法，探寻新的道路，开发了一款又一款新的笔记应用，今天的恐怕也算一个。至于另一款老前辈TiddlyWiki，我已经在[另一篇文章](https://coyoteshkw.com/posts/tech-play/tiddlywiki-singlehtml-deploy-nginx/)里介绍过了

## SilverBullet是什么，优点？

SilverBullet 是一个可编程的、隐私好、基于浏览器的、**开源的**、自托管的个人知识库——说白了就是“功能强大的笔记应用”。 我解析一下：

> 以下会简称silverbullet为SB，方便书写，不是骂人的意思doge

1. 可编程 - 等于可拓展
2. 隐私 - 自带的登录管理系统
3. 基于浏览器 - 全平台支持
4. 开源 - 不被版本限制，不担心永久性跑路
5. 自托管 - 数据不被某一个厂商控制
6. 所见即所得编辑器

它们没提到的：SB的细粒度似乎做的不错，你可以用待办语法、标签语法直接定位到某一行，这在做待办事项处理的时候尤其好用

### 可编程？

可编程的部分，我看了一下，类似于一个更方便易懂的TiddlyWiki筛选器语法，基于Lua，写起来像SQL

比如说，下面的代码可以定位所有Books文件夹下(在SB中，文件名中斜杠之前的内容会自动转换为文件夹)的笔记，以frontmatter中author + status的形态输出。

```
${query[[
  from b = index.pages()
  where b.name:startsWith("Books/")
  order by b.lastModified desc
  select {
    title = "[[" .. b.name .. "]]",
    author = b.author,
    status = b.status
  }
]]}
```

![image.png](https://img.055933.xyz/file/1786804673808_image.png)

这一段代码可以按倒序排列所有文章中状态为「未读」的文章，以待办事项列表的形式输出。和Obsidian/Notion的多维表格很像，但以代码的形式书写让它更为灵活，可以完成更复杂的工作，实现多表联查

```
${query[[
  from b = index.pages()
  where b.status == "未读"
  order by b.lastModified desc
  select templates.taskItem(b)
]]}

```

![image.png](https://img.055933.xyz/file/1786804732204_image.png)

## 部署

### 下载和初步启动

有两种方法，一种是用Docker，另一种是官方提供的二进制文件，这里用第二种

在[GitHub发布页](https://github.com/silverbulletmd/silverbullet/releases)下载最新的zip，这里要注意 `sb-` 开头的文件是可选的CLI工具，本体要下载以 `silverbullet-` 开头的文件

![image.png](https://img.055933.xyz/file/1786805820996_image.png)

创建一个文件夹来保存数据

```bash
mkdir sb-data # 可以取任何名字
```

```bash
./silverbullet sb-data
```

服务默认监听 `http://localhost:3000` 可以用 `-p` 修改
```bash
./silverbullet -p 45555 sb-data
```

开放服务器防火墙对应端口即可访问

### 配置

当我下载MacOS版本测试的时候，`./silverbullet sb-data` 启动服务会自动调用登录界面让你注册和登录，但是在Linux版本里没有了，因此我只好手动设置一下密码。如果有知道怎么做的可以告诉我，现在我只能在配置文件中写明文密码，这让我觉得有点不舒服

```sh
export SB_USER=username:user-password
./silverbullet sb-data
```

编写 `silverbullet.service` 文件

```ini
# silverbullet.service
[Unit]
Description=SilverBullet Note Server
After=network.target

[Service]
Type=simple
User=username
Group=usergroup
WorkingDirectory=/home/username/silverbullet
ExecStart=/home/username/silverbullet/silverbullet -L 127.0.0.1 -p your-port-number sb-data
Restart=on-failure
RestartSec=5
Environment="SB_USER=username:userpassword"

[Install]
WantedBy=multi-user.target
```

将SB注册到系统服务

```bash
# 1. 复制到系统service目录，根据Linux发行版的不同系统服务的路径可能不同
sudo cp /home/username/silverbullet/silverbullet.service /etc/systemd/system/silverbullet.service

# 2. 重新加载配置
sudo systemctl daemon-reload

# 3. 启动服务
sudo systemctl start silverbullet.service

# 4. 设置开机自启
sudo systemctl enable silverbullet.service

# 5. 检查日志信息，确定已经正常启动
sudo journalctl -u silverbullet.service -f # 也可以用sudo systemctl status silverbullet.service查看一部分
```

### 利用Cloudflare Tunnels配置HTTPS以及保护隐私

已经做过很多次了，就不再赘述，详细可以看之前写的[ignis部署](https://coyoteshkw.com/posts/tech-play/obsidian-ignis-deploy-docker/#%E5%88%A9%E7%94%A8cloudflare-tunnel%E8%8E%B7%E5%8F%96https)，一旦熟练了就是重复劳动：添加路由 -> 填写喜欢的子域名前缀 -> 填写本地开放的端口地址 -> 添加路由

![img](https://img.055933.xyz/file/1785335598943_image.png)

![img](https://img.055933.xyz/file/1785335622748_image.png)

![img](https://img.055933.xyz/file/1785335842160_image.png)

添加完成后稍等几分钟，通过新域名就可以访问到SB啦

记得在添加完路由后关闭之前开启的防火墙端口，避免恶意用户扫描到

## 基础使用

在一个浏览器上首次使用时会加载一段时间，在右上角会显示加载进度条，一次加载完成后之后都不需要再次加载

部署到云服务器上后创建和加载速度要取决于服务器的网速，SB的同步没有ignis那样即时，有时候在手机上编辑了，到电脑上要多刷新一两遍才会看到最新的文章

如果服务端出现断网或停机情况，在网页端会显示黄条标题栏表明处于离线状态，此时仍然可以编辑和添加新内容，在服务端恢复后仍然会同步

![image.png](https://img.055933.xyz/file/1786874276200_image.png)

SB的基础使用和普通的markdown笔记软件没有区别，首页自带一个创建快速笔记和快速日志功能，创建后可以用 `/frontmatter` 快速创建一个frontmatter，里面写各种你觉得自己会用得上的标签信息，太长的frontmatter会被自动折叠很方便

和Obsidian/tiddlywiki一样有双向链接语法 `[[link]]`，可以快速连接到另一篇文章并且反查

:::image-figure[双链展示]
![image.png](https://img.055933.xyz/file/1786874329061_image.png)
:::

关于最有用的组件/查询语法，可以看他们[官网](https://silverbullet.md/)，它们官网也是用SB搭建的，由于本质上编辑器，所以无法用沉浸式翻译或KISS翻译来做双语，只能直接看原文啦

## 潜在隐患

从issue状况来看，开发者似乎对反馈有点放养状态，一直还是有在积极修复，但对于社区没有积极响应。对比一下tiddlywiki的GitHub issue，TW虽然未解决的量比SB多不少，但开发者都会标注对应问题的标签，仍让人感受到自己的反馈有被倾听

之前我就遇到过一个问题，在手机端编辑时，删除文字不但没有删掉反而让被删的文字增殖了，解决方案目前没有，只能通过长按选择的方式一口气删掉。我在issue也找到了这个问题，但有段时间没解决，也没有新的跟进，还好不是经常出现，不是很影响使用

## 个人使用体验

因为我用Astro写博客，经常会用到mdx以及乱七八糟的非基础md语法，之前用ignis的时候对mdx支持很不好，换到files.md大部分时候没事，但有时候还是会吞语法，不方便存储内容，各类所见即所得编辑器多少都有这个问题，太急于转换即使自己无法处理的内容

我当前对各类MD笔记的需求是「一个合适的备份地」，知识库会在tiddlywiki做，详尽的博客会在Astro发布，所以对笔记软件的要求反而是**不要干扰**，你把你理解不了的语法隐藏了对将来的我是一种额外的烦恼，在这一点上目前silverbullet比其他的软件做的都要好，并且也方便拓展。

此外由于它的快速编写比tiddlywiki要方便比flomo更容易让我查看(flomo里写的东西太过杂乱，反而有时候不愿意整理)，目前也兼职了一部分我的待办处理

如果你有一台服务器，推荐你试试，万一就喜欢上了呢
