<template>
  <div class="ink-background-container">
    <!-- 主背景渐变 -->
    <div class="main-background-gradient"></div>
    
    <!-- 水墨飞溅效果 -->
    <div class="ink-splash-layer">
      <div class="ink-splash ink-splash-primary"></div>
      <div class="ink-splash ink-splash-secondary"></div>
      <div class="ink-splash ink-splash-accent"></div>
      <div class="ink-splash ink-splash-ambient"></div>
    </div>
    
    <!-- 水墨流动效果 -->
    <div class="ink-flow-layer">
      <div class="ink-flow ink-flow-top"></div>
      <div class="ink-flow ink-flow-bottom"></div>
      <div class="ink-flow ink-flow-center"></div>
    </div>
    
    <!-- 纹理叠加 -->
    <div class="texture-overlay"></div>
  </div>
</template>

<script>
export default {
  name: 'InkBackground'
}
</script>

<style lang="less" scoped>
.ink-background-container {
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.main-background-gradient {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(139, 0, 0, 0.8) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(45, 45, 45, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(13, 17, 23, 0.95) 0%, transparent 60%),
    linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #0d1117 75%, #0a0a0a 100%);
}

.ink-splash-layer {
  position: absolute;
  inset: 0;
}

.ink-splash {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  
  &.ink-splash-primary {
    width: 600px;
    height: 600px;
    top: -200px;
    right: -200px;
    background: 
      radial-gradient(circle, rgba(139, 0, 0, 0.9) 0%, rgba(139, 0, 0, 0.4) 30%, transparent 60%),
      radial-gradient(circle at 30% 70%, rgba(220, 38, 38, 0.6) 0%, transparent 40%);
    animation: inkSplash 25s ease-in-out infinite;
  }
  
  &.ink-splash-secondary {
    width: 500px;
    height: 500px;
    bottom: -150px;
    left: -150px;
    background: 
      radial-gradient(circle, rgba(45, 45, 45, 0.9) 0%, rgba(26, 26, 26, 0.5) 40%, transparent 70%),
      radial-gradient(circle at 60% 30%, rgba(139, 0, 0, 0.4) 0%, transparent 50%);
    animation: inkSplash 30s ease-in-out infinite reverse;
  }
  
  &.ink-splash-accent {
    width: 400px;
    height: 400px;
    top: 20%;
    left: 10%;
    background: 
      radial-gradient(circle, rgba(139, 0, 0, 0.7) 0%, rgba(13, 17, 23, 0.3) 30%, transparent 60%);
    animation: inkPulse 20s ease-in-out infinite;
  }
  
  &.ink-splash-ambient {
    width: 300px;
    height: 300px;
    top: 60%;
    right: 20%;
    background: 
      radial-gradient(circle, rgba(220, 38, 38, 0.5) 0%, rgba(139, 0, 0, 0.2) 40%, transparent 70%);
    animation: inkPulse 18s ease-in-out infinite reverse;
  }
}

.ink-flow-layer {
  position: absolute;
  inset: 0;
}

.ink-flow {
  position: absolute;
  filter: blur(1px);
  
  &.ink-flow-top {
    width: 100%;
    height: 200px;
    top: 0;
    background: linear-gradient(180deg, 
      rgba(139, 0, 0, 0.6) 0%, 
      rgba(139, 0, 0, 0.3) 30%, 
      transparent 100%);
    animation: inkFlow 35s ease-in-out infinite;
  }
  
  &.ink-flow-bottom {
    width: 100%;
    height: 150px;
    bottom: 0;
    background: linear-gradient(0deg, 
      rgba(45, 45, 45, 0.8) 0%, 
      rgba(26, 26, 26, 0.4) 40%, 
      transparent 100%);
    animation: inkFlow 40s ease-in-out infinite reverse;
  }
  
  &.ink-flow-center {
    width: 80%;
    height: 300px;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
    background: radial-gradient(ellipse, 
      rgba(139, 0, 0, 0.4) 0%, 
      rgba(13, 17, 23, 0.2) 50%, 
      transparent 80%);
    animation: inkPulse 25s ease-in-out infinite;
  }
}

.texture-overlay {
  position: absolute;
  inset: 0;
  background: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(139, 0, 0, 0.02) 2px,
      rgba(139, 0, 0, 0.02) 4px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 2px,
      rgba(45, 45, 45, 0.03) 2px,
      rgba(45, 45, 45, 0.03) 4px
    );
  opacity: 0.3;
}
</style>