<template>
  <div class="music-player-container">
    <!-- 无歌曲播放时显示的占位符 -->
    <div class="no-song" v-if="currentSongIndex === -1">请选择一首歌曲开始播放</div>

    <!-- 有歌曲播放时显示的详细信息 -->
    <div class="player-content" v-else>
      <!-- 专辑封面 -->
      <div class="album-cover-container">
        <img
          :src="currentSong?.albumCover || albumCover"
          :alt="currentSong?.album || '专辑封面'"
          class="album-cover"
        />
      </div>

      <!-- 歌曲信息 -->
      <div class="song-info">
        <h2 class="song-title">{{ currentSong?.title || "未知歌曲" }}</h2>
        <p class="song-artist">{{ currentSong?.artist || "未知艺术家" }}</p>
        <p class="song-album">{{ currentSong?.album || "未知专辑" }}</p>
      </div>

      <!-- 进度条 -->
      <div class="progress-container">
        <div class="time-display">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="total-time">{{ formatTime(duration) }}</span>
        </div>
        <div class="progress-bar" @click="handleProgressClick">
          <div
            class="progress"
            :style="{ width: `${(currentTime / duration) * 100 || 0}%` }"
          ></div>
          <div
            class="progress-handle"
            :style="{ left: `${(currentTime / duration) * 100 || 0}%` }"
          ></div>
        </div>
      </div>

      <!-- 控制按钮区域 -->
      <div class="controls-section">
        <!-- 播放控制按钮 -->
        <div class="play-buttons">
          <button class="control-btn" @click="prevSong" title="上一首">
            <Previous class="icon" />
          </button>
          <button
            class="play-btn"
            @click="togglePlay"
            :title="isPlaying ? '暂停' : '播放'"
          >
            <template v-if="isPlaying">
              <Pause class="icon" />
            </template>
            <template v-else>
              <Play class="icon" />
            </template>
          </button>
          <button class="control-btn" @click="nextSong" title="下一首">
            <Next class="icon" />
          </button>
        </div>

        <!-- 模式和音量控制 -->
        <div class="extra-controls">
          <button
            class="mode-btn"
            @click="togglePlayMode"
            :title="`播放模式: ${formatPlayMode(playMode)}`"
          >
            <template v-if="playMode === 'shuffle'">
              <Shuffle class="icon" />
            </template>
            <template v-else>
              <Repeat class="icon" />
            </template>
          </button>
          <div class="volume-control">
            <button
              class="volume-btn"
              @click="toggleMute"
              :title="isMuted ? '取消静音' : '静音'"
            >
              <Volume class="icon" />
            </button>
            <div class="volume-slider-container">
              <input
                type="range"
                min="0"
                max="100"
                v-model="volume"
                @input="setVolume(volume)"
                class="volume-slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watchEffect, onUnmounted } from "vue";
import { useMusicStore } from "@/composables/useMusicStore";
import albumCover from "@/icons/album.png";
// 导入howler.js
import { Howl } from "howler";
// 导入图标组件
import Play from "@/icons/Play.vue";
import Pause from "@/icons/Pause.vue";
import Next from "@/icons/Next.vue";
import Previous from "@/icons/Previous.vue";
import Repeat from "@/icons/Repeat.vue";
import Shuffle from "@/icons/Shuffle.vue";
import Volume from "@/icons/Volume.vue";

// 状态管理
const {
  songs,
  currentSongIndex,
  isPlaying,
  playMode,
  volume,
  currentTime,
  duration,
  togglePlay,
  prevSong,
  nextSong,
  togglePlayMode,
  setVolume,
  updateProgress,
} = useMusicStore();

// 当前播放歌曲
const currentSong = computed(() => {
  return currentSongIndex.value >= 0 && songs.value.length > currentSongIndex.value
    ? songs.value[currentSongIndex.value]
    : {};
});

// 音频元素改为howler实例
const sound = ref(null);
const isMuted = ref(false);
const progressInterval = ref(null);

