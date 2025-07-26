const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  unmaximize: () => ipcRenderer.send('window-unmaximize'),
  close: () => ipcRenderer.send('window-close'),
  isFocused: () => ipcRenderer.invoke('window-is-focused'),
  onWindowFocus: (callback) => {
    ipcRenderer.on('window-focus-change', (_, focused) => callback(focused));
  },
  // 清理监听器的方法 (新增)
  removeAllListeners: (event) => ipcRenderer.removeAllListeners(event),

  // 状态查询
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  // 状态监听
  onMaximize: (callback) => {
    ipcRenderer.on('window-maximize-change', (_, isMaximized) =>
      callback(isMaximized)
    );
  }
});

// sss todo debug
// 预加载脚本中添加调试
ipcRenderer.on('window-focus', (_, focused) => {
  console.log('窗口焦点状态:', focused);
});
