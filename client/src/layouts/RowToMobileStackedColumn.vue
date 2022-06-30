<template>
  <div
    class="flex-1 flex flex-col md:overflow-auto border-1 shadow-lg rounded-xl border-gray-700"
  >
    <slot></slot>
  </div>
</template>
<style scoped>
.custom-shadow {
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.75);
}
</style>
