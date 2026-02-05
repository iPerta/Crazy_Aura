<template>
  <div class="betting-grid">
    <div class="bet-options">
      <!-- Number Bets -->
      <div class="bet-card num-1" @click="$emit('place-bet', '1')">
        <div class="bet-content">
          <span class="bet-label">1</span>
          <span class="bet-payout">Pays 1x</span>
        </div>
        <div v-if="bets['1']" class="chip">{{ bets['1'] }}</div>
      </div>
      
      <div class="bet-card num-2" @click="$emit('place-bet', '2')">
        <div class="bet-content">
          <span class="bet-label">2</span>
          <span class="bet-payout">Pays 2x</span>
        </div>
        <div v-if="bets['2']" class="chip">{{ bets['2'] }}</div>
      </div>
      
      <div class="bet-card num-5" @click="$emit('place-bet', '5')">
        <div class="bet-content">
          <span class="bet-label">5</span>
          <span class="bet-payout">Pays 5x</span>
        </div>
        <div v-if="bets['5']" class="chip">{{ bets['5'] }}</div>
      </div>
      
      <div class="bet-card num-10" @click="$emit('place-bet', '10')">
        <div class="bet-content">
          <span class="bet-label">10</span>
          <span class="bet-payout">Pays 10x</span>
        </div>
        <div v-if="bets['10']" class="chip">{{ bets['10'] }}</div>
      </div>

      <!-- Bonus Bets -->
      <div class="bet-card bonus-cf" @click="$emit('place-bet', 'Coin Flip')">
        <div class="bet-content">
          <span class="bet-label">Coin Flip</span>
          <span class="bet-payout">Bonus</span>
        </div>
        <div v-if="bets['Coin Flip']" class="chip">{{ bets['Coin Flip'] }}</div>
      </div>
      
      <div class="bet-card bonus-ph" @click="$emit('place-bet', 'Pachinko')">
        <div class="bet-content">
          <span class="bet-label">Pachinko</span>
          <span class="bet-payout">Bonus</span>
        </div>
        <div v-if="bets['Pachinko']" class="chip">{{ bets['Pachinko'] }}</div>
      </div>
      
      <div class="bet-card bonus-ch" @click="$emit('place-bet', 'Cash Hunt')">
        <div class="bet-content">
          <span class="bet-label">Cash Hunt</span>
          <span class="bet-payout">Bonus</span>
        </div>
        <div v-if="bets['Cash Hunt']" class="chip">{{ bets['Cash Hunt'] }}</div>
      </div>
      
      <div class="bet-card bonus-ct" @click="$emit('place-bet', 'Crazy Time')">
        <div class="bet-content">
          <span class="bet-label">Crazy Time</span>
          <span class="bet-payout">Bonus</span>
        </div>
        <div v-if="bets['Crazy Time']" class="chip">{{ bets['Crazy Time'] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bets: {
    type: Object,
    required: true
  }
})

defineEmits(['place-bet'])
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
  border: 2px solid rgba(255,255,255,0.2);
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
  font-size: 1.2rem;
  color: white;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.bet-payout {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.8);
  margin-top: 2px;
}

/* Specific Styles for Cards */
.num-1 { background: radial-gradient(#82CAFA, #4682B4); }
.num-2 { background: radial-gradient(#DAA520, #B8860B); }
.num-5 { background: radial-gradient(#FF69B4, #DB7093); }
.num-10 { background: radial-gradient(#9370DB, #8A2BE2); }

.bonus-cf { background: radial-gradient(#4169E1, #00008B); border: 2px solid #FFD700; }
.bonus-ph { background: radial-gradient(#DA70D6, #800080); border: 2px solid #FFD700; } /* Magenta/Purple */
.bonus-ch { background: radial-gradient(#3CB371, #006400); border: 2px solid #FFD700; } /* Green */
.bonus-ct { background: radial-gradient(#DC143C, #8B0000); border: 2px solid #FFD700; } /* Red */

.chip {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  background: white;
  border: 5px solid #333;
  border-radius: 50%;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
}
</style>
