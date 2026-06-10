---
pubDatetime: 2021-09-20T00:06:20.000+08:00
title: Pelican博客生成及换主题
featured: false
draft: false
tags:
  - 博客
  - 旧文
  - pelican
description: 当你不懂基础知识然后开始学博客会经历什么艰难
---

> [!NOTE] 2021年，青春懵懂时写的文章，今日发现了，遂搬运，作纪念

## Table of contents

> Pelican在法语里是「笔记本」的意思


「官网」是我们查找信息的最好渠道：[https://docs.getpelican.com/en/latest/](https://docs.getpelican.com/en/latest/)

由于Pelican是Python应用，所以电脑必须首先有python


## 利用[virtualenv](https://virtualenv.pypa.io/en/latest/)安装Pelican

> 遵照官网的指示：[https://virtualenv.pypa.io/en/latest/](https://virtualenv.pypa.io/en/latest/)


### 安装pipx

```bash
pip install pipx
export PATH=$PATH:/home/coyotec/.local/bin # 设置变量，每次开机都必须设置

```


利用pipx升级virtualenv，不会影响到系统的其他部分

```bash
pipx install virtualenv 
virtualenv --help # 查看是否安装成功
```


### 为Pelican创建虚拟环境

```bash
virtualenv ~/virtualenvs/pelican # 在virtualenvs下创建pelican文件夹
cd ~/virtualenvs/pelican # 切换到文件夹下
source bin/activate # 激活虚拟环境

```


### 安装pelican及可选包

```bash
pip install pelican
```


可运行`pelican —help`查看是否安装好

接着安装markdown支持（pelican原生支持.rsf）

```bash
python -m pip install "pelican[markdown]"
```


可以在设置文件中启用排版增强功能，但首先必须安装必要的[Typogrify](https://pypi.org/project/typogrify/)库：

```bash
python -m pip install typogrify
```


### 首次运行pelican

如果是跟着上面的流程走的，这时应该是已经进入了Pelican的（在命令行前缀的最前方会出现「pelican」的文字）。直接进行接下来的流程

```bash
pelican-quickstart # 创建网站骨架
```


接着会让你回答一系列问题，例如网站的名字、网站的作者、是否要添加到github pages等等，没回答好也没关系，之后可以在pelicanconf.py里面修改

回答完后，系统将在/virtualenv/pelican下生成文件，之后的修改也会在这里进行


进入pelican/content文件夹下，创建一篇新的文章，如果没有文章pelican是无法运行的，格式任选，推荐.md。由于pelican的特性，必须在文章的开头写上至少以下内容的第一栏才能识别文章（之后有其他方式可以解决，但那都是后话了），所以创建以下内容：

```bash
Title: My First Review
Date: 2010-12-03 10:20
Category: Review

Following is a review of my favorite mechanical keyboard.
```


接着运行以下命令，解析文章为HTML格式，将生成index.html在`pelican/output`文件夹下（您可能会看到与提要相关的警告，但在本地开发时这是正常的，现在可以忽略。）

```bash
pelican content

```


然后可以预览网站了，可喜可贺，可喜可贺：

```bash
pelican --listen
```


通过在浏览器中导航到[http://localhost:8000/](http://localhost:8000/)或者按住ctrl点击终端提供的网址来预览站点，默认的主题其实也不丑

## 后续基本运行

因为是用virtualenv的虚拟环境运行的pelican，所以无法用普通的方式在开机后直接终端输入`pelican content` 和`—listen` 来运行网站。

之后，每次开机都必须运行这些代码

```bash
export PATH=$PATH:/home/coyotec/.local/bin # 设置变量来启用pipx和virtualenv

```


```
virtualenv ~/virtualenvs/pelican # 进入pelican文件夹
source bin/activate # 激活虚拟环境
```


之后进入正常流程：

1. 写文章（随便在你喜欢的平台）

2. 保存到`pelican/content`文件夹下

3. 在已经激活pelican的终端运行`pelican content`来把你写的文字解析为HTML，接着运行`pelican —listen`本地预览


## 换主题

github有pelican的主题聚合仓库，可以选择直接git clone这个仓库：

```bash
git clone --recursive [https://github.com/getpelican/pelican-themes](https://github.com/getpelican/pelican-themes) ~/pelican-themes
# 在~/pelican-theme（可以自己修改路径）down所有这个仓库收纳的主题

```


或者在[这个网站](http://www.pelicanthemes.com/)查看这个仓库里所有主题的截图，寻找自己喜欢的主题直接进它们的仓库然后`git clone`。这里以我启用过的hyde主题为例

```bash
coyotec@localhost:~> cd /home/coyotec/pelican-themes/
coyotec@localhost:~/pelican-themes> git clone https://github.com/jvanz/pelican-hyde.git
正克隆到 'pelican-hyde'...
remote: Enumerating objects: 190, done.
remote: Total 190 (delta 0), reused 0 (delta 0), pack-reused 190
接收对象中: 100% (190/190), 125.95 KiB | 299.00 KiB/s, 完成.
处理 delta 中: 100% (95/95), 完成.

```



之后回到`virtualenv/pelican`下，找到`pelicanconf.py`文件，这就是pelican的配置文件

用编辑器打开添加一行

```bash
THEME = "/home/user/pelican-themes/theme-name"
# 路径填自己的主题所在本地路径
```


保存，在终端重新运行一遍`pelican content`和`pelican —listen`，然后就会加载主题了


### 配置主题

pelican本身可配置的内容比较少，所以主题可配置的内容也不多，每个主题能配置的内容不一样，可以在他们的github主题仓库查看，或者在down下来的仓库的readme.md文件中也会有。所有的主题配置内容都写在`pelicanconf.py`文件中，自行添加进去即可

例如：

```bash
# 这些是我的设置，每个主题的设置都不一样，我用的是Just-Read主题
# 它的样式我比较喜欢
THEME = "/home/coyotec/pelican-themes/Just-Read"
MARKUP = 'md'
MD_EXTENSIONS = 'extra'
DEFAULT_DATE_FORMAT = '%Y%m%d' # 将默认日期格式调整为年/月/日
```


