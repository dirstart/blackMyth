import { watch } from 'vue';

export const useMusicInit = (musicStore, musicPlayer) => {
  // 防递归标志
  let isPlayingSong = false;

  // 监听歌曲变化，自动播放新歌曲
  const initSongWatcher = () => {
    const { currentSongIndex, songs } = musicStore;
    const { playSelectedSong, shouldPlayNewSong } = musicPlayer;

    return watch(
      [currentSongIndex, songs],
      ([newIndex, newSongs]) => {
        // 防止递归调用
        if (isPlayingSong) return;

        if (newIndex >= 0 && newSongs.length > 0) {
          const song = newSongs[newIndex];
          if (song?.filePath && shouldPlayNewSong(newIndex)) {
            console.log("检测到歌曲变化，准备播放新歌曲");
            isPlayingSong = true;
            playSelectedSong(newIndex).finally(() => {
              isPlayingSong = false;
            });
          }
        }
      },
      { immediate: true }
    );
  };

  // 监听音量变化
  const initVolumeWatcher = () => {
    const { volume } = musicStore;
    const { setVolume } = musicPlayer;

    return watch(
      volume,
      (newVolume) => {
        setVolume(newVolume);
      }
    );
  };

  // 初始化所有监听器
  const initWatchers = () => {
    const stopSongWatch = initSongWatcher();
    const stopVolumeWatch = initVolumeWatcher();

    return () => {
      stopSongWatch();
      stopVolumeWatch();
    };
  };

  return {
    initWatchers,
    initSongWatcher,
    initVolumeWatcher,
  };
}; 
