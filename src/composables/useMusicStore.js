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

  // 修改 addSongs 方法
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

  // 播放指定歌曲
  const playSong = (index) => {
    currentSongIndex.value = index;
    isPlaying.value = true;
  };

  // 切换播放/暂停
  const togglePlay = () => {
    isPlaying.value = !isPlaying.value;
  };

  return {
    songs,
    currentSongIndex,
    isPlaying,
    lastMusicFolder,
    addSongs,
    playSong,
    togglePlay,
    saveLastFolder
  };
};

// 提供音乐存储
export const provideMusicStore = () => {
  const musicStore = createMusicStore();
  provide('musicStore', musicStore);
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
