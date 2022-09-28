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
          <chevrons-down-icon-svg class="h-8 w-8 -rotate-45 transform" />
        </button>
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
        <transition name="bounce">
          <div
            class="absolute z-20 flex p-6 xl:p-12 flex-col h-full w-full bg-gray-100 dark:bg-gray-700"
            :class="
              afterGameModal
                ? isTie
                  ? amIWinner
                    ? 'victory-background'
                    : 'defeat-background'
                  : 'tie-background'
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
                <cross-icon-svg class="h-8" />
              </button>
              <h1
                class="w-full text-center text-5xl p-4 xl:text-7xl font-medium text text-gomoku-blue"
              >
                {{ amIWinner ? "Victory!" : "Defeat!" }}
              </h1>
              <h3
                v-show="hasEndedByDisconnect"
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
            </div>
          </div>
        </transition>
      </div>
      <!-- Socials container -->
      <div
        ref="chatContainer"
        class="flex-1 min-h-0 min-w-0 w-full flex flex-col p-4 relative"
      >
        <transition>
          <div
            class="fancy-background px-4 py-2 rounded-lg flex justify-center place-items-center w-full h-14 md:h-16  mb-4 bg-gray-100"
          >
            <div
              v-if="
                slideNotification.enemyChoose ||
                  slideNotification.choose ||
                  slideNotification.place ||
                  slideNotification.enemyPlace
              "
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
                        :style="`color:${myColor}`"
                      />
                    </button>
                    <button
                      @click="$emit('pickGameStone', 2)"
                      class="border-2 p-1 border-gray-700 dark:border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl"
                    >
                      <game-stone-cross-svg
                        class="h-8 w-8"
                        :style="`color:${enemyColor}`"
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
            @click="toogleMute"
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
import type {PropType} from "vue"
import { defineComponent } from "vue";
// Types
import { GameState } from "@/types";
// Howler
import { Howl } from "howler";
// Components
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import SocialBlade from "@/components/GameSocialBlade.vue";
import ChatMessage from "@/components/GameChatMessage.vue";
// SVGs
import GameStoneCrossSvg from "@/assets/svg/GameStoneCross.svg.vue";
import GameStoneCircleSvg from "@/assets/svg/GameStoneCircleSvg.vue";
import CrossIconSvg from "@/assets/svg/CrossIconSvg.vue";
import ChevronsDownIconSvg from "@/assets/svg/ChevronsDownIconSvg.vue";
import NoMicIconSvg from "@/assets/svg/NoMicIconSvg.vue"
import MicIconSvg from "@/assets/svg/MicIconSvg.vue";
// Utils
import { EndingType, GameType, Opening, OpeningPhase, Player } from "@/shared/types";
import { Message } from "@/views/Game/Game.vue";

export enum PlayerSymbol {
  Cross = 'cross',
  Circle = 'circle',
  Undefined = 'undefined'
}

