<template>
  <div
    v-if="isElectron"
    class="mac-title-bar"
    :class="{ 'is-maximized': isMaximized }"
  >
    <!-- 左侧控制按钮 -->
    <div class="window-controls">
      <button
        class="close"
        @click="close"
        @mouseenter="setButtonHover(true)"
        @mouseleave="setButtonHover(false)"
      ></button>
      <button
        class="minimize"
        @click="minimize"
        @mouseenter="setButtonHover(true)"
        @mouseleave="setButtonHover(false)"
      ></button>
      <button
        class="maximize"
        @click="toggleMaximize"
        @mouseenter="setButtonHover(true)"
        @mouseleave="setButtonHover(false)"
      ></button>
    </div>

    <!-- 居中标题 -->
    <div class="title">
      <slot>Electron App</slot>
    </div>
  </div>
</template>

<script setup>
import { useElectron } from '../composables/useElectron';

const {
  isElectron,
  isMaximized,
  minimize,
  toggleMaximize,
  close
} = useElectron();

debugger
console.log('🍀🍀🍀🍀', 'isElectron', isElectron);

// 按钮悬停效果控制
const setButtonHover = (isHovering) => {
  if (!isElectron.value) return;
  window.electronAPI?.setIgnoreMouseEvents(!isHovering);
};
</script>

<style scoped>
.mac-title-bar {
  -webkit-app-region: drag;
  height: 28px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background-color: rgba(255, 255, 255, 0.7);
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

.title {
  flex: 1;
  text-align: center;
  font-size: 13px;
  color: #333;
  opacity: 0.9;
}

.dark .title {
  color: #f0f0f0;
}

/* 最大化时移除圆角 */
.mac-title-bar.is-maximized {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
