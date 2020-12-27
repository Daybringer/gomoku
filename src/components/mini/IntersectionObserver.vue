<template>
  <div class="observer h-px w-px block bg-transparent" />
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      observer: null,
    };
  },
  mounted() {
    this.observer = new IntersectionObserver(this.onIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    });

    this.observer.observe(this.$el);
  },

  unmounted() {
    this.observer.disconnect();
    this.observer = null;
  },

  methods: {
    onIntersect(event) {
      const isIntersecting = event.find((entry) => {
        return entry.isIntersecting;
      });
      if (isIntersecting) {
        this.$emit("intersect", event);
      }
    },
  },
});
</script>
