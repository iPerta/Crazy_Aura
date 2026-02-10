<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Wheel from '@/components/Wheel.vue'
import BettingGrid from '@/components/BettingGrid.vue'
import TopSlot from '@/components/TopSlot.vue'
import ChipSelector from '@/components/ChipSelector.vue'

const router = useRouter()
const showSettings = ref(false)
const settingsForm = ref({ username: '', password: '', confirmPassword: '' })
const showPassword = ref(false)
const wheelRef = ref(null)
const topSlotRef = ref(null)

// Game State
const balance = ref(1000)
const bets = reactive({})
const betTypes = ['1', '2', '5', '10', 'Coin Flip', 'Pachinko', 'Cash Hunt', 'Crazy Time']
betTypes.forEach((type) => (bets[type] = 0))

const spinning = ref(false)
const topSlotSpinning = ref(false)
const activeTopSlot = ref(null) // { target: {label, type}, multiplier: 10 }
const selectedChip = ref(10) // Default chip value

// Win State
const winAmount = ref(0)
const showWin = ref(false)
const winMultiplier = ref(null)

// Timer State
const timeLeft = ref(15)
let timerInterval = null

const username = computed(() => {
  return localStorage.getItem('username') || 'Player'
})

const totalBet = computed(() => {
  const sum = Object.values(bets).reduce((a, b) => a + b, 0)
  return Number(sum.toFixed(2))
})

const formatCurrency = (val) => {
  if (val === undefined || val === null) return '0.00'
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const gameStatus = computed(() => {
  if (topSlotSpinning.value) return 'TOP SLOT...'
  if (spinning.value) return 'SPINNING...'
  return timeLeft.value > 0 ? `BETTING OPEN: ${timeLeft.value}s` : 'BETS CLOSED'
})

onMounted(() => {
  // Initialize balance from storage if exists
  const storedBalance = localStorage.getItem('balance')
  if (storedBalance) {
    balance.value = parseFloat(storedBalance)
  } else {
    localStorage.setItem('balance', balance.value)
  }

  // Start the Game Loop
  startTimer()
})

onUnmounted(() => {
  clearInterval(timerInterval)
})

const updateBalance = (newBalance) => {
  const rounded = Number(newBalance.toFixed(2))
  balance.value = rounded
  localStorage.setItem('balance', rounded)
}

const reloadBalance = () => {
  updateBalance(balance.value + 1000)
  alert('Balance reloaded (+1000)!')
}

const startTimer = () => {
  clearInterval(timerInterval)
  timeLeft.value = 15
  activeTopSlot.value = null
  winMultiplier.value = null
  timerInterval = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval)
      lockAndSpin()
    }
  }, 1000)
}

const placeBet = (type) => {
  if (spinning.value || topSlotSpinning.value || timeLeft.value <= 0) return

  // Check if balance covers current bets + new bet (without deduction yet)
  if (balance.value >= totalBet.value + selectedChip.value) {
    bets[type] = Number(((bets[type] || 0) + selectedChip.value).toFixed(2))
  }
}

const clearBets = () => {
  if (spinning.value || topSlotSpinning.value || timeLeft.value <= 0) return
  betTypes.forEach((type) => (bets[type] = 0))
}

const lockAndSpin = () => {
  // Deduct bets now
  if (totalBet.value > 0) {
    updateBalance(balance.value - totalBet.value)
  }

  topSlotSpinning.value = true
  // 1. Spin Top Slot
  if (topSlotRef.value) {
    topSlotRef.value.spin()
  } else {
    // Fallback if ref missing
    spinning.value = true
    wheelRef.value.spin()
  }
}

const handleTopSlotResult = (result) => {
  topSlotSpinning.value = false
  activeTopSlot.value = result

  // 2. Spin Wheel after Top Slot matches
  spinning.value = true
  if (wheelRef.value) {
    // Delay slightly to let user see the top slot result
    setTimeout(() => {
      wheelRef.value.spin()
    }, 1000)
  }
}

