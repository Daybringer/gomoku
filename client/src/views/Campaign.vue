<template>
  <ViewBaseResponsive
    style="padding-left: 0; padding-right: 0; padding-bottom: 0"
  >
    <div class="w-full">
      <CampaignSvg />
      <BaseModal
        :is-active="conversationModal.start"
        @close-modal="conversationModal.start = false"
      >
        <div class="flex-1 flex flex-col justify-between">
          <div class="flex flex-col md:flex-row w-full gap-4 md:gap-8">
            <img
              class="w-32 border-gray-800 border-4 rounded-md"
              src="../assets/svg/campaign/sad_man.svg"
            />
            <p class="text-xl md:text-2xl">
              Heeeelp! I've been robbed.<br />
              My precious Gomoku board has been stolen <br />
              It looked something like this:
              <img
                class="h-12 inline-block"
                src="../assets/svg/campaign/board.svg"
              />
              <br />
              <br />
              Please, could you help me?
            </p>
          </div>
          <BaseButton
            class="py-4 text-xl"
            :gomoku-blue="true"
            @click="
              () => {
                interactibles.path[0] = true;
                interactibles.icon[0] = true;
                setSVGStyles(rootSVG);
                conversationModal.start = false;
              }
            "
            >Embark on journey</BaseButton
          >
        </div>
      </BaseModal>
      <BaseModal
        :is-active="conversationModal.villageFighter"
        @close-modal="conversationModal.villageFighter = false"
      >
        <div class="flex-1 flex flex-col justify-between gap-8">
          <div class="flex flex-col md:flex-row w-full gap-4 md:gap-8">
            <img
              class="w-32 border-gray-800 border-4 rounded-md"
              src="../assets/svg/campaign/sumo.svg"
            />
            <p class="text-xl md:text-2xl">
              What are you doing?<br />
              If you want to pass through my farms you have to defeat me.
            </p>
          </div>
          <div class="flex flex-col md:flex-row-reverse w-full gap-4 md:gap-8">
            <img
              class="w-32 border-gray-800 border-4 rounded-md"
              src="../assets/svg/campaign/sad_man.svg"
            />
            <p class="text-xl md:text-2xl">
              Wait my friend! <br />
              Before you fight, you should at least learn basic rules of Gomoku.
              Here is a part from book I got from my dad and he got from his dad
              and ...
            </p>
          </div>
          <BaseButton
            @click="
              () => {
                conversationModal.villageFighter = false;
                conversationModal.rules1 = true;
              }
            "
            :gomoku-blue="true"
            >Have a look at it</BaseButton
          >
        </div>
      </BaseModal>
      <BaseModal
        @close-modal="conversationModal.rules1 = false"
        :is-active="conversationModal.rules1"
      ></BaseModal>
    </div>
  </ViewBaseResponsive>
