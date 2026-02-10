<template>
  <div class="betting-grid">
    <div class="bet-options">
      <!-- Number Bets -->
      <div
        v-for="num in ['1', '2', '5', '10']"
        :key="num"
        :class="[
          'bet-card',
          'num-' + num,
          { 'has-multiplier': topSlotMatch?.target.label === num },
        ]"
        @click="$emit('place-bet', num)"
      >
        <div class="bet-content">
          <span class="bet-label">{{ num }}</span>
          <span class="bet-payout">Pays {{ num }}x</span>
        </div>
        <div v-if="bets[num]" class="chip">{{ formatAmount(bets[num]) }}</div>
        <div v-if="topSlotMatch?.target.label === num" class="multiplier-badge">
          {{ topSlotMatch.multiplier }}X
        </div>
      </div>

      <!-- Bonus Bets -->
      <div
        v-for="bonus in [
          { label: 'Coin Flip', class: 'bonus-cf' },
          { label: 'Pachinko', class: 'bonus-ph' },
          { label: 'Cash Hunt', class: 'bonus-ch' },
          { label: 'Crazy Time', class: 'bonus-ct' },
        ]"
        :key="bonus.label"
        :class="[
          'bet-card',
          bonus.class,
          { 'has-multiplier': topSlotMatch?.target.label === bonus.label },
        ]"
        @click="$emit('place-bet', bonus.label)"
      >
        <div class="bet-content">
          <span class="bet-label">{{ bonus.label }}</span>
          <span class="bet-payout">Bonus</span>
        </div>
        <div v-if="bets[bonus.label]" class="chip">{{ formatAmount(bets[bonus.label]) }}</div>
        <div v-if="topSlotMatch?.target.label === bonus.label" class="multiplier-badge">
          {{ topSlotMatch.multiplier }}X
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bets: {
    type: Object,
    required: true,
  },
  topSlotMatch: {
    type: Object,
    default: null,
  },
})

defineEmits(['place-bet'])

function formatAmount(val) {
  if (!val) return '0'
  if (val < 1) return val.toFixed(2)
  if (Number.isInteger(val)) return val.toString()
  return val.toFixed(2)
}
</script>

<style scoped>
.betting-grid {
  width: 100%;
  max-width: 900px;
  padding: 1rem;
}

.bet-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
}

.bet-card {
  position: relative;
  height: 80px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
  border: 2px solid rgba(255, 255, 255, 0.2);
  user-select: none;
}

.bet-card:active {
  transform: scale(0.95);
}

.bet-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bet-label {
  font-weight: 900;
  font-size: 1.1rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  text-align: center;
}

.bet-payout {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 1);
  margin-top: 4px;
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

/* Specific Styles for Cards */
.num-1 {
  background: radial-gradient(#82cafa, #4682b4);
}
.num-2 {
  background: radial-gradient(#daa520, #b8860b);
}
.num-5 {
  background: radial-gradient(#ff69b4, #db7093);
}
.num-10 {
  background: radial-gradient(#9370db, #8a2be2);
}

.bonus-cf {
  background: radial-gradient(#4169e1, #00008b);
  border: 2px solid #ffd700;
}
.bonus-ph {
  background: radial-gradient(#da70d6, #800080);
  border: 2px solid #ffd700;
} /* Magenta/Purple */
.bonus-ch {
  background: radial-gradient(#3cb371, #006400);
  border: 2px solid #ffd700;
} /* Green */
.bonus-ct {
  background: radial-gradient(#dc143c, #8b0000);
  border: 2px solid #ffd700;
} /* Red */

.chip {
  position: absolute;
  top: -12px;
  right: -5px;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  background: white;
  border: 3px solid #333;
  border-radius: 16px;
  color: #333;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
  z-index: 5;
  white-space: nowrap;
}

.multiplier-badge {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(to right, #ffd700, #ffa500);
  color: #000;
  padding: 2px 10px;
  border-radius: 10px;
  font-weight: 900;
  font-size: 0.9rem;
  box-shadow: 0 0 10px #ffd700;
  border: 1px solid #fff;
  z-index: 10;
  animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.has-multiplier {
  animation: border-pulse 1s infinite alternate;
  border: 3px solid #ffd700 !important;
}

@keyframes pop-in {
  from {
    transform: translateX(-50%) scale(0);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

@keyframes border-pulse {
  from {
    box-shadow: 0 0 5px #ffd700;
  }
  to {
    box-shadow: 0 0 20px #ffd700;
  }
}
</style>
