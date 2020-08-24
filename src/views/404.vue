<template>
  <div>
    <h1 class="heading">
      404 <br />
      page doesn't exist
    </h1>
  </div>
</template>
<script>
export default {
  name: "PageMissing",
  components: {},
  mounted() {},
  data() {
    return {};
  },
};
</script>
<style scoped>
.heading {
  position: absolute;
  top: 30vh;
  left: 50%;
  transform: translate(-50%, 0);
  color: #363636;
  white-space: nowrap;
  font-size: 1.5rem;
  text-align: center;
}
</style>