</template>
<style scope>
.all-full-opacity {
  opacity: 1;
}
.all-small-opacity {
  opacity: 0.3;
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
.gomoku-stroke {
  stroke: #00b3fe !important;
}
.clickable:hover {
  stroke-opacity: 0.7;
}
</style>
<script setup lang="ts">
import { Ref, onMounted, ref } from "vue";
import { SVG, Element, Runner } from "@svgdotjs/svg.js";
import CampaignSvg from "@/components/CampaignSvg.vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import BaseModal from "@/components/BaseModal.vue";
import router from "@/router";
import BaseButton from "@/components/BaseButton.vue";

const conversationModal = ref({
  start: false,
  villageFighter: false,
  rules1: false,
  geisha: false,
  ninja: false,
  monster: false,
  shogun: false,
});

const rootSVG: Ref<Element> = ref(SVG());

const forkFlipped = ref();

const milestones = 12;
const paths = 17;
const icons = 5;

const interactibles: Ref<{
  path: boolean[];
  milestone: boolean[];
  icon: boolean[];
}> = ref({
  path: Array(paths).fill(false),
  milestone: Array(milestones).fill(false),
  icon: Array(icons).fill(false),
});

enum Interactible {
  Path,
  Icon,
  Milestone,
  StartingIcon,
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

// interactibles.value.icon[0] = true;
// interactibles.value.path[0] = true;
// interactibles.value.path[1] = true;
// interactibles.value.milestone[0] = true;
// interactibles.value.icon[1] = true;

function loadInteractibles() {}

function addListenersToInteractibles(svgRoot: Element) {
  svgRoot
    .find("#motionIcon0")[0]
    .click(() => interactibleClick(Interactible.StartingIcon, 0));
  svgRoot
    .find("#profileIconAvatar0")[0]
    .click(() => interactibleClick(Interactible.StartingIcon, 0));

  interactibles.value.icon.forEach((foo, ix) => {
    svgRoot
      .find(`#profileIconGroup${ix + 1}`)[0]
      .click(() => interactibleClick(Interactible.Icon, ix));
  });
  interactibles.value.milestone.forEach((foo, ix) => {
    svgRoot
      .find(`#motionMilestoneGroup${ix + 1}`)[0]
      .click(() => interactibleClick(Interactible.Milestone, ix));
  });
}

function setSVGStyles(svg: Element) {
  if (!interactibles.value.icon[0]) {
    svg.find("#motionIcon0")[0].addClass("gomoku-stroke").addClass("clickable");
    svg.find("#profileIconAvatar0")[0].addClass("clickable");
  } else {
    svg
      .find("#motionIcon0")[0]
      .removeClass("gomoku-stroke")
      .removeClass("clickable");
    svg.find("#profileIconAvatar0")[0].removeClass("clickable");
  }
  interactibles.value.icon.forEach((val, ix) => {
    const el = svg.find(`#motionIcon${ix + 1}`)[0];
    const clickable = svg.find(`#profileIconGroup${ix + 1}`)[0];
    const avatar = svg.find(`#profileIconAvatarShadow${ix + 1}`)[0];
    if (val) {
      el.addClass("all-full-opacity");
      if (isLastInteractible(Interactible.Icon, ix)) {
        el.addClass("gomoku-stroke");
        clickable.addClass("clickable");
      } else {
        el.removeClass("gomoku-stroke");
        clickable.removeClass("clickable");
      }
      if (avatar) {
        avatar.remove();
      }
    } else {
      el.addClass("stroke-small-opacity");
    }
  });
  interactibles.value.milestone.forEach((val, ix) => {
    const el = svg.find(`#motionMilestone${ix + 1}`)[0];
    const textEl = svg.find(`#motionMilestoneText${ix + 1}`)[0];
    const clickable = svg.find(`#motionMilestoneGroup${ix + 1}`)[0];

    if (val) {
      el.removeClass("stroke-small-opacity");
      textEl.removeClass("all-small-opacity");
      el.removeClass("stroke-small-opacity");
      el.addClass("all-full-opacity");
      textEl.addClass("all-full-opacity");
      if (isLastInteractible(Interactible.Milestone, ix)) {
        el.addClass("gomoku-stroke");
        clickable.addClass("clickable");
      } else {
        el.removeClass("gomoku-stroke");
        clickable.removeClass("clickable");
      }
    } else {
      el.addClass("stroke-small-opacity");
      textEl.addClass("all-small-opacity");
    }
  });
  interactibles.value.path.forEach((val, ix) => {
    const el = svg.find(`#motionPath${ix}`)[0];
    if (val) {
      el.addClass("all-full-opacity");
      el.removeClass("stroke-small-opacity");
    } else {
      el.addClass("stroke-small-opacity");
    }
  });
}

function isLastInteractible(
  interactible:
    | Interactible.Icon
    | Interactible.Milestone
    | Interactible.StartingIcon,
  ix: number
) {
  if (interactible === Interactible.Icon) {
    if (interactibles.value.icon[ix] === false) return false;
    if (ix === icons - 1) return true;
    return (
      !interactibles.value.icon[ix + 1] &&
      !interactibles.value.milestone[ix * 3]
    );
  } else if (interactible === Interactible.Milestone) {
    if (interactibles.value.milestone[ix] === false) return false;
    if (ix === milestones - 1 && !interactibles.value.icon[icons]) return true;
    return (
      !interactibles.value.milestone[ix + 1] &&
      !interactibles.value.icon[Math.floor(ix / 3) + 1]
    );
  } else {
    return !(interactibles.value.milestone[0] || interactibles.value.icon[0]);
  }
}

function interactibleClick(
  interactible:
    | Interactible.Icon
    | Interactible.Milestone
    | Interactible.StartingIcon,
  ix: number
) {
  if (isLastInteractible(interactible, ix)) {
    if (interactible === Interactible.Milestone) {
      router.push("/campaign/game");
    } else if (interactible === Interactible.StartingIcon) {
      conversationModal.value.start = true;
    } else {
      switch (ix) {
        case 0:
          conversationModal.value.villageFighter = true;
          break;
        case 1:
          conversationModal.value.geisha = true;
          break;
        case 2:
          conversationModal.value.ninja = true;
          break;
        case 3:
          conversationModal.value.monster = true;
          break;
        case 4:
          conversationModal.value.shogun = true;
          break;
      }
    }
  }
}

onMounted(() => {
  rootSVG.value = SVG("#svg5");
  const svg = rootSVG.value;
  addListenersToInteractibles(svg);
  setSVGStyles(svg);
  // Top clouds
  const runner = new Runner();
  svg
    .find(IDs.topClouds)[0]
    .animate(2000)
    .transform({ translateX: -3 }, true)
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

  // Geisha dancers
  svg
    .find(IDs.dancer1)[0]
    .css("cursor", "pointer")
    .click(function () {
      //@ts-ignore
      this.animate(200).transform({ flip: "x" }, true).loop(10, true);
    });
  svg
    .find(IDs.dancer2)[0]
    .css("cursor", "pointer")
    .click(function () {
      //@ts-ignore
      this.animate(200).transform({ flip: "x" }, true).loop(10, true);
    });

  //
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
