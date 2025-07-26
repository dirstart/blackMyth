<template>
  <div class="left-list-container">
    <div class="title">黑神话：悟空 主题音乐</div>
    <ul class="list">
      <li
        class="list-item"
        v-for="(item, index) in items"
        :key="index"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const items = [
  "云宫讯音",
  "英雄气概穿时休",
  "胜景赛婆娑",
  "别有世间曾未见",
  "大闹黑风山",
  "灵山黄远求",
  "木生炉烟",
  "后院大狗",
  "怪不得小生现出本相",
  "胖长二百七十岁",
  "正是山中黑风王"
];
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
}

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
</style>
