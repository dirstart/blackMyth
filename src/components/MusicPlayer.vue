`
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

      <!-- 控制按钮区域 - 修改为单行布局 -->
      <div class="controls-section">
        <div class="all-controls">
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
import {
  computed,
  ref,
  onMounted,
  watchEffect,
  onUnmounted,
  watch,
  defineExpose,
} from "vue";
import { useMusicStore } from "@/composables/useMusicStore";
import albumCover from "@/icons/album.png";
import { Howl } from "howler";
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
  togglePlayMode,
  setVolume,
  updateProgress,
  togglePlay: storeTogglePlay,
  nextSong: storeNextSong, // 导入 store 的 nextSong
  prevSong: storePrevSong, // 导入 store 的 prevSong
} = useMusicStore();

// 移除组件内的 nextSong 和 prevSong 实现
// 改为直接使用 store 的方法
const nextSong = () => storeNextSong();
const prevSong = () => storePrevSong();

// 手动实现控制方法
const togglePlay = () => {
  if (!sound.value) {
    console.error("播放失败: sound实例不存在");
    return;
  }

  // 先判断当前播放状态
  const wasPlaying = isPlaying.value;
  // 保存当前进度
  const currentPosition = sound.value.seek();

  // 根据当前状态执行操作
  if (wasPlaying) {
    // 当前是播放状态，要暂停
    sound.value.pause();
    clearInterval(progressInterval.value);
    // 确保进度被正确保存
    updateProgress(currentPosition);
  } else {
    // 当前是暂停状态，要播放
    // 先设置进度，再播放
    sound.value.seek(currentPosition);
    sound.value.play();
    updateProgress(currentPosition);
    updateProgressInterval();
  }

  // 最后调用store的togglePlay方法
  storeTogglePlay();
};

// 将 togglePlay 方法暴露给父组件
defineExpose({ togglePlay });

// 当前播放歌曲
const currentSong = computed(() => {
  console.log("🍀🍀🍀🍀", "currentSong", songs.value[currentSongIndex.value]);

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

// 修改playSelectedSong为异步函数
const playSelectedSong = async (index) => {
  try {
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

    isPlaying.value = true;
    updateProgress(0);

    if (sound.value) {
      sound.value.stop();
      clearInterval(progressInterval.value);
      sound.value = null;
    }

    // 创建新的howler实例
    sound.value = new Howl({
      src: [`file://${song.filePath}`],
      format: ["mp3"],
      onload: () => {
        try {
          sound.value.play();
          duration.value = sound.value.duration();
          updateProgressInterval();
        } catch (e) {
          console.error("播放失败:", e);
          isPlaying.value = false;
          alert(`播放失败: ${e.message}`);
        }
      },
      onplay: () => {
        isPlaying.value = true;
      },
      onpause: () => {
        isPlaying.value = false;
      },
      onend: () => {
        clearInterval(progressInterval.value);
        handleSongEnded();
      },
      onerror: (err) => {
        console.error("音频播放错误:", err);
        isPlaying.value = false;
        alert(`播放失败: ${err}`);
      },
    });
  } catch (e) {
    console.error("播放歌曲时发生错误:", e);
    isPlayingSong = false;
  }
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

// 进度更新间隔
const updateProgressInterval = () => {
  clearInterval(progressInterval.value);
  progressInterval.value = setInterval(() => {
    if (sound.value && !sound.value.paused) {
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
  // 设置初始音量
  if (sound.value) {
    sound.value.volume(volume.value / 100);
  }
});

// 新增：使用watch监听具体依赖，并添加守卫条件
let isPlayingSong = false;

const stopCurrentSongWatch = watch(
  [currentSongIndex, songs],
  ([newIndex, newSongs]) => {
    // 防止递归调用
    if (isPlayingSong) return;

    if (newIndex >= 0 && newSongs.length > 0) {
      const song = newSongs[newIndex];
      if (song?.filePath) {
        // 检查是否真的需要播放新歌曲
        const needPlay = !sound.value || sound.value.src !== `file://${song.filePath}`;
        if (needPlay) {
          console.log("检测到歌曲变化，准备播放新歌曲");
          isPlayingSong = true;
          playSelectedSong(newIndex).finally(() => {
            isPlayingSong = false;
          });
        }
      }
    }
  },
  { immediate: true } // 初始化时执行一次
);

// 监听音量变化
const stopVolumeWatch = watchEffect(() => {
  if (sound.value) {
    sound.value.volume(Math.max(0, Math.min(1, volume.value / 100)));
  }
});

// 清理监听器
onUnmounted(() => {
  stopCurrentSongWatch();
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
  background-color: transparent;
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
      max-width: 600px;

      .all-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        width: 100%;

        .mode-btn,
        .control-btn,
        .play-btn,
        .volume-btn {
          background: #222222;
          border: 1px solid #444444;
          border-radius: 50%; // 圆形按钮
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          color: #ffffff;

          &:hover {
            background: #333333;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }

          &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }

          .icon {
            width: 20px;
            height: 20px;
            fill: currentColor;
            transition: fill 0.3s ease;
          }
        }

        .play-btn {
          width: 50px;
          height: 50px;
          background: #1a1a1a;
          border: 2px solid #555555;

          .icon {
            width: 24px;
            height: 24px;
          }

          &:hover {
            background: #2a2a2a;
            border-color: #777777;
          }
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 10px;

          .volume-slider-container {
            width: 100px;

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
                transition: all 0.2s;
              }

              &::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                background: #cccccc;
              }
            }
          }
        }
      }
    }
  }
}
</style>
