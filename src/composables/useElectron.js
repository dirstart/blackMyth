import { onMounted, ref, onUnmounted } from 'vue';

export function useElectron() {
  const isElectron = ref(false);
  const isMaximized = ref(false);
  const isWindowFocused = ref(true);
  const api = ref(null);
  const isReady = ref(false); // 添加加载状态

  const init = () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      isElectron.value = true;
      api.value = window.electronAPI;

      // 监听窗口最大化状态变化
      api.value.onMaximize((maximized) => {
        isMaximized.value = maximized;
      });
      // 监听窗口焦点变化
      api.value.onWindowFocus((focused) => {
        isWindowFocused.value = focused;
      });

      // 获取初始状态
      api.value.isMaximized().then((maximized) => {
        isMaximized.value = maximized;
      });
      api.value.isFocused().then((focused) => {
        isWindowFocused.value = focused;
      });
      isReady.value = true; // 初始化完成后设置为 true
    }
  };

  // 窗口控制方法
  const minimize = () => api.value?.minimize();
  const toggleMaximize = () => {
    if (!api.value) return;
    isMaximized.value ? api.value.unmaximize() : api.value.maximize();
  };
  const close = () => api.value?.close();

  // 添加批量读取本地音乐文件的API
  const openMusicFileDialog = async (options = {}) => {
    if (!isReady.value) {
      console.warn('Electron API 尚未初始化完成');
      return [];
    }

    if (!api.value || !api.value.openFileDialog) {
      console.warn('Electron API not available or openFileDialog not implemented');
      return [];
    }

    // 默认配置，支持常见音乐格式
    const defaultOptions = {
      title: '选择音乐文件',
      filters: [{
        name: '音频文件',
        extensions: ['mp3', 'wav', 'flac', 'm4a', 'ogg', 'aac', 'wma']
      }],
      properties: ['openFile', 'multiSelections'] // 支持多选
    };

    // 合并用户选项与默认选项
    const dialogOptions = { ...defaultOptions, ...options };

    try {
      return await api.value.openFileDialog(dialogOptions);
    } catch (error) {
      console.error('打开文件对话框失败:', error);
      return [];
    }
  };

  // 清理监听 (新增)
  const cleanup = () => {
    if (api.value) {
      api.value.removeAllListeners?.('window-maximize-change');
      api.value.removeAllListeners?.('window-focus-change');
    }
  };

  onMounted(init);
  onUnmounted(cleanup);

  return {
    isElectron,
    isMaximized,
    isWindowFocused,
    minimize,
    toggleMaximize,
    close,
    openMusicFileDialog,
    isReady // 导出加载状态
  };
}
