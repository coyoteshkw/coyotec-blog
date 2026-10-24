---
pubDatetime: 2026-10-21T19:03:20.000+08:00
title: 2026年，我的Vim配置介绍(而不是NeoVim)
featured: false
draft: false
tags:
  - 终端
  - Vim
description: 我喜欢我的Vim配置，很有生活
category: 折腾
---

我明白，NeoVim是潮流也是趋势，但我的Vim生涯是被TheCW这位up主上传的Vim视频开启的。那时的他相信Vim有着无限的可能性，并且毫无保留地讲了他如何配置Vim，包括那些很少有人会自定义的部分(例如他使用非qwert布局，所以他的按键基本上是「全部重设了一遍」)，他的教导奠定了我多年的Vim基础，后面看了一堆Vim的技巧书籍、配置教程，好像都从脑子里流走了，留下来的还是他教给我的基础知识

唉，这就是我为什么放着好好的LazyVim不用跑来写我的Vim配置，因为这是我真正用的**最熟的配置**，不是我一知半解的、或者拿着AI边流口水边写的(无意冒犯，只是我的Nvim配置真的是乱糟糟的)

以下所有配置都可以无缝迁移到NeoVim，没什么特别的。用Vim教学是因为我的NeoVim放着Lua化的配置，更漂亮但是我没完全搞明白。等我什么时候全部弄明白并且用的很舒服了，我会再写一篇

## 原则

我讲我认为自己基本了解的东西，不是新的、好的，是我真的在用的

宁愿是旧的，也要能用的、我真的理解的

如果你想看一篇很新的东西，可以去学一下[kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim)，它会给你一个可以先用起来的配置，再慢慢教你配好NeoVim，完全没有一点VimScript掺杂的那种

## 为什么不是NeoVim

其实我两个都用，我的电脑上同时存在Vim/NeoVim自配置/LazyVim三种Vim配置，但就像我说的，剩下两个的配置我还没有完全弄明白，只是『在用』而已

Vim因为设置成yazi默认，包揽了各种小修改；NeoVim自配置是Vim配置的Lua化，并添加了一些小优化，拿来写不长的代码或看代码很不错；LazyVim配置了Copilot补全，有时候不想手写代码就拿来用

假若某天Vim已经到了完全不够用的地步，而我的Lua水平也很不错了，那么NeoVim将成为完全的上位替代

## 重大抉择

我使用<u>vim-plug</u>而不是lazy.nvim，因为我认为lazy.nvim在配置时更Lua，也不够傻瓜化，vim-plug安装和使用都清晰易懂

我使用<u>coc.nvim</u>而不是nvim-cmp，我也没有专门去配置treesitter，原因很简单，coc.nvim已经能满足我绝大多数需求，而nvim的其他补全，没有什么教程是我一看就真的觉得哇我已经完全能自己轻松配置了的，无论他们怎么说，一旦到了我需要自己动手才能解决的地方，哪怕一点点，都很容易引发海啸

我并不讨厌<u>VimScript</u>，我认为在简单问题上，它作为内置语言相当简洁清晰，而Lua更像是后来的孩子，写的东西很规矩但很长很杂，同样的问题用VimScript更简单。我知道在更专业的领域并非如此，但就我接触到的部分，特意将Vim配置变更为Lua只是让我的配置更加难以维护了

我确实拆分了配置，但只是因为它太长了，事实上合成一个不会有太多后果

```
.
├── autoload
│   ├── plug.vim
│   └── plug.vim.old
├── coc-settings.json
├── config
│   ├── appearance.vim # 外观
│   ├── basic.vim # 基础配置
│   ├── keymaps.vim # 键映射(原生)
│   ├── plugin # 占位置的大篇幅插件配置
│   │   ├── coc.vim
│   │   └── vim-airline.vim
│   └── plugins.vim # 插件配置
```

## 开始配置，安装vim-plug

忘了说了我在用MacOS，但同样的代码在Linux和WSL2下应该完全没问题

虽然你确实可以在用户家目录下直接创建一个`.vimrc`文件，但以防万一配置真的增长了，还是算了吧

常用的配置路径为`~/.vim`

