<template>
  <div class="app h-screen flex-col overflow-hidden relative">
    <MacTitleBar class="z-9999 basis-32" />

    <!-- app 主内容 -->
    <div class="main relative z-10 flex-1 flex-row">
      <LeftList class="basis-250" />

      <!-- 音乐内容 -->
      <div class="content flex-1 flex-col">
        <!-- 音乐播放器 -->
        <MusicPlayer
          ref="musicPlayer"
          class="basis-150"
        />
        <!-- 快捷按键 -->
        <div class="shortcuts basis-100">
          <ShortCut :musicPlayerRef="musicPlayer" />
        </div>
      </div>
    </div>

    <!-- 背景 -->
    <InkBg class="h-screen z--1" />
  </div>
</template>

<script setup>
import { ref, provide } from "vue";
import { createMusicStore } from "@/composables/useMusicStore";
import InkBg from "@/components/InkBg.vue";
import MacTitleBar from "@/components/MacTitleBar.vue";
import LeftList from "@/components/LeftList.vue";
import ShortCut from "@/components/ShortCut.vue";
import MusicPlayer from "@/components/MusicPlayer.vue"; // 新增导入

// 声明musicPlayer ref
const musicPlayer = ref(null);
// 创建并提供音乐数据存储
const musicStore = createMusicStore();
provide("musicStore", musicStore);
</script>

<style lang="less">
.content {
  background-color: rgba(0, 0, 0, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.player-content {
  padding: 20px;
}
</style>
