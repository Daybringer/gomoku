<template>
  <BaseView
    id="start"
    style="padding-left: 0; padding-right: 0; padding-bottom: 0">
    <BaseButton
      class="mb-8 md:mt-4"
      @click="
        () => {
          campaignStore.setCampaignProgress(0);
          setSVGStyles(rootSVG);
        }
      ">
      Reset ALL Progress
    </BaseButton>
    <BaseButton
      @click="toggleConstantAnimations"
      :gomoku-blue="true"
      class="mb-8"
      >{{
        !areConstantAnimationsRunning ? "Start animations" : "Stop animations"
      }}</BaseButton
    >

    <div class="w-full xl:w-1/2">
      <CampaignSvg />
      <!-- FIRST CONVERSATION -->
      <BaseModal
        :is-active="conversationModal.start"
        @close-modal="conversationModal.start = false">
        <div class="flex-1 flex flex-col justify-between">
          <CampaignStoryMessage svg="sad_man">
            Heeeelp! I've been robbed.<br />
            My precious Gomoku board has been stolen <br />
            It looked something like this:
            <img
              class="h-12 inline-block"
              src="../assets/svg/campaign/board.svg" />
            <br />
            <br />
            Please, could you help me?
          </CampaignStoryMessage>
          <BaseButton
            :gomoku-blue="true"
            @click="
              () => {
                campaignStore.iterate();
                setSVGStyles(rootSVG);
                conversationModal.start = false;
              }
            "
            >Embark on journey</BaseButton
          >
        </div>
      </BaseModal>
      <!-- SUMO CONVERSATION -->
      <BaseModal
        :is-active="conversationModal.villageFighter"
        @close-modal="conversationModal.villageFighter = false">
        <div class="flex-1 flex flex-col justify-between gap-8">
          <CampaignStoryMessage svg="sumo">
            What are you doing?<br />
            If you want to pass through my farms you have to defeat me.
          </CampaignStoryMessage>
          <Transition name="slide">
            <CampaignStoryMessage
              svg="sad_man"
              v-show="conversationModal.rulesSub2">
              Wait my friend! <br />
              Before you fight, you should at least learn basic rules of Gomoku.
              Here is a part from book I got from my dad and he got from his dad
              and ...
            </CampaignStoryMessage>
          </Transition>

          <BaseButton
            @click="
              conversationModal.rulesSub2 = true;
              conversationModal.rulesSub1 = false;
            "
            v-show="conversationModal.rulesSub1"
            :gomoku-blue="true">
            Fight
          </BaseButton>
          <BaseButton
            v-show="conversationModal.rulesSub2"
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
        :is-active="conversationModal.rules1">
        <div
          class="flex-1 flex flex-col place-items-center justify-between gap-8">
          <iframe
            class="h-full w-full"
            src="https://www.youtube.com/embed/-KD743yNDHc?si=b-jT97-r_-G1No2y"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe>
          <BaseButton
            @click="
              () => {
                campaignStore.iterate();
                setSVGStyles(rootSVG);
                conversationModal.rules1 = false;
              }
            "
            class="w-full"
            :gomoku-blue="true"
            >Got it.</BaseButton
          >
        </div>
      </BaseModal>
      <!-- GEISHA CONVERSATION -->
      <BaseModal
        :is-active="conversationModal.geisha"
        @close-modal="conversationModal.geisha = false">
        <div class="flex-1 flex flex-col justify-between gap-8">
          <CampaignStoryMessage svg="geisha">
            How inelegant.
            <br />
            Let me show you how TRUE elegenace looks like.
            <br />
            <span class="italic text-gray-500"> Hi, hi, hi </span>
          </CampaignStoryMessage>
          <CampaignStoryMessage svg="sad_man">
            TIP:
            <br />
            Be careful of open 3s and try to make your own 3s that could secure
            your victory.
          </CampaignStoryMessage>
          <BaseButton
            @click="
              campaignStore.iterate();
              setSVGStyles(rootSVG);
              conversationModal.geisha = false;
            "
            :gomoku-blue="true"
            >Fight</BaseButton
          >
        </div>
      </BaseModal>
      <!-- NINJA CONVERSATION -->
      <BaseModal
        :is-active="conversationModal.ninja"
        @close-modal="conversationModal.ninja = false">
        <div class="flex-1 flex flex-col justify-between gap-8">
          <CampaignStoryMessage svg="ninja">
            Surprise!!! I bet you didn't see me.
            <br />
            <span class="italic text-gray-500"> Hi, hi, hi </span>
            <br />
            Now come and fight me!
          </CampaignStoryMessage>
          <CampaignStoryMessage svg="sad_man">
            TIP:
            <br />
            Be careful of Ninja's sneaky tactics. Try to play a little more
            defensively.
          </CampaignStoryMessage>
          <CampaignStoryMessage svg="ninja">
            We will see
            <span class="italic text-gray-500"> Hi, hi, hi </span>
          </CampaignStoryMessage>
          <BaseButton
            @click="
              campaignStore.iterate();
              setSVGStyles(rootSVG);
              conversationModal.ninja = false;
            "
            :gomoku-blue="true"
            >Fight!</BaseButton
          >
        </div>
      </BaseModal>
      <!-- MONSTER CONVERSATION -->
      <BaseModal
        :is-active="conversationModal.monster"
        @close-modal="conversationModal.monster = false">
        <div class="flex-1 flex flex-col justify-between gap-8">
          <CampaignStoryMessage svg="rokorubi">
            Oh, hello. I'm a cursed concubine of The Shogun.
            <br />
            Maybe if I defeat you he will pardon me and I can get my normal neck
            back.
          </CampaignStoryMessage>
          <CampaignStoryMessage svg="sad_man">
            Aaah, get her.
          </CampaignStoryMessage>
          <BaseButton
            @click="
              campaignStore.iterate();
              setSVGStyles(rootSVG);
              conversationModal.monster = false;
            "
            :gomoku-blue="true"
            >Fight monster.</BaseButton
          >
        </div>
      </BaseModal>
      <!-- SHOGUN CONVERSATION -->
      <BaseModal
        :is-active="conversationModal.shogun"
        @close-modal="conversationModal.shogun = false">
        <div class="flex-1 flex flex-col justify-between gap-8">
          <CampaignStoryMessage svg="sad_man">
            Oh, there's my BOARD. GIVE IT BACK.
          </CampaignStoryMessage>
          <CampaignStoryMessage svg="shogun">
            You wish old man.
            <br />
            But I see your are not alone.
            <br />
            Show me your skills in your final battle challenger.
          </CampaignStoryMessage>

          <BaseButton link="/campaign/game" :gomoku-blue="true"
            >Final battle!</BaseButton
          >
        </div>
      </BaseModal>
    </div>
  </BaseView>
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
.slide-leave-active,
.slide-enter-active {
  transition: all 1.5s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-20%);
  opacity: 0;
}
</style>

