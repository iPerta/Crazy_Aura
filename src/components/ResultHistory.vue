<script setup>
defineProps({
  history: {
    type: Array,
    required: true,
  },
})

const getResultColor = (result) => {
  if (result.type === 'minigame') {
    if (result.label === 'Crazy Time') return '#E60000'
    if (result.label === 'Pachinko') return '#EE82EE'
    if (result.label === 'Cash Hunt') return '#32CD32'
    if (result.label === 'Coin Flip') return '#1E90FF'
  }

  const val = result.value
  if (val === 1) return '#87CEEB'
  if (val === 2) return '#DAA520'
  if (val === 5) return '#FF69B4'
  if (val === 10) return '#8A2BE2'

  return '#444'
}

const getShorterLabel = (result) => {
  if (result.type === 'minigame') {
    return result.shorterLabel || result.label.substring(0, 2).toUpperCase()
  }
  return result.label
}
</script>

<template>
  <div class="history-container">
    <div
      v-for="(res, idx) in history"
      :key="idx"
      class="history-item"
      :style="{ backgroundColor: getResultColor(res) }"
    >
      {{ getShorterLabel(res) }}
    </div>
  </div>
</template>

<style scoped>
.history-container {
  display: flex;
  gap: 8px;
  flex-direction: row-reverse;
  justify-content: flex-start;
  padding: 10px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 30px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 50px;
  min-width: 300px;
  margin-top: 10px;
}

.history-item {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 0.8rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
