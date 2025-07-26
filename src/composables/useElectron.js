import { onMounted, ref } from "vue";

export function useElectron() {
	const isElectron = ref(false);
	const isMaximized = ref(false);

	const api = ref(null);

	onMounted(() => {
		// 检查是否在 Electron 环境中
		if (typeof window !== "undefined" && window.electronAPI) {
			isElectron.value = true;
			api.value = window.electronAPI;

			// 监听窗口状态变化
			api.value.onMaximize((maximized) => {
				isMaximized.value = maximized;
			});

			// 获取初始窗口状态
			api.value.isMaximized().then((maximized) => {
				isMaximized.value = maximized;
			});
		}
	});

	const minimize = () => {
		if (api.value) {
			api.value.minimize();
		}
	};

	const maximize = () => {
		if (api.value) {
			api.value.maximize();
		}
	};

	const close = () => {
		if (api.value) {
			api.value.close();
		}
	};

	const handleMouseBack = () => {
		// 处理鼠标返回按钮
		if (api.value) {
			// 这里可以添加返回逻辑，比如返回上一个页面或播放列表
			console.log("Mouse back button clicked");
		}
	};

	return {
		isElectron,
		isMaximized,
		minimize,
		maximize,
		close,
		handleMouseBack,
	};
}
