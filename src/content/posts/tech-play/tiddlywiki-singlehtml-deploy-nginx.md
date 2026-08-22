---
pubDatetime: 2026-08-09T17:30:00.000+08:00
modDatetime: 2026-08-22T09:43:32Z
title: TiddlyWiki单文件版服务器部署教程(tw5-server)
featured: true
draft: false
tags:
  - tiddlywiki
  - 笔记应用
  - 部署
  - nginx
description: 如何部署一个tiddlywiki单文件版到服务器上呢，小编也很好奇，那就和小编一起来看看吧
---

最近又开始尝试不同的笔记软件排列组合ing，发现比如做细碎的笔记，AI认为tiddlywiki这种「最小内容条目」的设计比起silverbullet更适合我，遂重拾tiddlywiki进行尝试

> 以下偶尔会简称tiddlywiki为tw，方便书写

nodejs版本的tw更加强大和灵活，但是我只想从最简单的单文件做起，之后确定会一直使用再转向nodejs版本，所以找了一个可以部署单文件的[tw5-server](https://github.com/hffqyd/tw5-server)

* 尝鲜友好
* tw5-server自带备份功能，抢救方便
* 单文件的强大总是出乎意料的(指我部署了nodejs版本之后发现加载速度还没一个6mb的HTML快)
* tiddlywiki不像之前的ignis/sivlerbullet一样强制HTTPS访问，如果不想通过域名避免公网快速裸奔，其实部署也就几行的事情

## 快速启动

将tw5-server最新的realease上传到服务器，这里使用curl直接在服务器上操作，也可以通过scp命令或xshell等工具上传

```bash
mkdir tiddlywiki && cd tiddlywiki
curl -LJO https://github.com/hffqyd/tw5-server/releases/download/1.5.2/tw5server-amd64-linux
```

通过这个命令启动tw5-server

```bash
# -d表示HTML存放的位置，-b表示备份存放的文件夹
tw5server -a:localhost -p:8000 -d:dir -b:backup
```

这里贴一个官方的用法说明

```
Usage:
tw5server -a:localhost -p:8000 -d:dir -b:backup

-h this help
-c config file, json format, default tw5server.json
-a address, defautl "127.0.0.1"
-p port, default 8000
-d directory to serve, default `current dir`
-b backup directory, default `backup` in serve dir. `backup/` or `backup\\` for a backup path.
-l show log message
-m max size of uploaded file (MB), default 100
--autoclean if auto clean backups

Backups auto-clean strategy:
Keep all backups in current month, keep only the newest one for previous months.
```

官方给的8000端口太常见，这里改为48321

```bash
tw5server -a:localhost -p:48321 -d:dir -b:backup
```

服务器防火墙开放48321端口，通过公网IP:端口号访问，应该可以看到这样的界面

![image.png](https://img.055933.xyz/file/1786203525199_image.png)

但第一次进入里面应该什么也没有，因为tw5-server默认不带tiddlywiki。打开tiddlywiki的官网，这里以民间汉化的官网[tiddlywiki舞](https://bramchen.github.io/tw5-docs/zh-Hans/)为例，点击快速入门的[DIY](https://bramchen.github.io/tw5-docs/zh-Hans/#GettingStarted)选项卡

![image.png](https://img.055933.xyz/file/1786203710726_image.png)

下载简体中文版即可。注意tiddlywiki舞这个汉化版本一直使用prerealease版本，如果想要下载官网的稳定版本那就从[官网](https://tiddlywiki.com/)下载，只是要在设置 - 插件里多下一个中文插件包，我这里就省去这一步了

![image.png](https://img.055933.xyz/file/1786203877737_image.png)

下载到本地回到tw5-server提供的界面，右上角有个upload按钮，但**不知道为什么在Mac Chrome浏览器上点了没用**，但是从文件管理器往网页里拖是有用的，所以拖进来上传了。直接从后台上传到`dir/`文件夹估计也能成

点击上传到html文件就会跳转到tiddlywiki单文件版了

![image.png](https://img.055933.xyz/file/1786204085661_image.png)

新添加一个条目，点击右上角保存按钮，确定保存成功

## 设为systemd服务

为了tiddlywiki在离开服务器时也能正常访问，我们需要把tw5-server设为系统服务。在tiddlywiki文件夹下创建一个 `tw5server.service` 文件，并 `sudo cp` 到系统service目录

```
# tw5server.service
[Unit]
Description=TW5 Server
After=network.target

[Service]
Type=simple
User=username
Group=username
WorkingDirectory=/your-folder/tw5-server
ExecStart=/your-folder/tw5-server/tw5server-amd64-linux -a:localhost -p:48321 -d:dir -b:backup
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# 1. 复制到系统 service 目录，根据发行版不同，路径也可能不同
sudo cp /your-folder/tw5server.service /etc/systemd/system/

# 2. 重新加载配置
sudo systemctl daemon-reload

# 3. 启动服务
sudo systemctl start tw5server

# 4. 设置开机自启
sudo systemctl enable tw5server
```

这样服务就会常驻后台，不需要手动启动。可以通过 `journalctl` 命令查看日志，不过说实话tw5-server几乎没有日志内容

```bash
sudo journalctl -u tw5server -f
```

## 设置域名与HTTPS访问

如果接受HTTP访问那么到这就可以结束了，不用往下看

### why not CF Tunnels?

本来最简单的，也是我对[ignis](https://coyoteshkw.com/posts/tech-play/obsidian-ignis-deploy-docker/)使用的方法是直接Cloudflare Tunnels，但是**CF Tunnels限制了一次保存的大小**，而tiddlywiki单文件一次保存轻轻松松超过2mb，所以被拒绝保存，加上因为tw安装和测试插件都要频繁地保存重载，走CF小黄云明显拖慢速度，对比ignis的tunnel体验很糟糕，所以采用经典的nginx+证书签发模式

> 单文件格式在服务器上寸步难行的又一力证

### nginx配置

用sudo新建 `/etc/nginx/conf.d/tw5.conf` 文件

> [!NOTE]
> 我用的Alibaba Cloud Linux，个人配置文件放在 `conf.d` 文件夹下，其他系统按照实际情况放置

```
server {
    listen 80;
    listen [::]:80;
    server_name 你的域名;
    location / {
        proxy_pass http://127.0.0.1:48321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

重载nginx

```bash
# 语法检查
sudo -S nginx -t
sudo systemctl reload nginx
```

现在访问域名，如果你的服务器**部署在海外**，那么已经可以成功访问HTTP版本，但我的服务器在境内，80/443端口无备案无法使用，而我的域名都在spaceship购买，不允许备案。而且我的tiddlywiki只打算自用，不会让任何其他人访问，所以曲线救国一下，改用高位端口

```
server {
	<!-- [!code --] -->
    listen 80;
    listen [::]:80;
    <!-- [!code ++] -->
    listen 7654;
	listen [::]:7654;
    <!-- the rest of the post -->
	hello
```

光改高位端口还没用，因为HTTP是明文传输，备案的又不是啥子，给你拦截了，所以要用HTTPS加密运输

## HTTPS证书签发

证书签发我用的是[acme.sh](https://github.com/acmesh-official/acme.sh)，可以自动续签，比较方便。

验证方式用域名所有权，我的域名托管的Cloudflare，这里就用CF来演示

```bash
curl https://get.acme.sh | sh -s email=your@gmail.com 2>&1
```

> [!WARNING]
> 服务器在国内的自行处理下载的网络问题

确认下载安装完成后，打开Cloudflare，点击右上角头像 - API令牌，可以创建一个自定义令牌或使用Global API Key

![ImageStitch_Toolshu.com_q80_1787388366741.jpg](https://img.055933.xyz/file/1787388407167_ImageStitch_Toolshu.com_q80_1787388366741.jpg)

调用acme.sh签发证书

```bash
export CF_Key="your_key"
export CF_Email="your-email@gmail.com"
~/.acme.sh/acme.sh --issue --dns dns_cf -d 你的域名 --keylength ec-256
```

签发过程比较慢，也可能会重试好几次。成功后会把证书和key保存在 `/home/coyotec/.acme.sh/你的域名_ecc/你的域名.cer` 下，所有信息都在 `/home/coyotec/.acme.sh/你的域名_ecc/` 文件夹下

```bash
#结构
your-folder/tw5-server/
├── cert.pem        # 站点证书
├── key.pem         # 私钥
├── fullchain.pem   # 完整证书链 (nginx 用的)
└── tw5-nginx.conf  # nginx 配置
```

将证书安装到tw5-server放置的文件夹下，这几个步骤可以让AI来完成

```bash
sudo -S mkdir -p /etc/nginx/ssl && ~/.acme.sh/acme.sh --install-cert -d yourdomain.com \
  --ecc \
  --cert-file       ./cert.pem \
  --key-file        ./key.pem \
  --fullchain-file  ./fullchain.pem \
  --reloadcmd       "echo 'your_password' | sudo -S systemctl reload nginx" 2>&1

# 安装完成应返回Reload successful
```

更新 nginx 配置，可以让AI写，都是固定工作

```
server {
    listen 7654 ssl;
    listen [::]:7654 ssl;
    server_name 你的域名;
    ssl_certificate     your-folder/tw5-server/fullchain.pem;
    ssl_certificate_key your-folder/tw5-server/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    location / {
        proxy_pass http://127.0.0.1:48321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

重载nginx

```bash
sudo -S nginx -t
sudo systemctl reload nginx
```

关闭防火墙之前测试的端口号，开放nginx允许的端口号。现在，如果你证书签发没有意外——就可以通过 `HTTPS://你的域名:高位端口号` 来访问你的tw了 :D

![jerry.gif](https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bDdscmhvbjIyZzNpMTByenIyeHQ0MXE5NnNsOTQ1emw0cGo0MzhwYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/30pykuIQHxzQsfefte/giphy.gif)

如果在签发时遇到一些问题，首先考虑你提供的信息是否足够确认所有权，acme.sh即使你忘记提供了某些信息，它也会返回200成功，我最开始就是完全没提供任何所有权信息就让它给我签发，结果它也不说有什么问题，我也没明白明明200了却什么也没有，二人僵持不下。其次可以考虑切换签发机构

```bash
# 设置默认 CA（例如 Let's Encrypt）
acme.sh --set-default-ca --server letsencrypt

# 其他常见 CA：
acme.sh --set-default-ca --server zerossl   # ZeroSSL（默认）
acme.sh --set-default-ca --server buypass    # Buypass
acme.sh --set-default-ca --server google     # Google Trust 
```

### 解决tw保存问题

虽然能访问，但是会发现通过域名访问的tiddlywiki无法保存，原因是nginx限制了默认的上传大小为1M，对于tw这么大的单文件显然不够，改为50M，除非图片不存图床不存服务器全往单文件里存，不然用不完

```
# tw5-nginx.conf
server {
    listen 7654 ssl;
    listen [::]:7654 ssl;
    server_name 你的域名;
    ssl_certificate     your-folder/tw5-server/fullchain.pem;
    ssl_certificate_key your-folder/tw5-server/key.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

	# 修改最大上传
	<!-- [!code ++] -->
    client_max_body_size 50m;

```

### 添加访问密码

没有CF做中转意味着即使我们做了这么多步骤，也并非完全安全，但可以再多加一把锁。tiddlywiki自带密码，但自带的密码意味着恶意用户还是有机会知道“这是个HTML文件”，在nginx上加密码，只要恶意用户没猜对它就不知道里面是什么，或许他会更愿意放过你呢（？）

> [!NOTE]
> - 用tw的密码那访问者还是至少可以看到这个网址部署的是tiddlywiki
> - tw不一定能扛住暴力访问
> - nginx在系统级层面拦截，恶意访问者在密码登录前无法知道内部运行了什么程序
> - nginx对暴力访问有经验多了

**什么是htpasswd?**

htpasswd 是管理 HTTP 基本认证（Basic Authentication） 凭证的一个标准文件格式和命令行工具。它最初是 Apache HTTP Server 的专属工具，但现在被 Nginx 及其他许多 Web 服务器原生支持

可以用htpasswd命令或OpenSSL来生成。服务端没装htpasswd，我就用openssl了

```bash
echo "login-name:$(openssl passwd -apr1 'your-password')\n" > ./tw5-server/.htpasswd
# 输出类似login-name:$abccccc/deffffff/，由冒号分割为登录用户名和密码的哈希后输出
cd tw5-server/
cat .htpasswd
```

修改nginx文件，在location块上方添加

```
# tw5-nginx.conf

	<!-- [!code ++] -->
	auth_basic "TW5 Server";
	<!-- [!code ++] -->
	auth_basic_user_file your-folder/tw5-server/.htpasswd;

    location / {
        proxy_pass http://127.0.0.1:48321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}

```

再次重载nginx

```bash
sudo -S nginx -t
sudo systemctl reload nginx
```

访问tw，应弹出nginx的登陆框，输入自己设置的用户名和密码即可登录，我用了两天还没有遇到过二次验证，所以不会经常打扰

至此，一个本质nginx配置的tiddlywiki单文件版服务器部署教程就此完成
