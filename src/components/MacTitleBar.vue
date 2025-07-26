<template>
  <div
    v-if="isElectron"
    class="mac-title-bar"
    :class="{
      'is-maximized': isMaximized,
      'is-blur': !isWindowFocused
    }"
  >
    <!-- 左侧控制按钮 -->
    <div class="window-controls">
      <button
        class="close"
        @click="close"
      ></button>
      <button
        class="minimize"
        @click="minimize"
      ></button>
      <button
        class="maximize"
        @click="toggleMaximize"
      ></button>
    </div>

    <!-- 居中标题 -->
    <!-- <div class="title">
      <slot>Electron App</slot>
    </div> -->
  </div>
</template>

<script setup>
import { useElectron } from '../composables/useElectron';

const {
  isElectron,
  isMaximized,
  isWindowFocused,
  minimize,
  toggleMaximize,
  close
} = useElectron();
</script>

<style scoped>
.mac-title-bar {
  /* 允许拖动 */
  -webkit-app-region: drag;
  height: 28px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  /* background-color: rgba(255, 255, 255, 0.7); */
    /* sss todo */
    background: #089e8a;
  backdrop-filter: blur(10px);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  position: relative;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* 深色模式适配 */
.dark .mac-title-bar {
  background-color: rgba(30, 30, 30, 0.7);
}

.window-controls {
  /* 按钮 */
  -webkit-app-region: no-drag;
  display: flex;
  gap: 8px;
  margin-right: 20px;
}

.window-controls button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.close {
  background-color: #ff5f56;
  border: 0.5px solid #e0443e;
}

.minimize {
  background-color: #ffbd2e;
  border: 0.5px solid #dea123;
}

.maximize {
  background-color: #27c93f;
  border: 0.5px solid #1aab29;
}
/* 最大化时移除圆角 */
.mac-title-bar.is-maximized {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background: transparent;
}
/* 新增失焦样式 */
.mac-title-bar.is-blur {
  opacity: 0.8;
}

.mac-title-bar.is-blur .window-controls button {
  filter: grayscale(50%);
}
</style>