<script setup lang="ts">
import { Ref, onMounted, ref, reactive } from "vue";
import { SVG, Element, Runner } from "@svgdotjs/svg.js";
import CampaignSvg from "@/components/CampaignSvg.vue";
import BaseView from "@/components/BaseView.vue";
import BaseModal from "@/components/BaseModal.vue";
import router from "@/router";
import BaseButton from "@/components/BaseButton.vue";
import { useCampaignStore } from "@/store/campaign";
import { storeToRefs } from "pinia";
import CampaignStoryMessage from "@/components/CampaignStoryMessage.vue";

const conversationModal = ref({
  start: false,
  villageFighter: false,
  rules1: false,
  rulesSub1: true,
  rulesSub2: false,
  geisha: false,
  ninja: false,
  monster: false,
  shogun: false,
});

const rootSVG: Ref<Element> = ref(SVG());

const campaignStore = reactive(useCampaignStore());

const forkFlipped = ref(false);

const areConstantAnimationsRunning = ref(false);

const runners: Ref<Runner[]> = ref([]);

const { progress } = storeToRefs(campaignStore);

const milestones = 12;
const paths = 17;
const icons = 5;

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
  warriorArm1 = "#warrior1Arm",
  warriorArm2 = "#warriorArm2",
  man1 = "#man1",
  man2 = "#man2",
  flowerDecorationR1 = "#flowerDecorationR1",
  flowerDecorationR2 = "#flowerDecorationR2",
  flowerDecorationL1 = "#flowerDecorationL1",
  flowerDecorationL2 = "#flowerDecorationL2",
  boardCage = "#boardCage",
  hidingWoman = "#hidingWoman",
  castle = "#castle",
}

