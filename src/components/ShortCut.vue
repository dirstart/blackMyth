<template>
  <div class="button-bar">
    <button
      v-for="button in buttons"
      :key="button.id"
      class="control-button"
      @click="handleButtonClick(button)"
    >
      <span
        class="shortcut"
        v-if="button.shortcut"
      >{{ button.shortcut }}</span>
      <span class="label">{{ button.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const buttons = ref([
  { id: 1, shortcut: 'Tab', label: '显示/隐藏歌词', action: 'toggleLyrics' },
  { id: 2, shortcut: 'A', label: '上一首', action: 'previousSong' },
  { id: 3, shortcut: 'B', label: '播放/暂停', action: 'playPause' },
  { id: 4, shortcut: 'D', label: '下一首', action: 'nextSong' },
  { id: 5, shortcut: 'F', label: '切换播放模式', action: 'togglePlayMode' },
  { id: 6, shortcut: 'G', label: '降低音量', action: 'volumeDown' },
  { id: 7, shortcut: 'P', label: '提高音量', action: 'volumeUp' },
  { id: 8, shortcut: '0', label: '返回', action: 'goBack' }
])

const handleButtonClick = (button) => {
  console.log(`Button clicked: ${button.label} (${button.action})`)
  // 在这里添加具体的按钮功能逻辑
  switch (button.action) {
    case 'toggleLyrics':
      // 切换歌词显示
      break
    case 'previousSong':
      // 上一首歌
      break
    case 'playPause':
      // 播放/暂停
      break
    case 'nextSong':
      // 下一首歌
      break
    case 'togglePlayMode':
      // 切换播放模式
      break
    case 'volumeDown':
      // 降低音量
      break
    case 'volumeUp':
      // 提高音量
      break
    case 'goBack':
      // 返回
      break
  }
}
</script>

<style lang="less" scoped>
.button-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  .control-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #2d2d2d;
    border: 1px solid #404040;
    border-radius: 6px;
    color: #ffffff;
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background: #3d3d3d;
      border-color: #505050;
      transform: translateY(-1px);
    }

    &:active {
      background: #252525;
      transform: translateY(0);
    }

    .shortcut {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 18px;
      background: #404040;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 500;
      color: #cccccc;
      line-height: 1;
    }

    .label {
      color: #e0e0e0;
      font-size: 12px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .button-bar {
    gap: 4px;
    padding: 6px 12px;

    .control-button {
      padding: 4px 8px;
      font-size: 11px;

      .shortcut {
        min-width: 16px;
        height: 16px;
        font-size: 10px;
      }

      .label {
        font-size: 11px;
      }
    }
  }
}

// 小屏幕时隐藏部分按钮文字，只显示快捷键
@media (max-width: 480px) {
  .button-bar {
    .control-button {
      .label {
        display: none;
      }
    }
  }
}
</style>