const handleResult = (result) => {
  // Process Payouts
  let payout = 0
  const betOnResult = bets[result.label]

  // Check Top Slot Match
  let multiplier = 1
  if (
    activeTopSlot.value &&
    activeTopSlot.value.isMatch &&
    activeTopSlot.value.target.label === result.label
  ) {
    multiplier = activeTopSlot.value.multiplier
    winMultiplier.value = multiplier // For display
  }

  if (result.type === 'value') {
    if (betOnResult > 0) {
      // Standard Payout: Bet + (Bet * Odds)
      // Top Slot Logic: Bet + (Bet * Odds * Multiplier)
      // e.g. Bet 10 on "10". Top Slot 5x on "10". Payout = 10 + (10 * 10 * 5) = 510.

      const odds = result.value
      const totalOdds = odds * multiplier

      payout = Number((betOnResult + betOnResult * totalOdds).toFixed(2))
      updateBalance(balance.value + payout)

      // SHOW WIN
      winAmount.value = payout
      showWin.value = true
    }
  } else {
    // Minigame
    if (betOnResult > 0) {
      // Pass multiplier to minigame
      if (multiplier > 1) {
        localStorage.setItem('activeMultiplier', multiplier)
      } else {
        localStorage.removeItem('activeMultiplier')
      }
      router.push(`/minigame/${result.id}`)
      return // Timer will stop since we navigate away
    }
  }

  // Reset for next round
  setTimeout(() => {
    showWin.value = false
    winAmount.value = 0
    activeTopSlot.value = null
    topSlotSpinning.value = false
    spinning.value = false
    winMultiplier.value = null
    betTypes.forEach((type) => (bets[type] = 0))
    startTimer()
  }, 5000) // 5 seconds to celebrate
}

// ... Settings & Logout Logic ...
const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('username')
    localStorage.removeItem('password')
    router.push('/')
  }
}

const openSettings = () => {
  settingsForm.value.username = localStorage.getItem('username') || ''
  settingsForm.value.password = ''
  settingsForm.value.confirmPassword = ''
  showPassword.value = false
  showSettings.value = true
}

