<template>
  <div class="app h-screen flex-col overflow-hidden relative">
    <MacTitleBar class="z-9999 basis-32" />

    <!-- app 主内容 -->
    <div class="main relative z-10 flex-1 flex-row">
      <LeftList class="basis-250" />

      <!-- 音乐内容 -->
      <div class="content flex-1 flex-col">
        <!-- 专辑/封面 -->
        <div class="player-content flex-1">
          <div>专辑</div>
        </div>
        <!-- 音乐播放器 -->
        <div class="player basis-150">
          <div>播放标题</div>
          <div>播放进度</div>
        </div>

        <div class="shortcuts basis-100">
          快件按钮组件
          <ShortCut />
        </div>
      </div>
    </div>

    <!-- 背景 -->
    <InkBg class="h-screen z--1" />
  </div>
</template>

<script setup>
import InkBg from '@/components/InkBg.vue';
import MacTitleBar from '@/components/MacTitleBar.vue';
import LeftList from '@/components/LeftList.vue';
import ShortCut from '@/components/ShortCut.vue';
</script>

<style lang="less">
.content {
  background-color: #089e8a;
}
</style>

