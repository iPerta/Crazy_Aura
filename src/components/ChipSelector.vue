<template>
  <div class="chip-selector">
    <div
      v-for="chip in chipValues"
      :key="chip"
      class="chip-wrapper"
      @click="$emit('select-chip', chip)"
    >
      <div :class="['chip', getChipClass(chip), { active: modelValue === chip }]">
        <div class="chip-inner">
          <span class="chip-value">{{ formatValue(chip) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
})

defineEmits(['select-chip'])

const chipValues = [0.1, 0.25, 0.5, 1, 5, 10, 25, 50, 100, 250, 500, 1000]

function formatValue(val) {
  if (val < 1) return val.toFixed(2)
  return val.toString()
}

function getChipClass(val) {
  if (val === 0.1) return 'chip-010'
  if (val === 0.25) return 'chip-025'
  if (val === 0.5) return 'chip-05'
  if (val === 1) return 'chip-1'
  if (val === 5) return 'chip-5'
  if (val === 10) return 'chip-10'
  if (val === 25) return 'chip-25'
  if (val === 50) return 'chip-50'
  if (val === 100) return 'chip-100'
  if (val === 250) return 'chip-250'
  if (val === 500) return 'chip-500'
  if (val === 1000) return 'chip-1000'
  return ''
}
</script>

<style scoped>
.chip-selector {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
  margin-bottom: 25px;
  max-width: 100%;
  user-select: none;
}

.chip-wrapper {
  perspective: 1000px;
}

.chip {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 3px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
}

.chip:hover {
  transform: translateY(-5px) scale(1.1);
}

.chip.active {
  transform: translateY(-10px) scale(1.2);
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(255, 255, 255, 0.5);
  z-index: 10;
}

.chip-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  background: inherit;
  filter: brightness(1.2);
}

.chip-value {
  font-weight: 900;
  font-size: 0.8rem;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* ChipDenominations Colors */
.chip-010 {
  background: radial-gradient(#ffffff, #cccccc);
  color: #333 !important;
}
.chip-010 .chip-value {
  color: #333;
  text-shadow: none;
}

.chip-025 {
  background: radial-gradient(#ffeb3b, #fbc02d);
}
.chip-05 {
  background: radial-gradient(#4caf50, #388e3c);
}
.chip-1 {
  background: radial-gradient(#2196f3, #1976d2);
}
.chip-5 {
  background: radial-gradient(#f44336, #d32f2f);
}
.chip-10 {
  background: radial-gradient(#9c27b0, #7b1fa2);
}
.chip-25 {
  background: radial-gradient(#009688, #00796b);
}
.chip-50 {
  background: radial-gradient(#ff5722, #e64a19);
}
.chip-100 {
  background: radial-gradient(#333333, #000000);
  border: 2px solid #ffd700;
}
.chip-250 {
  background: radial-gradient(#ffd700, #b8860b);
  border: 2px solid #ffffff;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}
.chip-250 .chip-value {
  color: #000;
  text-shadow: none;
}
.chip-500 {
  background: radial-gradient(#e5e4e2, #a9a9a9); /* Platinum */
  border: 2px solid #ffd700;
  box-shadow: 0 0 15px rgba(229, 228, 226, 0.6);
}
.chip-500 .chip-value {
  color: #000;
  text-shadow: none;
}
.chip-1000 {
  background: radial-gradient(#4a4a4a, #000000); /* Dark Obsidian/Diamond */
  border: 2px solid #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}
.chip-1000 .chip-value {
  color: #00ffff;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.active::after {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>
