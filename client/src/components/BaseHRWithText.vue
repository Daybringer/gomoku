<template>
  <div
    class="separator mt-8 flex items-center text-center leading-5 text-gray-700 dark:text-gray-200"
  >
    <slot></slot>
  </div>
</template>
<style scoped>
.separator::before,
.separator::after {
  content: "";
  flex: 1;
  @apply border-current;
  @apply border-b-2;
}
.separator::before {
  margin-right: 1em;
}
.separator::after {
  margin-left: 1em;
}
</style>
