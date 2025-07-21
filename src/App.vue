<template>
  <div class="music-player-app">
    <InkBg />
    
    <div class="app-main-container">
      <TitleBar />
      
      <div class="app-content-area">
        <div class="playlist-container">
          <Playlist />
        </div>
        
        <div class="player-container">
          <div class="player-content-area">
            <Player />
          </div>
          
          <Controls />
        </div>
        
        <Shortcuts />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import InkBg from './components/InkBg.vue'
import TitleBar from './components/TitleBar.vue'
import Playlist from './components/Playlist.vue'
import Player from './components/Player.vue'
import Controls from './components/Controls.vue'
import Shortcuts from './components/Shortcuts.vue'
import { useKeys } from './composables/useKeys'
import { useWindow } from './composables/useWindow'

export default {
  name: 'MusicPlayerApp',
  components: {
    InkBg,
    TitleBar,
    Playlist,
    Player,
    Controls,
    Shortcuts
  },
  setup() {
    const { init } = useKeys()
    const { handleBack } = useWindow()

    onMounted(() => {
      init()
      
      document.addEventListener('mouseup', (event) => {
        if (event.button === 3) {
          handleBack()
        }
      })
    })

    return {}
  }
}
</script>

<style lang="less">
.music-player-app {
  min-height: 100vh;
  background: #0a0a0a;
  color: #f5f5f5;
  overflow: hidden;
  position: relative;
}

.app-main-container {
  position: relative;
  z-index: 10;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.playlist-container {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.player-container {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.player-content-area {
  flex: 1;
}
</style>