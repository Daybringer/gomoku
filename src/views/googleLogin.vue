<template> <div></div></template>

<script>
export default {
  name: "GoogleLogin",
  mounted() {
    this.$store.dispatch("saveToken", this.$route.query.token);
    this.$router.push("/");
  },
};
</script>

<style></style>
