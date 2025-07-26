<template>
  <div class="ink-container">
    <!-- 多层墨水效果 -->
    <div class="ink-layer ink-layer-1"></div>
    <div class="ink-layer ink-layer-2"></div>
    <div class="ink-layer ink-layer-3"></div>
    <div class="ink-layer ink-layer-4"></div>
    <div class="ink-layer ink-layer-5"></div>

    <!-- 内容区域 -->
    <div class="content">
      <h1 class="title">流动墨水背景</h1>
      <p class="subtitle">像雾气一样的流动效果</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// 可以添加鼠标交互效果
const mouseX = ref(0)
const mouseY = ref(0)

onMounted(() => {
  const handleMouseMove = (e) => {
    mouseX.value = e.clientX / window.innerWidth
    mouseY.value = e.clientY / window.innerHeight
  }

  window.addEventListener('mousemove', handleMouseMove)

  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
  }
})
</script>

<style scoped>
.ink-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #0f0f0f 100%);
  overflow: hidden;
}

.ink-layer {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  opacity: 0.6;
  mix-blend-mode: screen;
  border-radius: 50%;
  filter: blur(40px);
}

.ink-layer-1 {
  background: radial-gradient(circle, rgba(100, 100, 255, 0.3) 0%, rgba(50, 50, 150, 0.2) 30%, transparent 70%);
  animation: float1 20s ease-in-out infinite;
  transform-origin: center center;
}

.ink-layer-2 {
  background: radial-gradient(circle, rgba(150, 50, 200, 0.25) 0%, rgba(100, 30, 120, 0.15) 40%, transparent 80%);
  animation: float2 25s ease-in-out infinite reverse;
  animation-delay: -5s;
}

.ink-layer-3 {
  background: radial-gradient(circle, rgba(50, 150, 200, 0.2) 0%, rgba(30, 100, 150, 0.1) 35%, transparent 75%);
  animation: float3 30s ease-in-out infinite;
  animation-delay: -10s;
}

.ink-layer-4 {
  background: radial-gradient(circle, rgba(200, 100, 50, 0.15) 0%, rgba(150, 70, 30, 0.08) 45%, transparent 85%);
  animation: float4 35s ease-in-out infinite reverse;
  animation-delay: -15s;
}

.ink-layer-5 {
  background: radial-gradient(circle, rgba(100, 200, 100, 0.18) 0%, rgba(70, 150, 70, 0.1) 38%, transparent 78%);
  animation: float5 28s ease-in-out infinite;
  animation-delay: -8s;
}

@keyframes float1 {

  0%,
  100% {
    transform: translate(-20%, -30%) rotate(0deg) scale(1);
  }

  25% {
    transform: translate(10%, -20%) rotate(90deg) scale(1.1);
  }

  50% {
    transform: translate(20%, 10%) rotate(180deg) scale(0.9);
  }

  75% {
    transform: translate(-10%, 20%) rotate(270deg) scale(1.05);
  }
}

@keyframes float2 {

  0%,
  100% {
    transform: translate(15%, 20%) rotate(0deg) scale(0.8);
  }

  33% {
    transform: translate(-25%, -10%) rotate(120deg) scale(1.2);
  }

  66% {
    transform: translate(30%, -25%) rotate(240deg) scale(0.95);
  }
}

@keyframes float3 {

  0%,
  100% {
    transform: translate(-30%, 15%) rotate(0deg) scale(1.1);
  }

  20% {
    transform: translate(25%, -30%) rotate(72deg) scale(0.85);
  }

  40% {
    transform: translate(-15%, -15%) rotate(144deg) scale(1.15);
  }

  60% {
    transform: translate(35%, 25%) rotate(216deg) scale(0.9);
  }

  80% {
    transform: translate(-25%, 35%) rotate(288deg) scale(1.05);
  }
}

@keyframes float4 {

  0%,
  100% {
    transform: translate(25%, -25%) rotate(0deg) scale(0.9);
  }

  30% {
    transform: translate(-35%, 20%) rotate(108deg) scale(1.3);
  }

  60% {
    transform: translate(20%, 35%) rotate(216deg) scale(0.8);
  }
}

@keyframes float5 {

  0%,
  100% {
    transform: translate(-15%, -35%) rotate(0deg) scale(1.05);
  }

  25% {
    transform: translate(30%, 15%) rotate(90deg) scale(0.85);
  }

  50% {
    transform: translate(-25%, 30%) rotate(180deg) scale(1.2);
  }

  75% {
    transform: translate(35%, -20%) rotate(270deg) scale(0.95);
  }
}

.content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: white;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #ffffff, #e0e0e0, #ffffff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

@keyframes shimmer {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .ink-layer {
    filter: blur(30px);
  }
}

/* 添加一些额外的视觉效果 */
.ink-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.1) 0%, transparent 50%);
  animation: backgroundShift 40s ease-in-out infinite;
}

@keyframes backgroundShift {

  0%,
  100% {
    opacity: 0.3;
    transform: scale(1) rotate(0deg);
  }

  50% {
    opacity: 0.6;
    transform: scale(1.1) rotate(180deg);
  }
}
</style>
