<template>
  <div
    class="bg-white dark:bg-gray-500 w-full rounded-full h-12 flex flex-row items-center justify-between overflow-hidden shadow-md"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7.684 7.684"
      class="h-8 ml-4 pr-2"
      v-if="symbol === 'cross'"
    >
      <g
        id="cross"
        transform="rotate(33.203 -466.024 -176.195)"
        :fill="symbolColor"
        paint-order="markers fill stroke"
      >
        <rect
          transform="rotate(-168.89)"
          ry="0"
          y="277.865"
          x="28.526"
          height="9.29"
          width="1.484"
        ></rect>
        <rect
          transform="rotate(-78.89)"
          ry="0"
          y="-33.912"
          x="281.768"
          height="9.29"
          width="1.484"
        ></rect>
      </g>
    </svg>
    <svg
      v-if="symbol === 'circle'"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 6.8557348 7.1098857"
      class="h-8 ml-4 pr-2"
    >
      <ellipse
        id="circle"
        cx="113.29025"
        cy="147.48361"
        rx="2.984288"
        ry="3.1113634"
        fill="none"
        :stroke="symbolColor"
        stroke-width=".887159"
        stroke-linejoin="round"
        paint-order="markers fill stroke"
        transform="translate(-109.86239 -143.92867)"
      ></ellipse>
    </svg>

    <svg
      v-if="symbol == ''"
      class="h-8 ml-4 pr-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#000000"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>

    <div class="flex-1 text-center text-xl text-gray-900 dark:text-gray-100">
      {{ humanReadableTime }}
    </div>
    <div class="flex-1 text-center text-xl text-gray-900 dark:text-gray-100">
      {{ nickname }}
    </div>
    <div
      class=" hover:bg-gray-300 dark:hover:bg-gray-400 cursor-pointer w-16 rounded-full h-full flex justify-between"
    >
      <img
        class="m-auto h-80 w-auto align-middle"
        alt="user_icon"
        src="../assets/samurai_blue.svg"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SocialBlade",
  props: {
    symbol: String,
    symbolColor: String,
    time: Number,
    nickname: String,
  },
  computed: {
    humanReadableTime(this: any) {
      const time = Math.floor(this.time / 1000);
      return `${Math.floor(time / 60)}:${
        time % 60 == 0 ? "00" : time % 60 < 10 ? "0" + time : time % 60
      }`;
    },
  },
  components: {},
  data() {
    return {};
  },
  methods: {},
});
</script>
<style scoped></style>
