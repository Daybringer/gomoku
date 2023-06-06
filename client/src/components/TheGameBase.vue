<template>
  <ViewBaseResponsive>
    <!-- Background top overlay -->
    <div class="absolute top-16 w-full h-2/6 bg-gray-800 z-0"></div>
    <!-- Main div -->
    <div
      ref="container"
      class="xl:w-80 overflow-hidden rounded-lg top-0 custom-shadow bg-gray-600 z-10 flex xl:flex-row flex-col shadow-2xl"
    >
      <div class="square flex relative">
        <Gameboard
          :turn-history="turnHistory"
          :cross-color="myColor"
          :circle-color="enemyColor"
          :board-size="15"
          :lines-width="3"
          :last-outline-color="'#363636'"
          :last-outline-width="3"
          :interactive="currentPlayer === me"
          @game-click="(turn) => emit('gameClick', turn)"
        >
        </Gameboard>
        <!-- Coinflip overlay -->
        <div
          class="absolute z-20 h-full w-full flex place-items-center justify-center bg-gray-100 dark:bg-gray-700"
          v-if="isWaitingOrCoinflip"
        >
          <Coinflip
            :heads-color="myColor"
            :tails-color="enemyColor"
            :is-heads="currentPlayer === me"
          ></Coinflip>
        </div>

        <!-- After game overlay -->
        <TheAfterGameOverlay
          v-show="gameState === GameState.Ended"
          :amIWinner="amIWinner"
          :endingType="endingType"
          :myElo="myElo"
          :gameType="gameType"
          :askingForRematch="askingForRematch"
          @rematchCustom="
            () => {
              $emit('rematchCustom');
            }
          "
        />
      </div>
      <!-- Socials container -->
      <div
        ref="chatContainer"
        class="flex-1 min-h-0 min-w-0 w-full flex flex-col p-4 relative"
      >
        <Transition>
          <div
            v-if="
              slideNotification.enemyChoose ||
              slideNotification.choose ||
              slideNotification.place ||
              slideNotification.enemyPlace
            "
            class="fancy-background px-4 py-2 rounded-lg flex justify-center place-items-center w-full h-14 md:h-16 mb-4 bg-gray-100"
          >
            <div
              class="flex justify-center place-items-center rounded-lg flex-1 h-full bg-gray-100"
            >
              <Transition name="slidetop">
                <div
                  class="flex-1 flex flex-row justify-around place-items-center"
                  v-if="slideNotification.choose"
                >
                  <p class="text-lg md:text-xl">Choose a symbol:</p>
                  <div class="flex self-center gap-8">
                    <button
                      @click="$emit('pickGameStone', 1)"
                      class="border-2 p-1 border-gray-700 dark:border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl"
                    >
                      <GameStoneCircle
                        class="h-8 w-8"
                        :style="`color:${
                          mySymbol === 'circle' ? myColor : enemyColor
                        };`"
                      />
                    </button>
                    <button
                      @click="$emit('pickGameStone', 2)"
                      class="border-2 p-1 border-gray-700 dark:border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl"
                    >
                      <GameStoneCross
                        class="h-8 w-8"
                        :style="`color:${
                          mySymbol === 'cross' ? myColor : enemyColor
                        };`"
                      />
                    </button>
                  </div>
                </div>
              </Transition>
              <Transition name="slidetop">
                <p class="text-lg" v-if="slideNotification.enemyChoose">
                  Opponent is choosing their symbol
                </p>
              </Transition>
              <Transition name="slidetop">
                <p class="text-lg" v-if="slideNotification.enemyPlace">
                  Enemy is placing 3 first stones
                </p>
              </Transition>
              <Transition name="slidetop">
                <p class="text-lg" v-if="slideNotification.place">
                  Place 3 first stones
                </p>
              </Transition>
            </div>
          </div>
        </Transition>
        <!-- Social Blades -->
        <div class="flex flex-col">
          <SocialBlade
            :player="me"
            :symbol="mySymbol"
            :symbolColor="myColor"
            :hasTimeLimit="hasTimeLimit"
            :isActive="currentPlayer.socketID === me.socketID"
          ></SocialBlade>
          <div
            class="m-auto my-3 text-3xl text-white font-semibold md:block hidden"
          >
            VS
          </div>
          <div class="md:hidden block my-2"></div>
          <SocialBlade
            :player="enemy"
            :symbol="enemySymbol"
            :symbolColor="enemyColor"
            :hasTimeLimit="hasTimeLimit"
            :isActive="currentPlayer.socketID === enemy.socketID"
          ></SocialBlade>
        </div>
        <!-- Chat container -->
        <div
          class="bg-white dark:bg-gray-500 xl:min-h-0 min-h-50vh flex-1 overflow-hidden rounded-lg mb-2 mt-10 p-4 flex relative flex-col"
        >
          <!-- Mute Button -->
          <button
            class="absolute p-1 top-0 right-0 rounded-bl-lg hover:bg-red-500 focus:outline-none text-white dark:text-gray-600"
            :class="muted ? 'bg-red-500' : 'bg-gray-500 dark:bg-gray-300'"
            @click="muted = !muted"
          >
            <NoMicrophoneIcon v-show="muted" class="h-6 stroke-current" />
            <MicrophoneIcon v-show="!muted" class="h-6 stroke-current" />
          </button>
          <!-- Title -->
          <h3
            class="m-auto font-medium text-3xl text-gray-900 dark:text-gray-100"
          >
            Chat
          </h3>
          <!-- Divider -->
          <hr class="my-2 border-2 rounded-full border-gray-700" />
          <!-- Messages container -->
          <div
            id="chatContainer"
            class="flex-grow flex flex-col space-y-2 pt-2 mb-2 h-0 relative"
            :class="muted ? 'overflow-hidden' : 'overflow-auto'"
            style="scroll-behavior: smooth"
          >
            <ChatMessage
              v-for="message in messages"
              v-show="!muted"
              :text="message.text"
              :author="message.author"
              :key="message.text + message.author"
              :borderColorHEX="message.author === 'me' ? myColor : enemyColor"
            ></ChatMessage>
            <!-- Muted overlay -->
            <div
              v-show="muted"
              class="w-90 h-90 absolute-center flex place-items-center justify-center font-medium text-gray-100 text-lg bg-gray-600 rounded-xl"
            >
              Muted
            </div>
          </div>
          <!-- Input container -->
          <div
            v-show="!muted"
            class="w-full rounded-full min-h-12 border-4 xl:px-8 p-2 px-4 border-gray-700 gap-x-4 flex flex-wrap flex-row overflow-hidden justify-between"
          >
            <input
              class="h-full bg-transparent placeholder-gray-400 dark:placeholder-gray-400 w-auto flex-1 p-0 border-0 border-b-2 border-gray-500 dark:border-gray-300 text-gray-900 dark:text-gray-50 text-lg float-left focus:border-gomoku-blue focus:ring-transparent"
              type="text"
              v-model="chatInput"
              placeholder="Write a message"
              @keyup.enter="sendMessage"
            />
            <button
              @click="sendMessage"
              class="w-12 xl:ml-4 focus:outline-none focus:text-gray-700 text-gray-900 dark:text-gray-100 text-lg font-medium float-right"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </ViewBaseResponsive>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
// Types
import { GameState } from "@/utils/types.dt";
// Howler
import { Howl } from "howler";
// Components
import TheAfterGameOverlay from "@/components/TheAfterGameOverlay.vue";
import SocialBlade from "@/components/GameSocialBlade.vue";
import ChatMessage from "@/components/GameChatMessage.vue";
import Coinflip from "./Coinflip.vue";

// SVGs
import GameStoneCircle from "@/assets/svg/GameStoneCircle.vue";
import GameStoneCross from "@/assets/svg/GameStoneCross.vue";
import NoMicrophoneIcon from "@/assets/svg/NoMicrophoneIcon.vue";
import MicrophoneIcon from "@/assets/svg/MicrophoneIcon.vue";
// Utils
import {
  EndingType,
  GameType,
  Opening,
  OpeningPhase,
  Player,
  Position,
  Turn,
} from "@/shared/types";
import { Message } from "@/views/Game/Game.vue";
import { computed } from "@vue/reactivity";
import Gameboard from "./Gameboard.vue";
import ViewBaseResponsive from "./ViewBaseResponsive.vue";
const props = defineProps<{
  me: Player;
  enemy: Player;
  winner: Player;
  elos: Player;
  myColor: string;
  enemyColor: string;
  currentPlayer: Player;
  hasTimeLimit: boolean;
  messages: Message[];
  turnHistory: Turn[];
  round: number;
  gameState: GameState;
  endingType: EndingType;
  openingPhase: OpeningPhase;
  opening: Opening;
  gameType: GameType;
  askingForRematch: number;
  winningCombination: Position[];
}>();
const emit = defineEmits([
  "rematchCustom",
  "gameClick",
  "sendMessage",
  "pickGameStone",
]);
const chatInput = ref("");
const muted = ref(false);
const slideNotification = computed(() => {
  const notifications = {
    place: false,
    enemyPlace: false,
    choose: false,
    enemyChoose: false,
  };
  if (
    props.opening === Opening.Swap1 &&
    props.gameState === GameState.Running
  ) {
    if (props.openingPhase === OpeningPhase.Place3) {
      if (props.currentPlayer.socketID === props.me.socketID) {
        notifications.place = true;
      } else {
        notifications.enemyPlace = true;
      }
    } else if (props.openingPhase === OpeningPhase.PickGameStone) {
      if (props.currentPlayer.socketID === props.me.socketID) {
        notifications.choose = true;
      } else {
        notifications.enemyChoose = true;
      }
    }
  }
  return notifications;
});

const coinSide = computed(() => {
  return props.me.socketID === props.currentPlayer.socketID ? "heads" : "tails";
});
const mySymbol = computed(() => {
  if (isWaitingOrCoinflip.value) return "";
  return props.me.playerSymbol === 1 ? "circle" : "cross";
});
const enemySymbol = computed(() => {
  if (
    props.gameState === GameState.Waiting ||
    props.gameState === GameState.Coinflip
  )
    return "";
  return props.enemy.playerSymbol === 1 ? "circle" : "cross";
});
const isWaitingOrCoinflip = computed(
  () =>
    props.gameState === GameState.Waiting ||
    props.gameState === GameState.Coinflip
);
const amIWinner = computed(() => props.winner.socketID === props.me.socketID);
const myElo = computed(() => {
  if (props.me.logged) {
    if (props.elos[props.me.userID]) return props.elos[props.me.userID];
  }
  return 0;
});
watch(
  () => props.gameState,
  (gameState) => {
    if (gameState === GameState.Ended) {
      const endingSFX = new Howl({
        // TODO implement tie sound
        src: [`sounds/${amIWinner ? "victory.mp3" : "defeat.mp3"}`],
        volume: 0.2,
      });
      endingSFX.play();
    }
  }
);
watch(
  () => props.winningCombination,
  (combination) => {
    combination.forEach((position) => {
      const [x, y] = position;

      const parent = document.getElementById(String(x + y * 15));
      if (parent) {
        parent.style.outlineColor = "#e03135";
        parent.style.outlineWidth = "2px";
        parent.style.outlineOffset = "-1px";
        parent.style.outlineStyle = "solid";
      }
    });
  },
  { deep: true }
);
watch(
  () => props.messages,
  () => {
    const messageSFX = new Howl({
      src: [`sounds/message.mp3`],
      volume: muted.value ? 0 : 1.5,
    });
    messageSFX.play();
    const chatContainer = document.getElementById(
      "chatContainer"
    ) as HTMLElement;
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1);
  }
);
watch(
  () => props.openingPhase,
  (phase) => {
    if (phase === OpeningPhase.Done && props.opening === Opening.Swap1) {
      const circles = Array.from(
        document.getElementsByClassName(
          "circle"
        ) as HTMLCollectionOf<HTMLElement>
      );
      const crosses = Array.from(
        document.getElementsByClassName(
          "cross"
        ) as HTMLCollectionOf<HTMLElement>
      );
      if (props.me.playerSymbol === 1) {
        circles.forEach((circle) => {
          circle.style.color = props.myColor;
        });
        crosses.forEach((cross) => {
          cross.style.color = props.enemyColor;
        });
      } else {
        circles.forEach((circle) => {
          circle.style.color = props.enemyColor;
        });
        crosses.forEach((cross) => {
          cross.style.color = props.myColor;
        });
      }
    }
  }
);

function sendMessage() {
  chatInput.value = chatInput.value.trim();
  if (chatInput.value) {
    emit("sendMessage", chatInput.value);
    chatInput.value = "";
  }
}
</script>
<style scoped>
.custom-shadow {
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.75);
}

.fancy-background {
  /* background-image: url("../assets/svg/flowers.svg"); */
  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='30' height='40' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M1.624 19.09l6.597-1.595a.503.503 0 11.238.98L2.145 20l6.314 1.526a.504.504 0 01-.238.98l-6.597-1.595 3.426 3.426a3.813 3.813 0 005.386 0l1.1-1.1a4.584 4.584 0 000-6.475l-1.1-1.099a3.814 3.814 0 00-5.386 0zM-.911 18.377l-1.595-6.597a.504.504 0 11.98-.237L0 17.856l1.526-6.313a.503.503 0 11.98.237L.911 18.377l3.426-3.426a3.813 3.813 0 000-5.386l-1.1-1.099A4.548 4.548 0 000 7.125a4.547 4.547 0 00-3.238 1.341l-1.099 1.099a3.813 3.813 0 000 5.386zM-11.535 16.763a4.584 4.584 0 000 6.476l1.1 1.099a3.813 3.813 0 005.385 0l3.426-3.426-6.597 1.595a.501.501 0 01-.609-.371.504.504 0 01.372-.609l6.313-1.526-6.313-1.526a.504.504 0 11.237-.98l6.597 1.595-3.426-3.426a3.796 3.796 0 00-2.693-1.113c-.975 0-1.95.37-2.693 1.113zM.911 21.625l1.595 6.597a.504.504 0 11-.98.237L0 22.146l-1.526 6.313a.505.505 0 01-.98-.237l1.595-6.597-3.426 3.426a3.813 3.813 0 000 5.386l1.1 1.099a4.584 4.584 0 006.475 0l1.099-1.099a3.813 3.813 0 000-5.386zM31.624 19.09l6.597-1.595a.503.503 0 11.238.98L32.145 20l6.314 1.526a.504.504 0 01-.238.98l-6.597-1.595 3.426 3.426a3.813 3.813 0 005.386 0l1.1-1.1a4.584 4.584 0 000-6.475l-1.1-1.099a3.814 3.814 0 00-5.386 0zM29.089 18.377l-1.595-6.597a.504.504 0 11.98-.237L30 17.856l1.526-6.313a.503.503 0 11.98.237l-1.595 6.597 3.426-3.426a3.813 3.813 0 000-5.386l-1.1-1.099A4.548 4.548 0 0030 7.125a4.547 4.547 0 00-3.238 1.341l-1.099 1.099a3.813 3.813 0 000 5.386zM18.465 16.763a4.584 4.584 0 000 6.476l1.1 1.099a3.813 3.813 0 005.385 0l3.426-3.426-6.597 1.595a.501.501 0 01-.609-.371.504.504 0 01.372-.609l6.313-1.526-6.313-1.526a.504.504 0 11.237-.98l6.597 1.595-3.426-3.426a3.796 3.796 0 00-2.693-1.113c-.975 0-1.95.37-2.693 1.113zM30.911 21.625l1.595 6.597a.504.504 0 11-.98.237L30 22.146l-1.526 6.313a.505.505 0 01-.98-.237l1.595-6.597-3.426 3.426a3.813 3.813 0 000 5.386l1.1 1.099a4.584 4.584 0 006.475 0l1.099-1.099a3.813 3.813 0 000-5.386zM16.624 39.09l6.597-1.595a.503.503 0 11.238.98L17.145 40l6.314 1.526a.504.504 0 01-.238.98l-6.597-1.595 3.426 3.426a3.813 3.813 0 005.386 0l1.1-1.1a4.584 4.584 0 000-6.475l-1.1-1.099a3.814 3.814 0 00-5.386 0zM14.089 38.377l-1.595-6.597a.504.504 0 11.98-.237L15 37.856l1.526-6.313a.503.503 0 11.98.237l-1.595 6.597 3.426-3.426a3.813 3.813 0 000-5.386l-1.1-1.099A4.548 4.548 0 0015 27.125a4.547 4.547 0 00-3.238 1.341l-1.099 1.099a3.813 3.813 0 000 5.386zM3.465 36.763a4.584 4.584 0 000 6.476l1.1 1.099a3.813 3.813 0 005.385 0l3.426-3.426-6.597 1.595a.501.501 0 01-.609-.371.504.504 0 01.372-.609l6.313-1.526-6.313-1.526a.504.504 0 11.237-.98l6.597 1.595-3.426-3.426a3.796 3.796 0 00-2.693-1.113c-.975 0-1.95.37-2.693 1.113zM15.911 41.625l1.595 6.597a.504.504 0 11-.98.237L15 42.146l-1.526 6.313a.505.505 0 01-.98-.237l1.595-6.597-3.426 3.426a3.813 3.813 0 000 5.386l1.1 1.1a4.584 4.584 0 006.475 0l1.099-1.1a3.813 3.813 0 000-5.386zM16.624-.91l6.597-1.595a.503.503 0 11.238.98L17.145 0l6.314 1.526a.504.504 0 01-.238.98L16.624.912l3.426 3.426a3.813 3.813 0 005.386 0l1.1-1.1a4.584 4.584 0 000-6.475l-1.1-1.099a3.814 3.814 0 00-5.386 0zM14.089-1.623L12.494-8.22a.504.504 0 11.98-.237L15-2.144l1.526-6.313a.503.503 0 11.98.237l-1.595 6.597 3.426-3.426a3.813 3.813 0 000-5.386l-1.1-1.099A4.548 4.548 0 0015-12.875a4.547 4.547 0 00-3.238 1.341l-1.099 1.099a3.813 3.813 0 000 5.386zM3.465-3.237a4.584 4.584 0 000 6.476l1.1 1.099a3.813 3.813 0 005.385 0L13.376.912 6.779 2.507a.501.501 0 01-.609-.371.504.504 0 01.372-.609L12.855.001 6.542-1.525a.504.504 0 11.237-.98L13.376-.91 9.95-4.336a3.796 3.796 0 00-2.693-1.113c-.975 0-1.95.37-2.693 1.113zM15.911 1.625l1.595 6.597a.504.504 0 11-.98.237L15 2.146 13.474 8.46a.505.505 0 01-.98-.237l1.595-6.597-3.426 3.426a3.813 3.813 0 000 5.386l1.1 1.099a4.584 4.584 0 006.475 0l1.099-1.099a3.813 3.813 0 000-5.386z'  stroke-width='1' stroke='none' fill='hsla(336, 100%, 56%, 1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
  background-repeat: repeat;
}

.absolute-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* md */
@media (max-width: 768px) {
  .square {
    width: 95vw;
    height: 95vw;
  }
}
@media (min-width: 768px) and (max-width: 1280px) {
  .square {
    width: 80vw;
    height: 80vw;
  }
}
@media (min-width: 1280px) {
  .square {
    width: 85vh;
    height: 85vh;
  }
}
</style>
