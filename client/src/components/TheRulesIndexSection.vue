<template>
  <BaseView id="rules" class="bg-gray-200 min-h-screen">
    <IntersectionObserver @intersect="emit('intersectionCrossed')" />
    <BaseHighHeadline>Rules</BaseHighHeadline>
    <div
      class="w-full xl:w-2/3 p-4 mt-12 py-8 flex flex-col bg-gray-900 text-gray-300 text-xl rounded-lg gap-6"
    >
      <!-- Basics -->
      <RuleSection type="section" title="Basics">
        <ul class="list-disc list-inside font-normal space-y-3 p-3">
          <li>Played on <b>15x15</b> gameboard</li>
          <li>Players take turns</li>
          <li>Total time measured using chess clock</li>
          <li>
            Player who makes an unbroken row of <b>5</b> stones in any direction
            <b>wins</b> the game
          </li>

          <li>Starting player is determined by a coin flip</li>
          <li>
            Players alternate until somebody wins or the board is filled, in
            which case the game is tied
          </li>
          <li>
            Game either starts with a blank board or with a more advanced
            technique called SWAP
          </li>
        </ul>
      </RuleSection>
      <!-- Game Types -->
      <RuleSection type="section" title="Game Types">
        <!-- Quick -->
        <RuleSection type="subsection" title="Quick">
          <ul class="list-disc list-inside space-y-3 p-3">
            <li>Players don't have to be logged in</li>
            <li>Each player has a time limit of 5mins</li>
            <li>ELO doesn't matter, just have fun!</li>
          </ul>
        </RuleSection>
        <!-- Ranked -->
        <RuleSection type="subsection" title="Ranked">
          <ul class="list-disc list-inside p-3 space-y-3">
            <li>Players have to be logged in</li>
            <li>Each player has a time limit of 10mins</li>
            <li>Players of similar ELO are matched against each other</li>
            <li>Winner's ELO increases, loser's decreases</li>
            <li>The game starts with SWAP1</li>
          </ul>
        </RuleSection>
        <!-- Custom -->
        <RuleSection type="subsection" title="Custom">
          <ul class="list-disc list-inside space-y-3 p-3">
            <li>
              One player creates a game room and shares its link with an
              opponent
            </li>
            <li>It's up to the player to prescribe a time limit and a swap</li>
            <li>ELO is not affected by the outcome of the game</li>
          </ul>
        </RuleSection>
        <!-- AI -->
        <RuleSection type="subsection" title="AI">
          <ul class="list-disc list-inside space-y-3 p-3">
            <li>A player enters a game against a bot</li>
            <li>The rules of the game will vary</li>
            <li>ELO is not affected by the outcome of the game</li>
            <li>Each game presents a unique challenge</li>
          </ul>
        </RuleSection>
      </RuleSection>
      <!-- SWAP1 -->
      <RuleSection type="section" title="SWAP1">
        <ul class="list-disc list-inside space-y-3 p-3">
          <li>Starting player is determined by a coin flip</li>
          <li>He then places 3 stones - 2 of one color and 1 of the other</li>
          <li>
            The opponent chooses one of the colors, starting player is assigned
            the other one
          </li>
          <li>The player with only 1 stone goes 1st</li>
          <li class="list-none">
            <!-- TODO implement showcase of Openings -->
            <BaseButton :gomokuBlue="true">Show example</BaseButton>
          </li>
        </ul>
      </RuleSection>
      <!-- SWAP2 -->
      <RuleSection type="section" title="SWAP2">
        <ul class="list-disc list-inside p-3">
          <li class="pb-3">
            The game starts like SWAP1, but the opponent has
            <b>3</b> choices
            <ul class="list-disc list-inside space-y-3 p-3">
              <li>Play with the 2 placed stones and go 2nd</li>
              <li>Play with the 1 placed stone and go 1st</li>
              <li>
                Place 2 more stones and let starting player choose his color
              </li>
            </ul>
          </li>
        </ul>
      </RuleSection>
    </div>
  </BaseView>
</template>

<script setup lang="ts">
import IntersectionObserver from "./IntersectionObserver.vue";
import RuleSection from "@/components/RulesSection.vue";
import BaseView from "./BaseView.vue";
import BaseButton from "./BaseButton.vue";
import BaseHighHeadline from "./BaseHighHeadline.vue";
const emit = defineEmits<{
  (e: "intersectionCrossed");
}>();
</script>
