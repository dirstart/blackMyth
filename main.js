const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// 保持对窗口对象的全局引用，如果不这么做，当JavaScript对象被垃圾回收时，窗口将会自动关闭
let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Electron应用',
    webPreferences: {
      // 启用Node.js集成
      nodeIntegration: true,
      // 启用上下文隔离（Electron 12+ 默认启用）
      contextIsolation: false,
      // 预加载脚本路径：预加载脚本作为桥梁，将主进程和渲染进程连接起来
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 加载应用的index.html
  mainWindow.loadFile('index.html');

  // 打开开发者工具
  // mainWindow.webContents.openDevTools();

  // 窗口关闭时触发
  mainWindow.on('closed', () => {
    // 取消引用窗口对象，如果你的应用支持多窗口的话，通常会把多个窗口对象存放在一个数组里，与此同时，你应该删除相应的元素
    mainWindow = null;
  });

  // 创建应用菜单
  createMenu();
}

// 创建应用菜单
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '刷新',
          accelerator: 'CmdOrCtrl+R',
          click() {
            mainWindow.webContents.reload();
          }
        },
        {
          label: '切换开发者工具',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click() {
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Electron会在初始化后并准备好创建浏览器窗口时调用这个函数
// 部分API只有在这个事件发生后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在macOS上，除非用户用Cmd+Q确定地退出，否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，当点击dock图标并且没有其他窗口打开时，通常在应用中重建一个窗口。
  if (mainWindow === null) {
    createWindow();
  }
});

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用require导入。
