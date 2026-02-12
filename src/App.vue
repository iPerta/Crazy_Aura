<template>
  <router-view />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Outfit:wght@300;400;600;900&display=swap');

/* Global styles to remove white borders */
html,
body {
  margin: 0;
  padding: 0;
  background: #1a0a0a; /* Match game background to prevent white flashes */
  overflow-x: hidden;
  height: 100%;
  font-family: 'Outfit', sans-serif;
}

#app {
  height: 100%;
}
</style>
