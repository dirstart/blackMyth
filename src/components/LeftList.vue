<template>
  <div class="left-list-container">
    <div class="title">黑神话：悟空 主题音乐</div>
    <ul class="list">
      <li
        class="list-item"
        v-for="(song, index) in songs"
        :key="index"
        :class="{ active: currentSongIndex === index }"
        @click="playSong(index)"
      >
        {{ song.title }}
      </li>
    </ul>
    <button
      class="load-local-btn"
      @click="loadLocalMusic"
    >读取本地音乐</button>
  </div>
</template>

<script setup>
import { useElectron } from "@/composables/useElectron";
import { useMusicStore } from "@/composables/useMusicStore";
const { openMusicFileDialog, parseAudioMetadata } = useElectron();
const { songs, currentSongIndex, playSong, addSongs } = useMusicStore();

// 读取本地音乐文件并解析元数据
const loadLocalMusic = async () => {
  const files = await openMusicFileDialog({
    title: "选择本地音乐文件",
    filters: [
      {
        name: "音频文件",
        extensions: ["mp3", "wav", "flac", "m4a", "ogg", "aac", "wma"],
      },
    ],
    properties: ["openFile", "multiSelections"],
  });

  if (files && files.length > 0) {
    // 解析每个文件的元数据
    const newSongs = [];
    for (const filePath of files) {
      const songInfo = await parseAudioMetadata(filePath);
      if (songInfo) {
        newSongs.push(songInfo);
      }
    }
    // 添加到音乐库
    addSongs(newSongs);
  }
};
</script>

<style scoped lang="less">
.left-list-container {
  width: 250px;
  color: white;
  padding: 20px;
  border-radius: 8px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.list {
  list-style-type: none;
  padding: 0;
  overflow-y: auto;
    max-height: calc(100vh - 150px);
  
    .list-item {
      font-size: 16px;
      line-height: 2;
      border-bottom: 1px solid #444;
      padding: 5px 0;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    .list-item:hover {
      background-color: #333;
    }
                                .list-item.active {
                                  background-color: #555;
                                  font-weight: bold;
                                }
                                }
.load-local-btn {
  width: 100%;
  padding: 8px 0;
  margin-top: 15px;
  background-color: #414141;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.load-local-btn:hover {
  background-color: #555;
}
</style>
