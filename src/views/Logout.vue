<template>
  <div>
    <h1 class="greeting">Logged out</h1>
  </div>
</template>
<script>
export default {
  name: "Logout",
  mounted() {
    this.$store.dispatch("AUTH_LOGOUT");
  },
};
</script>
<style scoped>
.greeting {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  font-size: 5rem;
  color: #2e4052;
}
</style>
