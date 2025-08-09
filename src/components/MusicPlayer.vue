<template>
  <div class="music-player-container">
    <!-- 无歌曲播放时显示的占位符 -->
    <div
      class="no-song"
      v-if="currentSongIndex === -1"
    >请选择一首歌曲开始播放</div>

    <!-- 有歌曲播放时显示的详细信息 -->
    <div
      class="player-content"
      v-else
    >
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
        <div
          class="progress-bar"
          @click="handleProgressClick"
        >
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

          <button
            class="control-btn"
            @click="prevSong"
            title="上一首"
          >
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

          <button
            class="control-btn"
            @click="nextSong"
            title="下一首"
          >
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
import { defineExpose, onMounted, onUnmounted } from "vue";
import { useMusicStore } from "@/composables/useMusicStore";
import { useMusicPlayer } from "@/composables/useMusicPlayer";
import { useMusicInit } from "@/composables/useMusicInit";
import albumCover from "@/icons/album.png";
import Play from "@/icons/Play.vue";
import Pause from "@/icons/Pause.vue";
import Next from "@/icons/Next.vue";
import Previous from "@/icons/Previous.vue";
import Repeat from "@/icons/Repeat.vue";
import Shuffle from "@/icons/Shuffle.vue";
import Volume from "@/icons/Volume.vue";

// 使用音乐存储
const musicStore = useMusicStore();

// 使用音乐播放器
const musicPlayer = useMusicPlayer(musicStore);
const {
  currentSong,
  isMuted,
  formatTime,
  formatPlayMode,
  handleProgressClick,
  togglePlay,
  toggleMute,
  setVolume,
  cleanup,
} = musicPlayer;

// 使用音乐初始化
const { initWatchers } = useMusicInit(musicStore, musicPlayer);

// 从 store 获取状态
const {
  songs,
  currentSongIndex,
  isPlaying,
  playMode,
  volume,
  currentTime,
  duration,
  nextSong,
  prevSong,
  togglePlayMode,
} = musicStore;

// 初始化监听器
onMounted(() => {
  const stopWatchers = initWatchers();
  // 保存清理函数，在组件卸载时调用
  window.stopMusicWatchers = stopWatchers;
});

// 组件卸载时清理资源
onUnmounted(() => {
  if (window.stopMusicWatchers) {
    window.stopMusicWatchers();
    delete window.stopMusicWatchers;
  }
  cleanup();
});

// 将 togglePlay 方法暴露给父组件
defineExpose({ togglePlay });
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
