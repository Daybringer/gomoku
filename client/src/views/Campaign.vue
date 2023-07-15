<template>
  <div class="flex flex-col justify-center">
    <BaseHighHeadline>Campaign</BaseHighHeadline>
    <BaseHRDivider />
    Some some some some some
    <BaseHRDivider />
    <div class="w-full">
      <CampaignSvg />
    </div>
  </div>
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
import { Ref, ref } from "vue";
import CampaignSvg from "@/components/CampaignSvg.vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseHRDivider from "@/components/BaseHRDivider.vue";

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

function interactiveClick(objType: ObjType, originID: number) {}

svg.value.icon[0] = true;
svg.value.path[0] = true;
svg.value.path[1] = true;
svg.value.milestone[0] = true;
svg.value.milestone[1] = true;

console.log(svg.value.icon);
</script>
