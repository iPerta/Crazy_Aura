<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Wheel from '@/components/Wheel.vue'

const router = useRouter()

const username = computed(() => {
  return localStorage.getItem('username') || 'Player'
})

const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('username')
    router.push('/')
  }
}
</script>

<template>
  <div class="game-container">
    <div class="navbar">
      <h1>Crazy Aura</h1>
      <div class="user-info">
        <span>{{ username }}</span>
        <button class="btn btn-logout" @click="logout">Logout</button>
      </div>
    </div>

    <div class="game-content">
      <h2>Crazy Wheel</h2>
      <p>Spin the wheel to play minigames or win values.</p>
      <div class="wheel-area">
        <Wheel />
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
  height: 100vh;
  background: linear-gradient(135deg, #1a0a0a 0%, #4a0000 50%, #1a0a0a 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  background: linear-gradient(90deg, #b22222 0%, #8b0000 100%);
  border-bottom: 3px solid #FFD966;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.navbar h1 {
  color: white;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info span {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
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

.btn-logout {
  background-color: #ff6b6b;
  color: white;
}

.btn-logout:hover {
  background-color: #ee5a52;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.game-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.game-content h2 {
  color: #FFD966;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  font-weight: 800;
}

.game-content p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.3rem;
  margin-bottom: 3rem;
  font-weight: 500;
}

.wheel-area {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.game-card {
  background-color: white;
  border-radius: 0.8rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.game-card h3 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.game-card:hover h3 {
  color: white;
}

.game-card p {
  color: #666;
  margin: 0;
}

.game-card:hover p {
  color: rgba(255, 255, 255, 0.9);
}
</style>
