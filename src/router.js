import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import GameView from '@/views/GameView.vue'
import Minigame1 from '@/views/Minigame1.vue'
import Minigame2 from '@/views/Minigame2.vue'
import Minigame3 from '@/views/Minigame3.vue'
import Minigame4 from '@/views/Minigame4.vue'

const routes = [
  {
    path: '/',
    component: LoginView
  },
  {
    path: '/game',
    component: GameView
  }
  ,
  { path: '/minigame/1', component: Minigame1 },
  { path: '/minigame/2', component: Minigame2 },
  { path: '/minigame/3', component: Minigame3 },
  { path: '/minigame/4', component: Minigame4 }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