[vim-plug](https://github.com/junegunn/vim-plug) ——  极简Vim插件管理器，低调、简洁、并且稳定

下载plug.vim并将其放入autoload目录

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

之后要安装的所有插件都放在这两行代码中，非常简单

```vim
call plug#begin()

" List your plugins here
Plug 'tpope/vim-sensible'

call plug#end()
```

## basic.vim

创建`vimrc`文件

> 如果只有一个Vim配置文件且放在用户家目录根，那么配置文件应该取名为`.vimrc`，但是放在单独的配置目录下就没有这个`.`前缀了

```vim
" 通用设置
source ~/.vim/config/basic.vim
```

basic存放最基础的Vim配置，它让一个Vim即使什么插件都不安装也能正常地跑起来，完成简单的任务

```vim
" ======================================
"
"            Basic Settings
"
" ======================================
" source: https://web.archive.org/web/20090213130939/http://items.sjbach.com/319/configuring-vim-right

syntax on
set mouse=a
set hidden
set number
set relativenumber
set nobackup
set encoding=utf-8
set hlsearch
filetype plugin indent on
set autoindent
set shiftwidth=4
set backspace=2
set tabstop=4 " 一个Tab等于几个空格
set wildmenu
set wildmode=list:longest,full
set ignorecase
set smartcase
set title
set scrolloff=3
set ruler
" Highlight search terms...
set hlsearch
set incsearch " dynamically as they are typed.
set belloff=all " so annoying
" 修复按下Esc后光标恢复有延迟的问题
set ttimeout
set ttimeoutlen=1
set ttyfast
set termguicolors " 24位真彩色(比256色还大)
set laststatus=2


" 高亮当前行
set cursorline
highlight CursorLine cterm=NONE ctermbg=darkgray guibg=lightgrey
" 在大约 80 字符的位置显示一条竖线，
" 如果配置了特定文件的textwidth选项则使用它定义的宽度
" set colorcolumn=80
augroup ColorColumn
  autocmd!
  autocmd FileType * let &colorcolumn = &textwidth ? &textwidth : 80
augroup END
highlight ColorColumn ctermbg=7 guibg=lightgrey

" 自动跳转到上次关闭时的光标位置
autocmd BufReadPost *
    \ if line("'\"") >= 1 && line("'\"") <= line("$") && &ft !~# 'commit'
    \ |   exe "normal! g`\""
    \ | endif

" 复制粘贴使用系统剪贴板
" set clipboard=unnamedplus  " Linux/WSL (使用寄存器 '+')
set clipboard=unnamed   " Mac (使用寄存器 '*', 但现代 Mac 也支持 +)

" cursor插入模式光标设置
let &t_SI = "\e[6 q"
let &t_EI = "\e[2 q"

set nowrap
```

大部分内容都无需解释

`set belloff=all`关闭蜂鸣器，现代电脑很少会让这个东西叫了，但是一些老电脑在Vim执行操作时发出巨大的蜂鸣声，或者操作它使用的终端发出提示音，足以把人吓死。关掉它享受美好生活

和现代编辑器不同，Vim不会自动高亮当前所在行。cursorline为当前行添加下划线，但不好看，后面这一行教你设置高亮行的颜色，颜色是可以自行调整的，但这样就足够好看了

```vim
set cursorline
highlight CursorLine cterm=NONE ctermbg=darkgray guibg=lightgrey
```

- 设置 CursorLine 这个高亮组的外观，也就是上面 cursorline 高亮当前行时使用的样式
- `cterm=NONE`：在终端里不使用额外样式，比如不加粗、不下划线、不反显等
- `ctermbg=darkgray`：在终端/cterm 环境下，当前行背景色设为深灰
- `guibg=lightgrey`：在 GUI Vim 或支持 GUI 颜色的环境里，当前行背景色设为浅灰
- 不设置前景色，所以文字颜色沿用配色方案

跳转到上次关闭时的光标位置的代码是照抄的，跳转功能其实是Vim自带的`g反引号`，其他代码是为了判断文件是否曾打开过、是否行数被裁剪到无法跳转以及是否是Git的Commit文件，直接用就好了

在大约80字符位置配置一条竖线，防君子不防小人，只是好看，作用不大，可以继续配置一旦超出80字符就硬换行或软视觉换行，但我觉得没必要

![竖线样式](https://img.055933.xyz/file/1792728049112_image.png)

## keymaps.vim

`keymaps.vim`文件负责配置全部原生Vim可用的按键

```vim
" 键位映射
source ~/.vim/config/keymaps.vim
```

```vim
" ======================================
"
"            Keyboard Mapping
"
" ======================================
" 原生vim按键配置

" 快速退出插入模式
inoremap jk <esc>
" <c-c>可以在命令行和可视模式下进入normal模式
" vnoremap jk <esc>
" cnoremap kj <C-C>

" 快速移动
noremap J 5j
noremap K 5k
" noremap gj G
nnoremap <BS> ciw
noremap <Enter> o<Esc>

" set leader key
let mapleader=" "

" 保存退出快捷键
nnoremap <leader>w :w<cr>
nnoremap <leader>q :q<cr>
" nnoremap <leader>rr so %<cr>
" 重映射分号，避免重复输入冒号到手痛
noremap ; :
" noremap ' :

" 求你别一直高亮了
nmap <silent> <leader>n :silent :nohlsearch<CR>

" === 窗口 ===
" c-w q 可以关系当前窗口 c-w o 关闭除当前窗口外的所有窗口
tnoremap <c-j> <c-w><c-j>
tnoremap <c-k> <c-w><c-k>
tnoremap <c-l> <c-w><c-l>
tnoremap <c-h> <c-w><c-h>

" 在tmux下无效
inoremap <C-Enter> <Esc>o

" cnoremap
cnoremap <C-A>		<Home>
cnoremap <C-E>		<End>
cnoremap <C-K>		<C-U>
```

大写J大写K快速移动5行是我和TheCW学的，极大改善Vim使用体验。`<count> + <movement>`确实也可以移动，但无法形成肌肉记忆，`C-u` `C-d`又移动太快，快速移动5行成了定位当前屏可见代码最好的方式之一，另一种当然是用搜索

JK快速退出插入模式一直都很有争议，但我很喜欢。不是我说，按下一个千里远的Esc键难道不是最容易脱离心流的方式吗？而且在一些键盘上Esc还会被压扁，更不好按。JK可以不用，不能没有

我和另一位我有些忘记名字的up主学习了下面这两种快速修改方式。删除键可以快速删除字符实在是太天才，一旦用习惯了就回不去了。而回车键快速添加空行在调整排版时很好用，不过回车键很常用，其他人可能会配置为更有用的快捷键，我用不上，就占用回车好了，也是我完全离不开的配置

```vim
nnoremap <BS> ciw
noremap <Enter> o<Esc>
```

设置Leader键是一种让自己更不容易腱鞘炎的完美方式

```vim
" set leader key
let mapleader=" "

" 保存退出快捷键
nnoremap <leader>w :w<cr>
nnoremap <leader>q :q<cr>
```

同理，让分号映射成冒号也是一种腱鞘友好映射，我很少看到有人这么做，但我真心觉得用小拇指狂按Shift会让职业生涯过早结束(虽然现在已经有AI了)

```vim
" 重映射分号，避免重复输入冒号到手痛
noremap ; :
```

我不是Vim狂热爱好者，让Vim用上一些Emacs键位也是极好的，特别是考虑到Emacs键位对于MacOS几乎是通用。我为命令模式做了一点映射

```vim
cnoremap <C-A>		<Home>
cnoremap <C-E>		<End>
cnoremap <C-K>		<C-U>
```

Vim默认的分屏切换按键看起来和Tmux师出同门，换一个键很有必要，不过Ctrl很常用，有时候会引发问题，但总体可控

```vim
" === 窗口 ===
" c-w q 可以关系当前窗口 c-w o 关闭除当前窗口外的所有窗口
tnoremap <c-j> <c-w><c-j>
tnoremap <c-k> <c-w><c-k>
tnoremap <c-l> <c-w><c-l>
tnoremap <c-h> <c-w><c-h>

" 在tmux下无效
inoremap <C-Enter> <Esc>o
```

## plugins.vim

`plugins.vim`文件负责安装插件、对插件进行简单的配置

```vim
" ======================================
"
"            Plugin Settings
"
" ======================================

" packloadall " 加载所有插件
" silent! helptags ALL "为所有插件加载帮助文档

" ==> vimwiki 作用范围限制（必须在插件加载前设置，即放在 plug#begin 之前）
" 1) 清空扩展名注册表：不让 vimwiki 认领 .md/.markdown 等，只留 .wiki
let g:vimwiki_ext2syntax = {}
" 2) 关掉临时 wiki：只有 g:vimwiki_list 里列出的路径才算 wiki
let g:vimwiki_global_ext = 0

call plug#begin()
Plug 'junegunn/vim-plug' " 加载文档
Plug 'tpope/vim-vinegar' " 给newtr目录管理添加- 键等小功能，如果安装Nerdtree会默认使用那个
" 快速搜索
Plug 'ctrlpvim/ctrlp.vim' " 搜索当前目录的文件、最近修改的文件、buffer
Plug 'junegunn/fzf'
Plug 'junegunn/fzf.vim'
" 快速移动
Plug 'mileszs/ack.vim' " 在vim中使用ack命令，将结果用quickfix窗口打开
Plug 'easymotion/vim-easymotion' " 快速移动
Plug 'rhysd/clever-f.vim' " 重复f/F键来执行原先;,的操作
" 实用工具
Plug 'tpope/vim-surround' " 添加、修改各种括号中的内容
Plug 'tpope/vim-unimpaired' " 为[ ] y 键添加一些实用映射
Plug 'christoomey/vim-tmux-navigator' " tmux支持
Plug 'tpope/vim-commentary' " 注释 gcc
Plug 'michaeljsmith/vim-indent-object' " 定义基于缩进级别的文本对象i和I
Plug 'terryma/vim-expand-region' " +/_ 扩大缩小可视选择的范围
Plug 'vimwiki/vimwiki'
Plug 'preservim/vim-pencil' " vim写作工具，添加换行功能
Plug 'junegunn/goyo.vim' " 为写作提供视觉优化
Plug 'junegunn/limelight.vim'
Plug 'shushcat/vim-minimd'
" minimd 改用 Vim 自带的完整 markdown 语法（而不是自带的极简语法），
" 同时让它靠 markdownHeadingDelimiter 组识别标题。
" 必须在插件加载前设置：autoload/minimd.vim 在首次调用时才求值，
" 且 syntax/minimd.vim 靠 exists() 判断后 set syntax=markdown。
let g:default_markdown_syntax = 1

" Plug 'preservim/vim-markdown', {'for': 'md'} " md支持
" coc
Plug 'neoclide/coc.nvim', {'branch': 'release'} " 语法补全
" 语言拓展
Plug 'godlygeek/tabular' " :Tab对齐文本

" 外观
Plug 'morhetz/gruvbox'
Plug 'catppuccin/nvim', { 'as': 'catppuccin' }
Plug 'junegunn/seoul256.vim'
Plug 'joshdick/onedark.vim'
Plug 'ayu-theme/ayu-vim'
Plug 'sainnhe/everforest'
Plug 'embark-theme/vim', { 'as': 'embark', 'branch': 'main' }
Plug 'cocopon/iceberg.vim'

Plug 'vim-airline/vim-airline' " 底栏美化及其主题
Plug 'vim-airline/vim-airline-themes'
Plug 'mhinz/vim-startify' " 美化启动界面
Plug 'machakann/vim-highlightedyank' " 高亮复制内容
Plug 'nathanaelkane/vim-indent-guides' " 缩进线，通过<leader>ig开关
call plug#end()

" ==> highlightedyank
let g:highlightedyank_highlight_duration = 500  " 高亮持续时间（毫秒）

" ==> ctrlp
let g:ctrlp_show_hidden = 0 " ctrl插件允许搜索隐藏文件
" Quickly find and open a file in the CWD
let g:ctrlp_map = '<C-p>'

" Quickly find and open a recently opened file
map <leader>ff :CtrlPMRUFiles<CR>

" Quickly find and open a buffer
map <leader>b :CtrlPBuffer<cr>

" ==> vim-indent-guides
let g:indent_guides_guide_size = 1 " < shiftwidth's size
let g:indent_guides_start_level = 2
let g:indent_guides_space_guides = 0
let g:indent_guides_tab_guides = 0
" let g:indent_guides_exclude_filetypes = ['help', 'nerdtree']
" default mapping
" :nmap <silent> <Leader>ig <Plug>IndentGuidesToggle

" ==> clever-f
let g:clever_f_chars_match_any_signs = ";"
let g:clever_f_smart_case = 1

" ==> tpope/vim-commentary
nnoremap <C-/> :Commentary<CR>
" inoremap <C-/> :Commentary<CR>

" ==> vimwiki
" 只认 .wiki 后缀；备注：g:vimwiki_ext2syntax / g:vimwiki_global_ext
" 已在文件顶部的 plug#begin() 之前设置（插件加载时求值，事后再设无效）
let g:vimwiki_list = [{'path': '~/Documents/vimwiki', 'path_html': '~/Documents/vimwiki_public_html/', 'ext': '.wiki'}]

" ==> minimd: 让 .mdx 也走 minimd（Vim 原生不认 mdx，会被 fallback 猜成 conf）
" 用 BufNewFile,BufRead 事件；setlocal filetype=minimd 后 Vim 会自动加载
" ftplugin/minimd.vim + syntax/minimd.vim（后者因 g:default_markdown_syntax 转用 markdown 语法）
augroup minimd_mdx
  autocmd!
  " .mdx 常以 import/export 开头，避免被 filetype.vim 的 fallback 先猜成 conf
  autocmd BufNewFile,BufRead *.mdx setlocal filetype=minimd
  " pencil 只对 markdown/mkd 初始化，为 mdx(minimd) 补上，保持与 .md 一致的写作体验
  autocmd FileType minimd if expand('%:e') ==# 'mdx' | call pencil#init() | endif
augroup END

" ==> vim-markdown
let g:vim_markdown_borderless_table = 1 " 允许不描边创建边框，看不懂那用就是了

" ==> 写作模式(markdown)
augroup pencil
  autocmd!
  " 为 Markdown 文件自动初始化 pencil
  autocmd FileType markdown,mkd call pencil#init()
  " 为纯文本文件自动初始化 pencil
  autocmd FileType text call pencil#init()
augroup END

" 进入 Goyo 模式时自coyoteshkw/vim_config动开启 Limelight
autocmd! User GoyoEnter Limelight 0.6
" 退出 Goyo 模式时自动关闭 Limelight
autocmd! User GoyoLeave Limelight!

" 进入禅模式
nnoremap <silent> <Leader>z :Goyo 80<CR>
```

内容都很简单，除了和vimwiki相关的部分，在后面作详细说明。简单来说，可以直接卸载vimwiki解决一切问题

### ctrlp - 快速查找文件

nvim有telescope.nvim，但是我发现偶尔用一下的话，ctrlp也凑合够用

```vim
let g:ctrlp_show_hidden = 0 " ctrl插件允许搜索隐藏文件
" Quickly find and open a file in the CWD
let g:ctrlp_map = '<C-p>'
" Quickly find and open a recently opened file
map <leader>fp :CtrlPMRUFiles<CR>
" Quickly find and open a buffer
map <leader>b :CtrlPBuffer<cr>
```

符合ctrlp插件的设定，Ctrl+P默认检索当前项目下的全部文件。C-j和C-k上下移动，Enter打开

`<leader>fp`可以检索最近打开的全部文件。`<leader>b`可以在最近打开的vim缓冲区之间切换

### fzf - 快速查找文件

::github{repo="junegunn/fzf.vim"}

很长时间以来我都使用ctrlp，但用了fzf以后就真香了

![image.png](https://img.055933.xyz/file/1792727379840_image.png)

系统需要已经安装过fzf，我知道fzf有很多高级配置，但是只是想要查找文件的话，简单一个映射就够了

```vim
" ==> fzf.vim
map <leader>ff :Files<CR>
```

如果在NeoVim上使用fzf.vim，搜索底栏还会有一些快捷功能

fzf.vim真的很强大，你还可以用它来查看Git历史提交，映射的所有案件，搜索历史，配色方案，当然，还有文件内查找。映射或直接敲`:Rg`命令即可。强烈推荐自己去看看这个Git仓库

注：除了Esc，还可以用Ctrl+Q关闭fzf窗口

### vim-easymotion - 快速定位

::github{repo="easymotion/vim-easymotion"}

关于easymotion，有很多人说它“违背了vim哲学”，但我觉得easymotion偶尔用一下也挺好的，相信Vim之父会原谅我的。如果是在NeoVim上，我会选择用flash.nvim插件替代

`<leader><leader>w`按单词定位，`<leader><leader>s{char}`按字符首字定位(区分大小写)，`<leader><leader>j`或`<leader><leader>k`快速定行

唯一的缺点是会导致我定义的`<leader>w`和`<leader>q`没法快速响应。但我习惯用`:w`和`:q`了，这个只是偶尔用一下

### vim-surround - 快速修改

::github{repo="tpope/vim-surround"}

除了快速在word周围添加单引号双引号括号尖号之类的事情以外，它还可以添加tag，修改HTML时偶尔很好用

支持在v选择模式下用大S也可以修改

:term[Normal Mode]{annotation="速查表由AI辅助生成"}

| 操作类型 | 命令格式 | 功能说明 | 示例与结果 |
| :--- | :--- | :--- | :--- |
| **删除环绕** | `ds{目标}` | 删除光标所在位置的环绕符号 | `ds"` 将 `"Hello"` 变为 `Hello` |
| **修改环绕** | `cs{原目标}{新目标}` | 将一种环绕替换为另一种 | `cs"'` 将 `"Hello"` 变为 `'Hello'` |
| **修改环绕（换行）** | `cS{原目标}{新目标}` | 替换环绕，并将内容置于新行 | `cS"{` 将 `"text"` 变为 `{\ntext\n}` |
| **添加环绕** | `ys{motion}{目标}` | 为指定的文本对象或移动范围添加环绕 | `ysiw)` 将 `word` 变为 `(word)` |
| **添加环绕（换行）** | `yS{motion}{目标}` | 同 `ys`，但将内容置于新行 | `ySiw}` 将 `word` 变为 `{\nword\n}` |
| **环绕整行** | `yss{目标}` | 为当前整行添加环绕 | `yss}` 将 `text` 变为 `{text}` |
| **环绕整行（换行）** | `ySS{目标}` | 为整行添加环绕，并新起一行缩进 | `ySS(` 将 `text` 变为 `(\ntext\n)` |

Visual Mode

| 命令 | 功能说明 | 模式差异 |
| :--- | :--- | :--- |
| `S{目标}` | 为选中的文本添加环绕 | **字符模式** (`v`)：行内环绕；**行模式** (`V`)：环绕符另起新行并缩进；**块模式** (`Ctrl-V`)：为每一行单独添加环绕 |
| `gS{目标}` | 同 `S`，但行为略有调整 | **行模式**：抑制自动缩进；**块模式**：在 `virtualedit` 开启时可环绕到行尾之外 |

### vim-expand-region - 快速选定

::github{repo="terryma/vim-expand-region"}

v选择模式下用`+`和`_`来拓展和缩减选定范围

### coc.nvim - 语法补全

::github{repo="neoclide/coc.nvim"}

coc插件的配置太长，创建一个plugin文件夹存放插件特定配置，编辑vimrc文件

```vim
" 指定配置文件所在的目录
let g:config_dir = expand('~/.vim/config/plugin/')

" 使用 glob() 函数查找所有配置文件
let g:config_files = glob(g:config_dir . '*.vim', 1, 1)  " *.vim 表示所有以 .vim 结尾的文件

" 循环加载每个配置文件
for file in g:config_files
  execute 'source ' . fnameescape(file)
endfor
```

创建对应文件夹，创建coc.vim文件，大部分内容都是从coc.nvim的Github页面抄下来的，默认配置中大量使用了`<leader>`键和`g`键，如果要用which-key做统一配置会是个难题。好消息：目前还没遇到这个难题

```vim
" ==> =======================================================
"
" ==> coc.nvim
"
" ==> =======================================================
set encoding=utf-8
set nobackup
set nowritebackup
set updatetime=300
set signcolumn=yes

" Use tab for trigger completion with characters ahead and navigate
" NOTE: There's always complete item selected by default, you may want to enable
" no select by `"suggest.noselect": true` in your configuration file
" NOTE: Use command ':verbose imap <tab>' to make sure tab is not mapped by
" other plugin before putting this into your config
inoremap <silent><expr> <TAB>
      \ coc#pum#visible() ? coc#pum#next(1) :
      \ CheckBackspace() ? "\<Tab>" :
      \ coc#refresh()
inoremap <expr><S-TAB> coc#pum#visible() ? coc#pum#prev(1) : "\<C-h>"

" Make <CR> to accept selected completion item or notify coc.nvim to format
" <C-g>u breaks current undo, please make your own choice
inoremap <silent><expr> <CR> coc#pum#visible() ? coc#pum#confirm()
                              \: "\<C-g>u\<CR>\<c-r>=coc#on_enter()\<CR>"

function! CheckBackspace() abort
  let col = col('.') - 1
  return !col || getline('.')[col - 1]  =~# '\s'
endfunction

" Use <c-space> to trigger completion
if has('nvim')
  inoremap <silent><expr> <c-space> coc#refresh()
else
  inoremap <silent><expr> <c-@> coc#refresh()
endif

" Use `[g` and `]g` to navigate diagnostics
" Use `:CocDiagnostics` to get all diagnostics of current buffer in location list
nmap <silent> [g <Plug>(coc-diagnostic-prev)
nmap <silent> ]g <Plug>(coc-diagnostic-next)

" GoTo code navigation
nmap <silent> gd <Plug>(coc-definition)
nmap <silent> gy <Plug>(coc-type-definition)
nmap <silent> gi <Plug>(coc-implementation)
nmap <silent> gr <Plug>(coc-references)

" Use K to show documentation in preview window
nnoremap <silent> gk :call ShowDocumentation()<CR>

function! ShowDocumentation()
  if CocAction('hasProvider', 'hover')
    call CocActionAsync('doHover')
  else
    call feedkeys('gk', 'in')
  endif
endfunction

" Highlight the symbol and its references when holding the cursor
autocmd CursorHold * silent call CocActionAsync('highlight')

" Symbol renaming
nmap <leader>rn <Plug>(coc-rename)

" Formatting selected code
xmap <leader>f  <Plug>(coc-format-selected)
nmap <leader>f  <Plug>(coc-format-selected)

augroup mygroup
  autocmd!
  " Setup formatexpr specified filetype(s)
  autocmd FileType typescript,json setl formatexpr=CocAction('formatSelected')
  " Update signature help on jump placeholder
  autocmd User CocJumpPlaceholder call CocActionAsync('showSignatureHelp')
augroup end

" Applying code actions to the selected code block
" Example: `<leader>aap` for current paragraph
xmap <leader>a  <Plug>(coc-codeaction-selected)
nmap <leader>a  <Plug>(coc-codeaction-selected)

" Remap keys for applying code actions at the cursor position
nmap <leader>ac  <Plug>(coc-codeaction-cursor)
" Remap keys for apply code actions affect whole buffer
nmap <leader>as  <Plug>(coc-codeaction-source)
" Apply the most preferred quickfix action to fix diagnostic on the current line
"nmap <leader>qf  <Plug>(coc-fix-current)
nmap <leader>gf  <Plug>(coc-fix-current)

" Remap keys for applying refactor code actions
nmap <silent> <leader>re <Plug>(coc-codeaction-refactor)
xmap <silent> <leader>r  <Plug>(coc-codeaction-refactor-selected)
nmap <silent> <leader>r  <Plug>(coc-codeaction-refactor-selected)

" Run the Code Lens action on the current line
nmap <leader>cl  <Plug>(coc-codelens-action)

" Map function and class text objects
" NOTE: Requires 'textDocument.documentSymbol' support from the language server
xmap if <Plug>(coc-funcobj-i)
omap if <Plug>(coc-funcobj-i)
xmap af <Plug>(coc-funcobj-a)
omap af <Plug>(coc-funcobj-a)
xmap ic <Plug>(coc-classobj-i)
omap ic <Plug>(coc-classobj-i)
xmap ac <Plug>(coc-classobj-a)
omap ac <Plug>(coc-classobj-a)

" Remap <C-f> and <C-b> to scroll float windows/popups
if has('nvim-0.4.0') || has('patch-8.2.0750')
  nnoremap <silent><nowait><expr> <C-f> coc#float#has_scroll() ? coc#float#scroll(1) : "\<C-f>"
  nnoremap <silent><nowait><expr> <C-b> coc#float#has_scroll() ? coc#float#scroll(0) : "\<C-b>"
  inoremap <silent><nowait><expr> <C-f> coc#float#has_scroll() ? "\<c-r>=coc#float#scroll(1)\<cr>" : "\<Right>"
  inoremap <silent><nowait><expr> <C-b> coc#float#has_scroll() ? "\<c-r>=coc#float#scroll(0)\<cr>" : "\<Left>"
  vnoremap <silent><nowait><expr> <C-f> coc#float#has_scroll() ? coc#float#scroll(1) : "\<C-f>"
  vnoremap <silent><nowait><expr> <C-b> coc#float#has_scroll() ? coc#float#scroll(0) : "\<C-b>"
endif

" Use CTRL-S for selections ranges
" Requires 'textDocument/selectionRange' support of language server
nmap <silent> <C-s> <Plug>(coc-range-select)
xmap <silent> <C-s> <Plug>(coc-range-select)

" Add `:Format` command to format current buffer
command! -nargs=0 Format :call CocActionAsync('format')

" Add `:Fold` command to fold current buffer
command! -nargs=? Fold :call     CocAction('fold', <f-args>)

" Add `:OR` command for organize imports of the current buffer
command! -nargs=0 OR   :call     CocActionAsync('runCommand', 'editor.action.organizeImport')

" Add (Neo)Vim's native statusline support
" NOTE: Please see `:h coc-status` for integrations with external plugins that
" provide custom statusline: lightline.vim, vim-airline
set statusline^=%{coc#status()}%{get(b:,'coc_current_function','')}

" Mappings for CoCList
" Show all diagnostics
nnoremap <silent><nowait> <space>a  :<C-u>CocList diagnostics<cr>
" Manage extensions
nnoremap <silent><nowait> <space>e  :<C-u>CocList extensions<cr>
" Show commands
nnoremap <silent><nowait> <space>c  :<C-u>CocList commands<cr>
" Find symbol of current document
nnoremap <silent><nowait> <space>o  :<C-u>CocList outline<cr>
" Search workspace symbols
nnoremap <silent><nowait> <space>s  :<C-u>CocList -I symbols<cr>
" Do default action for next item
nnoremap <silent><nowait> <space>j  :<C-u>CocNext<CR>
" Do default action for previous item
nnoremap <silent><nowait> <space>k  :<C-u>CocPrev<CR>
" Resume latest coc list
nnoremap <silent><nowait> <space>p  :<C-u>CocListResume<CR>
```

coc.nvim很稳定，我多少年前用了它，今天再用还是不会突然炸掉，不会太爱我然后送我一个破坏性更新让我体验一下欧卡mod全炸了的感觉，爱你coc

coc.nvim功能很丰富，也因此很容易**忘记**，最好没事多看看配置


### vim-airline

大部分时间里毫无问题，但前些日子会出现后半段抽搐的情况，希望已经随着更新修复了。airline作为老牌mod相当重型，默认兼容大量插件，无需手动配置，这也是我为什么一直使用它，省心

由于它的配置文件有点长，单独开了一个vim文件

```vim
" ==> vim-airline
" let g:airline_theme='bubblegum'
let g:airline_theme = 'catppuccin'
" let g:airline_left_sep = '▶'
let g:airline_left_sep = ''
let g:airline_left_sep = ''
" let g:airline_left_alt_sep = '❯'
let g:airline_left_alt_sep = ''
" let g:airline_right_sep = '◀'
" let g:airline_right_alt_sep = '❮'
let g:airline_right_sep = ''
let g:airline_right_alt_sep = ''
let g:airline_powerline_fonts = 1 " 使用nerdfont字符
let g:airline_section_x = '%{strftime("%H:%M")}'
let g:airline#parts#ffenc#skip_expected_string = 'utf-8[unix]' " Skip display if encoding matches default (e.g., utf-8[unix])
let g:airline_section_z = '%p%% %l/%L'
```


## appearance.vim

主题配置是根据不同主题来定的，其实没什么好讲。我用的比较多的主题是catppuccin系列、onedark、everforest。catppuccin系列非常漂亮，但开发和配置都是为了Nvim而生的，想要做个性化配置在Vim上比较难受，基本上只是默认状态能“在Vim里面跑”而已。其他的都对Vim有不同程度的适配，最主要的适配是对airline状态栏插件

```vim
" ======================================
"
"              Colorscheme
"
" ======================================

" seoul256 config info:https://github.com/junegunn/seoul256.vim

" hi Normal guibg=NONE ctermbg=NONE
" let t:is_transparent = 0

" Toggle transparent background
let t:is_transparent = 0
function! Toggle_transparent()
    if t:is_transparent == 0
        hi Normal guibg=NONE ctermbg=NONE
        let t:is_transparent = 1
    else
"        set background=dark
        let t:is_tranparent = 0
    endif
endfunction

nnoremap gl : call Toggle_transparent()<CR>


" ======================================
"
" configuration option should be placed before colorscheme
"
" ======================================
"

" => everforest
" Set contrast.
" Available values: 'hard', 'medium'(default), 'soft'
let g:everforest_background = 'soft'

" For better performance
let g:everforest_better_performance = 1

let g:airline_theme = 'everforest'
let g:everforest_enable_italic = 1
" To use transparent background, set this option to `1`.
" If you want more ui components to be transparent (for example, status line background), set this option to `2`.
" let g:everforest_transparent_background = 1
" Some plugins support highlighting error/warning/info/hint texts, by default
" these texts are only underlined, but you can use this option to also highlight the background of them.
let g:everforest_diagnostic_text_highlight = 1
" Some plugins support highlighting error/warning/info/hint lines, but this feature is disabled by default in this color scheme. To enable this feature, set this option to `1`.
let g:everforest_diagnostic_line_highlight = 1
let g:everforest_inlay_hints_background = 'dimmed' " none

" => iceberg
" TODO
" let g:airline_theme = 'iceberg'


"
set background=dark
" set background=light
" colorscheme catppuccin-mocha " catppuccin-latte, catppuccin-frappe, catppuccin-macchiato, catppuccin-mocha
colorscheme onedark
" colorscheme everforest
```

我总是留下很多注释，方便之后快速切换，就是看起来会有些乱糟糟的

这个开关背景透明的函数写的很烂，虽然叫做Toggle，但只能开不能关，太耻辱了。但由于使用场景很少以致于遇到了只要退出重新一下Vim就好了，一直提不起重写的欲望。透明背景虽然漂亮，但在很多终端下代码配色失去了背景色立马变得模糊不清，只好开着

在Goyo状态下(下文会介绍)开关透明背景设置无效

## 写作

MarkEdit是个好软件，但总有些时刻它不适合，例如：

- 在上传博客初稿后发现哪里不对只好在终端内部修改(我不用VSCode写文章因为占内存)
- 突然的博客修订，可能只是改几个标点，删两行字

遇到的问题：

- 为了代码看着舒服，通常会设置`set nowrap`，博客文字跟着遭殃，看着就不舒服
- 为非代码文件设置wrap，wrap内容无法通过jk:term[移动定位]{annotation="移动时即使设置了换行，仍旧会将整行内容「视作一行」，因而按一下J会直接跳过整段内容，哪怕这一段有200字。使用gj则会无视这一状况把每一个软换行段都可以移动定位。有些用户会重新映射J键为gj，我没有这样做"}，必须gj和gk
- 界面干扰元素多，不舒服
- 需要按标题折叠，特别是长文本

解决方案：

仍旧默认设置nowrap，但安装这几个插件

```
Plug 'preservim/vim-pencil' " vim写作工具，添加换行功能
Plug 'junegunn/goyo.vim' " 为写作提供视觉优化
Plug 'junegunn/limelight.vim'
Plug 'shushcat/vim-minimd'
```

[vim-pencil](https://github.com/preservim/vim-pencil)插件为markdown格式提供软换行支持，并且支持类gj换行，相当好用

为了激活插件需要如下代码

```vim
augroup pencil
  autocmd!
  " 为 Markdown 文件自动初始化 pencil
  autocmd FileType markdown,mkd call pencil#init()
  " 为纯文本文件自动初始化 pencil
  autocmd FileType text call pencil#init()
augroup END
```

[goyo.vim](https://github.com/junegunn/goyo.vim)插件简化了Vim样式，视觉干扰更少

![image.png](https://img.055933.xyz/file/1792605632940_image.png)

更重要的是，它解决了pencil插件的一个痛点，pencil插件默认使用Vim提供的软换行，所以打开的文件只是**看起来换行了**，原文并没有插入换行符，但这种软换行无法被限制字符宽度，所以当前Vim窗口有多宽，文本就有多宽。如果换用硬换行确实能解决这个问题，但我无法保证我将来不会使用其他编辑器来编辑博客，到时这些硬换行可能会有些扎眼

Goyo提供配置项，可以直接限制整个文本区域的显示宽度，搭配pencil就实现了没有硬换行但你的眼睛仍然很舒服

考虑到goyo默认不展示行号(可配置)，我没有设置和pencil一起开启，必须手动在命令行输入`Goyo 80`或按下快捷键

```vim
nnoremap <silent> <Leader>z :Goyo 80<CR>
```

Goyo状态没有官方方式切换开关，退出直接`:q<CR>`即可

[limelight.vim](https://github.com/junegunn/limelight.vim)和goyo.vim插件是同一个作者，它为Goyo状态添加一个专注行效果，当前所在段落以外的文字都会变得淡淡的。因为是同一个作者，所以官方提供了集成

```vim
" 进入 Goyo 模式时自动开启 Limelight
autocmd! User GoyoEnter Limelight 0.6
" 退出 Goyo 模式时自动关闭 Limelight
autocmd! User GoyoLeave Limelight!
```

淡色效果可以自己配置[0.0-1.0]，临时关闭使用`:Limelight!`

![gif](https://img.055933.xyz/file/1792608072852_2026-10-22_02.40.08.gif)

[vim-minimd](https://github.com/shushcat/vim-minimd)是一个按标题折叠的插件，对着标题按下空格即可。本打算使用另一个更轻量级的插件vim-markdown-folding，但不知何故无法使用

它同时还提供一些简单的功能，像按Tab跳转到标题，-=可以调整标题缩进，数字+空格可以一口气折叠多个标题等等

我的工作流：在终端中用yazi创建一篇新博客 -> `<leader>z`进入goyo状态，编写初稿 -> 在浏览器查看状态 -> 持续修改

### vim-wiki

::github{repo="vimwiki/vimwiki"}

Emacs有org-mode，Vim有vim-wiki，虽然二者差远了，但vim-wiki还是很不错的

不了解的话，vim-wiki基本上是一个vim内部的记事本，只是功能强大且支持一套自己的wiki语法，很适合突然写点什么。但老实说我现在用的很少，因为它没有什么特别独特的功能，它所能实现的，TiddlyWiki/Obsidian/SilverBullet也能实现，它只占了一个终端里快速打开的优势

不过也没有必要删掉，所以我一直留着，直到我发现它会和大纲折叠插件minimd抢位置，叹为观止

抢位置就是说，由于vim-wiki插件霸道地占领了md后缀文件，它的优先级比minimd高，minimd的按标题折叠功能就不生效了，但其他功能还可以用例如用`-`和`=`增加减少标题层级

为了解决此问题问了AI，答案是让vim-wiki把它侵占的md后缀吐出去，但是为此而写的代码实在不怎么优雅，希望之后可以解决这个问题

```vim
" ==> vimwiki 作用范围限制（必须在插件加载前设置，即放在 plug#begin 之前）
" 1) 清空扩展名注册表：不让 vimwiki 认领 .md/.markdown 等，只留 .wiki
let g:vimwiki_ext2syntax = {}
" 2) 关掉临时 wiki：只有 g:vimwiki_list 里列出的路径才算 wiki
let g:vimwiki_global_ext = 0

call plug#begin()

Plug 'vimwiki/vimwiki'
Plug 'shushcat/vim-minimd'
" minimd 改用 Vim 自带的完整 markdown 语法（而不是自带的极简语法），
" 同时让它靠 markdownHeadingDelimiter 组识别标题。
" 必须在插件加载前设置：autoload/minimd.vim 在首次调用时才求值，
" 且 syntax/minimd.vim 靠 exists() 判断后 set syntax=markdown。
let g:default_markdown_syntax = 1

call plug#end()

" ==> vimwiki
" 只认 .wiki 后缀；备注：g:vimwiki_ext2syntax / g:vimwiki_global_ext
" 已在文件顶部的 plug#begin() 之前设置（插件加载时求值，事后再设无效）
" 这里的地址要填自己设定好的，别填我的啊
let g:vimwiki_list = [{'path': '~/Documents/vimwiki', 'path_html': '~/Documents/vimwiki_public_html/', 'ext': '.wiki'}]

```

### MDX支持

MDX对于Astro博客就像水之于鱼，但Vim自带的语法居然不认识mdx，怎么能这样！(胡搅蛮缠中)，而且minimd插件也不认识mdx文件，我的mdx博客简直和山一样多，这可不行

让AI小出一手。这段代码没什么魔法，只是在检测到任何mdx后缀的文件时手动启用minimd(`setlocal filetype=minimd`)，并且开启pencil

```vim
" ==> minimd: 让 .mdx 也走 minimd（Vim 原生不认 mdx，会被 fallback 猜成 conf）
" 用 BufNewFile,BufRead 事件；setlocal filetype=minimd 后 Vim 会自动加载
" ftplugin/minimd.vim + syntax/minimd.vim（后者因 g:default_markdown_syntax 转用 markdown 语法）
augroup minimd_mdx
  autocmd!
  " .mdx 常以 import/export 开头，避免被 filetype.vim 的 fallback 先猜成 conf
  autocmd BufNewFile,BufRead *.mdx setlocal filetype=minimd
  " pencil 只对 markdown/mkd 初始化，为 mdx(minimd) 补上，保持与 .md 一致的写作体验
  autocmd FileType minimd if expand('%:e') ==# 'mdx' | call pencil#init() | endif
augroup END
```

## VSCodeVim

可是人也不能完全舍弃VSCode呀，所以我copy了最重要的部分给VSCode的Vim插件使用

```vim
" 快速退出插入模式
inoremap jk <esc>

" 快速移动
noremap J 5j
noremap K 5k

" 保存退出快捷键
nnoremap <leader>w :w<cr>
nnoremap <leader>q :q<cr>
" nnoremap <leader>r so %<cr>
" 重映射分号，避免重复输入冒号到手痛
" noremap ; :
" noremap ' :

" 求你别一直高亮了
nmap <silent> <leader>n :noh<CR>

" === 窗口 ===
" c-w q 可以关系当前窗口 c-w o 关闭除当前窗口外的所有窗口
map <C-j> <C-W>j
map <C-k> <C-W>k
map <C-h> <C-W>h
map <C-l> <C-W>l

" 在tmux下无效
inoremap <C-Enter> <Esc>o
```

如果用JetBrains，那就在这个基础上添加一些和Jet兼容的代码，例如快速切换tab

## 完整配置

::github{repo="coyoteshkw/vim_config"}

我的完整配置公开在Github上
