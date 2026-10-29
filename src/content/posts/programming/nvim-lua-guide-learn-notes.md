---
pubDatetime: 2026-10-29T20:04:20.000+08:00
title: NeoVim Lua Guide学习及笔记
featured: false
draft: false
tags:
  - 终端
  - Vim
  - NeoVim
  - 笔记
description: NeoVim默认的Lua Guide在有编程基础的情况下并不复杂，但不复杂不代表可以像读中文和喝水一样轻松理解全部内容，遂作笔记。完全涵盖了lua-guide的基础内容，并尽量对我觉得复杂的地方详细说明，方便理解
category: 技术笔记
---

NeoVim默认的lua guide在有编程基础的情况下并不复杂，但不复杂不代表可以像读中文和喝水一样轻松理解全部内容，遂作笔记。完全涵盖了lua-guide的基础内容，并尽量对我觉得复杂的地方详细说明，方便理解

> [!NOTE]
> nvim-lua-guide是对neovim内部的lua如何使用的介绍，而不是lua基础介绍，如[kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim)所述，如果没有Lua基础需要先看一篇Lua教程，[Learn Lua in Y minutes](https://learnxinyminutes.com/zh-cn/lua/)就不错

> [!WARNING]
> 本文的MD表格内容为AI生成

## 参考

nvim内容的文档来自[nanotee](https://github.com/nanotee)，感谢他的付出

以下内容的代码部分基本完全来自于原文，毕竟主要是一篇边做边学的笔记

---

## 按需加载

这解释了为什么所有的插件都放在lua文件夹下，因为放在里面的内容是按需加载的(on demand)，要调用需要用`require()`函数

```lua
require('myluamodule')
require('subfolder/myluamodule')
```

require只在初次调用时运行一次模块，之后会进行缓存，想再次调用需要

```lua
package.loaded['myluamodule'] = nil
require('myluamodule')    -- read and execute the module again from disk
```

---

## 错误处理

```lua
local ok, mymod = pcall(require, 'module_with_error')
if not ok then
  print("Module had an error")
else
  mymod.func()
end
```

---

## Vim命令 -> Lua

放在`vim.cmd()`里

```lua
vim.cmd("colorscheme habamax")
```

利用`[[]]`(类似于Python的三反引号)可以一次调用执行多个命令


```lua
vim.cmd([[
  highlight Error guibg=red
  highlight link Warning Error
]])
```

它可以以一种更加可编程化的方式呈现，方式是把以上代码的首动作作为**函数方法**，剩下的内容作为参数，如果有多个参数那就放在一个Table里(近似于JS的对象语法)

```lua
vim.cmd.colorscheme("habamax")
vim.cmd.highlight({ "Error", "guibg=red" })
vim.cmd.highlight({ "link", "Warning", "Error" })
```

利用这种方法，可以直接在`init.lua`文件里塞原生Vimscript

```lua
-- init.lua
vim.cmd([[
    syntax on
    set mouse=a
    set hidden
    set number
    set relativenumber
    set nobackup
    set encoding=utf-8
]])
```

---

## Vimscript函数 -> Lua调用

原本的Vim函数可以转成用Lua调用。此处的reverse函数传入了Lua的Table，但会在执行时转换成Vim可以理解的List被调用，得出的反转List又被自动转换成Lua的Table，被reversed_list获取

```lua
print(vim.fn.printf('Hello from %s', 'Lua'))

local reversed_list = vim.fn.reverse({ 'a', 'b', 'c' })
vim.print(reversed_list) -- { "c", "b", "a" }

local function print_stdout(chan_id, data, name)
  print(data[1])
end

vim.fn.jobstart('ls', { on_stdout = print_stdout })
```

这里的`vim.print(reversed_list)`是Nvim提供的Lua函数，用来打印格式化的Lua值

> [!NOTE]
> Lua中`#`有特殊含义，所以用Lua调用Vim中有井号的方法需要用`[]`来调用

```lua
vim.fn['my#autoload#function']()
```

---

## Vim变量 -> Lua方法调用

```
• |vim.g|:   global variables (|g:|)
• |vim.b|:   variables for the current buffer (|b:|)
• |vim.w|:   variables for the current window (|w:|)
• |vim.t|:   variables for the current tabpage (|t:|)
• |vim.v|:   predefined Vim variables (|v:|)
• |vim.env|: environment variables defined in the editor session
```

用法

```lua
-- 全局
vim.g.a_global_var = {
    key1 = "value",
    key2 = 300
}
vim.print(vim.g.a_global_var)
-- buffer
vim.b[2].myvar = 1 -- 在第二个缓冲区设置变量myvar
-- window
vim.w[1005].myvar2 = true -- 在窗口ID为1005的窗口设置变量
-- 有特殊字符的Vim变量定义
vim.g['special#variable'] = 1
```

> [!NOTE]
> vim开头 = 必须意识到这是在以Lua的方式写「原本用Vimscript写的东西」，本质是Vimscript，有些操作可能会无法以原本Lua可用的方式实现，例如下面这个：

以Vim方式定义的数组，无法用Lua的方式简单的修改其值，只能整体替换

```lua
vim.g.some_global_variable.key2 = 400
vim.print(vim.g.some_global_variable)
--> { key1 = "value", key2 = 300 } 不可行
-- 用临时Lua变量获取Vim值，修改这个Table，再整体赋值回去

local temp_table = vim.g.some_global_variable
temp_table.key2 = 400
vim.g.some_global_variable = temp_table
vim.print(vim.g.some_global_variable)
--> { key1 = "value", key2 = 400 }
```

但有些操作是可以的，nvim帮助简化了，可以通过直接将一个变量赋值为空的方式删除这个变量

```lua
vim.g.myvar = nil
```

---

## 设置项 Options

### 1. vim.opt

所有的`set`系列命令可以用`vim.opt`替代

```
• |vim.opt|:        behaves like |:set|
• |vim.opt_global|: behaves like |:setglobal|
• |vim.opt_local|:  behaves like |:setlocal|
```

单值：

```
set smarttab -> vim.opt.smarttab = true
set nosmarttab -> vim.opt.smarttab = false
```

如果值以Vim列表或字典(List/Dict)的方式呈现，则可以转换成Lua Table，Table真是万能啊

```vim
set wildignore=*.o,*.a,__pycache__ "列表
set listchars=space:_,tab:>~ "字典，看起来很糊的字典
set formatoptions=njt "njt都是格式化选项，写在一起让人都愣一下
```

```lua
vim.opt.wildignore = { '*.o', '*.a', '__pycache__' } -- key仍然存在，是没写明的数字
vim.opt.listchars = { space = '_', tab = '>~' }
vim.opt.formatoptions = { n = true, j = true, t = true }
```

Vim有一些写法相对神秘(我觉得Lua其实也没好到哪去吧？)的语法，例如`:set+=`,`:set^=`, `:set-=`，也可以转换成Lua语法


```lua
vim.opt.shortmess:append({ I = true }) -- 加到shortmess列表末尾
vim.opt.wildignore:prepend('*.o') -- 加到wildignore列表最前面
vim.opt.whichwrap:remove({ 'b', 's' }) -- 移除
```

### 2. get()

用这种方法设置时你无法直接访问到option值，必须通过`vim.opt.get()`方法

```lua
print(vim.opt.smarttab)
--> {...} (big table)
print(vim.opt.smarttab:get())
--> false
vim.print(vim.opt.listchars:get())
--> { space = '_', tab = '>~' }
```

### 3. vim.o

vim.o = vim option，读代码的时候念作“option”要清晰很多

由于用`vim.opt`定义的选项，测试打印必须用`vim.opt.get()`，有了`vim.o`方案，它在接收变量时(至少在接收list时)更像Vimscript，其他方面相同，它可以直接通过`print()`打印设置的结果

`vim.o`也囊括了更多的变量范围

```
• |vim.o|:  behaves like |:set|
• |vim.go|: behaves like |:setglobal|
• |vim.bo|: for buffer-scoped options
• |vim.wo|: for window-scoped options (can be double indexed)
```


```lua
vim.o.smarttab = false -- :set nosmarttab
print(vim.o.smarttab)
--> false
vim.o.listchars = 'space:_,tab:>~' -- :set listchars='space:_,tab:>~'
print(vim.o.listchars)
--> 'space:_,tab:>~'
vim.o.isfname = vim.o.isfname .. ',@-@' -- :set isfname+=@-@
print(vim.o.isfname)
--> '@,48-57,/,.,-,_,+,,,#,$,%,~,=,@-@'
vim.bo.shiftwidth = 4 -- :setlocal shiftwidth=4
print(vim.bo.shiftwidth)
--> 4
```

指定窗口ID和buffer的方法依旧有效

```lua
vim.bo[4].expandtab = true -- sets expandtab to true in buffer 4
vim.wo.number = true       -- sets number to true in current window
vim.wo[0].number = true    -- same as above
vim.wo[0][0].number = true -- sets number to true in current buffer
                           -- in current window only
print(vim.wo[0].number)    --> true
```

---

## 映射 Mappings

既可以映射Vim命令，也可以直接映射Lua函数。肯定啊，不然这么大费周章地把Lua弄进Vim里是为了干啥呢

### 1. 创建映射 vim.keymap.set()

`vim.keymap.set()`三个必填参数：{mode} {lhs} {rhs}

1. {mode}是一个字符串或包含字符串的table，内容为nvim支持的vim mode的前缀(例如n→普通模式, c→命令模式)，这些前缀在`:map-modes`/`:map!`/`:map`展示的内容中被显示出来

![image.png](https://img.055933.xyz/file/1793199259167_image.png)

| 值 | 含义 | 对应 Vim 命令 |
|---|---|---|
| `'n'` | Normal 模式 | `:nmap` |
| `'i'` | Insert 模式 | `:imap` |
| `'v'` | Visual + Select 模式（`x` 和 `s` 的并集） | `:vmap` |
| `'x'` | 仅 Visual 模式（不含 Select） | `:xmap` |
| `'s'` | 仅 Select 模式 | `:smap` |
| `'o'` | Operator-pending 模式（如 `d`、`y` 后等动作） | `:omap` |
| `'c'` | Command-line 模式 | `:cmap` |
| `'t'` | Terminal 模式 | `:tmap` |
| `'!'` | Insert + Command-line 模式（`i` + `c` 的并集） | `:map!` |
| `'l'` | Lang-arg 伪模式，用于 `:lmap`（语言/输入法映射） | `:lmap` |

2. {lhs}是一个字符串键序列，表示用来触发映射的键

3. {rhs}是被映射的Vim命令或Lua函数，若{rhs}为空，表示禁用{lhs}的映射，效果和`<Nop>`相同

例：

```lua
-- Normal mode mapping for Vim command
vim.keymap.set('n', '<Leader>ex1', '<cmd>echo "Example 1"<cr>')
-- Normal and Command-line mode mapping for Vim command
vim.keymap.set({'n', 'c'}, '<Leader>ex2', '<cmd>echo "Example 2"<cr>')
-- Normal mode mapping for Lua function
vim.keymap.set('n', '<Leader>ex3', vim.treesitter.start)
-- Normal mode mapping for Lua function with arguments
vim.keymap.set('n', '<Leader>ex4', function() print('Example 4') end)
```

{rhs}可以直接是从Lua包里拿来的函数，用`function() end`包裹可实现在按下按键时才加载plugin

```lua
-- 在映射被定义时就加载了plugin
vim.keymap.set('n', '<Leader>pl1', require('plugin').action)
-- 在按键被触发时才加载plugin
vim.keymap.set('n', '<Leader>pl2', function() require('plugin').action() end)
```

可选参数，这些参数要放在一个table中：

- `buf`: 只为指定buffer设置此映射，值填0表示当前buf

```lua
-- set mapping for the current buffer
vim.keymap.set('n', '<Leader>pl1', require('plugin').action, { buf = 0 })
-- set mapping for the buffer number 4
vim.keymap.set('n', '<Leader>pl1', require('plugin').action, { buf = 4 })
```

- `silent`: 执行命令就算在后台跑递归它也不会告诉你的，睡的很香

```lua
vim.keymap.set('n', '<Leader>pl1', require('plugin').action, { silent = true })
```

- `expr`: 通常情况下，{rhs}作为一个「按键序列」被输入，也就是模拟人手在键盘上按顺序按下按键，启用`expr`表达式模式时，{rhs}作为一个**函数/表达式**，算出它的结果后，再**将它的结果作为按键输入**。
    - 这意味着可以在函数中执行判断，根据判断结果执行不同的按键操作

```lua
-- 当补全菜单弹出时方向键下会触发`<c-n>`移动到下一个补全项，否则执行默认行为
vim.keymap.set('c', '<down>', function()
  if vim.fn.pumvisible() == 1 then return '<c-n>' end
  return '<down>'
end, { expr = true })
```

- `desc`: 在列出映射时展示一段描述

```lua
vim.keymap.set('n', '<Leader>pl1', require('plugin').action,
  { desc = 'Execute action from plugin' })
```

- `remap`: 默认所有映射都是非递归的(因为递归很危险)，remap将按键设置为支持递归运行，{rhs} 里写的内容如果是一个映射的 lhs，那么继续运行到没有下一个映射为止
    - 非递归相当于`:noremap`，递归相当于`:map`
    - {rhs}中有`<Plug>`时无视remap设置一定递归，否则`<Plug>`本身不展开，命令失去了意义

```lua
vim.keymap.set('n', '<Leader>ex1', '<cmd>echo "Example 1"<cr>')
-- add a shorter mapping
-- 按下e时，找到按键<leader>ex1，通过这个按键发现它被映射成lhs，那么继续查找: e -> <Leader>ex1 -> <cmd>echo "Example 1"<cr>
vim.keymap.set('n', 'e', '<Leader>ex1', { remap = true })
```

### 2. 删除映射 vim.keymap.del()

```lua
vim.keymap.del('n', '<Leader>ex1')
vim.keymap.del({'n', 'c'}, '<Leader>ex2', { buf = 0 })
```

---

## 自动命令 Autocommands

当某个/某些`events`被触发时自动执行的命令，支持Vim命令(command)或Lua函数

`vim.api.nvim_create_autocmd()`有两个必填参数

- {event}: 触发条件，可以是字符串或包含多个字符串的table
- {opts}:  会触发的东西，展现为table，其key是pattern, command, callback。vim command和lua callback只能二选一
    - `pattern`: 正则筛选，如要使用环境变量需要放在`vim.fn.expand()`之中，如`$HOME`或`~`。不填写时默认值为`*`
    - `command`: vim command
    - `callback`: 当成JS的那个callback就好了，其实就是Lua函数

```lua
vim.api.nvim_create_autocmd({"BufEnter", "BufWinEnter"}, {
  pattern = {"*.c", "*.h"},
  command = "echo 'Entering a C or C++ file'",
})

-- 相同的效果用Lua重写
vim.api.nvim_create_autocmd({"BufEnter", "BufWinEnter"}, {
  pattern = {"*.c", "*.h"},
  callback = function() print("Entering a C or C++ file") end,
})

-- User event triggered by MyPlugin
vim.api.nvim_create_autocmd("User", {
  pattern = "MyPlugin",
  callback = function() print("My Plugin Works!") end,
})
```

### 1. callback相关的事情

Nvim 总是用一个 table 来调用 Lua 回调，里面包含触发该自动命令的信息。回调callback的参数会包含这些信息(在下面代码块中参数设置为`ev`)

| key | 含义 | 对应 Vimscript |
|---|---|---|
| `match` | 匹配上 `pattern` 的那段字符串 | `<amatch>` |
| `buf` | 事件发生的 buffer 编号 | `<abuf>` |
| `file` | 事件发生的 buffer 的文件名 | `<afile>` |
| `data` | 某些事件附带的额外数据 table | —— |

```lua
-- desc
vim.api.nvim_create_autocmd('TextYankPost', {
  callback = function() vim.hl.on_yank() end,
  desc = "Briefly highlight yanked text"
})
```

如果回调函数的内容声明了参数，需要用`function() end`包裹

```lua
-- on_yank()函数需要参数
vim.api.nvim_create_autocmd('TextYankPost', {
  callback = function() vim.hl.on_yank() end
})
```

除了`pattern`还可以使用`buffer`参数，二者互斥只能同时使用一个

```lua
-- 当前 buffer
vim.api.nvim_create_autocmd("CursorHold", {
  buffer = 0,
  callback = function() print("hold") end,
})

-- 编号 33 的 buffer
vim.api.nvim_create_autocmd("CursorHold", {
  buffer = 33,
  callback = function() print("hold") end,
})
```

callback当然也可以和`desc`在一起

```lua
vim.api.nvim_create_autocmd('TextYankPost', {
  callback = function() vim.hl.on_yank() end,
  desc = "Briefly highlight yanked text"
})
```

---

## 命令分组 Grouping Autocommands

可以一次性执行多个命令，虽然在单个command里居然不行吗？

相信有很多用处。下面是vimscript转lua，说实话看起来明显是vimscript简洁

```vim
augroup vimrc
  " Remove all vimrc autocommands
  autocmd!
  " 参数分别是{events} {patterns} {执行的命令}
  au BufNewFile,BufRead *.html set shiftwidth=4
  au BufNewFile,BufRead *.html set expandtab
augroup END
```

augroud()函数接受两个必填参数：{group_name}, {是否在每次执行前清除它，防止它已经存在然后一直在反复执行}

```lua
local mygroup = vim.api.nvim_create_augroup('vimrc', { clear = true })
vim.api.nvim_create_autocmd({ 'BufNewFile', 'BufRead' }, {
  pattern = '*.html',
  group = mygroup,
  command = 'set shiftwidth=4',
})
vim.api.nvim_create_autocmd({ 'BufNewFile', 'BufRead' }, {
  pattern = '*.html',
  group = 'vimrc',  -- equivalent to group=mygroup
  command = 'set expandtab',
})
```

group按名字是唯一的，可以在另一个文件中继续修改和执行。注意这段代码中用的是`clear=false`，避免清空了之前对html文件所执行的命令

```lua
local mygroup = vim.api.nvim_create_augroup('vimrc', { clear = false })
vim.api.nvim_create_autocmd({ 'BufNewFile', 'BufRead' }, {
  pattern = '*.c',
  group = mygroup,
  command = 'set noexpandtab',
})
```

---

## 删除Autocommands 

`vim.api.nvim_clear_autocmds()`可以以各种指定条件清理自动命令

```lua
-- Delete all BufEnter and InsertLeave autocommands
vim.api.nvim_clear_autocmds({event = {"BufEnter", "InsertLeave"}})

-- Delete all autocommands that uses "*.py" pattern
vim.api.nvim_clear_autocmds({pattern = "*.py"})

-- Delete all autocommands in group "scala"
vim.api.nvim_clear_autocmds({group = "scala"})

-- Delete all ColorScheme autocommands in current buffer
vim.api.nvim_clear_autocmds({event = "ColorScheme", buffer = 0 })
```

属于autocommand group的内容必须在table中指定了group才会被删掉，以上命令不会删除属于group的指令

```lua
-- 删整个组
vim.api.nvim_clear_autocmds({ group = "scala" })
-- 或
vim.api.nvim_clear_autocmds({ event = "BufEnter", group = "scala" })
```

---

## 用户自定义命令 User commands 

自定义Vim命令，虽然名字这么叫，但这个命令除了可以调用Vim command，也可以调用Lua函数

自定义的命令**必须**以大写字母开头，和内置函数进行区分

```lua
vim.api.nvim_create_user_command(name, command, opts)
```

| 参数 | 类型 | 说明 |
|---|---|---|
| `name` | 字符串 | 命令名，**必须以大写字母开头**，用来和内置命令区分 |
| `command` | 字符串 或 Lua 函数 | 命令被调用时执行的内容：要么是 Vim 命令字符串，要么是 Lua 函数 |
| `opts` | table | 命令属性（对应 `:command-attributes`），另可包含 `desc`、`force`、`preview` |

`opts`可以为如下值：

- `desc`：字符串，命令描述（`:command` 列表里显示）
- `force`：设 `false` 时，**如果同名命令已存在就报错而不覆盖**（默认 `true`，即会覆盖）
- `preview`：Lua 函数，用于 `:command-preview`（命令预览功能）

> 注：`opts` **即使什么都不配也必须传**，无参写 `{}`


```lua
-- 这些命令可以直接在命令模式下以:lua开头执行
vim.api.nvim_create_user_command('Test', 'echo "It works!"', {})
vim.cmd.Test() -- 也可以写成vim.cmd('Test')，这样看是不是熟悉多了？
--> It works!
```

### 1. {command}是Lua函数时

第二个参数是Lua函数时会收到一个table参数(通常命名为opts)，以下是它可以提供的东西：

| key | 含义 | 对应 Vimscript |
|---|---|---|
| `name` | 命令名（字符串） | —— |
| `fargs` | 参数按空白拆分后的 table | `<f-args>` |
| `bang` | 是否带了 `!` 修饰符 | `<bang>` |
| `line1` | range 起始行号 | `<line1>` |
| `line2` | range 结束行号 | `<line2>` |
| `range` | range 项数：0、1 或 2 | `<range>` |
| `count` | 提供的 count | `<count>` |
| `smods` | 命令修饰符的 table | `<mods>` |

官方示例中opts.fargs获取了按空白拆分好的参数列表

```lua
vim.api.nvim_create_user_command('Upper',
  function(opts)
    print(string.upper(opts.fargs[1]))
  end,
  { nargs = 1 }) -- nargs = 1 表示这个命令只接受一个参数(number argument?)

vim.cmd.Upper('foo') -- 用vimscript表示为:Upper foo
--> FOO
```

### 2. 命令补全

像内置命令一样，自定义命令也可以定义Tab补全的内容，利用complete属性

除了内置的补全类型可选(用`:help :command-complete`查看)，还可以用Lua函数自定义补全会显示的内容

> 文档的这一段非常突兀的插入了补全参数的介绍，看了半天才意识到和上述内容不在一条世界线上

```lua
-- ArgLead: 当前正在补全的那个词（光标前的部分）
-- CmdLine: 整条命令行
-- CursorPos: 光标位置
vim.api.nvim_create_user_command('Upper',
  function(opts)
    print(string.upper(opts.fargs[1]))
  end,
  { nargs = 1,
    complete = function(ArgLead, CmdLine, CursorPos)
      return { "foo", "bar", "baz" }
    end,
})
```

### 3. buffer-local也是可用的

`vim.api.nvim_buf_create_user_command(buffer number, ...)`可以为指定buffer设置自定义命令

```lua
vim.api.nvim_buf_create_user_command(0, 'Upper',
  function(opts)
    print(string.upper(opts.fargs[1]))
  end,
  { nargs = 1 })
```

---

### 4. 删除user commands

`vim.api.nvim_del_user_command(command_name)`可以删除自定义命令，参数为自定义命令名

```lua
vim.api.nvim_del_user_command('Upper')
```

`vim.api.nvim_buf_del_user_command()`可以删除针对buffer设置的自定义命令

```lua
vim.api.nvim_buf_del_user_command('Upper')
```

