<template>
  <div class="music-player-container">
    <!-- 无歌曲播放时显示的占位符 -->
    <div
      class="no-song"
      v-if="currentSongIndex === -1"
    >
      请选择一首歌曲开始播放
    </div>

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
        >
      </div>

      <!-- 歌曲信息 -->
      <div class="song-info">
        <h2 class="song-title">{{ currentSong?.title || '未知歌曲' }}</h2>
        <p class="song-artist">{{ currentSong?.artist || '未知艺术家' }}</p>
        <p class="song-album">{{ currentSong?.album || '未知专辑' }}</p>
        <div class="song-meta">
          <span class="format">{{ currentSong?.format || '未知格式' }}</span>
          <span class="duration">{{ currentSong?.duration || '00:00' }}</span>
        </div>
      </div>

      <!-- 播放控制 -->
      <div class="play-controls">
        <button class="control-btn">上一首</button>
        <button
          class="play-btn"
          @click="togglePlay"
        >
          {{ isPlaying ? '暂停' : '播放' }}
        </button>
        <button class="control-btn">下一首</button>
      </div>

      <!-- 进度条 -->
      <div class="progress-bar">
        <div
          class="progress"
          :style="{ width: '30%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMusicStore } from '@/composables/useMusicStore';
import { computed } from 'vue';
import albumCover from '@/icons/album.png'

const { songs, currentSongIndex, isPlaying, togglePlay } = useMusicStore();

// 当前播放歌曲的信息 - 确保返回一个对象而不是null
const currentSong = computed(() => {
  return currentSongIndex.value >= 0 && songs.value.length > currentSongIndex.value
    ? songs.value[currentSongIndex.value]
    : {};
});
</script>

<style scoped lang="less">
.music-player-container {
  flex: 1;
  padding: 30px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-song {
  font-size: 20px;
  color: #aaa;
  text-align: center;
}

.player-content {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.album-cover-container {
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.album-cover {
  width: 300px;
  height: 300px;
  object-fit: cover;
}

.song-info {
  text-align: center;
  margin-bottom: 30px;
}

.song-title {
  font-size: 28px;
  margin-bottom: 10px;
}

.song-artist {
  font-size: 18px;
  color: #aaa;
  margin-bottom: 5px;
}

.song-album {
  font-size: 16px;
  color: #888;
  margin-bottom: 15px;
}

.song-meta {
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.play-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.control-btn {
  background-color: #444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #555;
  }
}

.play-btn {
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #ff5252;
    transform: scale(1.05);
  }
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #444;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #ff6b6b;
  transition: width 0.1s;
}
</style>