export default defineComponent({
  name: "GameBase",
  components: {
    ViewBaseFixedHeight,
    // Components
    SocialBlade,
    ChatMessage,
    //SVGs
    CrossIconSvg,
    ChevronsDownIconSvg,
    GameStoneCrossSvg,
    GameStoneCircleSvg,
    MicIconSvg,
    NoMicIconSvg,
  },
  props: {
    // Player info
    me:{type: Object as PropType<Player>,required:true},
    enemy:{type:Object as PropType<Player>,required:true},
    winner:{type:Object as PropType<Player>,required:true},
    elos:{type:Object as PropType<Player>,required:true},
    myColor: {type:String,required:true},
    enemyColor: {type:String,required:true},
    currentPlayer:{type:Object as PropType<Player>,required:true},
    // General
    hasTimeLimit: Boolean,
    messages: {type:Array as PropType<Message[]>,required:true},
    lastPositionID: Number,
    round: {type:Number,required:true},
    gameState: {type: Object as PropType<GameState>,required:true},
    endingType:{type:Object as PropType<EndingType>,required:true},
    openingPhase:{type:Object as PropType<OpeningPhase>, required:true},
    opening:{type:Object as PropType<Opening>,required:true}
  },
  data(): {
    chatInput: string;
    afterGameModal: boolean;
    muted: boolean;
    gameType: GameType;
  } {
    return {
      chatInput: "",
      afterGameModal: true,
      muted: false,
      gameType: GameType.Quick,
    };
  },
  computed: {
    slideNotification(){
      const notifications = {place:false,enemyPlace:false,choose:false,enemyChoose:false}
      if(this.opening === Opening.Swap1 && this.gameState === GameState.Running){
        if(this.openingPhase === OpeningPhase.Place3){
          if(this.currentPlayer.socketID === this.me.socketID){
            notifications.place = true
          }else {
            notifications.enemyPlace = true
          }
        } else if (this.openingPhase === OpeningPhase.PickGameStone){
          if(this.currentPlayer.socketID === this.me.socketID){
            notifications.choose = true;
          }else {
            notifications.enemyChoose = true;
          }
        }
      }
      return notifications
    },
    coinSide(): string {
      return this.me.socketID === this.currentPlayer.socketID ? "heads" : "tails";
    },
    mySymbol(): string {
      if (this.isWaitingOrCoinflip) return "";
      return this.me.playerSymbol===1? "circle" : "cross";
    },
    enemySymbol(): string {
      if (this.isWaitingOrCoinflip) return "";
      return this.enemy.playerSymbol===1 ? "circle" : "cross";
    },
    isWaitingOrCoinflip():boolean{
      return this.gameState === GameState.Waiting || this.gameState === GameState.Coinflip
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
    isTie():boolean {
      return this.endingType === EndingType.Tie
    },
    amIWinner():boolean{
      return this.winner.socketID === this.me.socketID
    },
    hasEndedByDisconnect():boolean{
      return this.endingType === EndingType.Surrender
    },
    hasEndedByTimeLimit():boolean{
      return this.endingType === EndingType.Time
    },
    hasEndedByCombination():boolean{
      return this.endingType === EndingType.Combination
    },
    myElo():number{
      if(this.me.logged){
        if (this.elos[this.me.userID]) return this.elos[this.me.userID]
      }
      return 0
    },
    genArray() {
      const array: number[] = [];

      for (let i = 0; i < 225; i++) {
        array.push(i);
      }

      return array;
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
          // TODO implement tie sound
          src: [
            `sounds/${this.winner.socketID === this.me.socketID ? "victory.mp3" : "defeat.mp3"}`,
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
    openingPhase:function(){
      if(this.openingPhase === OpeningPhase.Done && this.opening === Opening.Swap1){
        const circles = Array.from(document.getElementsByClassName("circle")as HTMLCollectionOf<HTMLElement>);
        const crosses = Array.from(document.getElementsByClassName("cross")as HTMLCollectionOf<HTMLElement>);
        if(this.me.playerSymbol===1){
          circles.forEach((circle)=>{
            circle.style.color = this.myColor;
          })
          crosses.forEach((cross)=>{
            cross.style.color = this.enemyColor
          })
        }else{

          circles.forEach((circle)=>{
            circle.style.color = this.enemyColor;
          })
          crosses.forEach((cross)=>{
            cross.style.color = this.myColor
          })
        }
      }
    }
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


      if (this.round! % 2 === 1) {
        clone.classList.add('circle')
      } else {
        clone.classList.add("cross")
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

    window.addEventListener("resize", this.equalizeGameContDimensions);

    const urlParams = new URLSearchParams(window.location.search);

    const gameType = urlParams.get("type");
    this.gameType = gameType as GameType;
  },
  unmounted() {
    window.removeEventListener("resize", this.equalizeGameContDimensions);
  },
});
</script>
<style scoped>
.slidetop-enter-active {
  animation: slidetop-in 0.5s ease-in;
  white-space: nowrap;
}
.slidetop-leave-active {
  animation: slidetop-out 0.5s ease-out;
  white-space: nowrap;
}
@keyframes slidetop-in {
  0% {
    transform: translateX(-40px);
    opacity: 0%;
  }

  100% {
    transform: translateX(40px);
    opacity: 100%;
  }
}

@keyframes slidetop-out {
  0% {
    transform: translateX(-40px);
    opacity: 100%;
  }

  100% {
    transform: translateX(40px);
    opacity: 0%;
  }
}

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

.fancy-background {
  /* background-image: url("../assets/svg/flowers.svg"); */
  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='25' height='13' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M15.044 22.25a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5 2.5 2.5 0 012.5 2.5m2.5 0a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5 5 5 0 015 5m2.5 0a7.5 7.5 0 01-7.5 7.5 7.5 7.5 0 01-7.5-7.5 7.5 7.5 0 017.5-7.5 7.5 7.5 0 017.5 7.5m2.5 0a10 10 0 01-10 10 10 10 0 01-10-10 10 10 0 0110-10 10 10 0 0110 10m2.5 0a12.5 12.5 0 01-12.5 12.5 12.5 12.5 0 01-12.5-12.5 12.5 12.5 0 0112.5-12.5 12.5 12.5 0 0112.5 12.5m0-9a2.5 2.5 0 00-2.363 1.688 12.5 12.5 0 011.672 3.212 12.5 12.5 0 010 .002 2.5 2.5 0 00.69.098 2.5 2.5 0 002.5-2.5 2.5 2.5 0 00-2.5-2.5zm0-2.5a5 5 0 00-4.143 2.203 12.5 12.5 0 014.053 7.795 5 5 0 00.09.002 5 5 0 005-5 5 5 0 00-5-5zm-.037-2.5a7.5 7.5 0 00-6.125 3.227 12.5 12.5 0 016.162 10.773 12.5 12.5 0 01-.041 1 7.5 7.5 0 00.04 0 7.5 7.5 0 007.5-7.5 7.5 7.5 0 00-7.5-7.5 7.5 7.5 0 00-.036 0zm.017-2.5a10 10 0 00-8.441 4.672 12.5 12.5 0 018.46 11.828 12.5 12.5 0 01-.495 3.488 10 10 0 00.496.012 10 10 0 0010-10 10 10 0 00-10-10 10 10 0 00-.02 0zm.006-2.5a12.5 12.5 0 00-10.998 6.588 12.5 12.5 0 01.29.039 12.5 12.5 0 01.005 0 12.5 12.5 0 01.29.045 12.5 12.5 0 01.003 0 12.5 12.5 0 01.58.113 12.5 12.5 0 01.004 0 12.5 12.5 0 011.123.3 12.5 12.5 0 01.02.007 12.5 12.5 0 01.006.002 12.5 12.5 0 01.277.093 12.5 12.5 0 01.8.31 12.5 12.5 0 01.032.01 12.5 12.5 0 01.033.016 12.5 12.5 0 01.492.223 12.5 12.5 0 01.016.008 12.5 12.5 0 01.004.002 12.5 12.5 0 01.523.271 12.5 12.5 0 01.006.002 12.5 12.5 0 01.254.143 12.5 12.5 0 01.004.002 12.5 12.5 0 01.252.15 12.5 12.5 0 01.004.002 12.5 12.5 0 01.248.156 12.5 12.5 0 01.004.002 12.5 12.5 0 01.244.16 12.5 12.5 0 01.004.002 12.5 12.5 0 01.24.168 12.5 12.5 0 01.004.002 12.5 12.5 0 01.236.174 12.5 12.5 0 01.004.002 12.5 12.5 0 01.233.18 12.5 12.5 0 01.004.002 12.5 12.5 0 01.228.183 12.5 12.5 0 01.004.002 12.5 12.5 0 01.223.19 12.5 12.5 0 01.004.002 12.5 12.5 0 01.218.195 12.5 12.5 0 01.032.03 12.5 12.5 0 01.185.173 12.5 12.5 0 01.004.002 12.5 12.5 0 01.209.205 12.5 12.5 0 01.004.004 12.5 12.5 0 01.205.21 12.5 12.5 0 01.002.001 12.5 12.5 0 01.2.215 12.5 12.5 0 01.003.004 12.5 12.5 0 01.193.219 12.5 12.5 0 01.004.003 12.5 12.5 0 01.19.223 12.5 12.5 0 01.004.004 12.5 12.5 0 01.363.463 12.5 12.5 0 01.004.004 12.5 12.5 0 01.172.236 12.5 12.5 0 01.004.004 12.5 12.5 0 01.166.24 12.5 12.5 0 01.002.004 12.5 12.5 0 01.162.244 12.5 12.5 0 01.002.004 12.5 12.5 0 01.156.248 12.5 12.5 0 01.03.05 12.5 12.5 0 01.251.437 12.5 12.5 0 01.016.029 12.5 12.5 0 01.01.02 12.5 12.5 0 01.263.507 12.5 12.5 0 01.002.004 12.5 12.5 0 01.125.266 12.5 12.5 0 01.002.004 12.5 12.5 0 01.118.267 12.5 12.5 0 01.002.004 12.5 12.5 0 01.113.272 12.5 12.5 0 01.002.004 12.5 12.5 0 01.105.273 12.5 12.5 0 01.002.004 12.5 12.5 0 01.098.275 12.5 12.5 0 01.002.004 12.5 12.5 0 01.092.278 12.5 12.5 0 01.002.003 12.5 12.5 0 01.086.282 12.5 12.5 0 01.002.004 12.5 12.5 0 01.078.28 12.5 12.5 0 01.002.005 12.5 12.5 0 01.072.285 12.5 12.5 0 01.002.004 12.5 12.5 0 01.067.285 12.5 12.5 0 01.023.121 12.5 12.5 0 01.035.17 12.5 12.5 0 01.086.496 12.5 12.5 0 01.014.09 12.5 12.5 0 010 .004 12.5 12.5 0 01.039.29 12.5 12.5 0 01.008.075 12.5 12.5 0 01.045.467 12.5 12.5 0 01.003.05 12.5 12.5 0 01.002.04 12.5 12.5 0 01.028.535 12.5 12.5 0 010 .02 12.5 12.5 0 010 .003 12.5 12.5 0 01.004.293 12.5 12.5 0 010 .014 12.5 12.5 0 01-.127 1.777 12.5 12.5 0 01-.1.586 12.5 12.5 0 01-.058.291 12.5 12.5 0 010 .002 12.5 12.5 0 01-.141.576 12.5 12.5 0 01-.08.287 12.5 12.5 0 01-.182.567 12.5 12.5 0 01-.207.557 12.5 12.5 0 01-.234.546 12.5 12.5 0 01-.26.536 12.5 12.5 0 01-.1.187 12.5 12.5 0 001.488.088 12.5 12.5 0 0012.5-12.5 12.5 12.5 0 00-12.5-12.5 12.5 12.5 0 00-.014 0zm-24.986 10a2.5 2.5 0 00-2.5 2.5 2.5 2.5 0 002.5 2.5 2.5 2.5 0 00.691-.098 12.5 12.5 0 011.672-3.214A2.5 2.5 0 00.044 13.25zm0-2.5a5 5 0 00-5 5 5 5 0 005 5 5 5 0 00.09-.002 12.5 12.5 0 014.054-7.795A5 5 0 00.044 10.75zm-.037-2.5a7.5 7.5 0 00-7.463 7.5 7.5 7.5 0 007.5 7.5 7.5 7.5 0 00.041 0 12.5 12.5 0 01-.041-1 12.5 12.5 0 016.162-10.773A7.5 7.5 0 00.044 8.25a7.5 7.5 0 00-.037 0zm.017-2.5a10 10 0 00-9.98 10 10 10 0 0010 10 10 10 0 00.498-.014 12.5 12.5 0 01-.498-3.486 12.5 12.5 0 018.46-11.828A10 10 0 00.045 5.75a10 10 0 00-.02 0zm-.082-2.5a12.5 12.5 0 00-12.486 12.5 12.5 12.5 0 0012.5 12.5 12.5 12.5 0 001.57-.1 12.5 12.5 0 01-1.482-5.9 12.5 12.5 0 0110.93-12.4A12.5 12.5 0 00-.044 3.25a12.5 12.5 0 00-.014 0zm12.602 3.5a2.5 2.5 0 00-2.39 1.773 12.5 12.5 0 01.82 1.327 12.5 12.5 0 011.57-.1 12.5 12.5 0 011.488.088 12.5 12.5 0 01.875-1.399 2.5 2.5 0 00-2.363-1.689zm0-2.5a5 5 0 00-4.178 2.256 12.5 12.5 0 012.608 3.344 12.5 12.5 0 011.57-.1 12.5 12.5 0 011.488.088 12.5 12.5 0 012.658-3.383 5 5 0 00-4.146-2.205zm-.037-2.5a7.5 7.5 0 00-6.15 3.266 12.5 12.5 0 014.617 4.834 12.5 12.5 0 011.57-.1 12.5 12.5 0 011.488.088 12.5 12.5 0 014.676-4.861 7.5 7.5 0 00-6.164-3.227 7.5 7.5 0 00-.037 0zm5.226 9.129a12.5 12.5 0 01.254.117 12.5 12.5 0 00-.254-.117zM12.524-.75a10 10 0 00-8.457 4.695 12.5 12.5 0 016.907 5.905 12.5 12.5 0 011.57-.1 12.5 12.5 0 011.488.088 12.5 12.5 0 016.973-5.916A10 10 0 0012.544-.75a10 10 0 00-.02 0zm5.21 11.629a12.5 12.5 0 01.253.117 12.5 12.5 0 00-.254-.117zM12.53-3.25a12.5 12.5 0 00-11.004 6.6 12.5 12.5 0 019.448 6.5 12.5 12.5 0 011.57-.1 12.5 12.5 0 011.488.088 12.5 12.5 0 019.526-6.498 12.5 12.5 0 00-11.014-6.59 12.5 12.5 0 00-.014 0zm5.203 14.129a12.5 12.5 0 01.254.117 12.5 12.5 0 00-.254-.117zM25.043.25a2.5 2.5 0 00-2.362 1.688 12.5 12.5 0 01.877 1.4 12.5 12.5 0 011.472-.088 12.5 12.5 0 01.014 0 12.5 12.5 0 012.389.23 2.5 2.5 0 00.11-.73 2.5 2.5 0 00-2.5-2.5zm0-2.5A5 5 0 0020.9-.047a12.5 12.5 0 012.659 3.385 12.5 12.5 0 011.472-.088 12.5 12.5 0 01.014 0 12.5 12.5 0 014.783.953 5 5 0 00.217-1.453 5 5 0 00-5-5zm-.036-2.5a7.5 7.5 0 00-6.125 3.227 12.5 12.5 0 014.676 4.86 12.5 12.5 0 011.472-.087 12.5 12.5 0 01.014 0 12.5 12.5 0 017.014 2.152 7.5 7.5 0 00.486-2.652 7.5 7.5 0 00-7.5-7.5 7.5 7.5 0 00-.037 0zm.017-2.5a10 10 0 00-8.441 4.672 12.5 12.5 0 016.975 5.916 12.5 12.5 0 011.472-.088 12.5 12.5 0 01.014 0 12.5 12.5 0 019.01 3.838 10 10 0 00.99-4.338 10 10 0 00-10-10 10 10 0 00-.02 0zm.006-2.5a12.5 12.5 0 00-10.998 6.59 12.5 12.5 0 019.526 6.498 12.5 12.5 0 011.472-.088 12.5 12.5 0 01.014 0 12.5 12.5 0 0110.678 6 12.5 12.5 0 001.822-6.5 12.5 12.5 0 00-12.5-12.5 12.5 12.5 0 00-.014 0zM14.69 8.75a12.5 12.5 0 00-.128.197 12.5 12.5 0 01.128-.197zm3.043 2.129a12.5 12.5 0 01.254.117 12.5 12.5 0 00-.254-.117zM.043.25a2.5 2.5 0 00-2.5 2.5 2.5 2.5 0 00.106.717A12.5 12.5 0 01-.058 3.25a12.5 12.5 0 01.014 0 12.5 12.5 0 011.57.1 12.5 12.5 0 01.881-1.41A2.5 2.5 0 00.044.25zm0-2.5a5 5 0 00-5 5 5 5 0 00.208 1.42 12.5 12.5 0 014.691-.92 12.5 12.5 0 01.014 0 12.5 12.5 0 011.57.1A12.5 12.5 0 014.19-.045 5 5 0 00.044-2.25zm-.036-2.5a7.5 7.5 0 00-7.463 7.5 7.5 7.5 0 00.469 2.605A12.5 12.5 0 01-.057 3.25a12.5 12.5 0 01.013 0 12.5 12.5 0 011.57.1 12.5 12.5 0 014.682-4.873A7.5 7.5 0 00.044-4.75a7.5 7.5 0 00-.037 0zm.017-2.5a10 10 0 00-9.98 10 10 10 0 00.96 4.275A12.5 12.5 0 01-.057 3.25a12.5 12.5 0 01.014 0 12.5 12.5 0 011.57.1 12.5 12.5 0 016.979-5.928A10 10 0 00.044-7.25a10 10 0 00-.02 0zm.006-2.5a12.5 12.5 0 00-12.486 12.5 12.5 12.5 0 001.78 6.428A12.5 12.5 0 01-.059 3.25a12.5 12.5 0 01.014 0 12.5 12.5 0 011.57.1 12.5 12.5 0 019.532-6.51A12.5 12.5 0 00.044-9.75a12.5 12.5 0 00-.014 0zM9.722 7.951a12.5 12.5 0 01.12.154 12.5 12.5 0 00-.12-.154z'  stroke-width='1' stroke='hsla(198, 100%, 50%, 1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
  background-repeat: repeat;
}
.victory-background {
}
.defeat-background {
}
.tie-background {
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
