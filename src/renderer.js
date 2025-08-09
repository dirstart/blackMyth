import { createApp } from "vue";
import "./style/index.less";
import App from "./App.vue";
import { provideMusicStore } from "./composables/useMusicStore";

const app = createApp(App);

// 提供音乐存储给整个应用
provideMusicStore(app);

app.mount("#app");
