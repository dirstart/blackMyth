import path from "node:path";
import { app, ipcMain, BrowserWindow, dialog } from "electron";
import started from "electron-squirrel-startup";
import * as mm from 'music-metadata'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,       // 初始宽度
    height: 800,       // 初始高度
    minWidth: 1057,    // 最小宽度
    minHeight: 752,    // 最小高度
    nodeIntegration: true, // 允许渲染进程使用Node.js API
    contextIsolation: false, // 禁用上下文隔离
    frame: false, // 完全隐藏原生标题栏
    transparent: true, // 标题栏允许透明
    alwaysOnTop: false, // 避免强制置顶
    vibrancy: 'under-window', // macOS 毛玻璃效果（可选）
    backgroundColor: '#000', // 设置窗口背景色与标题栏一致
    // 添加以下配置
    allowFileAccess: true,
    webSecurity: false, // 仅在开发阶段使用，生产环境建议关闭
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  setupWindowListeners(mainWindow);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      const win = BrowserWindow.getAllWindows()[0];
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});


// 【单向通信，主进程只接收、不返回】窗口控制，渲染进程主动调用
ipcMain.on('window-minimize', (e) =>
  BrowserWindow.fromWebContents(e.sender).minimize()
);
ipcMain.on('window-maximize', (e) =>
  BrowserWindow.fromWebContents(e.sender).maximize()
);
ipcMain.on('window-unmaximize', (e) => {
  console.log('🍀🍀🍀🍀', 'window-unmaximize')
  return BrowserWindow.fromWebContents(e.sender).unmaximize()
})

ipcMain.on('window-close', (e) =>
  BrowserWindow.fromWebContents(e.sender).close()
);

// 【双向通信】接收，并且返回结果s
ipcMain.handle('window-is-maximized', (e) =>
  BrowserWindow.fromWebContents(e.sender).isMaximized()
);
ipcMain.handle('window-is-focused', (e) =>
  BrowserWindow.fromWebContents(e.sender).isFocused()
);
// 实现打开文件对话框的处理
ipcMain.handle('open-file-dialog', async (event, options) => {
  try {
    const result = await dialog.showOpenDialog(options);
    return result.filePaths || [];
  } catch (error) {
    console.error('打开文件对话框失败:', error);
    return [];
  }
});

// 【主进程主动推送】状态变化通知，win.on 监听当前【窗口实例】的原生事件
function setupWindowListeners(win) {
  win.on('maximize', () => {
    console.log('🍀🍀🍀🍀', 'maximize');
    return win.webContents.send('window-maximize-change', true)
  });

  win.on('unmaximize', () => {
    console.log('🍀🍀🍀🍀', 'unmaximize')
    return win.webContents.send('window-maximize-change', false)
  });
  win.on('focus', () => {
    console.log('🍀🍀🍀🍀', 'focus')
    if (win.isMinimized()) {
      console.log('🍀🍀🍀🍀', '最小化状态')
      win.restore(); // 如果是最小化状态，则恢复窗口
    }
    win.focus();
    return win.webContents.send('window-focus-change', true);
  });
  // 失焦后无法点击，不需要禁止穿透
  win.on('blur', () => {
    console.log('🍀🍀🍀🍀', 'blur')
    win.setIgnoreMouseEvents(false); // ✅ 必要：防止窗口失焦后无法点击
    return win.webContents.send('window-focus-change', false);
  });
};

// 添加音频元数据解析服务
ipcMain.handle('parse-audio-metadata', async (event, filePath) => {
  try {
    const metadata = await mm.parseFile(filePath, {
      duration: true,
      skipCovers: false // 不跳过封面图片
    });

    // 提取专辑封面（转换为Base64）
    let albumCover = null;
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const picture = metadata.common.picture[0];
      albumCover = `data:${picture.format};base64,${picture.data.toString('base64')}`;
    }

    // 格式化时长（秒 -> 分:秒）
    const duration = metadata.format.duration ? Math.floor(metadata.format.duration) : 0;
    const minutes = Math.floor(duration / 60);
    const seconds = String(duration % 60).padStart(2, '0');
    const formattedDuration = `${minutes}:${seconds}`;

    return {
      fileName: path.basename(filePath),
      title: metadata.common.title || path.basename(filePath, path.extname(filePath)),
      artist: metadata.common.artist || '未知艺术家',
      album: metadata.common.album || '未知专辑',
      format: metadata.format.container?.toUpperCase(),
      duration: formattedDuration,
      durationSeconds: duration,
      albumCover: albumCover,
      filePath: filePath
    };
  } catch (error) {
    console.error('解析音频元数据失败:', error);
    return null;
  }
});

// 在现有的 ipcMain 处理函数后添加
ipcMain.handle('read-music-folder', async (event, folderPath) => {
  try {
    // 实现读取文件夹中音乐文件的逻辑
    // 可使用 fs 模块遍历文件夹，筛选音频文件
    const fs = require('fs');
    const path = require('path');

    const files = fs.readdirSync(folderPath);
    const musicFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp3', '.wav', '.flac', '.m4a'].includes(ext);
    }).map(file => path.join(folderPath, file));

    return musicFiles;
  } catch (error) {
    console.error('读取音乐文件夹失败:', error);
    return [];
  }
});
