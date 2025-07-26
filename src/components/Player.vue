<template>
  <div class="player-content">
    <!-- 主要内容区域 -->
    <div class="main-content-area">
      <!-- 专辑封面区域 -->
      <div v-if="!showWaveform" class="album-cover-section">
        <div class="album-cover-container">
          <div class="cover-glow-ring"></div>
          <div class="album-cover-wrapper">
            <img 
              :src="currentTrack?.cover" 
              :alt="currentTrack?.title"
              class="album-cover-image"
              :class="{ 'cover-rotating': isPlaying }"
            />
            <div class="cover-overlay"></div>
          </div>
          <div class="cover-reflection"></div>
        </div>
      </div>

      <!-- 波形图区域 -->
      <div v-if="showWaveform" class="waveform-section">
        <Waveform />
      </div>
    </div>

    <!-- 歌曲信息区域 -->
    <div class="track-info-section">
      <div class="track-main-info">
        <h1 class="track-title">{{ currentTrack?.title || '未选择歌曲' }}</h1>
        <div class="track-metadata">
          <span class="track-artist">{{ currentTrack?.artist || '未知艺术家' }}</span>
          <span class="metadata-separator">·</span>
          <span class="track-album">{{ currentTrack?.album || '未知专辑' }}</span>
        </div>
      </div>
      
      <!-- 歌词显示区域 -->
      <div v-if="isLyricsVisible" class="lyrics-display-section">
        <div class="lyrics-container">
          <div class="lyrics-header">
            <h3 class="lyrics-title">歌词</h3>
            <button @click="toggleLyricsDisplay" class="lyrics-close-btn">
              <span>✕</span>
            </button>
          </div>
          <div class="lyrics-content">
            <div 
              v-for="(line, index) in currentTrack?.lyricsLines || []" 
              :key="index"
              class="lyrics-line"
              :class="{ 'lyrics-active': index === currentLyricsIndex }"
            >
              {{ line }}
            </div>
            <div v-if="!currentTrack?.lyricsLines?.length" class="no-lyrics">
              暂无歌词
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { usePlayer } from '../composables/usePlayer'
import Waveform from './Waveform.vue'

export default {
  name: 'PlayerContent',
  components: {
    Waveform
  },
  setup() {
    const { 
      currentTrack,
      playerState,
      currentPlayTime,
      toggleLyricsDisplay,
      toggleWaveformDisplay,
    } = usePlayer()

    // 调试用 - 监听状态变化
    watch(() => playerState.showWaveform, (newValue) => {
      console.log('🎨 Player showWaveform 变化:', newValue)
    })

    // 模拟当前歌词行索引（基于播放时间）
    const currentLyricsIndex = computed(() => {
      if (!currentTrack.value?.lyricsLines) return 0
      // 简单的时间映射，实际应用中需要更精确的时间戳
      const lyricsCount = currentTrack.value.lyricsLines.length
      const progress = currentPlayTime.value / (currentTrack.value.duration || 1)
      return Math.floor(progress * lyricsCount)
    })

    return {
      currentTrack,
      isPlaying: playerState.isPlaying,
      isLyricsVisible: playerState.isLyricsVisible,
      showWaveform: computed(() => playerState.showWaveform),
      playerState,
      currentLyricsIndex,
      toggleLyricsDisplay,
      toggleWaveformDisplay
    }
  }
}
</script>

<style lang="less" scoped>
.player-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(25px);
  background: rgba(26, 26, 26, 0.85);
  border: 2px solid rgba(139, 0, 0, 0.4);
  box-shadow: 
    0 8px 32px rgba(13, 17, 23, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(13, 17, 23, 0.5);
  position: relative;
  overflow: hidden;
}

.main-content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.waveform-section {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
  z-index: 1;
}

.album-cover-section {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
}

.album-cover-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-glow-ring {
  position: absolute;
  width: 320px;
  height: 320px;
  border: 3px solid transparent;
  border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(139, 0, 0, 0.8), rgba(220, 38, 38, 0.4), rgba(139, 0, 0, 0.8));
  animation: glowRotate 8s linear infinite;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    inset: -6px;
    background: conic-gradient(from 0deg, transparent, rgba(220, 38, 38, 0.6), transparent);
    border-radius: 50%;
    z-index: -1;
    filter: blur(8px);
  }
}

@keyframes glowRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.album-cover-wrapper {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 2;
  box-shadow: 
    0 8px 32px rgba(13, 17, 23, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(13, 17, 23, 0.5);
  border: 4px solid rgba(139, 0, 0, 0.6);
}

.album-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  &.cover-rotating {
    animation: coverRotate 20s linear infinite;
  }
}

@keyframes coverRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(139, 0, 0, 0.3) 0%, transparent 60%);
  pointer-events: none;
}

.cover-reflection {
  position: absolute;
  bottom: -140px;
  left: 50%;
  transform: translateX(-50%) scaleY(-1);
  width: 280px;
  height: 140px;
  background: inherit;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(2px);
  z-index: 0;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(26, 26, 26, 0.9) 100%);
    border-radius: inherit;
  }
}

.track-info-section {
  padding: 32px 48px;
  border-top: 2px solid rgba(139, 0, 0, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.6), transparent);
  }
}

.track-main-info {
  text-align: center;
  margin-bottom: 24px;
}

.track-title {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(45deg, #fbbf24, #f59e0b, #d97706);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 
    0 0 20px rgba(251, 191, 36, 0.8),
    0 0 40px rgba(245, 158, 11, 0.6),
    0 0 60px rgba(217, 119, 6, 0.4);
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
  margin: 0 0 12px 0;
  line-height: 1.2;
  animation: goldGlow 3s ease-in-out infinite alternate;
}

@keyframes goldGlow {
  0% {
    filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.5));
  }
  100% {
    filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8));
  }
}

.track-metadata {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 16px;
  color: #9ca3af;
}

.track-artist {
  font-weight: bold;
  color: #d1d5db;
}

.metadata-separator {
  color: #6b7280;
}

.track-album {
  opacity: 0.8;
}

.lyrics-display-section {
  margin-top: 24px;
}

.lyrics-container {
  backdrop-filter: blur(25px);
  background: rgba(26, 26, 26, 0.85);
  border: 2px solid rgba(139, 0, 0, 0.4);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 
    0 8px 32px rgba(13, 17, 23, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(13, 17, 23, 0.5);
  max-height: 200px;
  overflow: hidden;
}

.lyrics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(139, 0, 0, 0.3);
}

.lyrics-title {
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
  color: #dc2626;
  margin: 0;
}

.lyrics-close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(139, 0, 0, 0.2);
    color: #dc2626;
  }
}

.lyrics-content {
  max-height: 120px;
  overflow-y: auto;
}

.lyrics-line {
  padding: 8px 0;
  font-size: 16px;
  color: #9ca3af;
  transition: all 0.3s ease;
  line-height: 1.5;
  
  &.lyrics-active {
    text-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
    color: #dc2626;
    font-weight: bold;
    transform: translateX(8px);
  }
}

.no-lyrics {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 24px 0;
}
</style>