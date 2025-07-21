<template>
  <div class="playlist-panel">
    <div class="playlist-header glass-effect ink-shadow">
      <div class="playlist-title-section">
        <h2 class="playlist-title red-glow">播放列表</h2>
        <div class="playlist-subtitle">Playlist</div>
      </div>
      <div class="playlist-stats">
        <span class="track-count">{{ musicPlaylist.length }} 首歌曲</span>
      </div>
    </div>
    
    <div class="playlist-content">
      <div class="track-list">
        <div 
          v-for="(track, index) in musicPlaylist" 
          :key="track.id"
          class="track-item"
          :class="{ 
            'track-active': index === currentTrackIndex,
            'track-playing': index === currentTrackIndex && isPlaying 
          }"
          @dblclick="playTrackByIndex(index)"
        >
          <div class="track-cover-container">
            <img 
              :src="track.cover" 
              :alt="track.title"
              class="track-cover-image"
            />
            <div class="track-cover-overlay">
              <div class="play-indicator">
                <Play v-if="index !== currentTrackIndex || !isPlaying" :size="16" />
                <Pause v-else :size="16" />
              </div>
            </div>
          </div>
          
          <div class="track-details">
            <div class="track-main-info">
              <h3 class="track-name">{{ track.title }}</h3>
              <div class="track-meta">
                <span class="track-artist-name">{{ track.artist }}</span>
                <span class="meta-separator">·</span>
                <span class="track-album-name">{{ track.album }}</span>
              </div>
            </div>
            <div class="track-duration">{{ formatTimeDisplay(track.duration) }}</div>
          </div>
          
          <div class="track-actions">
            <button class="action-btn favorite-btn" title="收藏">
              <Heart :size="14" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePlayer } from '../composables/usePlayer'
import { Play, Pause, Heart } from '../icons'

export default {
  name: 'PlaylistPanel',
  components: {
    Play,
    Pause,
    Heart
  },
  setup() {
    const { 
      musicPlaylist,
      currentTrackIndex,
      isPlaying,
      playTrackByIndex
    } = usePlayer()

    function formatTimeDisplay(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    return {
      musicPlaylist,
      currentTrackIndex,
      isPlaying,
      playTrackByIndex,
      formatTimeDisplay
    }
  }
}
</script>

<style lang="less" scoped>
.playlist-panel {
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

.playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  border-bottom: 3px solid rgba(139, 0, 0, 0.5);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(139, 0, 0, 0.8), transparent);
  }
}

.playlist-title-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.playlist-title {
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
  color: #dc2626;
  margin: 0;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #8b0000, #dc2626, #ef4444, transparent);
    margin-top: 8px;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
  }
}

.playlist-subtitle {
  font-size: 14px;
  color: #9ca3af;
  font-weight: normal;
  opacity: 0.8;
  font-style: italic;
}

.playlist-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.track-count {
  font-size: 16px;
  font-weight: bold;
  color: #dc2626;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.6);
}

.playlist-content {
  flex: 1;
  overflow: hidden;
}

.track-list {
  height: 100%;
  overflow-y: auto;
  padding: 16px 0;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 32px;
  border-bottom: 1px solid rgba(139, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: transparent;
    transition: all 0.3s ease;
  }

  &:hover {
    background: rgba(139, 0, 0, 0.1);
    transform: translateX(8px);
    
    &::before {
      background: linear-gradient(180deg, #8b0000, #dc2626, #ef4444);
      box-shadow: 0 0 15px rgba(220, 38, 38, 0.6);
    }
    
    .track-cover-overlay {
      opacity: 1;
    }
  }

  &.track-active {
    background: rgba(139, 0, 0, 0.2);
    border-color: rgba(139, 0, 0, 0.6);
    
    &::before {
      background: linear-gradient(180deg, #dc2626, #ef4444, #f87171);
      box-shadow: 0 0 20px rgba(220, 38, 38, 0.8);
    }
    
    .track-name {
      text-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
      color: #dc2626;
      font-weight: bold;
    }
    
    .track-cover-overlay {
      opacity: 1;
      background: rgba(139, 0, 0, 0.8);
    }
  }

  &.track-playing {
    .play-indicator {
      animation: glowPulse 2s ease-in-out infinite;
    }
  }
}

.track-cover-container {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 
    0 4px 16px rgba(13, 17, 23, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(139, 0, 0, 0.4);
}

.track-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.track-cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 26, 26, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.play-indicator {
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
}

.track-details {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.track-main-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.track-name {
  font-size: 16px;
  font-weight: bold;
  color: #f5f5f5;
  margin: 0;
  line-height: 1.2;
  transition: all 0.3s ease;
}

.track-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #9ca3af;
}

.track-artist-name {
  font-weight: 500;
  color: #d1d5db;
}

.meta-separator {
  color: #6b7280;
}

.track-album-name {
  opacity: 0.8;
}

.track-duration {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
  font-family: 'Courier New', monospace;
}

.track-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(139, 0, 0, 0.2);
    color: #dc2626;
    transform: scale(1.1);
  }
  
  &.favorite-btn:hover {
    color: #ef4444;
  }
}
</style>