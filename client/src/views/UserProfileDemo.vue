<script lang="ts">
// Components
import ViewBase from "@/components/ViewBase.vue";
import RowToMobileStackedLayout from "@/layouts/RowToMobileStackedLayout.vue";
import RowToMobileStackedColumn from "@/layouts/RowToMobileStackedColumn.vue";
import BaseBoldHeadline from "@/components/BaseBoldHeadline.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "UserProfileDemo",
  components: {
    ViewBase,
    RowToMobileStackedLayout,
    RowToMobileStackedColumn,
    BaseBoldHeadline,
  },
});
</script>
<template
  ><view-base
    ><row-to-mobile-stacked-layout
      ><row-to-mobile-stacked-column
        ><div class="border-2 bg-gray-700 w-full h-full">
          <base-bold-headline>text</base-bold-headline>
          <base-bold-headline>text</base-bold-headline>
          <base-bold-headline>text</base-bold-headline>
          <base-bold-headline class="mt-32  mb-60">text</base-bold-headline>
          <base-bold-headline>text</base-bold-headline>
          <base-bold-headline class="mt-32  mb-60">text</base-bold-headline>
          <base-bold-headline>text</base-bold-headline>
        </div>
      </row-to-mobile-stacked-column>
      <row-to-mobile-stacked-column
        ><div class="border-2 bg-gray-700 w-full h-full"></div
      ></row-to-mobile-stacked-column>
    </row-to-mobile-stacked-layout> </view-base
></template>
<style scoped></style>
