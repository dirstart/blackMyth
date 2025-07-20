# 接触 electron

# 工程化，使用`npx create-electron-app@latest ./ --template=vite --force`
* 热更新
* main、preload、renderer打包
* 【格式化工具】由于本人偶然发现`eslint`和`prettier`冲突，遂比较推荐将【格式化】【规范化】都使用同一个主体进行控制。
* 【git流程管控】lefthook，【跨平台、无依赖】，同样，我认为将【简单的】流程，分给两个主体，是一件增加复杂度的事情。
> 对于复杂的事情，比如做成了一个复杂的中台，也许分成两个主体没问题。但是对于较为简易的流程，我认为应该降低复杂度，使用一个主体进行控制。

# todo：阅览一下其他的 Electron Vite 项目的大致构成。

【参考项目】：https://github.com/stark81/VutronMusic
> 可以参考下这个项目的工程结构，使用的 electron 版本较新

【参考文档】：https://www.bytezonex.com/archives/SXXT6r4s.html


# 实现具体功能

1.读取某个目录的内容
2.展示对应的播放列表

