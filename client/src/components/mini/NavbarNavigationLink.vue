<template>
  <router-link
    :to="to"
    :class="classObject"
    class="ml-4 px-3 py-2 border-2  rounded-md text-sm font-semibold leading-5  focus:outline-none  transition duration-150 ease-in-out"
    ><slot></slot
  ></router-link>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
export default defineComponent({
  name: "NavbarNavigationLink",
  props: {
    active: Boolean,
    to: String,
    type: {
      type: String,
      validator: (val: string) => {
        return ["primary", "secondary"].indexOf(val) !== -1;
      }
    }
  },
  computed: {
    classObject(): {} {
      return {
        // Primary
        "border-gomoku-blue": this.type == "primary",
        "text-gray-300": this.type == "primary",
        "hover:bg-gomoku-blue": this.type == "primary",
        "hover:text-gray-800": this.type == "primary",
        "focus:bg-gomoku-blue": this.type == "primary",
        "focus:text-gray-800": this.type == "primary",
        // Primary Active
        "bg-gomoku-blue": this.active && this.type == "primary",
        "hover:bg-gomoku-blue-dark": this.active && this.type == "primary",
        "hover:border-gomoku-blue-dark": this.active && this.type == "primary",
        "text-gray-800": this.active && this.type == "primary",
        // Secondary
        "focus:bg-gray-700": this.type == "secondary",
        "focus:text-gray-50": this.type == "secondary",
        "hover:bg-gray-700": this.type == "secondary",
        "hover:text-gray-50": this.type == "secondary",
        "text-gray-200": this.type == "secondary",
        "border-transparent": this.type == "secondary",
        // Secondary Active
        "bg-gray-900": this.active && this.type == "secondary"
      };
    }
  }
});
</script>
