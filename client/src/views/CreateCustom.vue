<template>
  <view-base-fixed-height :placeItems="'start'">
    <div class="flex-1 py-8 px-4 gap-4 flex flex-col">
      <base-bold-headline class="mb-4">Custom game</base-bold-headline>
      <img
        src="@/assets/svg/puzzle.svg"
        class="h-20 md:h-32 absolute left-2 md:left-10 top-20"
        alt=""
      />
      <hr
        class="m3 border-2 w-full md:w-80 self-center rounded border-gray-500"
      />
      <div
        class="w-full md:w-80 gap-4 self-center justify-around flex-1 flex flex-col md:flex-row"
      >
        <div class="flex flex-col gap-4">
          <base-mid-headline class="my-2">Opening type</base-mid-headline>
          <div class="flex flex-row gap-6">
            <base-toggle-button
              @toggle="openingRadio('standard')"
              :toggled="opening === 'standard'"
            >
              <span class="md:text-xl">Standard</span>
            </base-toggle-button>
            <base-toggle-button
              @toggle="openingRadio('swap1')"
              :toggled="opening === 'swap1'"
            >
              <span class="md:text-xl">SWAP1</span>
            </base-toggle-button>
            <base-toggle-button
              @toggle="openingRadio('swap2')"
              :toggled="opening === 'swap2'"
            >
              <span class="md:text-xl">SWAP2</span>
            </base-toggle-button>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <base-mid-headline class="my-2">Time limit</base-mid-headline>
          <div class="flex flex-row gap-6">
            <base-toggle-button
              @toggle="timeRadio('3')"
              :toggled="time === '3'"
            >
              <span class="md:text-xl">3min</span>
            </base-toggle-button>
            <base-toggle-button
              @toggle="timeRadio('5')"
              :toggled="time === '5'"
            >
              <span class="md:text-xl">5m</span>
            </base-toggle-button>
            <base-toggle-button
              @toggle="timeRadio('10')"
              :toggled="time === '10'"
            >
              <span class="md:text-xl">10m</span>
            </base-toggle-button>
            <base-toggle-button
              @toggle="timeRadio('infinity')"
              :toggled="time === 'infinity'"
            >
              <infinity-icon-svg class="h-6 md:h-8" />
            </base-toggle-button>
          </div>
        </div>
      </div>
      <hr class="m-3 border-2 rounded border-gray-500" />
      <base-button class="w-60 self-center text-xl">Create game</base-button>
    </div>
  </view-base-fixed-height>
</template>
<script lang="ts">
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import BaseLowHeadline from "@/components/BaseLowHeadline.vue";
import BaseMidHeadline from "@/components/BaseMidHeadline.vue";
import BaseBoldHeadline from "@/components/BaseBoldHeadline.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseToggleButton from "@/components/BaseToggleButton.vue";
import InfinityIconSvg from "@/assets/svg/InfinityIconSvg.vue";
import { defineComponent } from "vue";

type Opening = "standard" | "swap1" | "swap2";
type Time = "3" | "5" | "10" | "infinity";
export default defineComponent({
  name: "CreateCustom",
  props: {},
  components: {
    ViewBaseFixedHeight,
    BaseButton,
    BaseLowHeadline,
    BaseBoldHeadline,
    BaseMidHeadline,
    BaseToggleButton,
    InfinityIconSvg,
  },
  data(): { opening: Opening; time: Time } {
    return { opening: "standard", time: "5" };
  },
  computed: {},
  methods: {
    openingRadio(opening: Opening) {
      this.opening = opening;
    },
    timeRadio(time: Time) {
      this.time = time;
    },
  },
  mounted() {},
});
</script>
<style scoped></style>
