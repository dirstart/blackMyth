const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
	packagerConfig: {
		asar: false, // 是否使用 asar 打包格式，测试先用 false 了
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {},
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"],
		},
		{
			name: "@electron-forge/maker-deb",
			config: {},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-vite",
			config: {
				// `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
				// If you are familiar with Vite configuration, it will look really familiar.
				build: [
					{
						// `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
						entry: "src/main.js",
						config: "./build/vite.main.config.mjs",
						target: "main",
					},
					{
						entry: "src/preload.js",
						config: "./build/vite.preload.config.mjs",
						target: "preload",
					},
				],
				renderer: [
					{
						entry: "src/renderer",
						// 这个就是 MAIN_WINDOW_VITE_NAME 的值
						name: "main_window",
						config: "./build/vite.renderer.config.mjs",
					},
				],
			},
		},
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
			[FuseV1Options.OnlyLoadAppFromAsar]: false,
		}),
	],
};
