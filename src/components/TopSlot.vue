<template>
  <div class="top-slot-container">
    <div class="slot-frame">
      <div class="reel reel-left">
        <div class="reel-strip" :style="leftReelStyle">
          <!-- We need 3 sets of items to enable seamless looping logic if we wanted perfect value, 
               but here we just render a long strip for visual effect -->
          <div v-for="(item, i) in infiniteLeftItems" :key="'l-' + i" class="slot-item">
            <div :class="['symbol', getSymbolClass(item)]">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="reel reel-right">
        <div class="reel-strip" :style="rightReelStyle">
          <div v-for="(mul, i) in infiniteRightItems" :key="'r-' + i" class="slot-item">
            <div class="multiplier">{{ mul }}x</div>
          </div>
        </div>
      </div>

      <!-- Winning Line Indicator -->
      <div class="win-line" :class="{ 'win-line-active': hasMatch }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['spin-end'])

// ... (betOptions and multipliers remain same) ...
const betOptions = [
  { label: '1', type: 'number' },
  { label: '2', type: 'number' },
  { label: '5', type: 'number' },
  { label: '10', type: 'number' },
  { label: 'Pachinko', type: 'bonus' },
  { label: 'Coin Flip', type: 'bonus' },
  { label: 'Cash Hunt', type: 'bonus' },
  { label: 'Crazy Time', type: 'bonus' },
]

const multipliers = [2, 3, 4, 5, 7, 10, 15, 20, 25, 50]

// Repeat more times for longer scroll
const infiniteLeftItems = computed(() => {
  let list = []
  for (let i = 0; i < 200; i++) list = list.concat(betOptions)
  return list
})

const infiniteRightItems = computed(() => {
  let list = []
  for (let i = 0; i < 200; i++) list = list.concat(multipliers)
  return list
})

const itemHeight = 80 // height of one item
const leftOffset = ref(0)
const rightOffset = ref(0)
const isSpinning = ref(false)
const hasMatch = ref(false)

const leftReelStyle = computed(() => ({
  transform: `translateY(${leftOffset.value}px)`,
  // Sharp start, slow end for "ansia" effect
  transition: isSpinning.value ? 'transform 10s cubic-bezier(0.45, 0.05, 0.55, 0.95)' : 'none',
}))

const rightReelStyle = computed(() => ({
  transform: `translateY(${rightOffset.value}px)`,
  transition: isSpinning.value ? 'transform 10.5s cubic-bezier(0.45, 0.05, 0.55, 0.95)' : 'none',
}))

function getSymbolClass(item) {
  if (item.type === 'bonus') return 'bonus-symbol'
  return `num-${item.label}`
}

function spin() {
  if (isSpinning.value) return
  hasMatch.value = false

  // 1. Ensure transition is 'none' by keeping isSpinning false
  isSpinning.value = false

  // 2. Jump to 0 instantly
  leftOffset.value = 0
  rightOffset.value = 0

  // 3. Wait for DOM update and then start animation
  setTimeout(() => {
    isSpinning.value = true

    // Weighted Symbols: Numbers appear much more than bonus games
    const weightedSymbols = [
      { label: '1', weight: 35 },
      { label: '2', weight: 25 },
      { label: '5', weight: 15 },
      { label: '10', weight: 10 },
      { label: 'Coin Flip', weight: 6 },
      { label: 'Pachinko', weight: 4 },
      { label: 'Cash Hunt', weight: 3 },
      { label: 'Crazy Time', weight: 2 },
    ]

    function getWeightedSymbol() {
      const totalWeight = weightedSymbols.reduce((sum, item) => sum + item.weight, 0)
      let random = Math.random() * totalWeight
      for (const item of weightedSymbols) {
        if (random < item.weight) return item.label
        random -= item.weight
      }
      return '1' // Fallback
    }

    const resultSymbolLabel = getWeightedSymbol()
    const resultSymbol = betOptions.find((o) => o.label === resultSymbolLabel)
    const targetLeftIndex = betOptions.indexOf(resultSymbol)

    // Weighted Multipliers: Lower values (2, 3, 5) appear much more than high ones (25, 50)
    const weightedMultipliers = [
      { val: 2, weight: 40 },
      { val: 3, weight: 25 },
      { val: 5, weight: 15 },
      { val: 10, weight: 8 },
      { val: 15, weight: 5 },
      { val: 20, weight: 3 },
      { val: 25, weight: 2 },
      { val: 50, weight: 2 },
    ]

    function getWeightedMultiplier() {
      const totalWeight = weightedMultipliers.reduce((sum, item) => sum + item.weight, 0)
      let random = Math.random() * totalWeight
      for (const item of weightedMultipliers) {
        if (random < item.weight) return item.val
        random -= item.weight
      }
      return 2 // Fallback
    }

    const resultMultiplier = getWeightedMultiplier()
    const targetRightIndex = multipliers.indexOf(resultMultiplier)

    // Higher repetition for very fast spin
    const rep = 80

    const finalLeftIndex = rep * betOptions.length + targetLeftIndex
    const finalRightIndex = rep * multipliers.length + targetRightIndex

    // Match probability (65%)
    const isMatch = Math.random() < 0.65

    let leftFinal = 40 - finalLeftIndex * itemHeight
    let rightFinal = 40 - finalRightIndex * itemHeight

    if (!isMatch) {
      rightFinal += 40
    }

    leftOffset.value = leftFinal
    rightOffset.value = rightFinal

    setTimeout(() => {
      isSpinning.value = false
      if (isMatch) hasMatch.value = true

      emit('spin-end', {
        target: resultSymbol,
        multiplier: resultMultiplier,
        isMatch: isMatch,
      })
    }, 10500)
  }, 50)
}

defineExpose({ spin })
</script>

<style scoped>
.top-slot-container {
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
  z-index: 20;
  padding: 10px;
}

.slot-frame {
  width: 320px;
  height: 160px;
  background: #111;
  border: 4px solid #f0c420;
  border-radius: 12px;
  display: flex;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.9);
}

.reel {
  flex: 1;
  height: 100%;
  background: #222;
  position: relative;
  /* Add vignette/shadow inside each reel */
  box-shadow:
    inset 0 20px 20px -20px #000,
    inset 0 -20px 20px -20px #000;
}
.reel-left {
  border-right: 2px solid #444;
}
.reel-right {
  border-left: 2px solid #444;
}

.divider {
  width: 2px;
  background: #000;
}

.reel-strip {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.slot-item {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.symbol,
.multiplier {
  font-family: Impact, sans-serif;
  font-size: 1.8rem;
  color: #fff;
  text-shadow: 0 3px 6px #000;
  text-transform: uppercase;
  text-align: center;
  width: 100%;
}
.bonus-symbol {
  font-size: 1.2rem;
  line-height: 1.1;
  background: linear-gradient(to bottom, #fff, #aaa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.num-1 {
  color: #87ceeb;
}
.num-2 {
  color: #daa520;
}
.num-5 {
  color: #ff69b4;
}
.num-10 {
  color: #8a2be2;
}

.multiplier {
  font-size: 3rem;
  color: #ff4500;
}

.win-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 10;
}

.win-line-active {
  background: #fff;
  height: 4px;
  box-shadow:
    0 0 15px #fff,
    0 0 30px #f0c420;
  animation: flicker 0.2s infinite;
}

@keyframes flicker {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}
</style>
