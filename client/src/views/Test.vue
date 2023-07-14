<script setup lang="ts">
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import TheMatchesIndexSection from "@/components/TheMatchesIndexSection.vue";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import Gameboard from "@/components/Gameboard.vue";
import { useStore } from "@/store/store";
import { reactive } from "vue";
import { Turn } from "@/shared/types";
import Coinflip from "@/components/Coinflip.vue";
const userStore = useStore();
function createNotification(mode: number) {
  const store = useNotificationsStore();
  if (mode == 1) {
    store.createNotification(
      NotificationType.Success,
      "Some textSome textSome text"
    );
  } else if (mode == 2) {
    store.createNotification(
      NotificationType.Error,
      "Lorem ipsum dolorem something here and theres"
    );
  } else if (mode == 3) {
    store.createNotification(NotificationType.Warning, "Some text");
  } else {
    store.createNotification(NotificationType.Info, "Some text");
  }
}
const turns: Turn[] = reactive([]);
function gameClick(turn: Turn) {
  turns.push(turn);
}
</script>
<template>
  <ViewBaseFixedHeight :placeItems="'start'">
    <div>
      <button
        class="rounded-lg shadow-lg py-2 px-4 text-xl border-2 border-gray-500"
        @click="createNotification(1)"
      >
        Create success notification
      </button>
      <button
        class="rounded-lg shadow-lg py-2 px-4 text-xl border-2 border-gray-500"
        @click="createNotification(2)"
      >
        Create error notification
      </button>
      <button
        class="rounded-lg shadow-lg py-2 px-4 text-xl border-2 border-gray-500"
        @click="createNotification(3)"
      >
        Create warning notification
      </button>

      <button
        class="rounded-lg shadow-lg py-2 px-4 text-xl border-2 border-gray-500"
        @click="createNotification(4)"
      >
        Create info notification
      </button>
    </div>
    <div class="h-96 w-96 flex">
      <Gameboard
        :turnHistory="turns"
        :crossColor="userStore.user.enemyColor"
        :circleColor="userStore.user.playerColor"
        :boardSize="15"
        :interactive="true"
        :lines-width="2"
        :last-outline-color="'#363636'"
        :last-outline-width="3"
        @game-click="gameClick"
      ></Gameboard>
    </div>
    <Coinflip
      :heads-color="userStore.user.playerColor"
      :tails-color="userStore.user.enemyColor"
      :is-heads="true"
    ></Coinflip>
  </ViewBaseFixedHeight>
  <TheMatchesIndexSection></TheMatchesIndexSection>
</template>
