import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
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
      "import/no-unresolved": "error",
      // 禁用Vue组件中style部分的相关规则
      "vue/no-v-model-argument": "off",
      "vue/one-component-per-file": "off",
      "vue/no-deprecated-slot-attribute": "off",
      "vue/no-deprecated-v-on-native-modifier": "off",
      "vue/multi-word-component-names": "off"
    },
    languageOptions: {
      ...config.languageOptions,
      globals: { ...globals.browser }
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.vue', '.json']
        }
      }
    }
  }))
];
