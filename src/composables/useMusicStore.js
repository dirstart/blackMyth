import { ref, provide, inject } from 'vue';

// 创建音乐数据存储
export const createMusicStore = () => {
  // 音乐列表
  const songs = ref([]);
  // 当前播放的歌曲索引
  const currentSongIndex = ref(-1);
  // 当前播放状态
  const isPlaying = ref(false);

  // 添加歌曲到列表
  const addSongs = (newSongs) => {
    songs.value = [...songs.value, ...newSongs];
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
    addSongs,
    playSong,
    togglePlay
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
