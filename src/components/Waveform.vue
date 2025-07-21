<template>
  <div class="waveform-container">
    <div class="waveform-header">
      <h3 class="waveform-title red-glow">{{ currentTrack?.title || '未选择歌曲' }}</h3>
      <div class="waveform-subtitle">音乐波形图</div>
    </div>
    
    <div class="chart-container">
      <canvas ref="waveformCanvas" width="760" height="260"></canvas>
    </div>
    
    <div class="waveform-info">
      <span class="current-progress">{{ Math.round(playbackProgress) }}%</span>
      <span class="time-info">{{ formattedCurrentTime }} / {{ formattedDuration }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick, onBeforeUnmount } from 'vue'
import { useGlobalPlayer } from '../store/player'

export default {
  name: 'WaveformChart',
  setup() {
    const globalPlayer = useGlobalPlayer()
    
    // 直接从全局状态获取数据
    const currentTrack = globalPlayer.currentTrack
    const currentPlayTime = computed(() => globalPlayer.playerState.currentPlayTime)
    const isPlaying = computed(() => globalPlayer.playerState.isPlaying)
    const playbackProgress = globalPlayer.playbackProgress
    const formattedCurrentTime = globalPlayer.formattedCurrentTime

    const waveformCanvas = ref(null)
    const waveformData = ref([])
    const targetPoints = ref(1)
    const currentPoints = ref(1)
    const animationId = ref(null)
    
    // 平滑绘制参数
    const drawingSpeed = ref(2.0) // 每秒绘制2个点，更频繁更平滑
    const smoothingFactor = ref(0.8) // 平滑因子，用于减少突变

    // 生成252个波形数据点
    const generateWaveformData = (trackId) => {
      const points = []
      let seed = parseInt(trackId) || 1
      
      for (let i = 0; i < 252; i++) {
        // 更复杂的伪随机数生成
        seed = (seed * 9301 + 49297) % 233280
        const random = seed / 233280
        
        // 模拟真实音乐波形特征
        const time = i / 252
        
        // 基础随机振幅（模拟音乐的随机性）
        const baseAmplitude = (random - 0.5) * 120
        
        // 低频成分（鼓声、贝斯）- 较大振幅，变化缓慢
        const lowFreq = Math.sin(time * Math.PI * 4 + seed * 0.01) * 60 * (0.5 + random * 0.5)
        
        // 中频成分（人声、吉他）- 中等振幅，中等变化
        const midFreq = Math.sin(time * Math.PI * 12 + seed * 0.02) * 40 * (0.3 + random * 0.7)
        
        // 高频成分（镲片、高音）- 小振幅，快速变化
        const highFreq = Math.sin(time * Math.PI * 32 + seed * 0.03) * 20 * random
        
        // 音乐动态变化（模拟音量起伏）
        const dynamics = Math.sin(time * Math.PI * 2) * 0.5 + 0.5 // 0-1之间
        const crescendo = Math.pow(Math.sin(time * Math.PI), 0.5) // 渐强效果
        
        // 添加一些突发的峰值（模拟鼓点、重音）
        const peakChance = random > 0.92 ? (random - 0.92) * 12.5 : 0 // 8%概率出现峰值
        const peak = peakChance * (random > 0.5 ? 1 : -1) * 80
        
        // 组合所有频率成分
        let finalAmplitude = baseAmplitude + lowFreq + midFreq + highFreq + peak
        
        // 应用动态变化
        finalAmplitude *= (dynamics * 0.7 + 0.3) * crescendo
        
        // 添加一些平滑的连接（避免过于尖锐的变化）
        if (i > 0) {
          const prevAmplitude = points[i - 1]
          const maxChange = 25 // 进一步限制相邻点的最大变化
          if (Math.abs(finalAmplitude - prevAmplitude) > maxChange) {
            finalAmplitude = prevAmplitude + Math.sign(finalAmplitude - prevAmplitude) * maxChange
          }
          
          // 额外的平滑处理 - 与前一个点进行加权平均
          finalAmplitude = prevAmplitude * (1 - smoothingFactor.value) + finalAmplitude * smoothingFactor.value
        }
        
        // 限制振幅范围并添加一些非线性压缩（模拟音频压缩）
        finalAmplitude = Math.max(-100, Math.min(100, finalAmplitude))
        finalAmplitude = Math.sign(finalAmplitude) * Math.pow(Math.abs(finalAmplitude) / 100, 0.8) * 100
        
        points.push(finalAmplitude)
      }
      
      return points
    }

    const formattedDuration = computed(() => {
      if (!currentTrack.value) return '00:00'
      const minutes = Math.floor(currentTrack.value.duration / 60)
      const seconds = Math.floor(currentTrack.value.duration % 60)
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    // 绘制超平滑曲线波形图
    const drawWaveform = () => {
      if (!waveformCanvas.value || waveformData.value.length === 0) return
      
      const canvas = waveformCanvas.value
      const ctx = canvas.getContext('2d')
      const centerY = canvas.height / 2
      const width = canvas.width
      const height = canvas.height
      
      // 清空画布并设置背景
      ctx.clearRect(0, 0, width, height)
      
      // 绘制背景
      ctx.fillStyle = 'rgba(13, 17, 23, 0.8)'
      ctx.fillRect(0, 0, width, height)
      
      // 绘制中心线
      ctx.strokeStyle = 'rgba(139, 0, 0, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, centerY)
      ctx.lineTo(width, centerY)
      ctx.stroke()
      
      // 绘制网格线
      for (let i = 1; i < 5; i++) {
        const y = (height / 5) * i
        ctx.strokeStyle = 'rgba(139, 0, 0, 0.1)'
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      
      // 使用浮点数精度，支持小数点绘制
      const pointsToShow = currentPoints.value
      const wholePoints = Math.floor(pointsToShow)
      const fractionalPart = pointsToShow - wholePoints
      
      // 绘制波形曲线（超平滑贝塞尔曲线）
      if (wholePoints > 1) {
        // 主曲线
        ctx.strokeStyle = '#dc2626'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        
        // 发光效果
        ctx.shadowColor = '#dc2626'
        ctx.shadowBlur = 12
        
        ctx.beginPath()
        
        // 绘制完整的点
        for (let i = 0; i < wholePoints && i < waveformData.value.length; i++) {
          const x = (i / (waveformData.value.length - 1)) * (width - 40) + 20
          const y = centerY + waveformData.value[i]
          
          if (i === 0) {
            ctx.moveTo(x, y)
          } else if (i === 1) {
            ctx.lineTo(x, y)
          } else {
            // 使用二次贝塞尔曲线创建平滑效果
            const prevX = ((i - 1) / (waveformData.value.length - 1)) * (width - 40) + 20
            const prevY = centerY + waveformData.value[i - 1]
            const controlX = (prevX + x) / 2
            const controlY = (prevY + y) / 2
            ctx.quadraticCurveTo(controlX, controlY, x, y)
          }
        }
        
        // 绘制部分点（平滑过渡）
        if (fractionalPart > 0 && wholePoints < waveformData.value.length) {
          const currentIndex = wholePoints
          const prevIndex = currentIndex - 1
          
          if (prevIndex >= 0) {
            const prevX = (prevIndex / (waveformData.value.length - 1)) * (width - 40) + 20
            const prevY = centerY + waveformData.value[prevIndex]
            const currentX = (currentIndex / (waveformData.value.length - 1)) * (width - 40) + 20
            const currentY = centerY + waveformData.value[currentIndex]
            
            // 插值计算部分点的位置
            const partialX = prevX + (currentX - prevX) * fractionalPart
            const partialY = prevY + (currentY - prevY) * fractionalPart
            
            if (currentIndex === 1) {
              ctx.lineTo(partialX, partialY)
            } else {
              const controlX = (prevX + partialX) / 2
              const controlY = (prevY + partialY) / 2
              ctx.quadraticCurveTo(controlX, controlY, partialX, partialY)
            }
          }
        }
        
        ctx.stroke()
        ctx.shadowBlur = 0
        
        // 绘制填充区域
        ctx.globalAlpha = 0.3
        const fillGradient = ctx.createLinearGradient(0, 0, 0, height)
        fillGradient.addColorStop(0, 'rgba(220, 38, 38, 0.4)')
        fillGradient.addColorStop(0.5, 'rgba(220, 38, 38, 0.2)')
        fillGradient.addColorStop(1, 'rgba(220, 38, 38, 0.1)')
        ctx.fillStyle = fillGradient
        
        ctx.beginPath()
        const startX = 20
        ctx.moveTo(startX, centerY)
        
        // 填充完整的点
        for (let i = 0; i < wholePoints && i < waveformData.value.length; i++) {
          const x = (i / (waveformData.value.length - 1)) * (width - 40) + 20
          const y = centerY + waveformData.value[i]
          
          if (i === 0) {
            ctx.lineTo(x, y)
          } else if (i === 1) {
            ctx.lineTo(x, y)
          } else {
            const prevX = ((i - 1) / (waveformData.value.length - 1)) * (width - 40) + 20
            const prevY = centerY + waveformData.value[i - 1]
            const controlX = (prevX + x) / 2
            const controlY = (prevY + y) / 2
            ctx.quadraticCurveTo(controlX, controlY, x, y)
          }
        }
        
        // 填充部分点
        if (fractionalPart > 0 && wholePoints < waveformData.value.length) {
          const currentIndex = wholePoints
          const prevIndex = currentIndex - 1
          
          if (prevIndex >= 0) {
            const prevX = (prevIndex / (waveformData.value.length - 1)) * (width - 40) + 20
            const prevY = centerY + waveformData.value[prevIndex]
            const currentX = (currentIndex / (waveformData.value.length - 1)) * (width - 40) + 20
            const currentY = centerY + waveformData.value[currentIndex]
            
            const partialX = prevX + (currentX - prevX) * fractionalPart
            const partialY = prevY + (currentY - prevY) * fractionalPart
            
            if (currentIndex === 1) {
              ctx.lineTo(partialX, partialY)
            } else {
              const controlX = (prevX + partialX) / 2
              const controlY = (prevY + partialY) / 2
              ctx.quadraticCurveTo(controlX, controlY, partialX, partialY)
            }
          }
        }
        
        // 连接到底部
        const lastDrawnIndex = Math.min(wholePoints + (fractionalPart > 0 ? fractionalPart : 0), waveformData.value.length - 1)
        const endX = (Math.min(wholePoints - 1 + fractionalPart, waveformData.value.length - 1) / (waveformData.value.length - 1)) * (width - 40) + 20
        ctx.lineTo(endX, centerY)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
      }
      
      // 绘制动态金色亮点（支持小数位置）
      if (pointsToShow > 1) {
        let glowX, glowY
        
        if (fractionalPart > 0 && wholePoints < waveformData.value.length) {
          // 在两点之间插值
          const prevIndex = wholePoints - 1
          const currentIndex = wholePoints
          
          const prevX = (prevIndex / (waveformData.value.length - 1)) * (width - 40) + 20
          const prevY = centerY + waveformData.value[prevIndex]
          const currentX = (currentIndex / (waveformData.value.length - 1)) * (width - 40) + 20
          const currentY = centerY + waveformData.value[currentIndex]
          
          glowX = prevX + (currentX - prevX) * fractionalPart
          glowY = prevY + (currentY - prevY) * fractionalPart
        } else {
          // 在整数点上
          const currentIndex = Math.min(wholePoints - 1, waveformData.value.length - 1)
          glowX = (currentIndex / (waveformData.value.length - 1)) * (width - 40) + 20
          glowY = centerY + waveformData.value[currentIndex]
        }
        
        // 外圈发光 - 减少闪烁
        ctx.shadowColor = '#fbbf24'
        ctx.shadowBlur = 15
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.arc(glowX, glowY, 5 + Math.sin(Date.now() * 0.003) * 1, 0, 2 * Math.PI)
        ctx.fill()
        
        // 内圈亮点
        ctx.shadowBlur = 0
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(glowX, glowY, 3, 0, 2 * Math.PI)
        ctx.fill()
      }
      
      // 绘制进度信息
      ctx.shadowBlur = 0
      ctx.fillStyle = 'rgba(220, 38, 38, 0.8)'
      ctx.font = '12px monospace'
      ctx.fillText(`${pointsToShow.toFixed(1)}/${waveformData.value.length}`, width - 100, 30)
    }

    // 平滑动画循环
    const animate = () => {
      // 平滑增长到目标点数
      if (currentPoints.value < targetPoints.value) {
        const increment = drawingSpeed.value / 60 // 60FPS下的增量，现在更快
        currentPoints.value = Math.min(currentPoints.value + increment, targetPoints.value)
        // 减少日志输出频率，避免控制台刷屏
        if (Math.floor(currentPoints.value * 10) % 5 === 0) {
          console.log(`🎨 平滑绘制进度: ${currentPoints.value.toFixed(2)}/${targetPoints.value}`)
        }
      }
      
      drawWaveform()
      
      // 继续动画
      if (isPlaying.value || currentPoints.value < targetPoints.value) {
        animationId.value = requestAnimationFrame(animate)
      }
    }

    // 清除动画
    const clearAnimation = () => {
      if (animationId.value) {
        cancelAnimationFrame(animationId.value)
        animationId.value = null
      }
    }

    // 启动动画
    const startAnimation = () => {
      clearAnimation()
      console.log('🎵 启动平滑波形图动画')
      animationId.value = requestAnimationFrame(animate)
    }

    // 停止动画
    const stopAnimation = () => {
      clearAnimation()
      console.log('⏸️ 停止波形图动画')
    }

    // 重置波形图
    const resetWaveform = () => {
      console.log('🔄 重置波形图')
      currentPoints.value = 1
      targetPoints.value = 1
      
      drawWaveform()
    }

    // 更新目标点数（基于播放时间）
    const updateTargetPoints = () => {
      if (currentTrack.value && currentPlayTime.value >= 0) {
        // 每秒对应一个点，但允许小数精度
        const newTarget = Math.max(1, currentPlayTime.value + 1)
        if (newTarget !== targetPoints.value) {
          targetPoints.value = newTarget
          console.log(`🎯 更新目标点数: ${targetPoints.value}`)
        }
      }
    }

    // 初始化波形图
    const initWaveform = () => {
      if (!currentTrack.value) return
      
      console.log('🎵 初始化波形图:', currentTrack.value.title)
      waveformData.value = generateWaveformData(currentTrack.value.id)
      currentPoints.value = 1
      targetPoints.value = 1
      
      nextTick(() => {
        drawWaveform()
      })
    }

    // 监听播放状态变化
    watch(() => globalPlayer.playerState.isPlaying, (playing) => {
      console.log('🎵 播放状态变化:', playing)
      if (playing) {
        startAnimation()
      } else {
        stopAnimation()
      }
    })

    // 监听歌曲变化
    watch(() => globalPlayer.currentTrack.value, (newTrack) => {
      console.log('🎵 歌曲变化:', newTrack?.title)
      stopAnimation()
      if (newTrack) {
        initWaveform()
      }
    }, { immediate: true })

    // 监听播放时间变化
    watch(() => globalPlayer.playerState.currentPlayTime, (newTime) => {
      // 减少日志输出频率
      if (newTime % 5 === 0 || newTime === 0) {
        console.log('⏰ 播放时间变化:', newTime)
      }
      
      const oldTime = currentPoints.value - 1 // 获取之前的时间用于比较
      // 检测是否是跳转操作（时间差大于2秒表示用户点击跳转）
      const isSeekOperation = Math.abs(newTime - (oldTime || 0)) > 2
      
      updateTargetPoints()
      
      if (newTime === 0) {
        resetWaveform()
      } else if (isSeekOperation) {
        // 快速跳转到目标位置
        console.log('🎯 检测到跳转操作，快速绘制到目标位置')
        currentPoints.value = targetPoints.value
        drawWaveform()
      }
    })

    onMounted(() => {
      console.log('🎵 波形图组件挂载')
      nextTick(() => {
        if (currentTrack.value) {
          initWaveform()
        }
      })
    })

    onBeforeUnmount(() => {
      clearAnimation()
    })

    onUnmounted(() => {
      console.log('🎵 波形图组件卸载')
      clearAnimation()
    })

    return {
      waveformCanvas,
      playbackProgress,
      formattedCurrentTime,
      formattedDuration,
      currentTrack
    }
  }
}
</script>

<style lang="less" scoped>
.waveform-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px;
}

.waveform-header {
  text-align: center;
  margin-bottom: 24px;
}

.waveform-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.waveform-subtitle {
  font-size: 14px;
  color: #9ca3af;
  opacity: 0.8;
}

.chart-container {
  flex: 1;
  position: relative;
  background: rgba(13, 17, 23, 0.3);
  border: 2px solid rgba(139, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.waveform-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #9ca3af;
}

.current-progress {
  font-weight: bold;
  color: #dc2626;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.6);
}

.time-info {
  font-family: 'Courier New', monospace;
}
</style>