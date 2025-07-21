<template>
  <div class="player-controls">
    <!-- 进度条区域 -->
    <div class="progress-control-section">
      <div class="progress-time-info">
        <span class="current-time">{{ formattedCurrentTime }}</span>
        <span class="total-duration">{{ formattedTrackDuration }}</span>
      </div>
      <div 
        class="progress-bar-container"
        @click="handleProgressBarClick"
        ref="progressBarRef"
      >
        <div class="progress-bar-track"></div>
        <div 
          class="progress-bar-fill"
          :style="{ width: `${playbackProgress}%` }"
        ></div>
        <div 
          class="progress-bar-thumb"
          :style="{ left: `calc(${playbackProgress}% - 8px)` }"
        ></div>
      </div>
    </div>

    <!-- 主要控制按钮 -->
    <div class="main-control-buttons">
      <!-- 上一首 -->
      <button @click="playPreviousTrack" class="control-btn secondary-btn" title="上一首 (A)">
        <Previous :size="20" />
      </button>

      <!-- 播放/暂停 -->
      <button @click="togglePlayback" class="control-btn primary-btn" title="播放/暂停 (E)">
        <div class="btn-glow-effect"></div>
        <Play v-if="!playerState.isPlaying" :size="28" />
        <Pause v-else :size="28" />
      </button>

      <!-- 下一首 -->
      <button @click="playNextTrack" class="control-btn secondary-btn" title="下一首 (D)">
        <Next :size="20" />
      </button>
    </div>

    <!-- 辅助控制区域 -->
    <div class="auxiliary-controls">
      <!-- 左侧控制 -->
      <div class="left-auxiliary-controls">
        <!-- 播放模式 -->
        <button 
          @click="cyclePlaybackMode" 
          class="auxiliary-btn" 
          :title="`${playbackModeText} (T)`"
        >
          <Shuffle v-if="playbackMode === 'shuffle'" :size="16" />
          <Repeat v-else :size="16" />
          <span class="mode-indicator">{{ playbackModeIcon }}</span>
        </button>

        <!-- 歌词切换 -->
        <button 
          @click="toggleLyricsDisplay" 
          class="auxiliary-btn" 
          :class="{ 'btn-active': isLyricsVisible }"
          title="显示/隐藏歌词 (Tab)"
        >
          <Lyrics :size="16" />
        </button>

        <!-- 波形图切换 -->
        <button 
          @click="toggleWaveformDisplay" 
          class="auxiliary-btn" 
          :class="{ 'btn-active': playerState.showWaveform }"
          title="切换波形图显示 (当前: {{ showWaveform ? '波形图' : '封面' }})"
        >
          <span v-if="!playerState.showWaveform">📊</span>
          <span v-else>🖼️</span>
        </button>
      </div>

      <!-- 音量控制 -->
      <div class="volume-control-section">
        <Volume :size="16" />
        <div 
          class="volume-bar-container"
          @click="handleVolumeBarClick"
          ref="volumeBarRef"
        >
          <div class="volume-bar-track"></div>
          <div 
            class="volume-bar-fill"
            :style="{ width: `${currentVolume * 100}%` }"
          ></div>
          <div 
            class="volume-bar-thumb"
            :style="{ left: `calc(${currentVolume * 100}% - 6px)` }"
          ></div>
        </div>
        <span class="volume-percentage">{{ Math.round(currentVolume * 100) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { usePlayer } from '../composables/usePlayer'
import { Play, Pause, Previous, Next, Repeat, Shuffle, Lyrics, Volume } from '../icons'

export default {
  name: 'PlayerControls',
  components: {
    Play,
    Pause,
    Previous,
    Next,
    Repeat,
    Shuffle,
    Lyrics,
    Volume
  },
  setup() {
    const { 
      playerState,
      currentPlayTime,
      currentVolume,
      playbackMode,
      isLyricsVisible,
      showWaveform,
      playbackProgress,
      formattedCurrentTime,
      formattedTrackDuration,
      playbackModeIcon,
      playbackModeText,
      currentTrack,
      togglePlayback,
      playNextTrack,
      playPreviousTrack,
      seekToTime,
      adjustVolume,
      cyclePlaybackMode,
      toggleLyricsDisplay,
      toggleWaveformDisplay
    } = usePlayer()

    const progressBarRef = ref()
    const volumeBarRef = ref()

    function handleProgressBarClick(event) {
      if (!progressBarRef.value || !currentTrack.value) return
      
      const rect = progressBarRef.value.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const percentage = clickX / rect.width
      const newTime = percentage * currentTrack.value.duration
      
      seekToTime(newTime)
    }

    function handleVolumeBarClick(event) {
      if (!volumeBarRef.value) return
      
      const rect = volumeBarRef.value.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const percentage = Math.max(0, Math.min(1, clickX / rect.width))
      
      adjustVolume(percentage)
    }

    return {
      playerState,
      currentPlayTime,
      currentVolume,
      playbackMode,
      isLyricsVisible,
      playbackProgress,
      formattedCurrentTime,
      formattedTrackDuration,
      playbackModeIcon,
      playbackModeText,
      currentTrack,
      showWaveform,
      togglePlayback,
      playNextTrack,
      playPreviousTrack,
      seekToTime,
      adjustVolume,
      cyclePlaybackMode,
      toggleLyricsDisplay,
      toggleWaveformDisplay,
      progressBarRef,
      volumeBarRef,
      handleProgressBarClick,
      handleVolumeBarClick
    }
  }
}
</script>

<style lang="less" scoped>
@import (reference) '../style.less';

.player-controls {
  padding: 40px;
  backdrop-filter: blur(25px);
  background: rgba(26, 26, 26, 0.85);
  border: 2px solid rgba(139, 0, 0, 0.4);
  box-shadow: 
    0 8px 32px rgba(13, 17, 23, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(13, 17, 23, 0.5);
  border-top: 3px solid rgba(139, 0, 0, 0.5);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(139, 0, 0, 0.8), transparent);
  }
}

.progress-control-section {
  margin-bottom: 40px;
}

.progress-time-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  color: #d1d5db;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.current-time {
  text-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
  color: #dc2626;
}

