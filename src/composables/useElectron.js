import { onMounted, ref } from 'vue';

export function useElectron() {
  const isElectron = ref(false);
  const isMaximized = ref(false);
  const api = ref(null);

  const init = () => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      isElectron.value = true;
      api.value = window.electronAPI;

      // 监听窗口最大化状态变化
      api.value.onMaximize((maximized) => {
        isMaximized.value = maximized;
      });

      // 获取初始状态
      api.value.isMaximized().then((maximized) => {
        isMaximized.value = maximized;
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

  onMounted(init);

  return {
    isElectron,
    isMaximized,
    minimize,
    toggleMaximize,
    close
  };
}
