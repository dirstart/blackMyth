<template>
  <div class="app-title-bar glass-effect ink-shadow">
    <!-- 应用标识区域 -->
    <div class="app-identity-section">
      <div class="app-logo-container">
        <div class="app-logo">♪</div>
        <div class="logo-glow"></div>
      </div>
      <div class="app-title-container">
        <h1 class="app-main-title red-glow">黑神话：悟空</h1>
        <div class="app-subtitle">原声音乐专辑</div>
      </div>
    </div>

    <!-- 窗口控制按钮 (Electron 环境) -->
    <div v-if="isElectronEnvironment" class="window-control-buttons">
      <button @click="minimizeWindow" class="window-control-btn minimize-btn" title="最小化">
        <span class="control-icon">─</span>
      </button>
      <button @click="maximizeWindow" class="window-control-btn maximize-btn" :title="isWindowMaximized ? '还原' : '最大化'">
        <span class="control-icon">{{ isWindowMaximized ? '❐' : '□' }}</span>
      </button>
      <button @click="closeWindow" class="window-control-btn close-btn" title="关闭">
        <span class="control-icon">✕</span>
      </button>
    </div>

    <!-- 专辑信息 (非 Electron 环境) -->
    <div v-else class="album-info-section">
      <div class="album-details">
        <span class="album-track-count">8首歌曲</span>
        <span class="album-duration">总时长 48:32</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useWindow } from '../composables/useWindow'

export default {
  name: 'AppTitleBar',
  setup() {
    const { 
      isElectronEnvironment, 
      isWindowMaximized, 
      minimizeWindow, 
      maximizeWindow, 
      closeWindow 
    } = useWindow()

    return {
      isElectronEnvironment,
      isWindowMaximized,
      minimizeWindow,
      maximizeWindow,
      closeWindow
    }
  }
}
</script>

<style lang="less" scoped>
.app-title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 24px;
  border-bottom: 3px solid rgba(139, 0, 0, 0.5);
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
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.6), transparent);
  }
}

.app-identity-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-logo-container {
  position: relative;
  width: 48px;
  height: 48px;
}

.app-logo {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #8b0000 0%, #dc2626 50%, #ef4444 100%);
  border: 3px solid rgba(139, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f5f5f5;
  font-weight: bold;
  font-size: 20px;
  position: relative;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    background: conic-gradient(from 0deg, rgba(139, 0, 0, 0.8), rgba(220, 38, 38, 0.4), rgba(139, 0, 0, 0.8));
    border-radius: 50%;
    z-index: -1;
    animation: glowPulse 3s ease-in-out infinite;
  }
}

.logo-glow {
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
  animation: glowPulse 4s ease-in-out infinite;
}

.app-title-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-main-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #8b0000, #dc2626, #ef4444, transparent);
    margin-top: 6px;
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
  }
}

.app-subtitle {
  font-size: 14px;
  color: #9ca3af;
  font-weight: normal;
  opacity: 0.8;
}

.window-control-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.window-control-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(139, 0, 0, 0.3);
  background: linear-gradient(145deg, rgba(45, 45, 45, 0.8), rgba(26, 26, 26, 0.8));
  color: #9ca3af;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  .control-icon {
    font-size: 14px;
    font-weight: bold;
  }

  &:hover {
    background: linear-gradient(145deg, rgba(139, 0, 0, 0.2), rgba(26, 26, 26, 0.9));
    border-color: rgba(139, 0, 0, 0.6);
    color: #f5f5f5;
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(139, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  &.close-btn:hover {
    background: linear-gradient(145deg, #dc2626, #b91c1c);
    border-color: #ef4444;
    color: white;
    box-shadow: 
      0 8px 25px rgba(220, 38, 38, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }
}

.album-info-section {
  display: flex;
  align-items: center;
}

.album-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-size: 14px;
  color: #9ca3af;
  
  .album-track-count {
    font-weight: bold;
    color: #dc2626;
  }
  
  .album-duration {
    opacity: 0.8;
  }
}
</style>