// 格式化播放时间
const formatTime = (seconds) => {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// 格式化播放模式显示文本
const formatPlayMode = (mode) => {
  const modeMap = {
    order: "顺序播放",
    repeat: "单曲循环",
    shuffle: "随机播放",
  };
  return modeMap[mode] || "顺序播放";
};

// 处理进度条点击
const handleProgressClick = (e) => {
  if (!sound.value) return;
  const progressBar = e.currentTarget;
  const clickPosition = e.offsetX / progressBar.offsetWidth;
  const newTime = clickPosition * duration.value;
  sound.value.seek(newTime);
  updateProgress(newTime);
};

// 处理歌曲播放结束
const handleSongEnded = () => {
  if (!sound.value) return;

  if (playMode.value === "repeat") {
    // 单曲循环
    sound.value.seek(0);
    sound.value.play();
  } else {
    // 顺序播放/随机播放
    nextSong();
  }
};

// 播放歌曲方法
const playSelectedSong = (index) => {
  if (index < 0 || index >= songs.value.length) {
    console.error("无效的歌曲索引:", index);
    return;
  }

  const song = songs.value[index];
  if (!song?.filePath) {
    console.error("歌曲路径不存在:", song);
    alert("无法播放：歌曲路径无效");
    return;
  }

  console.log("尝试播放歌曲:", song.filePath);

  // 停止当前播放的声音
  if (sound.value) {
    sound.value.stop();
    clearInterval(progressInterval.value);
  }

  // 创建新的howler实例
  sound.value = new Howl({
    src: [`file://${song.filePath}`],
    format: ["mp3"], // 明确指定格式
    onload: () => {
      console.log("歌曲加载成功，开始播放");
      sound.value.play();
      isPlaying.value = true;
      duration.value = sound.value.duration();
    },
    onplay: () => {
      console.log("播放开始");
      isPlaying.value = true;
      // 定期更新进度
      updateProgressInterval();
    },
    onpause: () => {
      console.log("播放暂停");
      isPlaying.value = false;
      clearInterval(progressInterval.value);
    },
    onend: () => {
      console.log("歌曲播放结束，当前模式:", playMode.value);
      clearInterval(progressInterval.value);
      handleSongEnded();
    },
    onerror: (err) => {
      console.error("音频播放错误:", err);
      isPlaying.value = false;
      alert(`播放失败: ${err}`);
    },
  });

  currentSongIndex.value = index;
};

// 进度更新间隔
const updateProgressInterval = () => {
  clearInterval(progressInterval.value);
  progressInterval.value = setInterval(() => {
    if (sound.value && !sound.value.paused()) {
      updateProgress(sound.value.seek());
    }
  }, 1000);
};

// 静音切换
const toggleMute = () => {
  if (!sound.value) return;
  isMuted.value = !isMuted.value;
  sound.value.mute(isMuted.value);
};

// 初始化
onMounted(() => {
  // 不需要初始化音频元素，howler会处理
});

// 监听当前歌曲变化
const stopCurrentSongWatch = watchEffect(() => {
  if (currentSongIndex.value >= 0 && songs.value.length > 0) {
    const song = songs.value[currentSongIndex.value];
    if (song?.filePath) {
      playSelectedSong(currentSongIndex.value);
    }
  }
});

// 监听播放状态变化
const stopPlayStatusWatch = watchEffect(() => {
  if (sound.value) {
    if (isPlaying.value) {
      sound.value.play().catch((err) => {
        console.error("播放失败:", err);
        isPlaying.value = false;
      });
    } else {
      sound.value.pause();
    }
  }
});

// 监听音量变化
const stopVolumeWatch = watchEffect(() => {
  if (sound.value) {
    sound.value.volume(Math.max(0, Math.min(1, volume.value / 100)));
  }
});

// 清理监听器
onUnmounted(() => {
  stopCurrentSongWatch();
  stopPlayStatusWatch();
  stopVolumeWatch();
  if (sound.value) {
    sound.value.stop();
    sound.value = null;
  }
  clearInterval(progressInterval.value);
});
</script>

<style scoped lang="less">
.music-player-container {
  flex: 1;
  padding: 20px;
  color: #ffffff;
  background: #121212;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;

  .no-song {
    font-size: 16px;
    color: #bbbbbb;
    text-align: center;
    padding: 20px;
    border: 1px dashed #444444;
    border-radius: 4px;
  }

  .player-content {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .album-cover-container {
      margin: 10px 0 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      overflow: hidden;
      border: 4px solid #222222;

      .album-cover {
        width: 160px;
        height: 160px;
        object-fit: cover;
      }
    }

    .song-info {
      text-align: center;
      margin-bottom: 20px;
      width: 100%;

      .song-title {
        font-size: 18px;
        margin-bottom: 4px;
      }

      .song-artist,
      .song-album {
        font-size: 14px;
        color: #bbbbbb;
      }
    }

    .progress-container {
      width: 100%;
      margin-bottom: 20px;

      .time-display {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 8px;
      }

      .progress-bar {
        width: 100%;
        height: 4px;
        background: #333333;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        .progress {
          height: 100%;
          background: #ffffff;
          transition: width 0.1s;
        }

        .progress-handle {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background: #ffffff;
          border-radius: 50%;
          margin-left: -6px;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
        }
      }
    }

    .controls-section {
      width: 100%;

      .play-buttons {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-bottom: 12px;

        .control-btn,
        .play-btn,
        .mode-btn,
        .volume-btn {
          background: #222222;
          border: 1px solid #444444;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;

          &:hover {
            background: #333333;
          }

          &:active {
            transform: translateY(1px);
          }

          .icon {
            width: 24px;
            height: 24px;
            fill: currentColor;
          }
        }

        .play-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
      }

      .extra-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;

        .volume-control {
          display: flex;
          align-items: center;
          gap: 8px;

          .volume-slider-container {
            width: 120px;

            .volume-slider {
              width: 100%;
              height: 4px;
              background: #333333;
              border: none;
              border-radius: 2px;
              appearance: none;
              outline: none;

              &::-webkit-slider-thumb {
                appearance: none;
                width: 12px;
                height: 12px;
                background: #ffffff;
                border-radius: 50%;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
}
</style>
