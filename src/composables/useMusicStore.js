import { ref, provide, inject } from 'vue';

// 创建音乐数据存储
export const createMusicStore = () => {
  // 音乐列表
  const songs = ref([]);
  // 当前播放的歌曲索引
  const currentSongIndex = ref(-1);
  // 当前播放状态
  const isPlaying = ref(false);
  // 上次选择的文件夹路径
  const lastMusicFolder = ref('');
  // 播放相关状态
  const playMode = ref('shuffle'); // 播放模式: order(顺序), repeat(单曲循环), shuffle(随机)
  const volume = ref(80); // 音量 0-100
  const currentTime = ref(0); // 当前播放时间(秒)
  const duration = ref(0); // 歌曲总时长(秒)

  // 从本地存储加载上次选择的文件夹
  const loadLastFolder = () => {
    try {
      const savedFolder = localStorage.getItem('last_music_folder');
      if (savedFolder) {
        lastMusicFolder.value = savedFolder;
      }
    } catch (e) {
      console.error('Failed to load last folder from storage:', e);
    }
  };

  // 保存上次选择的文件夹到本地存储
  const saveLastFolder = (folderPath) => {
    try {
      localStorage.setItem('last_music_folder', folderPath);
      lastMusicFolder.value = folderPath;
    } catch (e) {
      console.error('Failed to save last folder to storage:', e);
    }
  };

  // 初始化时加载
  loadLastFolder();

  // 添加歌曲
  const addSongs = (newSongs) => {
    // 使用文件路径作为唯一标识进行去重
    const existingPaths = new Set(songs.value.map(song => song.path));

    // 过滤掉已存在的歌曲
    const uniqueNewSongs = newSongs.filter(song => !existingPaths.has(song.path));

    // 只添加新的歌曲
    if (uniqueNewSongs.length > 0) {
      songs.value = [...songs.value, ...uniqueNewSongs];
      console.log(`添加了 ${uniqueNewSongs.length} 首新歌曲，已过滤掉 ${newSongs.length - uniqueNewSongs.length} 首重复歌曲`);
    } else {
      console.log('没有发现新的歌曲');
    }
  };

  // 设置当前播放歌曲索引
  const setCurrentSongIndex = (index) => {
    currentSongIndex.value = index;
  };

  // 设置播放状态
  const setPlayingState = (playing) => {
    isPlaying.value = playing;
  };

  // 切换播放/暂停状态
  const togglePlay = () => {
    isPlaying.value = !isPlaying.value;
  };

  // 上一首
  const prevSong = () => {
    if (songs.value.length === 0) return;
    currentSongIndex.value = (
      currentSongIndex.value - 1 + songs.value.length
    ) % songs.value.length;
    isPlaying.value = true;
  };

  // 下一首
  const nextSong = () => {
    if (songs.value.length === 0) return;
    if (playMode.value === 'shuffle') {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.value.length);
      } while (randomIndex === currentSongIndex.value && songs.value.length > 1);
      currentSongIndex.value = randomIndex;
    } else {
      currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length;
    }
    isPlaying.value = true;
  };

  // 切换播放模式
  const togglePlayMode = () => {
    const modes = ['repeat', 'shuffle'];
    const currentModeIndex = modes.indexOf(playMode.value);
    playMode.value = modes[(currentModeIndex + 1) % modes.length];
  };

  // 设置音量
  const setVolume = (newVolume) => {
    volume.value = Math.max(0, Math.min(100, newVolume));
  };

  // 更新播放进度
  const updateProgress = (time) => {
    currentTime.value = time;
  };

  // 设置歌曲总时长
  const setDuration = (newDuration) => {
    duration.value = newDuration;
  };

  // 清空播放列表
  const clearSongs = () => {
    songs.value = [];
    currentSongIndex.value = -1;
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
  };

  return {
    // 状态
    songs,
    currentSongIndex,
    isPlaying,
    lastMusicFolder,
    playMode,
    volume,
    currentTime,
    duration,

    // 方法
    addSongs,
    setCurrentSongIndex,
    setPlayingState,
    togglePlay,
    prevSong,
    nextSong,
    togglePlayMode,
    setVolume,
    updateProgress,
    setDuration,
    saveLastFolder,
    clearSongs
  };
};

// 提供音乐存储
export const provideMusicStore = (app) => {
  const musicStore = createMusicStore();
  app.provide('musicStore', musicStore);
  return musicStore;
};

// 注入音乐存储
export const useMusicStore = () => {
  const musicStore = inject('musicStore');
  if (!musicStore) {
    throw new Error('useMusicStore must be used within a provideMusicStore');
  }
  return musicStore;
};
