<template>
  <div class="ink-bg w-full h-full"></div>
</template>
<style lang="less" scoped>
.ink-bg {
  background-image: url(./ink.png);
  background-size: 260% auto;
  /* 放大图片到4倍宽度 */
  background-position: left center;
  /* 定位到图片左侧 */
  background-repeat: no-repeat;
  position: fixed;
  inset: 0;
  /* 保留原有的虚化和古朴效果 */
  filter: blur(1px) sepia(30%) saturate(80%) contrast(90%);
}
</style>
