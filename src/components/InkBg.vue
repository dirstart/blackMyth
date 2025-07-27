<template>
  <div class="ink-bg w-full h-full">
  </div>
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

修改说明：
1. 将`background-size: cover`改为`background-size: 400% auto`，这会将图片宽度放大到原来的4倍
2. 将`background-position: center`改为`background-position: left center`，使图片左侧对齐
3. 保留了原有的虚化和古朴效果的filter属性

这样设置后，只会显示图片左侧1/4的部分，并且这部分会被放大到填满整个屏幕。
