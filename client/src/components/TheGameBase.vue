<template>
  <view-base-fixed-height>
    <!-- Background top overlay -->
    <div class="absolute top-16 w-full h-2/6 bg-gray-800  z-0"></div>
    <!-- Game window -->
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
          :id="cellID"
          class="bg-white dark:bg-gray-500 cursor-pointer relative"
          :class="
            lastPositionID == cellID && round !== 0 ? 'currPositionOutline' : ''
          "
          @click="gameClick(cellID)"
        ></div>
        <!-- Button for toggling after game overlay -->
        <button
          v-show="!afterGameModal && isGameStateEnded"
          @click="afterGameModal = true"
          class="absolute top-2 left-2 p-1 rounded-full bg-gray-200  text-gray-900 focus:outline-none"
        >
          <OpenOverlaySVG class="h-8 stroke-current" />
        </button>
        <!-- Coinflip overlay -->
        <div
          class="absolute z-20 flex place-items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-700"
          v-if="isGameStateWaitingOrCoinflip"
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
        <transition name="bounce">
          <div
            class="absolute z-20 flex p-6 xl:p-12 flex-col h-full w-full bg-gray-100 dark:bg-gray-700"
            :class="
              afterGameModal
                ? isGameEndingVictory
                  ? 'confetti-background'
                  : 'rainy-background'
                : 'minimizeAfterGameModal'
            "
            v-show="isGameStateEnded && afterGameModal"
          >
            <div
              class="w-full h-full rounded-lg p-4 bg-white dark:bg-gray-500 shadow-2xl flex relative flex-col"
            >
              <button
                class="absolute top-3 left-3 p-1 rounded-full bg-gray-200 dark:bg-gray-300 text-gray-900 focus:outline-none"
                @click="afterGameModal = false"
              >
                <CloseIconSVG class="h-8 stroke-current" />
              </button>
              <h1
                class="w-full text-center text-5xl p-4 xl:text-7xl font-medium text text-gomoku-blue"
              >
                {{ isGameEndingVictory ? "Victory!" : "Defeat!" }}
              </h1>
              <h3
                v-show="isGameEndindVictoryByDisconnect"
                class="w-full text-center text-gray-800 text-2xl"
              >
                Opponent has disconnected
              </h3>
              <router-link
                :to="newGameURL"
                class="w-full mt-2 xl:mt-8 py-2 text-center rounded-lg text-gray-50 font-medium text-lg bg-gomoku-blue hover:bg-gomoku-blue-dark focus:bg-gomoku-blue-dark"
              >
                New Game
              </router-link>
              <div class="flex-1 relative">
                <!-- Overlay victory -->
                <VictoryConfettiConeSVG
                  class="absolute bottom-0 xl:bottom-10 left-0 xl:left-10 h-80 xl:h-50"
                  v-show="isGameEndingVictory"
                />
                <VictoryConfettiConeSVG
                  v-show="isGameEndingVictory"
                  class="absolute bottom-10 transform -rotate-90 right-10 h-0 xl:h-50"
                />
                <!-- Overlay defeat -->
                <DefeatConeSVG
                  class="absolute bottom-0 left-0 xl:bottom-10 xl:left-10 h-80 xl:h-50"
                  v-show="!isGameEndingVictory"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- Socials container -->
      <div
        ref="chatContainer"
        class="flex-1 min-h-0 min-w-0 w-full flex flex-col p-4 relative"
      >
        <!-- Social Blades -->
        <div class="flex flex-col">
          <social-blade
            :symbol="mySymbol"
            :symbolColor="myColor"
            :time="myTime"
            :nickname="myNickname"
            :logged="myLogged"
            :iconName="myIconName"
            :userID="myUserID"
          ></social-blade>
          <div class="m-auto my-3 text-3xl text-white font-semibold">VS</div>
          <social-blade
            :symbol="enemySymbol"
            :symbolColor="enemyColor"
            :time="enemyTime"
            :nickname="enemyNickname"
            :logged="enemyLogged"
            :iconName="enemyIconName"
            :userID="enemyUserID"
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
            @click="toogleMute"
          >
            <MutedIconSVG v-show="muted" class="h-6 stroke-current" />
            <UnmutedIconSVG v-show="!muted" class="h-6 stroke-current" />
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
            style="scroll-behavior: smooth;"
          >
            <chat-message
              v-for="message in messages"
              v-show="!muted"
              :text="message.text"
              :author="message.author"
              :key="message"
              :borderColorHEX="message.author === 'me' ? myColor : enemyColor"
            ></chat-message>
            <!-- Muted overlay -->
            <div
              v-show="muted"
              class="w-90 h-90 absolute-center flex place-items-center justify-center font-medium text-gray-100 text-lg  bg-gray-600 rounded-xl"
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
      <CrossOriginSVG
        :amIStartingPlayer="amIStartingPlayer"
        :enemyColor="enemyColor"
        :myColor="myColor"
      />
      <CircleOriginSVG
        :amIStartingPlayer="amIStartingPlayer"
        :enemyColor="enemyColor"
        :myColor="myColor"
      />
    </div>
  </view-base-fixed-height>
