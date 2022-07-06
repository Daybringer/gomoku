<script lang="ts">
import DarkContainer from "@/components/DarkContainer.vue";
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import BaseBoldHeadline from "@/components/BaseBoldHeadline.vue";
import TestComponent from "@/components/TestComponent.vue";
import { defineComponent } from "vue";
export default defineComponent({
  data(): { projectName: string; projectNames: string[] } {
    return {
      projectName: "",
      projectNames: [],
    };
  },
  components: {
    DarkContainer,
    ViewBaseFixedHeight,
    BaseBoldHeadline,
    TestComponent,
  },
  name: "Test",
  methods: {
    addProject() {
      this.projectNames.push(this.projectName);
    },
  },
});
</script>
<template>
  <view-base-fixed-height :placeItems="'start'">
    <div>
      <base-bold-headline class="text-center">Moje projekty</base-bold-headline>
      <input
        v-model="projectName"
        type="text"
        name="projectName"
        id="projectName"
      />
      <button
        @click="addProject"
        class="border-2 bg-gray-200 rounded-full text-2xl font-bold p-4"
      >
        +
      </button>
      <div class="flex flex-col">
        <test-component
          v-for="project in projectNames"
          :key="project"
          :projectName="project"
        ></test-component>
      </div>
    </div>
  </view-base-fixed-height>
</template>
<style scoped></style>
