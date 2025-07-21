import { computed, ref } from "vue";

export function useTheme() {
	const currentTheme = ref("dark");

	const isDark = computed(() => currentTheme.value === "dark");

	const toggleTheme = () => {
		currentTheme.value = currentTheme.value === "dark" ? "light" : "dark";
	};

	const setTheme = (theme) => {
		currentTheme.value = theme;
	};

	// 主题配色
	const colors = computed(() => ({
		primary: isDark.value ? "#f43f5e" : "#e11d48",
		secondary: isDark.value ? "#f59e0b" : "#d97706",
		background: isDark.value ? "#0f172a" : "#ffffff",
		surface: isDark.value ? "#1e293b" : "#f8fafc",
		text: isDark.value ? "#ffffff" : "#0f172a",
		textSecondary: isDark.value ? "#94a3b8" : "#64748b",
	}));

	return {
		currentTheme,
		isDark,
		toggleTheme,
		setTheme,
		colors,
	};
}
