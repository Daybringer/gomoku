<template>
  <div class="fixed bottom-4 mx-auto">Some text</div>
</template>
<script lang="ts">
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import { defineComponent, PropType } from "vue";
export default defineComponent({
  props: {
    UUID: { type: String, required: true },
    type: { type: Object as PropType<NotificationType>, required: true },
    text: { type: String, required: true },
    duration: { type: Number, required: true },
    autoDismiss: { type: Boolean, required: true },
    imageName: String,
  },
  components: {},
  data(): {} {
    return {};
  },
  computed: {},
  methods: {
    selfClose() {
      const store = useNotificationsStore();
      store.removeNotification(this.UUID);
    },
  },
  mounted() {},
});
</script>
<style scoped></style>
