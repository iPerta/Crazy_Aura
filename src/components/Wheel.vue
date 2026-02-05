<template>
  <div class="wheel-container">
    <div class="wheel-frame">
      <div class="pointer">▼</div>
      <svg class="wheel-svg" :style="wheelStyle" @transitionend="onTransitionEnd" ref="wheelSvg" viewBox="0 0 500 500">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.5"/>
          </filter>
          <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#DAA520;stop-opacity:1" />
          </linearGradient>
           <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF4500;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8B0000;stop-opacity:1" />
          </linearGradient>
        </defs>
        <g>
          <!-- Slices -->
          <path 
            v-for="(slice, i) in slices" 
            :key="i" 
            :d="slicePath(i)" 
            :fill="sliceColor(slice)" 
            stroke="rgba(0,0,0,0.2)" 
            stroke-width="0.5"
            class="slice-path"
          />
          
          <!-- Text -->
          <text 
            v-for="(slice, i) in slices" 
            :key="'label-' + i" 
            :x="labelX(i)" 
            :y="labelY(i)" 
            :transform="`rotate(${labelRotation(i)}, ${labelX(i)}, ${labelY(i)})`"
            class="slice-text" 
            :class="{ 'minigame-text': slice.type === 'minigame' }" 
            paint-order="stroke"
          >
            {{ slice.type === 'minigame' ? slice.shorterLabel : slice.label }}
          </text>

          <!-- Central Hub (Logo) -->
          <circle cx="250" cy="250" :r="innerRadius" fill="url(#grad-red)" stroke="url(#grad-gold)" stroke-width="8" />
          <text x="250" y="240" text-anchor="middle" fill="#FFD700" font-family="serif" font-weight="900" font-size="24" filter="drop-shadow(2px 2px 2px black)">CRAZY</text>
          <text x="250" y="270" text-anchor="middle" fill="#FFF" font-family="serif" font-weight="900" font-size="24" filter="drop-shadow(2px 2px 2px black)" letter-spacing="2">WHEEL</text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['result'])

const total = 54
const angle = 360 / total
const radius = 245 
const innerRadius = 60 

// Exact 54 Slices Sequence
const sliceOrder = [
  'Crazy Time', '1', '2', '5', '1', '2', 'Pachinko', '1',
  '5', '1', '2', '1', 'Coin Flip', '1', '2', '1',
  '10', '2', 'Cash Hunt', '1', '2', '1', '5',
  '1', 'Coin Flip', '1', '5', '2', '10',
  '1', 'Pachinko', '1', '2', '5', '1', '2', 'Coin Flip',
  '1', '10', '1', '5', '1', 'Cash Hunt', '1',
  '2', '5', '1', '2', 'Coin Flip', '2', '1', '10',
  '2', '1'
]

const slices = sliceOrder.map((label, idx) => {
  if (label === 'Crazy Time') return { label: 'Crazy Time', type: 'minigame', id: 1, shorterLabel: 'CT' }
  if (label === 'Pachinko') return { label: 'Pachinko', type: 'minigame', id: 2, shorterLabel: 'PK' }
  if (label === 'Cash Hunt') return { label: 'Cash Hunt', type: 'minigame', id: 3, shorterLabel: 'CH' }
  if (label === 'Coin Flip') return { label: 'Coin Flip', type: 'minigame', id: 4, shorterLabel: 'CF' }
  return { label, type: 'value', value: parseInt(label) }
})

const wheelSvg = ref(null)
const spinning = ref(false)
const currentRotation = ref(0)
defineExpose({ spin })

const wheelStyle = computed(() => ({
  transform: `rotate(${currentRotation.value}deg)`,
  transition: spinning.value ? 'transform 5s cubic-bezier(0.15, 0.9, 0.3, 1)' : 'none' 
}))