.total-duration {
  opacity: 0.8;
}

.progress-bar-container {
  position: relative;
  height: 16px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  .ink-shadow;
  
  &:hover .progress-bar-thumb {
    opacity: 1;
    transform: scale(1.2);
  }
}

.progress-bar-track {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(45, 45, 45, 0.9), rgba(26, 26, 26, 0.9));
  border: 2px solid rgba(139, 0, 0, 0.3);
  border-radius: 8px;
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #8b0000 0%, #dc2626 50%, #ef4444 100%);
  border-radius: 8px;
  box-shadow: 
    0 0 25px rgba(139, 0, 0, 0.8),
    inset 0 2px 0 rgba(255, 255, 255, 0.2),
    inset 0 -2px 0 rgba(13, 17, 23, 0.5);
}

.progress-bar-thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #dc2626 0%, #8b0000 100%);
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  box-shadow: 
    0 0 20px rgba(220, 38, 38, 0.9),
    0 4px 12px rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-control-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(45, 45, 45, 0.9) 0%, rgba(26, 26, 26, 0.9) 100%);
  border: 3px solid rgba(139, 0, 0, 0.6);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(13, 17, 23, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(13, 17, 23, 0.5);
  backdrop-filter: blur(20px);
  color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    background: conic-gradient(from 0deg, transparent, rgba(139, 0, 0, 0.4), transparent);
    border-radius: 16px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    background: linear-gradient(145deg, rgba(139, 0, 0, 0.3) 0%, rgba(26, 26, 26, 0.9) 100%);
    border-color: rgba(139, 0, 0, 0.9);
    transform: translateY(-4px);
    box-shadow: 
      0 12px 40px rgba(139, 0, 0, 0.5),
      inset 0 2px 0 rgba(255, 255, 255, 0.2),
      inset 0 -2px 0 rgba(13, 17, 23, 0.6);
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
  }

  &.secondary-btn {
    width: 64px;
    height: 64px;
  }

  &.primary-btn {
    width: 88px;
    height: 88px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      inset: 6px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139, 0, 0, 0.2) 0%, transparent 70%);
    }
  }
}

.btn-glow-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(139, 0, 0, 0.4) 0%, transparent 70%);
  opacity: 0.7;
  border-radius: inherit;
  animation: glowPulse 3s ease-in-out infinite;
}

.auxiliary-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-auxiliary-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.auxiliary-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(45, 45, 45, 0.8), rgba(26, 26, 26, 0.8));
  border: 2px solid rgba(139, 0, 0, 0.3);
  border-radius: 10px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 32px rgba(13, 17, 23, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(13, 17, 23, 0.5);
  position: relative;

  &:hover {
    background: linear-gradient(145deg, rgba(139, 0, 0, 0.2), rgba(26, 26, 26, 0.9));
    border-color: rgba(139, 0, 0, 0.6);
    color: #dc2626;
    transform: translateY(-2px);
  }

  &.btn-active {
    background: linear-gradient(145deg, rgba(139, 0, 0, 0.3), rgba(26, 26, 26, 0.9));
    border-color: rgba(139, 0, 0, 0.8);
    color: #dc2626;
    box-shadow: 
      0 0 20px rgba(220, 38, 38, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  
  .mode-indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 10px;
    background: rgba(139, 0, 0, 0.8);
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(220, 38, 38, 0.6);
  }
}

.volume-control-section {
  display: flex;
  align-items: center;
  gap: 16px;

  svg {
    color: #9ca3af;
  }
}

.volume-bar-container {
  width: 120px;
  height: 8px;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;

  &:hover .volume-bar-thumb {
    opacity: 1;
    transform: scale(1.2);
  }
}

.volume-bar-track {
  position: absolute;
  inset: 0;
  background: rgba(107, 114, 128, 0.5);
  border: 1px solid rgba(139, 0, 0, 0.2);
  border-radius: 4px;
}

.volume-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
}

.volume-bar-thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #dc2626;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.6);
  opacity: 0;
  transition: all 0.3s ease;
}

.volume-percentage {
  font-size: 14px;
  color: #9ca3af;
  font-weight: bold;
  width: 40px;
  text-align: right;
}
</style>

