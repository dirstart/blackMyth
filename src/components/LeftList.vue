<template>
  <div class="left-list-container">
    <div class="title">小曲</div>
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
    <div class="button-group">
      <button
        class="load-local-btn"
        @click="loadLocalMusic"
      >读取本地音乐</button>
      <button
        class="select-folder-btn"
        @click="selectMusicFolder"
      >选择音乐文件夹</button>
    </div>
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
  setCurrentSongIndex,
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

// 修改setCurrentSongIndex调用方式，确保正确传递索引
// 处理歌曲点击
const handleSongClick = (index) => {
  setCurrentSongIndex(index); // 只需更新状态，播放逻辑在MusicPlayer中处理
};
</script>

<style scoped lang="less">
.left-list-container {
  color: white;
  padding: 20px;
  border-radius: 2px;
  display: flex; // 新增：使用flex布局
  flex-direction: column; // 新增：垂直排列
  height: 100%; // 新增：占满父容器高度
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.list {
  margin-left: 20px;
  margin-top: 20px;
  list-style-type: none;
  padding: 0;
  overflow-y: auto;
  flex-grow: 1;
  margin-bottom: 15px;

  .list-item {
    font-size: 16px;
    line-height: 2;
    padding: 8px 12px; // 增加内边距，让圆角效果更明显
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    transform: perspective(1000px) rotateX(0deg);
    transform-style: preserve-3d;
    border-radius: 2px; // 添加圆角
  }

  .list-item:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: perspective(1000px) rotateX(2deg) translateY(-2px);
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); // 新增阴影效果，增强立体感
  }

  // 升级版毛笔效果 - 多重渐变叠加
  .list-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0) 100%);
    transition: width 0.6s ease-out;
    z-index: -1;
    border-radius: 2px; // 伪元素也添加圆角
  }

  .list-item:hover::before {
    width: 100%;
  }

  // 底部装饰线条动画
  .list-item::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #fff, transparent);
    transition: width 0.5s ease 0.2s;
    border-radius: 1px; // 线条也添加圆角
  }

  .list-item:hover::after {
    width: 100%;
  }

  .list-item.active {
    background-color: #555;
    font-weight: bold;
    border-radius: 2px; // 激活状态也添加圆角
  }
}

// 新增：按钮组样式
.button-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.load-local-btn {
  width: 100%;
  padding: 8px 0;
  background-color: #414141;
  color: white;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0; // 修改：移除margin-top
}

.load-local-btn:hover {
  background-color: #555;
}

.select-folder-btn {
  width: 100%;
  padding: 8px 0;
  margin-top: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.select-folder-btn:hover {
  background-color: #444;
}
</style>
