<template>
  <div class="modal-base" :class="modalContainer">
    <video
      autoplay
      loop
      muted
      playsinline
      v-if="modalState === 'basics'"
      class="responsiveGif"
    >
      <source src="../static/basics.webm" type="video/webm" />
    </video>
    <video
      autoplay
      loop
      muted
      playsinline
      v-if="modalState !== 'none'"
      class="responsiveGif"
    >
      <source src="../static/basics.webm" type="video/webm" />
    </video>
    <video
      autoplay
      loop
      muted
      playsinline
      v-if="modalState !== 'none'"
      class="responsiveGif"
    >
      <source src="../static/basics.webm" type="video/webm" />
    </video>
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
.responsiveGif {
  width: 100%;
  padding: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modal-base {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1001;
  transition: all 0.25s ease-out;
  border: 2px solid #363636;
}
.modalHidden {
  width: 0;
  height: 0;
}
.modalShowed {
  background-color: white;
  margin-left: -1px;
  width: calc(100vw + 1px);
  height: 100vh;
}
.backIconJoin {
  background-color: none;
  color: #00b3fe;
  padding: 1rem;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
