<template>
  <span
    class="loader border-4 h-14 w-14 border-gray-700 dark:border-gray-300"
  ></span>
</template>
<style scoped>
.loader {
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
