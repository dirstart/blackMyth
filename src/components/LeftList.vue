<template>
  <div class="left-list-container">
    <div class="title">黑神话：悟空 主题音乐</div>
    <ul class="list">
      <li
        class="list-item"
        v-for="(song, index) in songs"
        :key="index"
        :class="{ active: currentSongIndex === index }"
        @click="handleSongClick(index)"
      >
        {{ song.title }}
      </li>
    </ul>
    <button class="load-local-btn" @click="loadLocalMusic">读取本地音乐</button>
    <!-- 新增：选择音乐文件夹按钮 -->
    <button class="select-folder-btn" @click="selectMusicFolder">选择音乐文件夹</button>
  </div>
</template>

<script setup>
import { useElectron } from "@/composables/useElectron";
import { useMusicStore } from "@/composables/useMusicStore";
import { onMounted } from "vue"; // 新增导入

const {
  openMusicFileDialog,
  parseAudioMetadata,
  openMusicFolderDialog,
  readMusicFolder,
} = useElectron();
const {
  songs,
  currentSongIndex,
  playSong,
  addSongs,
  saveLastFolder,
  lastMusicFolder,
} = useMusicStore();

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

// 新增：选择音乐文件夹
const selectMusicFolder = async () => {
  const folderPath = await openMusicFolderDialog();
  if (folderPath) {
    // 保存文件夹路径
    saveLastFolder(folderPath);
    // 读取文件夹内的音乐文件
    await loadMusicFromFolder(folderPath);
  }
};

// 新增：从文件夹加载音乐
const loadMusicFromFolder = async (folderPath) => {
  if (!folderPath) return;

  const files = await readMusicFolder(folderPath);
  if (files && files.length > 0) {
    const newSongs = [];
    for (const filePath of files) {
      const songInfo = await parseAudioMetadata(filePath);
      if (songInfo) {
        newSongs.push(songInfo);
      }
    }
    addSongs(newSongs);
  }
};

// 新增：组件挂载时自动加载上次选择的文件夹
onMounted(() => {
  if (lastMusicFolder.value) {
    loadMusicFromFolder(lastMusicFolder.value);
  }
});

// 修改playSong调用方式，确保正确传递索引
const handleSongClick = (index) => {
  console.log("尝试播放歌曲索引:", index);
  playSong(index);
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

// 新增：文件夹选择按钮样式
.select-folder-btn {
  width: 100%;
  padding: 8px 0;
  margin-top: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.select-folder-btn:hover {
  background-color: #444;
}
</style>
