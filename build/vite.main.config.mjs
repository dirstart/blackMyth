import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
	build: {
		minify: false,
		// 可选：保留原始代码结构
		terserOptions: {
			compress: false,
			mangle: false,
		},
	},
});
