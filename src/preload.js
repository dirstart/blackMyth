const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  unmaximize: () => ipcRenderer.send('window-unmaximize'),
  close: () => ipcRenderer.send('window-close'),

  // 状态查询
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  // 状态监听
  onMaximize: (callback) => {
    ipcRenderer.on('window-maximize-change', (_, isMaximized) =>
      callback(isMaximized)
    );
  },

  // 鼠标事件穿透
  setIgnoreMouseEvents: (ignore) =>
    ipcRenderer.send('set-ignore-mouse-events', ignore)
});
