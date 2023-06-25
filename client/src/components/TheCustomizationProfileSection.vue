<script setup lang="ts">
// Components
import BaseHighHeadline from "./BaseHighHeadline.vue";
import BaseMidHeadline from "./BaseMidHeadline.vue";
import BaseLowHeadline from "./BaseLowHeadline.vue";
import BaseButton from "./BaseButton.vue";
import ProfileBoardPicker from "./ProfileBoardPicker.vue";
import ProfileColorPicker from "./ProfileColorPicker.vue";
// TS
import { GameBoard } from "@/shared/types";
import { useStore } from "@/store/store";
import UsersRepository from "@/repositories/usersRepository";

const store = useStore();
async function setGameBoard(gameBoard: GameBoard) {
  UsersRepository.setGameboard(gameBoard).then(() => {
    store.user.gameBoard = gameBoard;
    store.saveLocalUser();
  });
}

function setColor(isMyColor: boolean, color: string) {
  if (isMyColor) {
    store.user.playerColor = color;
  } else {
    store.user.enemyColor = color;
  }
  store.saveLocalUser();
  UsersRepository.setColors(store.user.playerColor!, store.user.enemyColor!);
}
</script>
<template>
  <BaseHighHeadline>Customizations</BaseHighHeadline>
  <div
    class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-0 justify-around"
  >
    <!-- Gameboard pickers -->
    <div class="flex-1 flex flex-col">
      <BaseMidHeadline>Gameboard</BaseMidHeadline>
      <div class="flex flex-row justify-around pt-3 px-3 gap-2 flex-1">
        <div class="flex flex-col">
          <ProfileBoardPicker
            @setBoard="setGameBoard"
            :type="GameBoard.Standard"
            :current="store.user.gameBoard"
            :player-color="store.user.playerColor"
            :opponent-color="store.user.enemyColor"
          />
        </div>
        <div class="flex flex-col">
          <ProfileBoardPicker
            @setBoard="setGameBoard"
            :type="GameBoard.Classic"
            :player-color="store.user.playerColor"
            :opponent-color="store.user.enemyColor"
            :current="store.user.gameBoard"
          />
        </div>
        <div class="flex flex-col">
          <ProfileBoardPicker
            @setBoard="setGameBoard"
            :current="store.user.gameBoard"
            :player-color="store.user.playerColor"
            :opponent-color="store.user.enemyColor"
            :type="GameBoard.Modern"
          />
        </div>
      </div>
    </div>
    <!-- Game color pickers-->
    <div class="flex-1 flex flex-col">
      <BaseMidHeadline>Game colors</BaseMidHeadline>
      <div class="flex flex-row justify-around md:mt-2 p-3 gap-2 flex-1">
        <div class="flex flex-col items-center">
          <BaseLowHeadline>Your color</BaseLowHeadline>
          <ProfileColorPicker
            :currentColor="store.user.playerColor"
            :isMyColor="true"
            @setColor="setColor"
          />
        </div>
        <div class="flex flex-col items-center">
          <BaseLowHeadline>Enemy's color</BaseLowHeadline>
          <ProfileColorPicker
            :currentColor="store.user.enemyColor"
            :isMyColor="false"
            @setColor="setColor"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    class="flex flex-1 flex-col md:flex-row justify-around md:items-center mt-4 lg:mt-0 gap-5 p-5"
  >
    <BaseButton
      @click="
        () => {
          $router.push('/set-username');
        }
      "
      >Change Username</BaseButton
    >

    <BaseButton
      @click="
        () => {
          $router.push('/set-email');
        }
      "
      >Change Email</BaseButton
    >

    <BaseButton
      @click="
        () => {
          $router.push('/set-password');
        }
      "
      >Change Password</BaseButton
    >
  </div>
</template>
