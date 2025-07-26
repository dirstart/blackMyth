import path from "node:path";
import { app, ipcMain, BrowserWindow } from "electron";
import started from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
    frame: false, // 完全隐藏原生标题栏
    transparent: true, // 标题栏允许透明
    vibrancy: 'under-window', // macOS 毛玻璃效果（可选）
    titleBarStyle: 'default', // 保留系统默认标题栏（Windows/macOS）
    backgroundColor: '#000', // 设置窗口背景色与标题栏一致
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
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


// 窗口控制
ipcMain.on('window-minimize', (e) =>
  BrowserWindow.fromWebContents(e.sender).minimize()
);
ipcMain.on('window-maximize', (e) =>
  BrowserWindow.fromWebContents(e.sender).maximize()
);
ipcMain.on('window-unmaximize', (e) =>
  BrowserWindow.fromWebContents(e.sender).unmaximize()
);
ipcMain.on('window-close', (e) =>
  BrowserWindow.fromWebContents(e.sender).close()
);
// 状态查询
ipcMain.handle('window-is-maximized', (e) =>
  BrowserWindow.fromWebContents(e.sender).isMaximized()
);


// 鼠标事件穿透
ipcMain.on('set-ignore-mouse-events', (e, ignore) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  win.setIgnoreMouseEvents(ignore, { forward: true });
});
// 状态变化通知
function setupWindowListeners(win) {
  win.on('maximize', () =>
    win.webContents.send('window-maximize-change', true)
  );
  win.on('unmaximize', () =>
    win.webContents.send('window-maximize-change', false)
  );
};
