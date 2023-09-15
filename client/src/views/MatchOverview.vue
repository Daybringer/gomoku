<template>
  <BaseView>
    <BaseLoadingSpinner v-if="!gameFetched" />
    <div class="xl:w-50 w-full flex-1 flex flex-col gap-6" v-if="gameFetched">
      <Container>
        <BaseHighHeadline>Match overview</BaseHighHeadline>
        <MatchOverviewGeneral
          v-for="game in games"
          :key="game.id"
          :game="game"
        ></MatchOverviewGeneral>
      </Container>
      <Container class="items-center">
        <BaseHighHeadline>Board rewind</BaseHighHeadline>
        <MatchOverviewBoardRewind
          v-for="game in games"
          :key="game.id"
          :game="game"
        ></MatchOverviewBoardRewind>
      </Container>
    </div>
  </BaseView>
</template>
<script setup lang="ts">
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseLoadingSpinner from "@/components/BaseLoadingSpinner.vue";
import Container from "@/components/Container.vue";
import MatchOverviewBoardRewind from "@/components/MatchOverviewBoardRewind.vue";
import MatchOverviewGeneral from "@/components/MatchOverviewGeneral.vue";
import BaseView from "@/components/BaseView.vue";
import gameRepository from "@/repositories/gameRepository";
import router from "@/router";
import { Game } from "@/shared/interfaces/game.interface";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
const gameIDParam = useRoute().params.id;
const gameID = Number(gameIDParam);
if (isNaN(gameID)) {
  notifyGameNonexistent();
  router.push("/");
}

const games: Game[] = reactive([]);
const gameFetched = ref(false);
gameRepository
  .getGameByID(gameID)
  .then((res) => {
    const game = res.data.game;
    gameFetched.value = true;
    games.push(game);
  })
  .catch((err) => {
    notifyGameNonexistent();
    router.push("/");
  });

function notifyGameNonexistent() {
  useNotificationsStore().createNotification(
    NotificationType.Error,
    "Game doesn't exist."
  );
}
</script>
