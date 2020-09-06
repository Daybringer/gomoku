<template>
  <div class="modal-base" :class="modalContainer">
    <img v-if="modalState !== 'none'" />
    <i
      v-if="modalState !== 'none'"
      @click="closeModal"
      class="fa fa-times fa-3x backIconJoin"
      aria-hidden="true"
    ></i>
  </div>
</template>

<script>
export default {
  name: "GifModal",
  props: ["modalState"],
  computed: {
    modalContainer() {
      return this.modalState === "none" ? "modalHidden" : "modalShowed";
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.modal-base {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1001;
  transition: all 0.25s;
}
.modalHidden {
  width: 0;
  height: 0;
}
.modalShowed {
  background-color: aqua;
  margin-left: -1px;
  width: 100vw;
  height: 100vh;
}
.backIconJoin {
  background-color: none;
  color: #363636;
  padding: 1rem;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
