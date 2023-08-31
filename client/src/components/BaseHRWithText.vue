<template>
  <div class="separator flex items-center text-center leading-5">
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
