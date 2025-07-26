<template>
  <div class="app h-screen flex-col overflow-hidden relative">
    <MacTitleBar />
    <!-- 可能的背景元素 -->
    <div class="bg absolute inset-0" />

    <!-- app 主内容 -->
    <div class="main relative z-10 h-full flex-col">
      <!-- 标题栏 -->
      <div class="text-12 text-lighter mr16">
        标题
      </div>
      <div class="text-32 text-danger">
        副标题
      </div>

      <!-- 音乐内容 -->
      <div class="content flex-1 flex-row overflow-hidden">
        <!-- 音乐列表 -->
        <div class="playlist mb32">
          <div
            class="text-10"
            style="color:#089e8a"
          >
            列表
          </div>
          <div class="text-bold mb18">
            列表
          </div>
          <div class="">
            test
          </div>
        </div>

        <!-- 音乐容器 -->
        <div class="player flex-col">
          <div class="player-content flex-1">
            <div>专辑</div>
          </div>

          <!-- 用户控制栏 -->
          <div class="text-32 ctrl">
            音乐播放控制栏
          </div>
        </div>

        <div class="shortcuts">
          快件按钮组件
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InkBg from '@/components/InkBg.vue';
import MacTitleBar from '@/components/MacTitleBar.vue';
</script>

<style lang="less"></style>

