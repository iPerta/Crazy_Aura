<template>
  <div class="wheel-container">
    <div class="wheel-frame">
      <div class="pointer">▼</div>
      <svg class="wheel-svg" :style="wheelStyle" @transitionend="onTransitionEnd" ref="wheelSvg" viewBox="0 0 500 500">
        <g>
          <polygon v-for="(slice, i) in slices" :key="i" :points="slicePoints(i)" :fill="sliceColor(slice)" stroke="none" />
          <line v-for="(slice, i) in slices" :key="'line-' + i" :x1="250" :y1="250" :x2="radialX(i)" :y2="radialY(i)" stroke="#fff" stroke-width="2" />
          <text v-for="(slice, i) in slices" :key="'label-' + i" :x="labelX(i)" :y="labelY(i)" class="slice-text" :class="{ 'minigame-text': slice.type === 'minigame' }" paint-order="stroke">{{ slice.type === 'minigame' ? slice.shorterLabel : slice.label }}</text>
        </g>
      </svg>
    </div>
    <button class="btn-spin" @click="spin" :disabled="spinning">{{ spinning ? 'SPINNING...' : 'SPIN' }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const total = 54
const angle = 360 / total
const radius = 200
const innerRadius = 90

// Predefined order like Crazy Time - 4 CF, 2 PK, 2 CH, 1 CT, rest values
const sliceOrder = [
  '1', '2', '5', '1', '2', 'Coin Flip', '1', '10', '2', '5',
  '1', '2', 'Pachinko', '1', '5', '2', '1', '2', 'Coin Flip', '5',
  '10', '1', '2', '5', 'Cash Hunt', '1', '2', '1', '5', '2',
  '1', '10', '2', 'Crazy Time', '1', '2', '5', '1', '2', 'Coin Flip',
  '5', '1', '10', '2', '1', 'Pachinko', '2', '5', '1', '2',
  '1', 'Cash Hunt', '5', 'Coin Flip'
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

const wheelStyle = computed(() => ({
  transform: `rotate(${currentRotation.value}deg)`,
  transition: spinning.value ? 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
}))

function slicePoints(i) {
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
  return `${x1},${y1} ${x2},${y2} A ${radius} ${radius} 0 ${large} 1 ${x3},${y3} ${x4},${y4} A ${innerRadius} ${innerRadius} 0 ${large} 0 ${x1},${y1}`
}

function labelX(i) {
  const midAngle = (i * angle + angle / 2 - 90) * (Math.PI / 180)
  return 250 + (radius - 20) * Math.cos(midAngle)
}

function labelY(i) {
  const midAngle = (i * angle + angle / 2 - 90) * (Math.PI / 180)
  return 250 + (radius - 20) * Math.sin(midAngle)
}

function radialX(i) {
  const midAngle = (i * angle + angle / 2 - 90) * (Math.PI / 180)
  return 250 + (radius + 40) * Math.cos(midAngle)
}

function radialY(i) {
  const midAngle = (i * angle + angle / 2 - 90) * (Math.PI / 180)
  return 250 + (radius + 40) * Math.sin(midAngle)
}

function sliceColor(s) {
  if (s.type === 'minigame') return '#FFD966'
  if (s.value === 1) return '#FFE4E1'
  if (s.value === 2) return '#FFB6C1'
  if (s.value === 5) return '#FFA07A'
  if (s.value === 10) return '#FF6347'
  return '#FFE4E1'
}

function spin() {
  if (spinning.value) return
  spinning.value = true
  const idx = Math.floor(Math.random() * total)
  const sliceCenter = idx * angle + angle / 2
  const rotations = 5 + Math.random() * 2
  const finalRotation = rotations * 360 + (270 - sliceCenter)
  currentRotation.value = finalRotation
}

function onTransitionEnd() {
  spinning.value = false
  const normalized = ((currentRotation.value % 360) + 360) % 360
  const pointerAngle = 270
  const landedAngle = (pointerAngle - normalized + 360) % 360
  const landedIndex = Math.floor(landedAngle / angle) % total
  const result = slices[landedIndex]
  if (result.type === 'minigame') {
    router.push(`/minigame/${result.id}`)
  } else {
    alert(`🎉 Hai vinto: ${result.label}!`)
  }
}
</script>

<style scoped>
.wheel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: slideUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px) }
  to { opacity: 1; transform: translateY(0) }
}

.wheel-frame {
  position: relative;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.5), transparent);
  border-radius: 50%;
  border: 8px solid #FFD966;
  box-shadow: 0 30px 80px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.2), 0 0 30px rgba(255,217,102,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pointer {
  position: absolute;
  top: -28px;
  font-size: 48px;
  font-weight: bold;
  color: #FFD966;
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
  z-index: 10;
  filter: drop-shadow(0 0 8px rgba(255,217,102,0.6));
}

.wheel-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.25));
}

.slice-text {
  font-size: 24px;
  font-weight: 900;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: white;
  stroke: #000;
  stroke-width: 2px;
}

.minigame-text {
  fill: white;
  stroke: #b22222;
  stroke-width: 2.5px;
  font-size: 26px;
  font-weight: 900;
}

.btn-spin {
  background: linear-gradient(135deg, #FFD966, #FFC107);
  color: #b22222;
  padding: 16px 40px;
  font-size: 1.3rem;
  font-weight: 900;
  border: 3px solid #b22222;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(255,217,102,0.4);
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.btn-spin:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(255,217,102,0.6);
  background: linear-gradient(135deg, #FFE082, #FFD966);
}

.btn-spin:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
