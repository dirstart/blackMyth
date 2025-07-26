import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import css from "@eslint/css";
import importPlugin from "eslint-plugin-import";

export default [
  // JavaScript/ESM files configuration
  {
    files: ["src/**/*.{js,mjs,cjs}"],
    ignores: ["**/preload.js", "**/renderer.js", "**/main.js"],
    plugins: {
      import: importPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      "import/no-unresolved": "error"
    },
    languageOptions: {
      globals: { ...globals.browser }
    }
  },
  // Vue files configuration
  ...pluginVue.configs["flat/essential"].map(config => ({
    ...config,
    files: ["src/**/*.vue"],
    plugins: {
      ...config.plugins,
      import: importPlugin
    },
    rules: {
      ...config.rules,
      "import/no-unresolved": "error"
    },
    languageOptions: {
      ...config.languageOptions,
      globals: { ...globals.browser }
    }
  })),
  // CSS files configuration
  {
    files: ["src/**/*.css"],
    ...css.configs.recommended
  }
];
