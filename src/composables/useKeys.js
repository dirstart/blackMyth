import { onMounted, onUnmounted } from "vue";
import { usePlayer } from "./usePlayer";

export function useKeys() {
	const keyHandlerMap = new Map();

	const {
		togglePlayback,
		playNextTrack,
		playPreviousTrack,
		cyclePlaybackMode,
		toggleLyricsDisplay,
		adjustVolume,
		currentVolume,
	} = usePlayer();

	const registerKeyHandler = (key, handler) => {
		keyHandlerMap.set(key.toLowerCase(), handler);
	};

	const unregisterKeyHandler = (key) => {
		keyHandlerMap.delete(key.toLowerCase());
	};

	const handleKeyPress = (event) => {
		const pressedKey = event.key.toLowerCase();
		const handler = keyHandlerMap.get(pressedKey);

		if (handler) {
			event.preventDefault();
			handler();
		}
	};

	const init = () => {
		// 注册所有快捷键
		registerKeyHandler("tab", toggleLyricsDisplay); // Tab: 显示/隐藏歌词
		registerKeyHandler("a", playPreviousTrack); // A: 上一首
		registerKeyHandler("e", togglePlayback); // E: 播放/暂停
		registerKeyHandler("d", playNextTrack); // D: 下一首
		registerKeyHandler("t", cyclePlaybackMode); // T: 切换播放模式
		registerKeyHandler("《", () => adjustVolume(currentVolume.value - 0.1)); // 《: 降低音量
		registerKeyHandler("》", () => adjustVolume(currentVolume.value + 0.1)); // 》: 提高音量
	};

	onMounted(() => {
		document.addEventListener("keydown", handleKeyPress);
	});

	onUnmounted(() => {
		document.removeEventListener("keydown", handleKeyPress);
		keyHandlerMap.clear();
	});

	return {
		registerKeyHandler,
		unregisterKeyHandler,
		init,
	};
}
