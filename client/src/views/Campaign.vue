<template>
  <ViewBaseResponsive
    style="padding-left: 0; padding-right: 0; padding-bottom: 0"
  >
    <div class="w-full">
      <CampaignSvg />
    </div>
  </ViewBaseResponsive>
</template>
<style scope>
.all-full-opacity {
  opacity: 1;
}
.all-small-opacity {
  opacity: 0.2;
}
.stroke-full-opacity {
  stroke-opacity: 1;
}
.stroke-small-opacity {
  stroke: gray !important;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  stroke-opacity: 0.7;
}
</style>
<script setup lang="ts">
import { Ref, onMounted, ref } from "vue";
import { SVG, Runner } from "@svgdotjs/svg.js";
import CampaignSvg from "@/components/CampaignSvg.vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";

const forkFlipped = ref(false);

const milestones = 9;
const paths = 12;
const icons = 4;

const svg: Ref<{ path: boolean[]; milestone: boolean[]; icon: boolean[] }> =
  ref({
    path: Array(paths).fill(false),
    milestone: Array(milestones).fill(false),
    icon: Array(icons).fill(false),
  });

enum ObjType {
  Path,
  Icon,
  Milestone,
}

enum IDs {
  topClouds = "#topClouds",
  fishLeft1 = "#fishLeft1",
  fishLeft2 = "#fishLeft2",
  fishRight1 = "#fishRight1",
  fishRight2 = "#fishRight2",
  fishRight3 = "#fishRight3",
  fishRight4 = "#fishRight4",
  gardenFork1 = "#gardenFork1",
  scarescrow1 = "#scarescrow1",
  rotateFlower1 = "#rotateFlower1",
  rotateFlower2 = "#rotateFlower2",
  rotateFlower3 = "#rotateFlower3",
  dancer1 = "#dancer1",
  dancer2 = "#dancer2",
  sTwoCloud1 = "#sTwoCloud1",
  sTwoCloud2 = "#sTwoCloud2",
  hiker = "#hiker",
  leaves1 = "#leaves1",
  leaves2 = "#leaves2",
  leaves3 = "#leaves3",
  warrior1 = "#warrior1",
  warrior2 = "#warrior2",
  warriorArm1 = "warriorArm1",
  warriorArm2 = "warriorArm2",
  man1 = "#man1",
  man2 = "#man2",
  flowerDecorationR1 = "#flowerDecorationR1",
  flowerDecorationR2 = "#flowerDecorationR2",
  flowerDecorationL1 = "#flowerDecorationL1",
  flowerDecorationL2 = "#flowerDecorationL2",
}

/**
 *
 Adheres to ObjectType.Index notation f.e.: Milestone.2 <br>
ObjectType options: 'Icon','Milestone','Path' <br>
Index starts from 0
 */
function parseSvgID(svgID: string) {
  const result: { index: number; objType: ObjType } = {
    index: 0,
    objType: ObjType.Path,
  };

  return result;
}

function isLastCleared(objType: ObjType.Milestone | ObjType.Icon, originID) {
  const id = originID - 1;
  if (objType === ObjType.Milestone) {
    return (
      svg.value.milestone.length === originID ||
      svg.value.milestone[originID] === false
    );
  } else {
    return (
      svg.value.icon.length === originID || svg.value.icon[originID] === false
    );
  }
}

function getStyle(objType: ObjType, originID: number) {
  const id = originID - 1;

  switch (objType) {
    case ObjType.Path:
      if (svg.value.path[id]) {
        return `stroke-full-opacity`;
      } else {
        return `stroke-small-opacity`;
      }
    case ObjType.Icon:
      if (svg.value.icon[id]) {
        return `stroke-full-opacity ${
          isLastCleared(ObjType.Icon, originID) ? "clickable" : ""
        }`;
      } else {
        return `stroke-small-opacity`;
      }
    case ObjType.Milestone:
      if (svg.value.milestone[id]) {
        return `stroke-full-opacity ${
          isLastCleared(ObjType.Milestone, originID) ? "clickable" : ""
        }`;
      } else {
        return `stroke-small-opacity`;
      }
    default:
      return "";
  }
}