const closeSettings = () => {
  showSettings.value = false
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const saveSettings = () => {
  if (settingsForm.value.username.trim()) {
    localStorage.setItem('username', settingsForm.value.username)
  }
  if (settingsForm.value.password) {
    if (settingsForm.value.password !== settingsForm.value.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    localStorage.setItem('password', settingsForm.value.password)
  }
  alert('Settings saved!')
  closeSettings()
  window.location.reload()
}
</script>

<template>
  <div class="game-container">
    <!-- User Info floating top-right -->
    <div class="user-info">
      <span>{{ username }}</span>
      <button class="btn btn-icon" @click="openSettings" title="Settings">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          ></path>
        </svg>
      </button>
      <button class="btn btn-logout" @click="logout">Logout</button>
    </div>

    <!-- Balance Display Top Left -->
    <div class="balance-display">
      <div>
        Balance: <span class="val">{{ formatCurrency(balance) }}</span>
        <button class="btn-reload" @click="reloadBalance" title="Add Money">+</button>
      </div>
      <div>
        Current Bet: <span class="val">{{ formatCurrency(totalBet) }}</span>
      </div>
    </div>

    <div class="game-content">
      <!-- Big Center Timer -->
      <div v-if="!spinning && !topSlotSpinning && timeLeft > 0" class="timer-overlay">
        <div class="timer-text">{{ timeLeft }}</div>
        <div class="timer-label">PLACE YOUR BETS</div>
      </div>

      <!-- WIN OVERLAY -->
      <div v-if="showWin" class="win-overlay">
        <div class="win-title">YOU WON</div>
        <div class="win-amount">{{ formatCurrency(winAmount) }}</div>
        <div v-if="winMultiplier" class="win-multiplier">({{ winMultiplier }}X MATCH)</div>
      </div>

      <!-- Status Box -->
      <div class="game-status" :class="{ 'status-spinning': spinning || topSlotSpinning }">
        {{ gameStatus }}
      </div>

      <!-- Top Slot Area -->
      <TopSlot ref="topSlotRef" @spin-end="handleTopSlotResult" />

      <div class="wheel-area">
        <Wheel ref="wheelRef" @result="handleResult" />
      </div>

      <!-- Betting Grid Controls -->
      <div class="betting-area">
        <ChipSelector :modelValue="selectedChip" @select-chip="selectedChip = $event" />
        <BettingGrid
          :bets="bets"
          :topSlotMatch="activeTopSlot && activeTopSlot.isMatch ? activeTopSlot : null"
          @place-bet="placeBet"
        />
        <div class="action-buttons">
          <button
            class="btn-clear"
            @click="clearBets"
            :disabled="spinning || topSlotSpinning || totalBet === 0 || timeLeft <= 0"
          >
            Clear Bets
          </button>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="modal-overlay" @click="closeSettings">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Settings</h3>
          <button class="close-btn" @click="closeSettings">&times;</button>
        </div>
        <div class="modal-body">
          <!-- Form content same as before -->
          <form @submit.prevent="saveSettings">
            <div class="form-group">
              <label>Username</label>
              <input v-model="settingsForm.username" type="text" placeholder="Username" required />
            </div>
            <div class="form-group">
              <label>New Password</label>
              <div class="password-wrapper">
                <input
                  v-model="settingsForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="New Password"
                />
                <button type="button" class="eye-btn" @click="togglePasswordVisibility">
                  <span v-if="!showPassword">👁️</span><span v-else>🔒</span>
                </button>
              </div>
            </div>
            <div class="form-group" v-if="settingsForm.password">
              <label>Confirm Password</label>
              <div class="password-wrapper">
                <input
                  v-model="settingsForm.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-save">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.game-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a0a0a 0%, #4a0000 50%, #1a0a0a 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: hidden;
  position: relative;
}
.user-info {
  position: absolute;
  top: 2rem;
  right: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 100;
}
.user-info span {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin-right: 0.5rem;
}

.balance-display {
  position: absolute;
  top: 2rem;
  left: 2.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  gap: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 90;
}
.balance-display .val {
  color: #ffd966;
}
.btn-reload {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  vertical-align: middle;
}
.btn-reload:hover {
  background: #45a049;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}
.btn-icon {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffd966;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
.btn-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}
.btn-logout {
  background-color: rgba(255, 107, 107, 0.9);
  color: white;
  backdrop-filter: blur(4px);
}
.btn-logout:hover {
  background-color: #ee5a52;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem;
  padding-top: 80px;
  padding-bottom: 50px;
  width: 100%;
}

.timer-overlay {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  text-align: center;
  pointer-events: none;
}
.timer-text {
  font-size: 8rem;
  font-weight: 900;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
  line-height: 1;
  animation: pop 1s infinite;
}
.timer-label {
  font-size: 2rem;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 0, 0, 1);
}
@keyframes pop {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.win-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 60;
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 40px 60px;
  border-radius: 20px;
  border: 4px solid #ffd700;
  box-shadow: 0 0 50px #ffd700;
  animation: shine 0.5s infinite alternate;
}
.win-title {
  font-size: 3rem;
  color: #fff;
  font-weight: 900;
  text-shadow: 0 0 10px #ffd700;
}
.win-amount {
  font-size: 5rem;
  color: #ffd700;
  font-weight: 900;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}
.win-multiplier {
  font-size: 2rem;
  color: #ff4500;
  font-weight: bold;
  margin-top: 10px;
}
@keyframes shine {
  from {
    box-shadow: 0 0 20px #ffd700;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    box-shadow: 0 0 60px #ffd700;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.game-status {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 30px;
  border-radius: 50px;
  border: 2px solid #ffd700;
}
.status-spinning {
  color: #ffd700;
  border-color: #ff4500;
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.wheel-area {
  flex: 0 0 auto;
  margin-bottom: 20px;
}
.betting-area {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
}
.btn-clear {
  background: #ff4757;
  color: white;
  padding: 10px 40px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  font-size: 1.2rem;
  transition: all 0.3s;
}
.btn-clear:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4);
}
.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Styles Reuse */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}
.modal {
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  border: 1px solid #444;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  color: white;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.modal-header h3 {
  font-size: 1.5rem;
  color: #ffd966;
}
.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 2rem;
  cursor: pointer;
}
.close-btn:hover {
  color: white;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #ccc;
  font-size: 0.9rem;
}
.form-group input {
  width: 100%;
  padding: 0.8rem;
  background: #333;
  border: 1px solid #555;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
}
.form-group input:focus {
  outline: none;
  border-color: #ffd966;
}
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.eye-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #aaa;
  padding: 0;
}
.eye-btn:hover {
  color: white;
}
.btn-save {
  background: linear-gradient(to right, #ffd966, #ffc107);
  color: #333;
  width: 100%;
  margin-top: 1rem;
}
.btn-save:hover {
  background: linear-gradient(to right, #ffc107, #ffb300);
}
</style>
