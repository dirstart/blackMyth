import { onMounted, ref, onUnmounted } from 'vue';

export function useElectron() {
  const isElectron = ref(false);
  const isMaximized = ref(false);
  const isWindowFocused = ref(true); // 焦点状态、默认聚焦
  const api = ref(null);

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
    }
  };

  // 窗口控制方法
  const minimize = () => api.value?.minimize();
  const toggleMaximize = () => {
    if (!api.value) return;
    isMaximized.value ? api.value.unmaximize() : api.value.maximize();
  };
  const close = () => api.value?.close();

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
    close
  };
}