onMounted(() => {
  const svg = SVG("#svg5");
  // Top clouds
  svg
    .find(IDs.topClouds)[0]
    .animate(2000)
    .transform({ translateX: -2 }, true)
    .loop(undefined, true);
  // Flying fishes
  svg
    .find(IDs.fishRight2)[0]
    .transform({ rotate: -5, origin: "right" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "right" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.fishRight1)[0]
    .transform({ rotate: -5, origin: "right" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "right" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.fishRight3)[0]
    .transform({ rotate: -5, origin: "right" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "right" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.fishRight4)[0]
    .transform({ rotate: -5, origin: "right" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "right" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.fishLeft1)[0]
    .transform({ rotate: -5, origin: "right" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "right" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.fishLeft2)[0]
    .transform({ rotate: -5, origin: "right" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "right" }, true)
    .loop(undefined, true);
  // Garden fork
  svg
    .find(IDs.gardenFork1)[0]
    .css("cursor", "pointer")
    .click(function () {
      forkFlipped.value = !forkFlipped.value;
      if (forkFlipped.value) {
        //@ts-ignore
        this.animate(1000).transform(
          { rotate: -200, translateX: -2.5, skewX: -3 },
          true
        );
      } else {
        //@ts-ignore
        this.animate(1000).transform(
          { rotate: 200, translateX: 2.5, skewX: 3 },
          true
        );
      }
    });
  // Scarecrow
  svg
    .find(IDs.scarescrow1)[0]
    .css("cursor", "pointer")
    .click(function () {
      //@ts-ignore
      this.animate(400).transform({ flip: "x", translateY: -3 }, true);
      //@ts-ignore
      this.animate(300).transform({ translateY: 3 }, true);
      // //@ts-ignore
    });
  // Hiker

  const hiker = svg.find(IDs.hiker)[0];
  hiker.css("cursor", "pointer");
  const hikerPos = [hiker.x(), hiker.y()];

  hiker.click(function () {
    //@ts-ignore
    this.animate(3000)
      .transform({ translate: [8.8, -7] }, true)
      .animate(200)
      .transform({ rotate: -5 }, true)
      .animate(1000)
      .transform({ translate: [2.5, -3] }, true)
      .animate(200)
      .transform({ rotate: 5 }, true)
      .animate(500)
      .transform({ translate: [3, -1.5], rotate: 35 }, true)
      .animate(300)
      .transform({ translateY: -5 }, true)
      .ease(">")
      .animate(300)
      .transform({ translateY: 5 }, true)
      .ease("<")
      .animate(100, 800)
      .transform({ flip: "x" }, true)
      .animate(1000, 500)
      .transform({ translate: [-3, 1.5], rotate: -45 }, true)
      .animate(1000, 500)
      .transform({ translate: [-3, 4] }, true)
      .animate(1000, 500)
      .transform({ translate: [-7, 6], rotate: 15 }, true)
      .animate(400)
      .transform({ translateX: -2, rotate: -18 }, true);
  });

  const warrior1 = svg.find(IDs.warrior1)[0];
  warrior1.css("cursor", "pointer");

  svg
    .find(IDs.rotateFlower1)[0]
    .animate(3000)
    .transform({ rotate: -360 }, true)
    .loop(undefined, true, 600);
  svg
    .find(IDs.rotateFlower2)[0]
    .animate(4000)
    .transform({ rotate: 360 }, true)
    .loop(undefined, true, 600);
  svg
    .find(IDs.rotateFlower3)[0]
    .animate(3500)
    .transform({ rotate: -360 }, true)
    .loop(undefined, true, 600);

  svg
    .find(IDs.leaves1)[0]
    .transform({ rotate: -5, origin: "bottom left" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "bottom left" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.leaves2)[0]
    .transform({ rotate: -5, origin: "bottom left" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "bottom left" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.leaves3)[0]
    .transform({ rotate: -5, origin: "bottom left" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "bottom left" }, true)
    .loop(undefined, true);

  svg
    .find(IDs.flowerDecorationL1)[0]
    .transform({ rotate: -5, origin: "top" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "top" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.flowerDecorationL2)[0]
    .transform({ rotate: -5, origin: "top" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "top" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.flowerDecorationR1)[0]
    .transform({ rotate: -5, origin: "top" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "top" }, true)
    .loop(undefined, true);
  svg
    .find(IDs.flowerDecorationR2)[0]
    .transform({ rotate: -5, origin: "top" }, true)
    .animate(1400)
    .transform({ rotate: 10, origin: "top" }, true)
    .loop(undefined, true);
});
</script>