function addListenersToInteractibles(svgRoot: Element) {
  svgRoot
    .find("#motionIcon0")[0]
    .click(() => interactibleClick(Interactible.StartingIcon, 0));
  svgRoot
    .find("#profileIconAvatar0")[0]
    .click(() => interactibleClick(Interactible.StartingIcon, 0));

  for (let i = 0; i < icons; i++) {
    svgRoot
      .find(`#profileIconGroup${i + 1}`)[0]
      .click(() => interactibleClick(Interactible.Icon, i));
    for (let i = 0; i < milestones; i++) {
      svgRoot
        .find(`#motionMilestoneGroup${i + 1}`)[0]
        .click(() => interactibleClick(Interactible.Milestone, i));
    }
  }
}

function setSVGStyles(svg: Element) {
  // First Starter Icon
  if (progress.value === 0) {
    svg.find("#motionIcon0")[0].addClass("gomoku-stroke").addClass("clickable");
    svg.find("#profileIconAvatar0")[0].addClass("clickable");
  } else {
    svg
      .find("#motionIcon0")[0]
      .removeClass("gomoku-stroke")
      .removeClass("clickable");
    svg.find("#profileIconAvatar0")[0].removeClass("clickable");
  }

  //Icons
  for (let i = 0; i < icons; i++) {
    const progressIx = i * 4 + 1;
    const el = svg.find(`#motionIcon${i + 1}`)[0];
    const clickable = svg.find(`#profileIconGroup${i + 1}`)[0];
    const avatar = svg.find(`#profileIconAvatarShadow${i + 1}`)[0];
    if (progressIx <= progress.value) {
      el.addClass("all-full-opacity");
      if (isLastInteractible(Interactible.Icon, i)) {
        el.addClass("gomoku-stroke");
        clickable.addClass("clickable");
      } else {
        console.log("got");
        el.removeClass("gomoku-stroke");
        clickable.removeClass("clickable");
      }
      if (avatar) {
        avatar.remove();
      }
    } else {
      el.addClass("stroke-small-opacity");
      el.removeClass("gomoku-stroke");
      clickable.removeClass("clickable");
    }
  }

  //Milestones
  for (let i = 0; i < milestones; i++) {
    const progressIx = i + Math.floor(i / 3) + 2;
    const el = svg.find(`#motionMilestone${i + 1}`)[0];
    const textEl = svg.find(`#motionMilestoneText${i + 1}`)[0];
    const clickable = svg.find(`#motionMilestoneGroup${i + 1}`)[0];

    if (progressIx <= progress.value) {
      el.removeClass("stroke-small-opacity");
      textEl.removeClass("all-small-opacity");
      el.removeClass("stroke-small-opacity");
      el.addClass("all-full-opacity");
      textEl.addClass("all-full-opacity");
      if (isLastInteractible(Interactible.Milestone, i)) {
        el.addClass("gomoku-stroke");
        clickable.addClass("clickable");
      } else {
        el.removeClass("gomoku-stroke");
        clickable.removeClass("clickable");
      }
    } else {
      el.addClass("stroke-small-opacity");
      textEl.addClass("all-small-opacity");

      el.removeClass("gomoku-stroke");
      clickable.removeClass("clickable");
    }
  }
  for (let i = 0; i < paths; i++) {
    const el = svg.find(`#motionPath${i}`)[0];
    if (i + 1 <= progress.value) {
      el.addClass("all-full-opacity");
      el.removeClass("stroke-small-opacity");
    } else {
      el.addClass("stroke-small-opacity");
    }
  }
}

