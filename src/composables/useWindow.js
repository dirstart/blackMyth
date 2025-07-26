import { onMounted, ref } from "vue";

export function useWindow() {
	const isElectronEnvironment = ref(false);
	const isWindowMaximized = ref(false);

	const electronAPI = ref(null);

	onMounted(() => {
		// 检测是否在 Electron 环境中运行
		if (typeof window !== "undefined" && window.electronAPI) {
			isElectronEnvironment.value = true;
			electronAPI.value = window.electronAPI;

			// 监听窗口最大化状态变化
			electronAPI.value.onMaximize((maximized) => {
				isWindowMaximized.value = maximized;
			});

			// 获取当前窗口最大化状态
			electronAPI.value.isMaximized().then((maximized) => {
				isWindowMaximized.value = maximized;
			});
		}
	});

	const minimizeWindow = () => {
		if (electronAPI.value) {
			electronAPI.value.minimize();
		}
	};

	const maximizeWindow = () => {
		if (electronAPI.value) {
			electronAPI.value.maximize();
		}
	};

	const closeWindow = () => {
		if (electronAPI.value) {
			electronAPI.value.close();
		}
	};

	const handleBack = () => {
		// 处理鼠标返回按钮逻辑
		if (electronAPI.value) {
			console.log("鼠标返回按钮被点击");
			// 这里可以添加具体的返回逻辑，比如返回上一个页面或播放列表
		}
	};

	return {
		isElectronEnvironment,
		isWindowMaximized,
		minimizeWindow,
		maximizeWindow,
		closeWindow,
		handleBack,
	};
}
