import { onMounted, onUnmounted } from "vue";

export function useKeyboard() {
	const keyHandlers = new Map();

	const registerKey = (key, handler) => {
		keyHandlers.set(key.toLowerCase(), handler);
	};

	const unregisterKey = (key) => {
		keyHandlers.delete(key.toLowerCase());
	};

	const handleKeyDown = (event) => {
		const key = event.key.toLowerCase();
		const handler = keyHandlers.get(key);

		if (handler) {
			event.preventDefault();
			handler();
		}
	};

	onMounted(() => {
		document.addEventListener("keydown", handleKeyDown);
	});

	onUnmounted(() => {
		document.removeEventListener("keydown", handleKeyDown);
		keyHandlers.clear();
	});

	return {
		registerKey,
		unregisterKey,
	};
}