function slicePath(i) {
  const start = (i * angle - 90) * (Math.PI / 180)
  const end = ((i + 1) * angle - 90) * (Math.PI / 180)
  
  const x1 = 250 + innerRadius * Math.cos(start)
  const y1 = 250 + innerRadius * Math.sin(start)
  
  const x2 = 250 + radius * Math.cos(start)
  const y2 = 250 + radius * Math.sin(start)
  
  const x3 = 250 + radius * Math.cos(end)
  const y3 = 250 + radius * Math.sin(end)
  
  const x4 = 250 + innerRadius * Math.cos(end)
  const y4 = 250 + innerRadius * Math.sin(end)
  
  const large = angle > 180 ? 1 : 0
  
  return `M ${x1},${y1} L ${x2},${y2} A ${radius} ${radius} 0 ${large} 1 ${x3},${y3} L ${x4},${y4} A ${innerRadius} ${innerRadius} 0 ${large} 0 ${x1},${y1} Z`
}

function labelX(i) {
  const midAngle = (i * angle + angle / 2 - 90) * (Math.PI / 180)
  const textRadius = innerRadius + (radius - innerRadius) * 0.89
  return 250 + textRadius * Math.cos(midAngle)
}

function labelY(i) {
  const midAngle = (i * angle + angle / 2 - 90) * (Math.PI / 180)
  const textRadius = innerRadius + (radius - innerRadius) * 0.89
  return 250 + textRadius * Math.sin(midAngle)
}

function labelRotation(i) {
  const angleDeg = (i * angle + angle / 2 - 90)
  return angleDeg + 90 
}

function sliceColor(s) {
  if (s.label === 'Crazy Time') return '#E60000' 
  if (s.label === 'Pachinko') return '#EE82EE' 
  if (s.label === 'Cash Hunt') return '#32CD32' 
  if (s.label === 'Coin Flip') return '#1E90FF' 
  
  if (s.value === 1) return '#87CEEB' 
  if (s.value === 2) return '#DAA520' 
  if (s.value === 5) return '#FF69B4' 
  if (s.value === 10) return '#8A2BE2' 
  return '#ccc'
}

function spin() {
  if (spinning.value) return
  spinning.value = true
  
  const idx = Math.floor(Math.random() * total)
  // Center of the target slice (relative to start of array)
  const sliceCenter = idx * angle + angle / 2
  
  // Add Random Jitter (Stop +/- 40% from center of slice)
  // This makes it land randomly inside the slice, not always dead center
  const jitter = (Math.random() - 0.5) * (angle * 0.8)
  
  // Calculate Target Rotation
  // We want Visual Position = Target (270)
  // Start(-90) + sliceCenter + Rotation + Jitter = 270
  // Rotation = 360 - sliceCenter - Jitter
  
  const targetVisualAngle = (360 - sliceCenter + jitter + 360) % 360
  
  const currentMod = currentRotation.value % 360
  
  // Calculate forward distance
  let distanceToTarget = targetVisualAngle - currentMod
  while (distanceToTarget < 0) distanceToTarget += 360
  
  // Add minimum full spins (4 to 7)
  const extraSpins = (4 + Math.floor(Math.random() * 4)) * 360
  
  const finalRotation = currentRotation.value + distanceToTarget + extraSpins
  
  currentRotation.value = finalRotation
}

function onTransitionEnd() {
  spinning.value = false
  const normalized = ((currentRotation.value % 360) + 360) % 360
  const pointerAngle = 270
  // Offset +90deg (Fixes payout mismatch)
  const landedAngle = (pointerAngle - normalized + 90 + 360) % 360
  const landedIndex = Math.floor(landedAngle / angle) % total
  
  const result = slices[landedIndex]
  emit('result', result)
}
</script>

<style scoped>
.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  justify-content: center;
  padding: 10px;
}

.wheel-frame {
  position: relative;
  width: 80vmin; 
  height: 80vmin;
  max-width: 700px;
  max-height: 700px;
  
  background: radial-gradient(circle, #333 30%, #000 100%);
  border-radius: 50%;
  padding: 15px; 
  border: 4px solid #F0C420; 
  box-shadow: 0 0 50px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-frame::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2);
  pointer-events: none;
}

.pointer {
  position: absolute;
  top: -5%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 5vh;
  color: #FFD700;
  z-index: 10;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8));
}

.wheel-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
}

.slice-text {
  font-size: 10.5px;
  font-weight: 800;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #fff;
  font-family: 'Segoe UI', sans-serif;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.minigame-text {
  font-size: 10px;
  fill: #FFF;
  font-weight: 900;
  letter-spacing: 0px; 
}

.slice-path:hover {
  filter: brightness(1.2); 
}
</style>