function isLastInteractible(
  interactible:
    | Interactible.Icon
    | Interactible.Milestone
    | Interactible.StartingIcon,
  ix: number
) {
  if (interactible === Interactible.Icon) {
    return ix * 4 + 1 === progress.value;
  } else if (interactible === Interactible.Milestone) {
    return ix + Math.floor(ix / 3) + 2 === progress.value;
  } else {
    return progress.value === 0;
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

function toggleConstantAnimations() {
  if (areConstantAnimationsRunning.value) {
    pauseConstantAnimations();
  } else {
    resumeConstantAnimations();
  }
  areConstantAnimationsRunning.value = !areConstantAnimationsRunning.value;
}

function setConstantAnimations() {
  rootSVG.value = SVG("#svg5");
  const svg = rootSVG.value;
  // Flying fishes
  runners.value.push(
    svg
      .find(IDs.fishRight2)[0]
      .transform({ rotate: -5, origin: "right" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "right" }, true)
      .loop(undefined, true)
  );
  runners.value.push(
    svg
      .find(IDs.fishRight1)[0]
      .transform({ rotate: -5, origin: "right" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "right" }, true)
      .loop(undefined, true)
  );
  runners.value.push(
    svg
      .find(IDs.fishRight3)[0]
      .transform({ rotate: -5, origin: "right" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "right" }, true)
      .loop(undefined, true)
  );
  runners.value.push(
    svg
      .find(IDs.fishRight4)[0]
      .transform({ rotate: -5, origin: "right" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "right" }, true)
      .loop(undefined, true)
  );
  runners.value.push(
    svg
      .find(IDs.fishLeft1)[0]
      .transform({ rotate: -5, origin: "right" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "right" }, true)
      .loop(undefined, true)
  );
  runners.value.push(
    svg
      .find(IDs.fishLeft2)[0]
      .transform({ rotate: -5, origin: "right" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "right" }, true)
      .loop(undefined, true)
  );

  // Top clouds
  runners.value.push(
    svg
      .find(IDs.topClouds)[0]
      .animate(2000)
      .transform({ translateX: -3 }, true)
      .loop(undefined, true)
  );

  runners.value.push(
    svg
      .find(IDs.rotateFlower1)[0]
      .animate(3000)
      .transform({ rotate: -360 }, true)
      .loop(undefined, true, 600)
  );
  runners.value.push(
    svg
      .find(IDs.rotateFlower2)[0]
      .animate(4000)
      .transform({ rotate: 360 }, true)
      .loop(undefined, true, 600)
  );
  runners.value.push(
    svg
      .find(IDs.rotateFlower3)[0]
      .animate(3500)
      .transform({ rotate: -360 }, true)
      .loop(undefined, true, 600)
  );

  runners.value.push(
    svg
      .find(IDs.leaves1)[0]
      .transform({ rotate: -5, origin: "bottom left" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "bottom left" }, true)
      .loop(undefined, true)
  );
  runners.value.push(
    svg
      .find(IDs.leaves2)[0]
      .transform({ rotate: -5, origin: "bottom left" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "bottom left" }, true)
      .loop(undefined, true)
  );
  runners.value.push(
    svg
      .find(IDs.leaves3)[0]
      .transform({ rotate: -5, origin: "bottom left" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "bottom left" }, true)
      .loop(undefined, true)
  );

  runners.value.push(
    svg
      .find(IDs.flowerDecorationL1)[0]
      .transform({ rotate: -5, origin: "top" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "top" }, true)
      .loop(undefined, true)
  );
  runners.value.push(
    svg
      .find(IDs.flowerDecorationL2)[0]
      .transform({ rotate: -5, origin: "top" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "top" }, true)
      .loop(undefined, true)
  );
  runners.value.push(
    svg
      .find(IDs.flowerDecorationR1)[0]
      .transform({ rotate: -5, origin: "top" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "top" }, true)
      .loop(undefined, true)
  );

  runners.value.push(
    svg
      .find(IDs.flowerDecorationR2)[0]
      .transform({ rotate: -5, origin: "top" }, true)
      .animate(1400)
      .transform({ rotate: 10, origin: "top" }, true)
      .loop(undefined, true)
  );
}

function pauseConstantAnimations() {
  runners.value.forEach((runner) => {
    runner.reset();
    runner.unschedule();
  });
  runners.value = [];
}
function resumeConstantAnimations() {
  if (runners.value.length === 0) setConstantAnimations();
}

onMounted(() => {
  rootSVG.value = SVG("#svg5");
  const svg = rootSVG.value;
  addListenersToInteractibles(svg);
  setSVGStyles(svg);
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

  svg
    .find(IDs.hiker)[0]
    .css("cursor", "pointer")
    .click(function () {
      //@ts-ignore
      this.animate(300)
        .transform({ translate: [1, -1], rotate: -5 }, true)
        .animate(300)
        .transform({ translate: [2, -0.8], rotate: 15 }, true)
        .animate(300)
        .transform({ translate: [2, -2], rotate: -15 }, true)
        .animate(300)
        .transform({ translate: [2, -1], rotate: 25 }, true)
        .animate(300)
        .transform({ translate: [2, -2], rotate: -35 }, true)
        .animate(300)
        .transform({ translate: [1, -2], rotate: 5 }, true)
        .animate(300)
        .transform({ translate: [6, -3], rotate: 45 }, true)
        .animate(300)
        .transform({ flip: "x" }, true)
        .animate(800)
        .ease("-")
        .transform({ translate: [-16, -5], rotate: -360 }, true)
        .animate(400)
        .ease("-")
        .transform({ translate: [0.15, 16.65], rotate: -43 }, true);
    });

  const warrior1 = svg.find(IDs.warrior1)[0].click(() => {
    warrior1
      .css("cursor", "pointer")
      .animate(320)
      .ease("-")
      .transform({ translateX: 7 }, true);
    svg
      .find(IDs.warriorArm1)[0]
      .animate(200)
      .ease("-")
      .transform({ rotate: -50, origin: "center right" }, true)
      .animate(140)
      .ease("-")
      .transform({ rotate: 50, origin: "center right" }, true);
    warrior1
      .css("cursor", "pointer")
      .animate(300, 1000)
      .ease("-")
      .transform({ translateX: -7 }, true);
  });

  const warrior2 = svg.find(IDs.warrior2)[0].click(() => {
    warrior2
      .css("cursor", "pointer")
      .animate(320)
      .ease("-")
      .transform({ translateX: -7 }, true);
    svg
      .find(IDs.warriorArm2)[0]
      .animate(200)
      .ease("-")
      .transform({ rotate: 50, origin: "center right" }, true)
      .animate(140)
      .ease("-")
      .transform({ rotate: -50, origin: "center right" }, true);
    warrior2
      .css("cursor", "pointer")
      .animate(300, 1000)
      .ease("-")
      .transform({ translateX: 7 }, true);
  });

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

  svg
    .find(IDs.man1)[0]
    .css("cursor", "pointer")
    .click(function () {
      //@ts-ignore
      this.animate(1000).opacity(0.1).animate(1000).opacity(1);
    });

  svg
    .find(IDs.man2)[0]
    .css("cursor", "pointer")
    .click(function () {
      //@ts-ignore
      this.animate(1000).opacity(0.1).animate(1000).opacity(1);
    });

  svg
    .find(IDs.castle)[0]
    .css("cursor", "pointer")
    .click(function () {
      svg
        .find(IDs.hidingWoman)[0]
        .animate(1000)
        .transform({ translate: [7, -4] }, true)
        .loop(2, true);
    });
  svg
    .find(IDs.boardCage)[0]
    .css("cursor", "pointer")
    .click(function () {
      //@ts-ignore
      //@ts-ignore
      this.animate(5)
        .transform({ rotate: -20 }, true)
        .animate(100)
        .ease("-")
        .transform({ rotate: 40 }, true)
        .loop(20, true)
        .animate(40)
        .transform({ rotate: 20 }, true);
    });
});
</script>
