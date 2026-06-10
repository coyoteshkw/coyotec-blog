---
pubDatetime: 2021-09-21T00:56:20.000+08:00
title: 用Github Pages和Jekyll创建一个简单的博客
featured: false
draft: false
tags:
  - 博客
  - 旧文
  - jekyll
description: 真正简单的博客，对后台的要求几乎降到底层了。
---

> [!NOTE] (2021年，青春懵懂时写的文章，今日发现了，遂搬运，作纪念)

## Table of contents

# 1. 用github pages和Jekyll创建一个简单的博客

对内的博客用pelican倒是省事了，但是对外的还是想弄一个……

所以，中秋佳节就被我变成了苦逼的做博客节，找啊找啊，找啊找啊，发现**不花钱、耗时短**（其实主要是花钱要扫码啥的真的很麻烦）的博客在我这个openSUSE上真的很难弄。大部分原因都在npm出错上，但是排查很麻烦，出现这个问题的人比较少，其次报错信息都是英文的，我在处理报错这件事情上真的花了太多的”无用“时间了，都给我整怕了，唉。

因为Hexo之类需要使用npm的博客基本短时间内宣告破产，只能把目光转向线上的博客，排除一大堆花钱的麻烦博客，**甚至可以无需线下的jekyll**进入了我的视野，这是在github上查找得到的，默认的网页非常清新，我就决定一试了。在经过了「亿点」麻烦之后，最后成功搞定了博客。[这](https://coyoteshkw.github.io/)是我目前的博客地址。主参考文章的作者是推荐我们购买域名的（因为他完全没有解释的写上了购买域名的步骤），不过考虑到**我输出能力有限而且这个博客到底会用多久还不确定**，还是选择直接使用github给的域名。

另外，我18年折腾博客的时候就是用的这个域名（目前做了归档，没舍得删除），也算是怀念吧，之后如果真的运营下去了再考虑购买域名的事情。

> 我写博客首先是因为我记忆力不好，不记下来的话以后遇到同样的事情就只能重新找资料；其次——我写博客不是因为我比这些先写的大佬们对那些被描述的事物更加认识，也不是我写东西条理更清晰，而是因为**我想要写下我遇到的困难，这能帮助我自己，或许也能帮助他人**；再其次，虽然我文笔非常烂，但是写作起码会让我有「学习写作」的冲动，而我这些幼稚的文笔留存下来，将来再看，或许也是宝物

**参考文档放在底栏，我还没有学会markdown的书写规范，抱歉**

---

## 1.1. 使用Jekyll的好处

1. Jekyll和GitHub的配合很好，GitHub上直接fork人家的仓库然后改个名字就能当自己的用了
2. 如果没有本地预览博客网页的需求的话，无需本地下载Jekyll（正好我这个系统下载Jekyll很麻烦）
3. 整个仓库都可以在线上，可以download个远程仓库编辑，在其他电脑上编辑也很方便
4. 支持Markdown（类型是kramdown）

## 1.2. fork仓库

[这](https://github.com/cnfeat/blog.io)是仓库地址，默认你已经有了一个GitHub账号，用QQ邮箱就可以注册，最好把用户名（第一次设置的那个）设得朗朗上口一点，之后好弄

右上角fork一下（需要外网）就会把他的仓库变成你的，然后setting里把仓库的名字变成：`用户名.github.io`

## 1.3. 开启GitHub Pages

等了好一会发现网址没法用？去Setting里把Github Pages打开试一试。或者先等10分钟左右（据说初始化要10分钟，我当时是已经失望透顶去吃饭了，然后回来发现网页已经可以打开了，这波是地狱到天堂）。默认会打开原仓库已经设定好的模板，说实话还是很好看的（默认的绿色背景是可以修改的，在img/里面）

## 1.4. 配置博客

配置博客有两种方法：

1. 把仓库 clone 到本地，在本地进行修改后统一提交、推送到仓库里  
    好处是可以一次性修改多个文件，坏处是修改多次后会发现不停地提交会让你身心俱疲
2. 直接在GitHub仓库里修改  
    优点是不用克隆东西，不用总是提交提交提交的；缺点是一次只能修改一个文件

配置方法是差不多的，我用的是**第一种**

### 1.4.1. clone博客仓库到本地

#### 1.4.1.1. SSH key

刚开始不懂要用SSH来clone，吃了大亏。这个Key可以让之后使用Git提交时不需要输入密码

首先要在本地创建一个SSH key，在Linux系统上非常容易，参照[这篇](https://workflow.ninghao.net/ssh-key.html)和[这篇](https://git.ninghao.net/)文章，在命令行用`cat`指令来查看这个key

在GitHub上点击右上角的 Account Settings—>SSH Public keys —> add another public keys

把你本地生成的密钥复制到里面（ key 文本框中）， 点击 add key 就ok了。可以输入下面的命令，看看设置是否成功

```bash
# git@GitHub.com 的部分不要修改：

$ ssh -T git@GitHub.com
```

如果是下面的反馈：

```bash
>>> The authenticity of host 'GitHub.com (207.97.227.239)' can't be established.
RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
Are you sure you want to continue connecting (yes/no)?
```

不要紧张，输入 `yes` 就好，然后会看到：

```
Hi cnfeat! You've successfully authenticated, but GitHub does not provide shell access.
```

#### 1.4.1.2. 设置用户信息

现在你已经可以通过 SSH 链接到 GitHub 了，还有一些个人信息需要完善的。

Git 会根据用户的名字和邮箱来记录提交。GitHub 也是用这些信息来做权限的处理，输入下面的代码进行个人信息的设置，把名称和邮箱替换成你自己的，名字必须是你的真名，而不是GitHub的昵称。

```bash
$ git config --global user.name "cnfeat"//用户名
$ git config --global user.email  "cnfeat@gmail.com"//填写自己的邮箱
```

#### 1.4.1.3. 开始克隆
在仓库的绿色`code`里选择默认的那项，在命令行界面输入：

```bash
git clone xxxxxx
```

就会自动克隆文件到本地（预先cd好要存放文件的地方，我放在「文档」下）


### 1.4.2. 开始配置
自带的README.md文件中介绍了几个可以修改的文件：`_config.yml`,`about.md`,`milestone.md`

开发者已经非常贴心地在文件里面注释了哪些内容是可以修改的，我当时忘记了要修改**作者（有两个作者要修改，第一个是显示在博客底部的，第二个是文章发布的时候显示的）**

## 1.5. 写文章、上传

突然发现在openSUSE下「Vnote」这个Markdown编辑器真的发挥了自己的能力（在Windows上总觉得界面很拉内容也很少，但是在Linux上却大放异彩），有非常之清晰的「自带大纲」，有自动「标题序列」，有「图床」，有「vim」模式，总之就是很不错，遂用作御用编辑器

文章是放在`_posts`文件夹下的，写好后依据Jekyll的要求，在开头加上YAML的内容，具体如何修改可以看文件夹内自带的一篇模板，主要要写的是tags,data,title

文件的名字必须用**日期+名称**，例：2015-03-02-how-to-write.md，而且**不能用中文**，不然就会在`git status`的时候发现文件的名字乱码，得不偿失

在网页端就直接新建文件粘贴进去完事，在本地还需要`git status -> git commit -am 'xxx' or git adds xxxx -> git push`

过一会儿（一分钟不到）博客页面就会刷新

## 1.6. 小菜：给文章添加目录

水平不足没有搞定复杂一点的目录，但是自带有一个简单的方法：在文章开始插入以下代码：

```
* TOC
{:toc}
```

## 1.7. GitHub冲突
如果在网页端进行了小修小补，然后又在本地进行修改的话两者会冲突，这时候git pull一下，重新提交内容就可以了

## 1.8. 参考文章

> 进阶也可以看的，大佬们写得比我好

1. [如何搭建一个独立博客——简明 GitHub Pages与 jekyll 教程](https://www.cnfeat.com/blog/2014/05/11/how-to-build-a-blog/)
2. [搭建一个免费的，无限流量的Blog----github Pages和Jekyll入门](http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html)
3. [使用Github Pages建独立博客](http://beiyuu.com/github-pages)


