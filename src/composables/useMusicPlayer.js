import { ref, computed, watch, onUnmounted } from 'vue';
import { Howl } from 'howler';

export const useMusicPlayer = (musicStore) => {
  // 音频实例
  const sound = ref(null);
  const isMuted = ref(false);
  const progressInterval = ref(null);

  // 从 store 获取状态
  const {
    songs,
    currentSongIndex,
    isPlaying,
    playMode,
    volume,
    currentTime,
    duration,
    updateProgress,
    nextSong,
    prevSong,
  } = musicStore;

  // 当前播放歌曲
  const currentSong = computed(() => {
    return currentSongIndex.value >= 0 && songs.value.length > currentSongIndex.value
      ? songs.value[currentSongIndex.value]
      : {};
  });

  // 格式化播放时间
  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 格式化播放模式显示文本
  const formatPlayMode = (mode) => {
    const modeMap = {
      order: "顺序播放",
      repeat: "单曲循环",
      shuffle: "随机播放",
    };
    return modeMap[mode] || "顺序播放";
  };

  // 处理进度条点击
  const handleProgressClick = (e) => {
    if (!sound.value) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX / progressBar.offsetWidth;
    const newTime = clickPosition * duration.value;
    sound.value.seek(newTime);
    updateProgress(newTime);
  };

  // 播放指定歌曲
  const playSelectedSong = async (index) => {
    return new Promise((resolve, reject) => {
      try {
        if (index < 0 || index >= songs.value.length) {
          console.error("无效的歌曲索引:", index);
          reject(new Error("无效的歌曲索引"));
          return;
        }

        const song = songs.value[index];
        if (!song?.filePath) {
          console.error("歌曲路径不存在:", song);
          reject(new Error("歌曲路径不存在"));
          return;
        }

        musicStore.setPlayingState(true);
        updateProgress(0);

        if (sound.value) {
          sound.value.stop();
          clearInterval(progressInterval.value);
          sound.value = null;
        }

        // 创建新的howler实例
        sound.value = new Howl({
          src: [`file://${song.filePath}`],
          format: ["mp3"],
          onload: () => {
            try {
              sound.value.play();
              musicStore.setDuration(sound.value.duration());
              updateProgressInterval();
              resolve();
            } catch (e) {
              console.error("播放失败:", e);
              musicStore.setPlayingState(false);
              reject(e);
            }
          },
          onplay: () => {
            musicStore.setPlayingState(true);
          },
          onpause: () => {
            musicStore.setPlayingState(false);
          },
          onend: () => {
            clearInterval(progressInterval.value);
            handleSongEnded();
          },
          onerror: (err) => {
            console.error("音频播放错误:", err);
            musicStore.setPlayingState(false);
            reject(err);
          },
        });
      } catch (e) {
        console.error("播放歌曲时发生错误:", e);
        reject(e);
      }
    });
  };

  // 处理歌曲播放结束
  const handleSongEnded = () => {
    if (!sound.value) return;

    if (playMode.value === "repeat") {
      // 单曲循环
      sound.value.seek(0);
      sound.value.play();
    } else {
      // 顺序播放/随机播放
      nextSong();
    }
  };

  // 进度更新间隔
  const updateProgressInterval = () => {
    clearInterval(progressInterval.value);
    progressInterval.value = setInterval(() => {
      if (sound.value && !sound.value.paused) {
        updateProgress(sound.value.seek());
      }
    }, 1000);
  };

  // 切换播放/暂停
  const togglePlay = () => {
    if (!sound.value) {
      console.error("播放失败: sound实例不存在");
      return;
    }

    // 先判断当前播放状态
    const wasPlaying = isPlaying.value;
    // 保存当前进度
    const currentPosition = sound.value.seek();

    // 根据当前状态执行操作
    if (wasPlaying) {
      // 当前是播放状态，要暂停
      sound.value.pause();
      clearInterval(progressInterval.value);
      // 确保进度被正确保存
      updateProgress(currentPosition);
    } else {
      // 当前是暂停状态，要播放
      // 先设置进度，再播放
      sound.value.seek(currentPosition);
      sound.value.play();
      updateProgress(currentPosition);
      updateProgressInterval();
    }

    // 最后调用store的togglePlay方法
    musicStore.togglePlay();
  };

  // 静音切换
  const toggleMute = () => {
    if (!sound.value) return;
    isMuted.value = !isMuted.value;
    sound.value.mute(isMuted.value);
  };

  // 设置音量
  const setVolume = (newVolume) => {
    if (sound.value) {
      sound.value.volume(Math.max(0, Math.min(1, newVolume / 100)));
    }
  };

  // 检查是否需要播放新歌曲（用于外部调用）
  const shouldPlayNewSong = (index) => {
    if (!sound.value) return true;
    const song = songs.value[index];
    return song?.filePath && sound.value.src !== `file://${song.filePath}`;
  };

  // 清理资源
  const cleanup = () => {
    if (sound.value) {
      sound.value.stop();
      sound.value = null;
    }
    clearInterval(progressInterval.value);
  };

  // 组件卸载时清理（可选，由使用者决定）
  // onUnmounted(cleanup);

  return {
    // 状态
    sound,
    isMuted,
    currentSong,

    // 方法
    formatTime,
    formatPlayMode,
    handleProgressClick,
    playSelectedSong,
    togglePlay,
    toggleMute,
    setVolume,

    // 工具方法
    shouldPlayNewSong,
    cleanup,
  };
}; 
