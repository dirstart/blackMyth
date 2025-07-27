<template>
  <div class="button-bar" @contextmenu.prevent="handleRightClick">
    <button
      v-for="button in buttons"
      :key="button.id"
      class="control-button"
      @click="handleButtonClick(button)"
    >
      <span class="shortcut" v-if="button.shortcut">{{ button.shortcut }}</span>
      <span class="label">{{ button.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps } from "vue";
import { useMusicStore } from "@/composables/useMusicStore";

// 定义 props 接收音乐播放器引用
const props = defineProps({
  musicPlayerRef: { type: Object, required: true },
});
// 获取音乐商店的方法
const { prevSong, nextSong, togglePlayMode, setVolume, volume } = useMusicStore();

// 更新按钮定义以匹配用户需求的快捷键
const buttons = ref([
  { id: 1, shortcut: "A", label: "上一首", action: "previousSong" },
  { id: 2, shortcut: "E", label: "播放/暂停", action: "playPause" },
  { id: 3, shortcut: "D", label: "下一首", action: "nextSong" },
  { id: 4, shortcut: "T", label: "切换播放模式", action: "togglePlayMode" },
  { id: 5, shortcut: "<", label: "降低音量", action: "volumeDown" },
  { id: 6, shortcut: ">", label: "提高音量", action: "volumeUp" },
]);

// 处理按钮点击
const handleButtonClick = (button) => {
  console.log(`Button clicked: ${button.label} (${button.action})`);
  try {
    switch (button.action) {
      case "previousSong":
        prevSong();
        break;
      case "playPause":
        props.musicPlayerRef.togglePlay();
        break;
      case "nextSong":
        nextSong();
        break;
      case "togglePlayMode":
        togglePlayMode();
        break;
      case "volumeDown":
        setVolume(Math.max(0, volume.value - 5));
        break;
      case "volumeUp":
        setVolume(Math.min(100, volume.value + 5));
        break;
      case "goBack":
        alert("返回功能已触发");
        break;
    }
  } catch (error) {
    console.error(`执行${button.label}操作时出错:`, error);
    alert(`操作失败: ${error.message}`);
  }
};

// 处理鼠标右键点击
const handleRightClick = () => {
  alert("返回功能已触发");
};

// 键盘快捷键处理
const handleKeyDown = (e) => {
  try {
    switch (e.key) {
      case "a":
      case "A":
        e.preventDefault();
        prevSong();
        break;
      case "e":
      case "E":
        // 糟糕的实现。
        console.log("通过E键触发播放/暂停功能");
        props.musicPlayerRef.togglePlay();
        break;
      case "d":
      case "D":
        e.preventDefault();
        nextSong();
        break;
      case "t":
      case "T":
        e.preventDefault();
        togglePlayMode();
        break;
      case "<":
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        setVolume(Math.max(0, volume.value - 5));
        break;
      case ">":
      case "ArrowUp":
      case "ArrowRight":
        e.preventDefault();
        setVolume(Math.min(100, volume.value + 5));
        break;
    }
  } catch (error) {
    console.error(`键盘操作出错:`, error);
  }
};

// 挂载时添加键盘监听
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

// 卸载时移除键盘监听
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style lang="less" scoped>
.button-bar {
  display: flex;
  align-items: center;
  justify-content: center;
    /* 实现居中显示 */
    gap: 12px;
    padding: 12px 20px;
    /* 移除背景色 */
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  
    .control-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(145deg, #222, #383737);
      /* 黑白渐变背景 */
      border: 1px solid #333;
      border-radius: 8px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
  
      &:hover {
        background: linear-gradient(145deg, #333, #9c9b98);
        border-color: #444;
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 255, 255, 0.1);
      }
  
      &:active {
        background: #111;
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
  
      .shortcut {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 22px;
        background: #333;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        line-height: 1;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
      }
  
      .label {
        color: #e0e0e0;
        font-size: 13px;
      }
    }
  }
  
  // 响应式设计
  @media (max-width: 768px) {
    .button-bar {
      gap: 8px;
      padding: 10px 16px;
  
      .control-button {
        padding: 6px 12px;
        font-size: 12px;
  
        .shortcut {
          min-width: 20px;
          height: 18px;
          font-size: 11px;
      }

      .label {
        font-size: 12px;
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
