# 音乐播放器 Composables 架构

## 概述

音乐播放器的逻辑已经被重构为三个独立的 composables，每个都有明确的职责：

## 1. useMusicStore

**职责**: 状态管理
- 管理音乐列表、当前播放索引、播放状态等
- 提供状态修改的方法
- 不包含具体的播放逻辑

**主要状态**:
- `songs`: 音乐列表
- `currentSongIndex`: 当前播放歌曲索引
- `isPlaying`: 播放状态
- `playMode`: 播放模式
- `volume`: 音量
- `currentTime`: 当前播放时间
- `duration`: 歌曲总时长

**主要方法**:
- `addSongs()`: 添加歌曲
- `setCurrentSongIndex()`: 设置当前歌曲索引
- `togglePlay()`: 切换播放状态
- `nextSong()`: 下一首
- `prevSong()`: 上一首
- `togglePlayMode()`: 切换播放模式

## 2. useMusicPlayer

**职责**: 音频播放控制
- 管理 Howler.js 音频实例
- 处理播放、暂停、进度控制等
- 不直接修改 store 状态，通过 store 方法更新

**主要功能**:
- 音频播放控制 (`playSelectedSong`, `togglePlay`)
- 进度管理 (`handleProgressClick`, `updateProgressInterval`)
- 音量控制 (`setVolume`, `toggleMute`)
- 播放结束处理 (`handleSongEnded`)

**返回的方法**:
- `togglePlay()`: 播放/暂停切换
- `playSelectedSong(index)`: 播放指定歌曲
- `handleProgressClick(event)`: 处理进度条点击
- `setVolume(volume)`: 设置音量
- `toggleMute()`: 静音切换
- `cleanup()`: 清理资源

## 3. useMusicInit

**职责**: 初始化和监听器管理
- 设置歌曲变化监听器
- 设置音量变化监听器
- 防止递归调用

**主要功能**:
- `initSongWatcher()`: 监听歌曲变化，自动播放
- `initVolumeWatcher()`: 监听音量变化
- `initWatchers()`: 初始化所有监听器

## 使用方式

```vue
<script setup>
import { useMusicStore } from "@/composables/useMusicStore";
import { useMusicPlayer } from "@/composables/useMusicPlayer";
import { useMusicInit } from "@/composables/useMusicInit";

// 1. 使用音乐存储
const musicStore = useMusicStore();

// 2. 使用音乐播放器
const musicPlayer = useMusicPlayer(musicStore);

// 3. 使用音乐初始化
const { initWatchers } = useMusicInit(musicStore, musicPlayer);

// 4. 在组件挂载时初始化
onMounted(() => {
  const stopWatchers = initWatchers();
  // 保存清理函数
  window.stopMusicWatchers = stopWatchers;
});

// 5. 在组件卸载时清理
onUnmounted(() => {
  if (window.stopMusicWatchers) {
    window.stopMusicWatchers();
    delete window.stopMusicWatchers;
  }
  musicPlayer.cleanup();
});
</script>
```

## 架构优势

1. **关注点分离**: 每个 composable 都有明确的职责
2. **可复用性**: 可以在不同组件中使用
3. **可测试性**: 逻辑分离后更容易进行单元测试
4. **可维护性**: 代码结构清晰，易于理解和修改
5. **状态一致性**: 通过 store 统一管理状态，避免状态不一致

## 注意事项

- `useMusicPlayer` 不直接修改 store 状态，而是通过 store 提供的方法
- 监听器的清理需要在组件卸载时手动处理
- 防递归逻辑在 `useMusicInit` 中实现 
