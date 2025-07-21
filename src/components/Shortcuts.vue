<template>
  <div class="keyboard-shortcuts-panel glass-effect ink-shadow">
    <div class="shortcuts-panel-header">
      <div class="shortcuts-title red-glow">快捷键</div>
      <div class="shortcuts-subtitle">Shortcuts</div>
    </div>
    
    <div class="shortcuts-list">
      <div 
        v-for="shortcut in keyboardShortcuts" 
        :key="shortcut.key"
        class="shortcut-item"
        :class="{ 'shortcut-active': shortcut.isActive }"
      >
        <div class="shortcut-key-badge" :data-key="shortcut.key">
          <span class="key-text">{{ shortcut.key }}</span>
          <div class="key-glow"></div>
        </div>
        <div class="shortcut-description">
          <span class="shortcut-action">{{ shortcut.action }}</span>
          <span class="shortcut-detail">{{ shortcut.detail }}</span>
        </div>
      </div>
    </div>
    
    <div class="shortcuts-panel-footer">
      <div class="footer-text">按键即可操作</div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'KeyboardShortcutsPanel',
  setup() {
    const keyboardShortcuts = reactive([
      {
        key: 'Tab',
        action: '歌词',
        detail: '显示/隐藏',
        isActive: false
      },
      {
        key: 'A',
        action: '上一首',
        detail: '切换歌曲',
        isActive: false
      },
      {
        key: 'E',
        action: '播放',
        detail: '播放/暂停',
        isActive: false
      },
      {
        key: 'D',
        action: '下一首',
        detail: '切换歌曲',
        isActive: false
      },
      {
        key: 'T',
        action: '模式',
        detail: '播放模式',
        isActive: false
      },
      {
        key: '《',
        action: '音量-',
        detail: '降低音量',
        isActive: false
      },
      {
        key: '》',
        action: '音量+',
        detail: '提高音量',
        isActive: false
      }
    ])

    return {
      keyboardShortcuts
    }
  }
}
</script>

<style lang="less" scoped>
.keyboard-shortcuts-panel {
  position: fixed;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  z-index: 100;
  width: 200px;
  border-radius: 20px;
  padding: 24px;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: conic-gradient(from 0deg, transparent, rgba(139, 0, 0, 0.4), transparent);
    border-radius: 20px;
    z-index: -1;
    opacity: 0.6;
  }
}

.shortcuts-panel-header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(139, 0, 0, 0.3);
}

.shortcuts-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.shortcuts-subtitle {
  font-size: 12px;
  color: #9ca3af;
  opacity: 0.7;
  font-style: italic;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(139, 0, 0, 0.1);
    transform: translateX(4px);
  }
  
  &.shortcut-active {
    background: rgba(139, 0, 0, 0.2);
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
    
    .shortcut-key-badge {
      background: linear-gradient(145deg, #dc2626, #b91c1c);
      border-color: #ef4444;
      box-shadow: 
        0 4px 15px rgba(220, 38, 38, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      
      .key-glow {
        opacity: 1;
      }
    }
  }
}

.shortcut-key-badge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 36px;
  padding: 0 12px;
  background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
  border: 2px solid rgba(139, 0, 0, 0.4);
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  .key-text {
    font-size: 14px;
    font-weight: bold;
    position: relative;
    z-index: 2;
  }
  
  .key-glow {
    position: absolute;
    inset: 2px;
    background: radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 70%);
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(145deg, #4a4a4a, #3a3a3a);
    border-color: rgba(139, 0, 0, 0.6);
    transform: translateY(-2px);
    box-shadow: 
      0 6px 20px rgba(13, 17, 23, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    
    .key-glow {
      opacity: 0.5;
    }
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
    box-shadow: 
      0 2px 8px rgba(13, 17, 23, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
}

.shortcut-description {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.shortcut-action {
  font-size: 14px;
  font-weight: bold;
  color: #f5f5f5;
}

.shortcut-detail {
  font-size: 12px;
  color: #9ca3af;
  opacity: 0.8;
}

.shortcuts-panel-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(139, 0, 0, 0.2);
  text-align: center;
}

.footer-text {
  font-size: 12px;
  color: #9ca3af;
  opacity: 0.6;
  font-style: italic;
}
</style>

