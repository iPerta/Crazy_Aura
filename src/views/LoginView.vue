<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Welcome</h1>
      <p>Login or Register to start the game!</p>

      <div class="buttons">
        <button class="login-btn" @click="openLogin">Login</button>
        <button class="register-btn" @click="openRegister">Register</button>
      </div>
    </div>

    <!-- Login Modal -->
    <div v-if="showLogin" class="modal-overlay" @click="closeLogin">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Login</h2>
          <button class="close-btn" @click="closeLogin">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="login-username">Username:</label>
              <input id="login-username" v-model="loginForm.username" type="text" placeholder="Enter username" required />
            </div>
            <div class="form-group">
              <label for="login-password">Password:</label>
              <input id="login-password" v-model="loginForm.password" type="password" placeholder="Enter password" required />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-cancel" @click="closeLogin">Cancel</button>
              <button type="submit" class="btn btn-submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <div v-if="showRegister" class="modal-overlay" @click="closeRegister">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Register</h2>
          <button class="close-btn" @click="closeRegister">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="register-username">Username:</label>
              <input id="register-username" v-model="registerForm.username" type="text" placeholder="Enter username" required />
            </div>
            <div class="form-group">
              <label for="register-password">Password:</label>
              <input id="register-password" v-model="registerForm.password" type="password" placeholder="Enter password" required />
            </div>
            <div class="form-group">
              <label for="register-confirm">Confirm Password:</label>
              <input id="register-confirm" v-model="registerForm.confirm" type="password" placeholder="Confirm password" required />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-cancel" @click="closeRegister">Cancel</button>
              <button type="submit" class="btn btn-submit">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '../assets/css/login.css'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  openLogin as openLoginFn,
  closeLogin as closeLoginFn,
  openRegister as openRegisterFn,
  closeRegister as closeRegisterFn,
  handleLogin as handleLoginFn,
  handleRegister as handleRegisterFn
} from '../assets/js/login.js'

const router = useRouter()
const showLogin = ref(false)
const showRegister = ref(false)
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', password: '', confirm: '' })

function openLogin() {
  openLoginFn(showLogin, loginForm)
}

function closeLogin() {
  closeLoginFn(showLogin)
}

function openRegister() {
  openRegisterFn(showRegister, registerForm)
}

function closeRegister() {
  closeRegisterFn(showRegister)
}

function handleLogin() {
  handleLoginFn(loginForm, router)
}

function handleRegister() {
  handleRegisterFn(registerForm, router)
}
</script>
