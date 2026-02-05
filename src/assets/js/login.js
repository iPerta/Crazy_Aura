// Functions that operate on Vue refs and a router instance.
// Each function receives refs (showLogin, loginForm, etc.) and the router when needed.

export function openLogin(showLoginRef, loginFormRef) {
  showLoginRef.value = true
  loginFormRef.value = { username: '', password: '' }
}

export function closeLogin(showLoginRef) {
  showLoginRef.value = false
}

export function openRegister(showRegisterRef, registerFormRef) {
  showRegisterRef.value = true
  registerFormRef.value = { username: '', password: '', confirm: '' }
}

export function closeRegister(showRegisterRef) {
  showRegisterRef.value = false
}

export function handleLogin(loginFormRef, router) {
  const data = loginFormRef.value
  if (!data.username || !data.password) {
    alert('Please enter username and password')
    return
  }
  // TODO: replace with real auth call
  localStorage.setItem('username', data.username)
  alert(`Login successful!\nWelcome ${data.username}`)
  router.push('/game')
}

export function handleRegister(registerFormRef, router) {
  const data = registerFormRef.value
  if (!data.username || !data.password) {
    alert('Please fill all fields')
    return
  }
  if (data.password !== data.confirm) {
    alert('Passwords do not match!')
    return
  }
  // TODO: replace with real registration call
  localStorage.setItem('username', data.username)
  alert(`Registration successful!\nWelcome ${data.username}`)
  router.push('/game')
}