</template>
<script lang="ts">
// Types
import { GameState, Ending } from "@/types";
enum Symbol {
  Cross,
  Circle,
}
// Howler
import { Howl, Howler } from "howler";
// SVGs
import VictoryConfettiConeSVG from "@/components/SVGVictoryConfettiCone.vue";
import CircleOriginSVG from "@/components/SVGCircleOrigin.vue";
import CrossOriginSVG from "@/components/SVGCrossOrigin.vue";
import OpenOverlaySVG from "@/components/SVGOpenOverlay.vue";
import CloseIconSVG from "@/components/SVGCloseIcon.vue";
import DefeatConeSVG from "@/components/SVGDefeatCone.vue";
import MutedIconSVG from "@/components/SVGMutedIcon.vue";
import UnmutedIconSVG from "@/components/SVGUnmutedIcon.vue";
// Components
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import SocialBlade from "@/components/GameSocialBlade.vue";
import ChatMessage from "@/components/GameChatMessage.vue";
// Utils
import { defineComponent } from "vue";

export default defineComponent({
  name: "GameBase",
  components: {
    ViewBaseFixedHeight,
    SocialBlade,
    ChatMessage,
    //SVGs
    CircleOriginSVG,
    CrossOriginSVG,
    VictoryConfettiConeSVG,
    DefeatConeSVG,
    OpenOverlaySVG,
    CloseIconSVG,
    MutedIconSVG,
    UnmutedIconSVG,
  },
  props: {
    myTime: Number,
    enemyTime: String,
    amIStartingPlayer: Boolean,
    myLogged: Boolean,
    enemyLogged: Boolean,
    myIconName: String,
    enemyIconName: String,
    myNickname: String,
    myUserID: Number,
    enemyUserID: Number,
    enemyNickname: String,
    myColor: String,
    enemyColor: String,
    messages: Array,
    lastPositionID: Number,
    round: Number,
    gameState: String,
    gameEnding: String,
  },
  data() {
    return {
      chatInput: "",
      afterGameModal: true,
      muted: false,
      gameType: "",
    };
  },
  computed: {
    coinSide(): string {
      return this.amIStartingPlayer ? "heads" : "tails";
    },
    mySymbol(): string {
      if (this.isGameStateWaitingOrCoinflip) return "";
      return this.amIStartingPlayer ? "circle" : "cross";
    },
    enemySymbol(): string {
      if (this.isGameStateWaitingOrCoinflip) return "";
      return !this.amIStartingPlayer ? "circle" : "cross";
    },
    genArray() {
      const array: number[] = [];

      for (let i = 0; i < 225; i++) {
        array.push(i);
      }

      return array;
    },
    // FIXME Replacament for template in-place enums, might remove and move it if I find how
    isGameStateCoinflip(): boolean {
      return this.gameState === GameState.Coinflip;
    },
    isGameStateEnded(): boolean {
      return this.gameState === GameState.Ended;
    },
    isGameStateWaiting(): boolean {
      return this.gameState === GameState.Waiting;
    },
    isGameStateWaitingOrCoinflip(): boolean {
      return this.isGameStateWaiting || this.isGameStateCoinflip;
    },
    isGameEndingVictory(): boolean {
      return (
        this.gameEnding === Ending.VictoryFiveInRow ||
        this.gameEnding === Ending.VictoryTimeout ||
        this.gameEnding === Ending.VictoryDisconnect
      );
    },
    isGameEndindVictoryByDisconnect(): boolean {
      return this.gameEnding === Ending.VictoryDisconnect;
    },
    newGameURL(): string {
      return `search?type=${this.gameType || ""}`;
    },
  },
  watch: {
    lastPositionID: function() {
      this.placeStone(this.lastPositionID!);
    },
    gameState: function() {
      if (this.gameState === GameState.Ended) {
        const endingSFX = new Howl({
          src: [
            `sounds/${this.isGameEndingVictory ? "victory.mp3" : "defeat.mp3"}`,
          ],
          volume: 0.4,
        });
        endingSFX.play();
      }
    },
    messages: {
      handler() {
        const messageSFX = new Howl({
          src: [`sounds/message.mp3`],
          volume: 1.5,
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
  },
  methods: {
    gameClick(id: number) {
      const position = [id % 15, Math.floor(id / 15)];
      this.$emit("gameClick", position);
    },
    placeStone(id: number) {
      let node;
      if (this.round! % 2 === 1) {
        node = document.getElementById("svgCircleOrigin");
      } else {
        node = document.getElementById("svgCrossOrigin");
      }
      const clone = node?.cloneNode(true) as HTMLElement;

      clone.id = `${id}symbol`;
      clone.classList.remove("hidden");
      clone.classList.add("svgCC");

      document.getElementById(String(id))?.appendChild(clone);

      const stonePlacedSoundEffect = new Howl({
        src: ["sounds/click1.ogg"],
      });
      stonePlacedSoundEffect.play();
    },
    sendMessage() {
      this.chatInput = this.chatInput.trim();
      if (this.chatInput) {
        this.$emit("sendMessage", this.chatInput);
        this.chatInput = "";
      }
    },
    toogleMute() {
      this.muted = !this.muted;
    },
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
    // FIXME why do I need to call it twice --> otherwise it doesn't fit fully and on small devices leaves a bar on side
    setTimeout(() => {
      this.equalizeGameContDimensions();
    }, 1);

    window.addEventListener("resize", this.equalizeGameContDimensions);

    const urlParams = new URLSearchParams(window.location.search);

    const gameType = urlParams.get("type");
    this.gameType = gameType || "";
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

.minimizeAfterGameModal {
  animation: minimizeAfterGameModal 0.5s forwards;
}

.confetti-background {
  background-image: url("../assets/img/confetti.png");
  background-repeat: repeat;
}
.rainy-background {
  background-image: url("../assets/img/rainy.png");
  background-repeat: space;
}

@keyframes minimizeAfterGameModal {
  0% {
    transform: scale(1);
  }
  0% {
    transform: scale(0) translate(-50%, -50%);
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
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
