<template>
  <view-base-fixed-height>
    <!-- Background top overlay -->
    <div class="absolute top-16 w-full h-2/6 bg-gray-800 z-0"></div>
    <!-- Main div -->
    <div
      ref="container"
      class="xl:w-80 w-full overflow-hidden rounded-lg top-0 min-h-full custom-shadow bg-gray-600 z-10 flex xl:flex-row flex-col shadow-2xl"
    >
      <!-- Game container -->
      <div
        ref="gameContainer"
        class="dark:bg-gray-700 w-0 grid-template-15 relative"
      >
        <!-- Cell grid -->
        <div
          v-for="cellID in genArray"
          :key="cellID"
          :id="String(cellID)"
          class="bg-white dark:bg-gray-500 cursor-pointer relative"
          :class="
            lastPositionID == cellID && round !== 0 ? 'currPositionOutline' : ''
          "
          @click="gameClick(cellID)"
          @mouseenter="placeHoverStone(cellID)"
          @mouseleave="removeHoverStone(cellID)"
        ></div>
        <!-- Coinflip overlay -->
        <div
          class="absolute z-20 flex place-items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-700"
          v-if="isWaitingOrCoinflip"
        >
          <!-- Coin -->
          <div id="coin" :class="coinSide" v-if="isGameStateCoinflip">
            <!-- heads -->
            <div class="side-a" :style="`background-color:${myColor};`"></div>
            <!-- tails -->
            <div
              class="side-b"
              :style="`background-color:${enemyColor};`"
            ></div>
          </div>
        </div>

        <!-- After game overlay -->
        <the-after-game-overlay
          v-show="isGameStateEnded"
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
        <transition>
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
              <transition name="slidetop">
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
                      <game-stone-circle-svg
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
                      <game-stone-cross-svg
                        class="h-8 w-8"
                        :style="`color:${
                          mySymbol === 'cross' ? myColor : enemyColor
                        };`"
                      />
                    </button>
                  </div>
                </div>
              </transition>
              <transition name="slidetop">
                <p class="text-lg" v-if="slideNotification.enemyChoose">
                  Opponent is choosing their symbol
                </p>
              </transition>
              <transition name="slidetop">
                <p class="text-lg" v-if="slideNotification.enemyPlace">
                  Enemy is placing 3 first stones
                </p>
              </transition>
              <transition name="slidetop">
                <p class="text-lg" v-if="slideNotification.place">
                  Place 3 first stones
                </p>
              </transition>
            </div>
          </div>
        </transition>
        <!-- Social Blades -->
        <div class="flex flex-col">
          <social-blade
            :player="me"
            :symbol="mySymbol"
            :symbolColor="myColor"
            :hasTimeLimit="hasTimeLimit"
            :isActive="currentPlayer.socketID === me.socketID"
          ></social-blade>
          <div
            class="m-auto my-3 text-3xl text-white font-semibold md:block hidden"
          >
            VS
          </div>
          <div class="md:hidden block my-2"></div>
          <social-blade
            :player="enemy"
            :symbol="enemySymbol"
            :symbolColor="enemyColor"
            :hasTimeLimit="hasTimeLimit"
            :isActive="currentPlayer.socketID === enemy.socketID"
          ></social-blade>
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
            <no-mic-icon-svg v-show="muted" class="h-6 stroke-current" />
            <mic-icon-svg v-show="!muted" class="h-6 stroke-current" />
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
            <chat-message
              v-for="message in messages"
              v-show="!muted"
              :text="message.text"
              :author="message.author"
              :key="message.text + message.author"
              :borderColorHEX="message.author === 'me' ? myColor : enemyColor"
            ></chat-message>
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
    <!-- Symbol origins -->
    <div>
      <game-stone-circle-svg
        id="svgCircleOrigin"
        class="hidden"
        :style="`color:${mySymbol === 'circle' ? myColor : enemyColor};`"
      />
      <game-stone-cross-svg
        id="svgCrossOrigin"
        class="hidden"
        :style="`color:${mySymbol === 'cross' ? myColor : enemyColor};`"
      />
    </div>
  </view-base-fixed-height>
</template>
<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
// Types
import { GameState } from "@/types";
// Howler
import { Howl } from "howler";
// Components
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import TheAfterGameOverlay from "@/components/TheAfterGameOverlay.vue";
import SocialBlade from "@/components/GameSocialBlade.vue";
import ChatMessage from "@/components/GameChatMessage.vue";
// SVGs
import GameStoneCrossSvg from "@/assets/svg/GameStoneCross.svg.vue";
import GameStoneCircleSvg from "@/assets/svg/GameStoneCircleSvg.vue";
import NoMicIconSvg from "@/assets/svg/NoMicIconSvg.vue";
import MicIconSvg from "@/assets/svg/MicIconSvg.vue";
// Utils
import {
  EndingType,
  GameType,
  Opening,
  OpeningPhase,
  Player,
} from "@/shared/types";
import { Message } from "@/views/Game/Game.vue";

export default defineComponent({
  name: "GameBase",
  components: {
    ViewBaseFixedHeight,
    // Components
    TheAfterGameOverlay,
    SocialBlade,
    ChatMessage,
    //SVGs
    GameStoneCrossSvg,
    GameStoneCircleSvg,
    MicIconSvg,
    NoMicIconSvg,
  },
  props: {
    // Player info
    me: { type: Object as PropType<Player>, required: true },
    enemy: { type: Object as PropType<Player>, required: true },
    winner: { type: Object as PropType<Player>, required: true },
    elos: { type: Object as PropType<Player>, required: true },
    myColor: { type: String, required: true },
    enemyColor: { type: String, required: true },
    currentPlayer: { type: Object as PropType<Player>, required: true },
    // General
    hasTimeLimit: Boolean,
    messages: { type: Array as PropType<Message[]>, required: true },
    lastPositionID: Number,
    round: { type: Number, required: true },
    gameState: { type: Object as PropType<GameState>, required: true },
    endingType: { type: Object as PropType<EndingType>, required: true },
    openingPhase: { type: Object as PropType<OpeningPhase>, required: true },
    opening: { type: Object as PropType<Opening>, required: true },
    gameType: { type: Object as PropType<GameType>, required: true },
    askingForRematch: { type: Number, required: true },
  },
  emits: ["rematchCustom", "gameClick", "sendMessage", "pickGameStone"],
  data(): {
    chatInput: string;
    muted: boolean;
  } {
    return {
      chatInput: "",
      muted: false,
    };
  },
  computed: {
    slideNotification() {
      const notifications = {
        place: false,
        enemyPlace: false,
        choose: false,
        enemyChoose: false,
      };
      if (
        this.opening === Opening.Swap1 &&
        this.gameState === GameState.Running
      ) {
        if (this.openingPhase === OpeningPhase.Place3) {
          if (this.currentPlayer.socketID === this.me.socketID) {
            notifications.place = true;
          } else {
            notifications.enemyPlace = true;
          }
        } else if (this.openingPhase === OpeningPhase.PickGameStone) {
          if (this.currentPlayer.socketID === this.me.socketID) {
            notifications.choose = true;
          } else {
            notifications.enemyChoose = true;
          }
        }
      }
      return notifications;
    },
    coinSide(): string {
      return this.me.socketID === this.currentPlayer.socketID
        ? "heads"
        : "tails";
    },
    mySymbol(): string {
      if (this.isWaitingOrCoinflip) return "";
      return this.me.playerSymbol === 1 ? "circle" : "cross";
    },
    enemySymbol(): string {
      if (this.isWaitingOrCoinflip) return "";
      return this.enemy.playerSymbol === 1 ? "circle" : "cross";
    },
    isWaitingOrCoinflip(): boolean {
      return (
        this.gameState === GameState.Waiting ||
        this.gameState === GameState.Coinflip
      );
    },
    isGameStateCoinflip(): boolean {
      return this.gameState === GameState.Coinflip;
    },
    isGameStateEnded(): boolean {
      return this.gameState === GameState.Ended;
    },
    isGameStateWaiting(): boolean {
      return this.gameState === GameState.Waiting;
    },
    amIWinner(): boolean {
      return this.winner.socketID === this.me.socketID;
    },
    myElo(): number {
      if (this.me.logged) {
        if (this.elos[this.me.userID]) return this.elos[this.me.userID];
      }
      return 0;
    },
    genArray(): number[] {
      const array: number[] = [];

      for (let i = 0; i < 225; i++) {
        array.push(i);
      }

      return array;
    },
  },
  watch: {
    lastPositionID: function () {
      this.placeStone(this.lastPositionID!);
    },
    gameState: function () {
      if (this.gameState === GameState.Ended) {
        const endingSFX = new Howl({
          // TODO implement tie sound
          src: [
            `sounds/${
              this.winner.socketID === this.me.socketID
                ? "victory.mp3"
                : "defeat.mp3"
            }`,
          ],
          volume: 0.2,
        });
        endingSFX.play();
      }
    },
    messages: {
      handler() {
        const messageSFX = new Howl({
          src: [`sounds/message.mp3`],
          volume: this.muted ? 0 : 1.5,
        });
        messageSFX.play();
        const chatContainer = document.getElementById(
          "chatContainer"
        ) as HTMLElement;
        setTimeout(() => {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 1);
      },
      deep: true,
    },
    openingPhase: function () {
      if (
        this.openingPhase === OpeningPhase.Done &&
        this.opening === Opening.Swap1
      ) {
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
        if (this.me.playerSymbol === 1) {
          circles.forEach((circle) => {
            circle.style.color = this.myColor;
          });
          crosses.forEach((cross) => {
            cross.style.color = this.enemyColor;
          });
        } else {
          circles.forEach((circle) => {
            circle.style.color = this.enemyColor;
          });
          crosses.forEach((cross) => {
            cross.style.color = this.myColor;
          });
        }
      }
    },
  },
  methods: {
    gameClick(id: number) {
      const position = [id % 15, Math.floor(id / 15)];
      this.$emit("gameClick", position);
    },

    placeStone(id: number) {
      let node: HTMLElement | null;
      if (this.round % 2 === 1) {
        node = document.getElementById("svgCircleOrigin");
      } else {
        node = document.getElementById("svgCrossOrigin");
      }
      const clone = node?.cloneNode(true) as HTMLElement;

      if (this.round % 2 === 1) {
        clone.classList.add("circle");
      } else {
        clone.classList.add("cross");
      }

      clone.id = `${id}symbol`;
      clone.classList.remove("hidden");
      clone.classList.add("svgCC");

      document.getElementById(String(id))?.appendChild(clone);

      const stonePlacedSoundEffect = new Howl({
        src: ["sounds/click1.ogg"],
        volume: 0.8,
      });
      stonePlacedSoundEffect.play();
    },
    placeHoverStone(id: number) {
      if (this.currentPlayer.socketID !== this.me.socketID) {
        return;
      }
      const parent = document.getElementById(String(id));
      if (parent) {
        if (parent.children.length > 0) {
          return;
        }
      }

      let node: HTMLElement | null;

      // assuming next round, hence the +1 on rounds
      if ((this.round + 1) % 2 === 1) {
        node = document.getElementById("svgCircleOrigin");
      } else {
        node = document.getElementById("svgCrossOrigin");
      }
      const clone = node?.cloneNode(true) as HTMLElement;

      if ((this.round + 1) % 2 === 1) {
        clone.classList.add("circle");
      } else {
        clone.classList.add("cross");
      }

      clone.id = `${id}symbol`;
      clone.classList.remove("hidden");
      clone.classList.add("svgCC");
      clone.classList.add("svgCCHover");

      parent?.appendChild(clone);
    },
    removeHoverStone(id: number) {
      const parent = document.getElementById(String(id));
      const hoverChildren = parent?.getElementsByClassName("svgCCHover");
      if (hoverChildren) {
        hoverChildren[0].remove();
      }
    },

    sendMessage() {
      this.chatInput = this.chatInput.trim();
      if (this.chatInput) {
        this.$emit("sendMessage", this.chatInput);
        this.chatInput = "";
      }
    },
    // "SQUARING" the game container window
    equalizeGameContDimensions() {
      const container = this.$refs.container as HTMLElement;
      const gameContainer = this.$refs.gameContainer as HTMLElement;

      const smallerDimension = Math.min(
        container.clientHeight,
        container.clientWidth
      );

      gameContainer.style.width = smallerDimension + "px";
      gameContainer.style.height = smallerDimension + "px";
    },
  },
  mounted() {
    this.equalizeGameContDimensions();
    window.addEventListener("resize", this.equalizeGameContDimensions);
  },
  unmounted() {
    window.removeEventListener("resize", this.equalizeGameContDimensions);
  },
});
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

.svgCC {
  width: 85%;
  position: absolute;
  display: block !important;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-animation: opacityIn 0.5s forwards;
  animation: opacityIn 0.5s forwards;
  opacity: 1;
}

.svgCCHover {
  opacity: 0.3 !important;
}

.currPositionOutline {
  outline: rgb(54, 54, 54) solid 4px;
  z-index: 10;
}

.absolute-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.grid-template-15 {
  display: grid;
  row-gap: 2px;
  column-gap: 2px;
  grid-template-rows: repeat(15, minmax(0, 1fr));
  grid-template-columns: repeat(15, minmax(0, 1fr));
}

/* Coinflip styles */
#coin {
  width: 100px;
  height: 100px;
  cursor: default;
}

@media only screen and (min-width: 768px) {
  #coin {
    width: 200px;
    height: 200px;
  }
}

#coin div {
  width: 100%;
  height: 100%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  -webkit-box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
    0 12px 20px -10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
    0 12px 20px -10px rgba(0, 0, 0, 0.4);
  box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
    0 12px 20px -10px rgba(0, 0, 0, 0.4);
}

#coin {
  transition: -webkit-transform 1s ease-in;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}
#coin div {
  position: absolute;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.side-a {
  z-index: 100;
}
.side-b {
  transform: rotateY(-180deg);
}
#coin.heads {
  -webkit-animation: flipHeads 3s ease-in-out forwards;
  -moz-animation: flipHeads 3s ease-in-out forwards;
  -o-animation: flipHeads 3s ease-in-out forwards;
  animation: flipHeads 3s ease-in-out forwards;
}
#coin.tails {
  -webkit-animation: flipTails 3s ease-in-out forwards;
  -moz-animation: flipTails 3s ease-in-out forwards;
  -o-animation: flipTails 3s ease-in-out forwards;
  animation: flipTails 3s ease-in-out forwards;
}
@keyframes flipHeads {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(1800deg);
    -moz-transform: rotateY(1800deg);
    transform: rotateY(1800deg);
  }
}
@keyframes flipTails {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(1980deg);
    -moz-transform: rotateY(1980deg);
    transform: rotateY(1980deg);
  }
}
</style>
