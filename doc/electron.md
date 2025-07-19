# Electron 整体运行原理

```mermaid
flowchart TD
    A[Electron 启动] --> B[主进程 main process]
    B --> C[创建 BrowserWindow]
    C --> D[加载前端页面 HTML/JS/Vue]
    D --> E[渲染进程 renderer process]
    E --> F[渲染层展示界面，控制 UI]

```

补充说明

- 主进程：控制整个应用生命周期
- 渲染进程：加载 html/css/js （或者是 Vue 应用），控制界面交互
- 每个窗口=一个渲染进程

# electron 主进程与渲染进程通信机制

```mermaid
sequenceDiagram
  participant render as 渲染器进程
  participant main as 主进程
  render ->> main: ipcRenderer.send('get-music-list')
  main -->> render: ipcMain.on -> 处理请求
  main -->> render: event.reply('music-list', data)
  Note over render: 使用 ipcRenderer.on 监听并接收响应
```

# BrowserWindow 生命周期流程

```mermaid
flowchart
A[Electron 启动] --> B[app.whenReady]
B --> C[创建 BrowserWindow 实例]
C --> D[加载 HTML/Vue 页面]
D --> E[窗口显示，用户开始交互]
E --> F[监听关闭事件 window.onClose]
```

- app.whenReady 是创建窗口的最佳时机
- window.on('closed') 用来销毁窗口引用，防止内存泄漏

# Electron 项目目录推荐

```mermaid
graph TD
    A[项目根目录] --> B[src]
    B --> C[main] --> D[main.ts 主进程入口]
    B --> E[renderer] --> F[App.vue / UI 组件]
    A --> G[public] --> H[音乐/封面图]
    A --> I[package.json] --> J[Electron 启动脚本]
```

# 播放器运行流程

```mermaid
flowchart TD
    A[Electron 启动主进程] --> B[创建窗口并加载 Vue3 页面]
    B --> C[Vue App 初始化]
    C --> D[加载 music-data.ts]
    D --> E[显示音乐列表]
    E --> F[用户点击播放]
    F --> G[播放音频]
    G --> H[展示当前播放信息 / 进度]
    F --> I[用户切歌 / 暂停 / 音量调节]
```

# 导入本地音乐

```mermaid
sequenceDiagram
    participant Renderer
    participant Main

    Renderer->>Main: ipcRenderer.send('open-file-dialog')
    Main-->>Main: dialog.showOpenDialog()
    Main-->>Renderer: ipcRenderer.send('file-selected', path)
```

# 打包应用

electron 核心模块没有捆绑任何打包内容。
依赖于 `electron forge` 来完成打包。


# Problem

## 1.什么是预加载脚本
Electron 的主进程，拥有完全【操作系统】访问的权限。
出于安全原因，渲染进程跑在网页上，而非是 Node 里。
为了将不同类型的进程桥接在一起，我们需要使用 预加载的 特殊脚本。

所以，预加载脚本，是一个桥梁？？？


## 2.electron是如何发布的(如何打包应用)


## 3.electron如何结合 vue3 进行开发
打包过程示意图

【开发环境】
1.启用 vite 开发服务器
2.加载 vue3 插件，处理 `.vue` 文件
3.利用 ES 模块，直给浏览器
4.支持热模块替换，提高开发效率

【生产环境】
1.使用 Rollup 打包
2.优化代码（tree-shaking、压缩）
3.生成静态资源

### 结合 Electron 特殊的地方。
1.主进程直接运行 Node，不经过 Vite 处理
2.渲染进程经过 Vue3 编译后，通过 mainWindow.loadURL 加载到 Electron 窗口
3.生产环境，Vite 打包结果通过 mainWindow.loadFile()加载。

