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
                ? !isTie
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
              <!-- Elo gains  -->
              <div>
                {{ myElo }}
              </div>
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
                        :style="
                          `color:${
                            mySymbol === 'circle' ? myColor : enemyColor
                          };`
                        "
                      />
                    </button>
                    <button
                      @click="$emit('pickGameStone', 2)"
                      class="border-2 p-1 border-gray-700 dark:border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl"
                    >
                      <game-stone-cross-svg
                        class="h-8 w-8"
                        :style="
                          `color:${
                            mySymbol === 'cross' ? myColor : enemyColor
                          };`
                        "
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
  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='30' height='40' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M1.624 19.09l6.597-1.595a.503.503 0 11.238.98L2.145 20l6.314 1.526a.504.504 0 01-.238.98l-6.597-1.595 3.426 3.426a3.813 3.813 0 005.386 0l1.1-1.1a4.584 4.584 0 000-6.475l-1.1-1.099a3.814 3.814 0 00-5.386 0zM-.911 18.377l-1.595-6.597a.504.504 0 11.98-.237L0 17.856l1.526-6.313a.503.503 0 11.98.237L.911 18.377l3.426-3.426a3.813 3.813 0 000-5.386l-1.1-1.099A4.548 4.548 0 000 7.125a4.547 4.547 0 00-3.238 1.341l-1.099 1.099a3.813 3.813 0 000 5.386zM-11.535 16.763a4.584 4.584 0 000 6.476l1.1 1.099a3.813 3.813 0 005.385 0l3.426-3.426-6.597 1.595a.501.501 0 01-.609-.371.504.504 0 01.372-.609l6.313-1.526-6.313-1.526a.504.504 0 11.237-.98l6.597 1.595-3.426-3.426a3.796 3.796 0 00-2.693-1.113c-.975 0-1.95.37-2.693 1.113zM.911 21.625l1.595 6.597a.504.504 0 11-.98.237L0 22.146l-1.526 6.313a.505.505 0 01-.98-.237l1.595-6.597-3.426 3.426a3.813 3.813 0 000 5.386l1.1 1.099a4.584 4.584 0 006.475 0l1.099-1.099a3.813 3.813 0 000-5.386zM31.624 19.09l6.597-1.595a.503.503 0 11.238.98L32.145 20l6.314 1.526a.504.504 0 01-.238.98l-6.597-1.595 3.426 3.426a3.813 3.813 0 005.386 0l1.1-1.1a4.584 4.584 0 000-6.475l-1.1-1.099a3.814 3.814 0 00-5.386 0zM29.089 18.377l-1.595-6.597a.504.504 0 11.98-.237L30 17.856l1.526-6.313a.503.503 0 11.98.237l-1.595 6.597 3.426-3.426a3.813 3.813 0 000-5.386l-1.1-1.099A4.548 4.548 0 0030 7.125a4.547 4.547 0 00-3.238 1.341l-1.099 1.099a3.813 3.813 0 000 5.386zM18.465 16.763a4.584 4.584 0 000 6.476l1.1 1.099a3.813 3.813 0 005.385 0l3.426-3.426-6.597 1.595a.501.501 0 01-.609-.371.504.504 0 01.372-.609l6.313-1.526-6.313-1.526a.504.504 0 11.237-.98l6.597 1.595-3.426-3.426a3.796 3.796 0 00-2.693-1.113c-.975 0-1.95.37-2.693 1.113zM30.911 21.625l1.595 6.597a.504.504 0 11-.98.237L30 22.146l-1.526 6.313a.505.505 0 01-.98-.237l1.595-6.597-3.426 3.426a3.813 3.813 0 000 5.386l1.1 1.099a4.584 4.584 0 006.475 0l1.099-1.099a3.813 3.813 0 000-5.386zM16.624 39.09l6.597-1.595a.503.503 0 11.238.98L17.145 40l6.314 1.526a.504.504 0 01-.238.98l-6.597-1.595 3.426 3.426a3.813 3.813 0 005.386 0l1.1-1.1a4.584 4.584 0 000-6.475l-1.1-1.099a3.814 3.814 0 00-5.386 0zM14.089 38.377l-1.595-6.597a.504.504 0 11.98-.237L15 37.856l1.526-6.313a.503.503 0 11.98.237l-1.595 6.597 3.426-3.426a3.813 3.813 0 000-5.386l-1.1-1.099A4.548 4.548 0 0015 27.125a4.547 4.547 0 00-3.238 1.341l-1.099 1.099a3.813 3.813 0 000 5.386zM3.465 36.763a4.584 4.584 0 000 6.476l1.1 1.099a3.813 3.813 0 005.385 0l3.426-3.426-6.597 1.595a.501.501 0 01-.609-.371.504.504 0 01.372-.609l6.313-1.526-6.313-1.526a.504.504 0 11.237-.98l6.597 1.595-3.426-3.426a3.796 3.796 0 00-2.693-1.113c-.975 0-1.95.37-2.693 1.113zM15.911 41.625l1.595 6.597a.504.504 0 11-.98.237L15 42.146l-1.526 6.313a.505.505 0 01-.98-.237l1.595-6.597-3.426 3.426a3.813 3.813 0 000 5.386l1.1 1.1a4.584 4.584 0 006.475 0l1.099-1.1a3.813 3.813 0 000-5.386zM16.624-.91l6.597-1.595a.503.503 0 11.238.98L17.145 0l6.314 1.526a.504.504 0 01-.238.98L16.624.912l3.426 3.426a3.813 3.813 0 005.386 0l1.1-1.1a4.584 4.584 0 000-6.475l-1.1-1.099a3.814 3.814 0 00-5.386 0zM14.089-1.623L12.494-8.22a.504.504 0 11.98-.237L15-2.144l1.526-6.313a.503.503 0 11.98.237l-1.595 6.597 3.426-3.426a3.813 3.813 0 000-5.386l-1.1-1.099A4.548 4.548 0 0015-12.875a4.547 4.547 0 00-3.238 1.341l-1.099 1.099a3.813 3.813 0 000 5.386zM3.465-3.237a4.584 4.584 0 000 6.476l1.1 1.099a3.813 3.813 0 005.385 0L13.376.912 6.779 2.507a.501.501 0 01-.609-.371.504.504 0 01.372-.609L12.855.001 6.542-1.525a.504.504 0 11.237-.98L13.376-.91 9.95-4.336a3.796 3.796 0 00-2.693-1.113c-.975 0-1.95.37-2.693 1.113zM15.911 1.625l1.595 6.597a.504.504 0 11-.98.237L15 2.146 13.474 8.46a.505.505 0 01-.98-.237l1.595-6.597-3.426 3.426a3.813 3.813 0 000 5.386l1.1 1.099a4.584 4.584 0 006.475 0l1.099-1.099a3.813 3.813 0 000-5.386z'  stroke-width='1' stroke='none' fill='hsla(336, 100%, 56%, 1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
  background-repeat: repeat;
}
.victory-background {
  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='100' height='100' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M100.16 24.75a2.93 2.93 0 11.04 5.86 2.93 2.93 0 01-2.95-2.91 2.92 2.92 0 012.9-2.95zm-100 0a2.93 2.93 0 11.04 5.86 2.93 2.93 0 01-2.95-2.91 2.92 2.92 0 012.9-2.95zm9.57 53.18c1.6 0 2.9 1.3 2.9 2.9a2.95 2.95 0 01-2.95 2.96 2.9 2.9 0 01-2.9-2.9 2.95 2.95 0 012.95-2.96zm58.57-2.51a2.93 2.93 0 11.04 5.86 2.93 2.93 0 11-.04-5.86zM49.45 4.4a2.93 2.93 0 11.04 5.86 2.93 2.93 0 01-.04-5.86zM21.66 49.6l2.95 2.91-2.9 2.95-2.95-2.9zm43.55-12.85s2.9 1.3 2.9 2.9v.05c0 1.6-1.3 2.9-2.9 2.9h-.04c-1.6 0-2.9-2.9-2.9-2.9z'  stroke-width='1' stroke='none' fill='hsla(258.5,59.4%,59.4%,1)'/><path d='M89.93 57.48a1.08 1.08 0 01.39-1.38c2.44-1.53 5.04-1.81 7.15-.8 2.1 1.03 3.47 3.26 3.77 6.13.22 2.14 1.14 3.71 2.58 4.42 1.44.7 3.24.45 5.07-.69a1.07 1.07 0 011.13 1.8c-2.44 1.54-5.04 1.83-7.14.81-2.1-1.02-3.48-3.25-3.77-6.12-.23-2.15-1.15-3.72-2.59-4.42-1.44-.7-3.24-.46-5.07.68-.5.32-1.16.16-1.47-.33l-.05-.1zm10.06 31.11a.87.87 0 011.07.46c.99 2.14.95 4.28-.1 5.88-1.05 1.6-3 2.48-5.36 2.42-1.76-.04-3.13.54-3.85 1.63-.72 1.1-.71 2.59.03 4.18a.87.87 0 11-1.59.73c-.99-2.13-.95-4.27.1-5.87 1.05-1.6 3-2.48 5.36-2.42 1.76.04 3.13-.54 3.85-1.63.72-1.1.71-2.59-.03-4.18a.87.87 0 01.52-1.2zm0-100a.87.87 0 011.07.46c.99 2.14.95 4.28-.1 5.88-1.05 1.6-3 2.48-5.36 2.42-1.76-.04-3.13.54-3.85 1.63-.72 1.1-.71 2.59.03 4.18a.87.87 0 11-1.59.73c-.99-2.13-.95-4.27.1-5.87 1.05-1.6 3-2.48 5.36-2.42 1.76.04 3.13-.54 3.85-1.63.72-1.1.71-2.59-.03-4.18a.87.87 0 01.52-1.2zM9.44 9.9c.15-.3.54-.39.9-.24 1.88.82 3.16 2.12 3.53 3.58.38 1.47-.21 2.93-1.6 4.02-1.04.8-1.47 1.81-1.22 2.81.26 1 1.17 1.9 2.57 2.5.39.18.6.58.47.9-.13.34-.55.47-.93.3-1.88-.82-3.16-2.12-3.54-3.58-.37-1.46.22-2.93 1.6-4.01 1.05-.81 1.48-1.82 1.23-2.82-.26-1-1.17-1.89-2.58-2.5-.38-.17-.59-.57-.46-.9l.03-.07zm-19.51 47.59a1.08 1.08 0 01.39-1.38c2.44-1.53 5.04-1.81 7.15-.8 2.1 1.03 3.47 3.26 3.77 6.13.22 2.14 1.14 3.71 2.58 4.42 1.44.7 3.24.45 5.07-.69a1.07 1.07 0 011.13 1.8c-2.44 1.54-5.04 1.83-7.14.81C.78 66.75-.6 64.52-.9 61.65c-.23-2.15-1.15-3.72-2.59-4.42-1.44-.7-3.24-.46-5.07.68-.5.32-1.16.16-1.47-.33l-.05-.1zM-.01 88.59a.87.87 0 011.07.46c.99 2.14.95 4.28-.1 5.88-1.05 1.6-3 2.48-5.36 2.42-1.76-.04-3.13.54-3.85 1.63-.72 1.1-.71 2.59.03 4.18a.87.87 0 11-1.59.73c-.99-2.13-.95-4.27.1-5.87 1.05-1.6 3-2.48 5.36-2.42 1.76.04 3.13-.54 3.85-1.63.72-1.1.71-2.59-.03-4.18a.87.87 0 01.52-1.2zm43.92-4.85c-.24-.48-.1-1.08.36-1.38 2.41-1.59 5-1.93 7.13-.96s3.55 3.17 3.92 6.03c.27 2.14 1.23 3.7 2.68 4.36 1.46.67 3.25.38 5.05-.8a1.07 1.07 0 011.48.3c.32.5.19 1.16-.3 1.48-2.4 1.59-5 1.94-7.13.96-2.12-.97-3.55-3.17-3.91-6.03-.28-2.14-1.23-3.69-2.69-4.36-1.46-.67-3.25-.38-5.05.8-.49.32-1.16.2-1.48-.3l-.06-.1zM41 45.67c-.47.25-1.07.1-1.38-.35-1.61-2.39-2-4.98-1.05-7.11.94-2.14 3.13-3.6 5.98-4 2.14-.3 3.67-1.27 4.32-2.73.65-1.47.34-3.26-.87-5.05-.33-.49-.2-1.15.28-1.48.5-.33 1.15-.2 1.5.28 1.6 2.39 2 4.98 1.04 7.11-.94 2.14-3.12 3.6-5.98 4-2.13.3-3.67 1.27-4.32 2.73-.65 1.47-.34 3.26.87 5.05.33.49.21 1.15-.28 1.49-.04.01-.07.04-.1.06z'  stroke-width='1' stroke='none' fill='hsla(339.6,82.2%,51.6%,1)'/><path d='M101 9.76l.75 1.71-9.97 4.34-.74-1.72zM87.35 9.7l-.66 1.75L59.14 1.12l.65-1.76zM41.4-6.21l1.62.93L34.2 10l-1.62-.94zM87.35 109.7l-.66 1.76-27.55-10.35.65-1.75zM50.58 56.03l1.85-.3 1.83 11.32-1.85.3zm-6.22 13.79l-.5 1.8-17-4.66.5-1.8zM41.4 93.79l1.62.93L34.2 110l-1.62-.94zM87.35 9.7l-.66 1.75L59.14 1.12l.65-1.76zm-7.77 42.56l.77 1.76-16.34 7.11-.77-1.75zM1 9.76l.75 1.71-9.96 4.34-.75-1.72zm100 0l.75 1.71-9.97 4.34-.74-1.72zM31.04 27.68l.6 1.86-23.13 7.48-.6-1.86zm48.1 46.45l.73-1.72 10 4.28-.74 1.72zM41.4-6.2l1.62.93L34.2 10l-1.62-.94zM67.54 11.2l1.62.94-7.26 12.57-1.62-.94zM21.22 90.35l-.6-1.4 9.58-4.16.6 1.39zm69.3-49.79l-1.5 1.12L78.5 27.55l1.5-1.12zm-3.17 69.14l-.66 1.76-27.55-10.35.65-1.75zM41.4 93.8l1.62.93L34.2 110l-1.62-.94zM1 9.76l.74 1.71-9.96 4.34-.75-1.72z'  stroke-width='1' stroke='none' fill='hsla(198.7,97.6%,48.4%,1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
  background-repeat: repeat;
}
.defeat-background {
  background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='100' height='100' patternTransform='scale(2) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M4.43 0c.17.58.34 1.12.52 1.58.29.76.59 1.51.9 2.25 1.59 3.68 4.3 5.96 8.1 7.2 2.69.88 6.77 1.47 10.1 1.58.14 0-.38-1.66-.93-3.38-.77-2.4-.74-4.74-1.27-7.16-.16-.7-.4-1.4-.7-2.07h-3.37c.19.24.37.49.54.74 1.25 1.83 1.73 4.07 2.07 6.2.17 1.08.33 2.67 1 3.45-.61-.28-3.5-1.2-3.97-1.4-2.94-1.2-5.53-1.08-7.84-3.6C8.21 3.9 7.56 1.96 6.87 0zm22.6 0a30.74 30.74 0 001.89 3.75c.09-1.1.54-2.51.94-3.75zm8.85 0c-3.4 5.03-5.04 11.1-.88 16.5 1.77 2.16 3.52 4.33 5.14 6.6 1.45 2.02 2.6 4.46 4.36 6.23.04.05 2.12-3.78 2.27-4.14.69-1.58 1.25-3.22 1.98-4.79 1.57-3.4 3.8-6.5 5.32-9.89v-.02c1.32-2.95 1.3-6.26 1.2-9.43 0-.25 0-.6-.03-1.06h-2.3a22.37 22.37 0 01.7 4.7 9.7 9.7 0 01-.57 3.33 15.35 15.35 0 01-1.74 3.47c-2.83 4.33-5.16 8.5-7.83 12.67-.33-.71-.58-1.42-.87-2.13l-.07-.15c-.1-.25-.2-.5-.32-.74l-.08-.17a10.11 10.11 0 00-.96-1.5l-.06-.08a12.18 12.18 0 00-.68-.79l-.39-.41a19.1 19.1 0 01-1.13-1.28 9.06 9.06 0 01-.67-.98 18.88 18.88 0 01-1.65-3.29c-.35-.96-.62-1.95-.76-2.96-.11-.8-.15-1.62-.1-2.45.18-2.9 1.5-5.18 3.22-7.24zm26.83 0a23.38 23.38 0 01-.85 3.63c-.46 1.47-1.2 2.97-1.2 4.54 1.79-2.23 4.86-2.88 7.38-3.93 2.63-1.1 5.25-2.37 7.42-4.24zM16.08 18.25c-.28 0-.55 0-.83.02-1.61-.05-3.17.34-4.75.73-1.11.28.44 1.06 2.67 4.17 2.31 3.24 3.84 8.76 8.33 9.66 3.01.6 6.15-.06 9.15-.45.47-.06 6.11-1.02 6.23-.6-.06-.23-.4-.58-1-1.08a22.05 22.05 0 01-4.18-4.47 17.1 17.1 0 00-4.7-4.81 19.07 19.07 0 00-10.92-3.17zm67.25 8.58a45.04 45.04 0 01-6.41 8c-2.57 2.46-5.57 4.03-8.59 5.84-3.22 1.93-4.9 6.23-4.16 9.83 1 5.33 2.16 10.17 2.38 15.35.04.9.45 3.98 1.37 4.98.56-.96 1.91-3.21 2.55-4.1a86.54 86.54 0 018.08-9.4c1.94-2.01 4.3-3.98 5.73-6.41a7.71 7.71 0 001.12-3.62c.27-6.8.6-13.97-2.07-20.47zm-1.16 7.5c-.25 4.67-.59 9.63-1.83 14.22a18.17 18.17 0 01-2.05 5.12c-2.46 3.83-6.12 6.5-9.29 9.83.25-1.92-.33-3.67-.48-5.58-.2-2.76-1.26-5.32-1.55-8.03-.1-.86-.04-1.73.3-2.57 1.16-2.92 4.3-5.4 6.7-7.32 1.52-1.23 7.03-3.83 8.2-5.67zM36.6 39.5c-4.17-.04-7.9 1.7-12.1 2.34-3.65.82-8.63.16-11.9 2.12-1.91 1.14-2.89 3.37-4.2 5.1-1.86 3.1-6 5.72-8.4 8.83v6.22c4.92-2.43 10.42-2.03 15.9-2.13 4.62-.08 10.32-.37 13.46-4.3 1.48-1.86 1.27-4.84 2.03-7.03.88-2.54 2.26-4.87 3.55-7.22.21-.4 1.4-3.25 2.06-3.92l-.4-.01zm-3.68 3.34c-2.77 3.2-5.32 7.08-8.25 12.17a9.54 9.54 0 01-4.7 4.3c-2.12.83-4.84.35-7.06.34a37.4 37.4 0 00-6.3.41c-1.33.22-3.2.37-5.2 1.53.13-.54 1.06-2.06 1.31-2.57 1.26-2.55 3.92-4.68 5.72-6.6 1.98-2.11 4.23-3.97 6.96-5.01 2.27-.87 4.66-1.37 7.04-1.88 2.33-.5 8.9-2.6 10.48-2.69zM100 57.88c-1.56 2.02-2.39 4.25-1.33 6.95.44-.27.88-.51 1.33-.73zM32.75 62.5c-1.75 2-4.07 5.92-5.85 8.13-2.37 2.95-5.05 6.05-5.27 9.84-.17 2.92.85 5.76 1.72 8.5 1.18 3.7 2.15 7.47 3.67 11.03h2.84c.16-.51.32-1 .43-1.4 1.23-4.34 3.72-8.16 6.38-11.77 2.56-3.47 2-8.6.5-12.42-.56-1.4-1.37-2.57-2.18-3.83-.93-1.44-1.26-3.1-1.8-4.7-.21-.66-.44-2.13-.44-3.38zM9.75 81C7.33 82.58 3.1 82.39.22 82.64l-.22.02v6.5c.5.08 1 .15 1.5.17 3.82.18 7.19-5.15 8.25-8.33zm38.58.17a34.68 34.68 0 01-7.05 12.75c-1.15 1.25-2.5 2.4-3.58 3.67-.64.77-1.25 1.58-1.82 2.41h3.1c1.5-1.8 3.32-3.42 4.93-5.12 1.78-1.88 2.79-4.1 3.74-6.38.13-.33.6-1.83.93-2.92 1.4 2.9 2.3 6.78 3.12 9.87.4 1.52.87 3.02 1.25 4.55h2.29c-.12-2.43-.87-8.03-6.9-18.83zm51.67 1.5c-2.4.22-4.95.7-6.92 2.18-.83.62-3.08 3.82-3.41 5.32 1.43-.92 3.08-1.9 4.81-1.94 1.88-.04 3.68.6 5.52.93zm-15.83 1.16a95.53 95.53 0 01-7.97 3.32c-4.2 1.53-9.96 2.46-12.32 6.78-.8 1.46-.94 3.3-1.05 4.94-.03.38-.07.76-.12 1.13h12.75l.39-.35c1.74-1.6 2.91-3.86 4.04-5.92a37.51 37.51 0 004.28-9.9zm-80.7 8.28c-.9 0-1.74.14-2.47.56 1.45 2.27 2.41 4.8 3.36 7.33h2.5a16.57 16.57 0 00-2.03-4.33c1.34 0 2.5 0 3.77-.13.25-.03.5-.04.75-.05 3.43-.06 6.36 1.85 8.43 4.51h3.37a14.48 14.48 0 00-1.76-2.91c-2.43-3.13-5.9-4.06-9.69-4.4-1.97.1-4.24-.58-6.23-.58z'  stroke-width='1' stroke='none' fill='hsla(258.5,59.4%,59.4%,1)'/><path d='M38.98 0c-1.72 2.06-3.04 4.34-3.22 7.24-.2 3.3 1.02 6.52 2.85 9.22.86 1.27 2.07 2.21 2.93 3.47.96 1.4 1.3 2.82 1.96 4.24 2.67-4.17 5-8.34 7.83-12.67 1.43-2.19 2.43-4.64 2.3-7.3a22.37 22.37 0 00-.68-4.2zm19.68 0a27.2 27.2 0 01-.12 4.26c-.4 2.95-.95 5.94-.37 8.9 3-.83 4.66-3.66 7.37-4.78C70.23 6.44 74.71 3.82 78.1 0h-2.64c-2.17 1.87-4.8 3.14-7.42 4.24-2.52 1.05-5.59 1.7-7.37 3.93 0-1.57.73-3.07 1.19-4.54.37-1.2.67-2.4.85-3.63zM97.4 6.96c-.03 0-.05.01-.07.04C93.17 15.33 84 23.17 86.9 33.34c1.12 3.97 4.3 6.5 6.73 9.65 2.08 2.7 3.07 5.46 4.42 8.5l1.96-2.86v-4.48c-.48.8-.98 1.56-1.5 2.24-.44-3.45-3.5-7.39-6.17-10.72-1.86-2.23-2.13-5.54-2.15-8.33-.03-6.4 4.9-10.22 7.65-15.5 1 1.1.7 3.71 1.12 5 .38 1.2.71 2.39 1.05 3.58v-9.45l-.12-.42c-.1-.34-2.06-3.54-2.48-3.59zm-97.4 4v9.46c.37 1.3.77 2.61 1.28 3.89 1.12 2.73 3.07 5.38 3.24 8.41.05.94-.1 1.92-.52 2.95a67.51 67.51 0 01-4 8.48v4.48c2.65-3.97 4.22-7 5.88-11.48.62-1.67 1.35-3.51 1.37-5.35.03-2.32-1.44-4.3-2.29-6.25-1.04-2.4-2.47-4.61-3.42-7.05C.58 16.05.68 13.46 0 10.97zm65.04 3.85l-.04.02c-1.35 1.36-3.08 2.3-4.58 3.47-2.34 1.84-3.93 4.46-6.06 6.51-1.37 1.32-2.7 2.75-2.34 4.8.88 4.88 2.09 9.82 5.31 13.72a16.93 16.93 0 011.57-4.14c1.43-2.49 4-3.85 5.97-5.83 2.48-2.48 3.29-5.9 2.8-9.36-.65-3.23-2.16-9.2-2.63-9.19zM91 59.33a36.8 36.8 0 01-3.61 1.65c-1.49.6-3 1.1-4.45 1.8-3.36 1.59-6.83 3.78-8.2 7.36-.7 1.8-1.12 3.58-2.05 5.32-.94 1.76-2.02 3.47-2.69 5.37 1.83-1 5.84-2.2 7.54-2.74 1.7-.54 3.5-.83 5.06-1.76a10.69 10.69 0 004.15-4.89c1.21-2.75.9-5.94 2.24-8.65.68-1.12 1.51-2.29 2.01-3.46zm-68 5.34a40.93 40.93 0 01-7.83 1.66c-3.61.4-7.25.17-10.86.65-1.47.12-2.92.5-4.31 1.1v1.95a16.41 16.41 0 019.19-2.3c2.7.11 5.14.77 7.81.44-.67.66-1.18 1.4-1.49 1.75-1.47 1.7-3 3.43-5.01 4.52a18.8 18.8 0 01-8.72 2.1c-.2.01-.9-.03-1.78-.08v1.6c.83 0 1.66-.02 2.48-.07 3.02-.15 5.92-.56 8.64-1.98a27.4 27.4 0 006.95-5.28 45.84 45.84 0 003.24-3.78c.21-.27 1.1-1.53 1.69-2.28zm77 3.4c-4.42 1.87-8.17 5.82-9.5 10.26 0 0 2.86-.12 3.24-.15 2.02-.14 4.15-.1 6.26-.12v-1.6l-1.57-.08a20.72 20.72 0 00-4.08.13l-.22.05c.37-.98.94-1.78 1.2-2.15a15.34 15.34 0 014.67-4.38zM87.17 80c-1.09.42-4.75 1.51-5.28 1.7-3.44 1.3-6.79 2.81-10.24 4.06-2.6.94-5.22 1.46-7.65 2.85-3.6 2.04-5.33 5.33-5.36 9.41 0 .66 0 1.32.02 1.98h4.05c.05-.37.1-.75.12-1.13.1-1.64.25-3.48 1.05-4.94 2.36-4.32 8.12-5.25 12.32-6.78 2.7-.98 5.36-2.1 7.97-3.32-1 3.5-2.34 6.84-4.28 9.9-1.13 2.06-2.3 4.31-4.04 5.92l-.39.35h2.64c3.1-3.5 5.56-7.71 7.1-12.13A45.45 45.45 0 0087.16 80zm-38.59 5.58c-.33 1.09-.8 2.6-.93 2.92-.95 2.28-1.96 4.5-3.74 6.38-1.61 1.7-3.42 3.32-4.93 5.12h13.97c-.38-1.53-.84-3.03-1.25-4.55-.82-3.1-1.73-6.97-3.12-9.87z'  stroke-width='1' stroke='none' fill='hsla(339.6,82.2%,51.6%,1)'/><path d='M80.57 0c-.35.33-.7.66-1.03 1-3.65 3.67-6.35 8.32-6.71 13.57-.16 2.3.06 4.61.3 6.9.24 2.2.98 6.53 1.54 9.7 2.79-2.7 4.55-6.26 7.41-8.86 1.52-1.38 3.2-2.55 4.62-4.04a24.4 24.4 0 003.64-5.12c.77-1.4 1.62-2.83 2.12-4.36l.09-.28c.47-1.61.53-3.3.85-4.94.25-1.24.74-2.42 1.25-3.57h-3.31c-.37.74-.66 1.52-.84 2.32-.34 1.5-.32 3.08-.52 4.6a16.5 16.5 0 01-1.07 4.13 16.93 16.93 0 01-4.28 5.91c-1.57 1.48-3.33 2.74-4.8 4.32-1.46 1.59-2.51 3.49-4 5.05 0-2.63-.43-5.23-.26-7.86.17-2.65.38-5.3.8-7.93.35-2.1.95-4.22 2.4-5.85C80.3 3 82.39 1.8 84.37.68l1.2-.68zm17.26 11.84c-2.74 5.28-7.68 9.1-7.65 15.5.02 2.8.3 6.1 2.15 8.33C95 39 98.06 42.94 98.5 46.39c.52-.68 1.02-1.44 1.5-2.24V20.42c-.34-1.2-.67-2.39-1.05-3.57-.43-1.3-.12-3.9-1.12-5.01zm-89.68 2.4c-1.48-.02-2.94.17-4.32.76 1.88 2.89 4.27 5.44 5.43 8.74 1.07 3.04 1.37 6.31 2.8 9.23 1.54 3.16 4.84 5.14 8.22 5.8 3.66.7 6.91-1.03 10.32-2.05 3.37-1 6.4-2.89 9.82-3.64.86-.19-1.66-3.3-2.9-4.49-.38-.37-.7-.66-.82-.82-1.4-1.7-2.5-3.62-3.44-5.6-1.16-2.47-2.55-4.82-5.31-5.65-4.04-1.22-8.26-1.2-12.43-1.5-2.37-.18-4.9-.76-7.37-.78zm7.93 4.01c4.09-.01 7.75 1.04 10.93 3.17a17.1 17.1 0 014.7 4.81c1.15 1.7 2.6 3.15 4.17 4.47.6.5.94.85 1 1.08-.12-.42-5.76.54-6.23.6-3 .4-6.14 1.06-9.15.45-4.5-.9-6.02-6.42-8.33-9.66-2.23-3.11-3.78-3.9-2.67-4.17a17.51 17.51 0 015.58-.75zM0 20.42v23.73a67.51 67.51 0 004-8.48c.42-1.03.57-2 .52-2.95-.17-3.03-2.12-5.68-3.24-8.41A37.8 37.8 0 010 20.42zm82.17 13.91c-1.17 1.84-6.68 4.44-8.2 5.67-2.4 1.92-5.54 4.4-6.7 7.32-.34.84-.4 1.7-.3 2.57.29 2.71 1.34 5.27 1.55 8.03.15 1.91.73 3.66.48 5.58 3.17-3.33 6.83-6 9.3-9.83.99-1.55 1.56-3.35 2.04-5.12 1.24-4.6 1.58-9.55 1.83-14.22zM44 39.83c-4 5-5.33 13.34-5.67 20-.24 4.96 1.97 10.36 6.54 12.83 1.95 1.05 4.16 1.49 6.19 2.35 1.9.8 3.68 1.8 5.47 2.8 5.22 2.94 6.28 4.63 6.47 4.19 1.33-3.08 1.02-6.82.92-10.02-.05-1.52-.08-3.04-.09-4.56.33-4.86-.2-10.61-4.67-13.53-2.05-1.57-4.7-1.71-6.98-2.75C47.5 49 47 43.5 44 39.84zm-11.08 3c-1.59.09-8.15 2.19-10.48 2.7-2.38.5-4.77 1-7.04 1.87-2.73 1.04-4.98 2.9-6.96 5-1.8 1.93-4.46 4.06-5.72 6.61-.25.5-1.18 2.03-1.3 2.57 2-1.16 3.86-1.31 5.18-1.53a37.4 37.4 0 016.31-.41c2.22.01 4.94.5 7.07-.34a9.54 9.54 0 004.69-4.3c2.94-5.1 5.48-8.96 8.25-12.17zm10.39 2.59c1.52 4.08 4.97 8.29 7.26 9.87 2.13 1.47 4.69 2.17 6.65 3.94 1.75 1.58 2.22 3.48 2.61 5.73.26 1.44 1.19 9.1 1.11 11.32-.55-.84-4.6-2.7-5.12-3.01-3.13-1.8-7.19-2.57-9.88-5.03-3.55-3.25-3.92-8.85-3.75-13.35.08-2.17.71-6.94 1.12-9.47zm53.02 45.75c-.83 1-1.66 1.83-2.66 2.16-1.81.6-3.57 1.32-5.35 2.01A22.3 22.3 0 0083 97.98c-.84.62-1.65 1.3-2.42 2.02h5c2.27-1.29 5.6-3.14 8.37-3.89-.25.39-1.44 1.84-1.69 2.24a18.8 18.8 0 00-.91 1.65h3.3l.17-.36c.91-2.03 2.43-4.4 2.21-6.7a3.21 3.21 0 00-.69-1.77z'  stroke-width='1' stroke='none' fill='hsla(198.7,97.6%,48.4%,1)'/><path d='M6.87 0c.69 1.95 1.34 3.9 2.71 5.4 2.31 2.5 4.9 2.4 7.84 3.6.46.19 3.36 1.11 3.97 1.39-.67-.78-.83-2.37-1-3.45-.34-2.13-.82-4.37-2.07-6.2-.17-.25-.35-.5-.54-.74zm17.09 0C25.5 2.97 27.27 5.84 29 8.67c.25-.92.84-2.54 1.07-3.08.76-1.84 1.33-3.73 1.98-5.59h-2.2c-.4 1.24-.84 2.66-.93 3.75A30.74 30.74 0 0127.02 0zm61.6 0l-1.2.68c-1.98 1.1-4.06 2.3-5.58 4.01-1.46 1.63-2.06 3.74-2.4 5.85a83.57 83.57 0 00-.81 7.93c-.17 2.63.26 5.23.26 7.86 1.49-1.56 2.54-3.46 4-5.05 1.47-1.58 3.23-2.84 4.8-4.32 1.8-1.7 3.33-3.6 4.28-5.91.54-1.33.89-2.7 1.07-4.13.2-1.52.18-3.1.52-4.6.18-.8.47-1.58.84-2.32zm-19.4 10.17c-.41.75-2.77 2.88-3.1 3.19a27.62 27.62 0 01-3.93 3.01c-5.3 3.3-11.46 7.8-9.96 14.96 1.5 6.67 3 14.34 9.66 17.5.2-.94.47-1.85.81-2.72a18.7 18.7 0 013.68-5.84c1.56-1.66 3.54-2.83 5.2-4.38 2.46-2.32 1.92-5.43 1.62-8.48-.5-5.02-1.74-9.9-3.02-14.75-.29-.85-.6-1.68-.95-2.5zm-1.12 4.64c.47 0 1.98 5.96 2.63 9.19.49 3.46-.32 6.88-2.8 9.36-1.97 1.98-4.54 3.34-5.97 5.83-.3.53-1.4 2.9-1.57 4.14-3.22-3.9-4.43-8.84-5.3-13.71-.38-2.06.96-3.5 2.33-4.8 2.13-2.06 3.72-4.68 6.06-6.52 1.5-1.18 3.23-2.11 4.58-3.47a.06.06 0 01.04-.02zm-21.73 30.6c-.4 2.54-1.04 7.31-1.12 9.48-.17 4.5.2 10.1 3.75 13.35 2.7 2.46 6.75 3.22 9.88 5.03.52.3 4.57 2.17 5.12 3 .08-2.2-.85-9.87-1.1-11.31-.4-2.25-.87-4.15-2.62-5.73-1.96-1.77-4.52-2.47-6.65-3.94-2.3-1.58-5.74-5.79-7.26-9.87zm-8.48 9.26c-1 2.27-2.31 4.31-3.8 6.21-2.14 2.73-4.73 5.82-7.46 7.97-2.33 2.34-4.7 4.1-5.3 7.54-.75 4.3.7 9.01 1.63 13.1.85 3.7 2.32 7.18 4.06 10.51h3.06c-1.52-3.56-2.49-7.33-3.67-11.04-.87-2.73-1.9-5.57-1.72-8.49.22-3.8 2.9-6.9 5.27-9.84 1.78-2.2 4.1-6.13 5.85-8.13 0 1.25.23 2.72.45 3.38.53 1.6.86 3.26 1.79 4.7.8 1.26 1.62 2.44 2.17 3.83 1.51 3.81 2.07 8.95-.5 12.42-2.65 3.6-5.14 7.43-6.37 11.77-.11.4-.27.89-.43 1.4h2.2c.8-2.31 1.73-4.56 3.32-6.56 2.92-3.7 8.14-7.56 7.12-12.94-1.07-5.6-4.96-10.04-6.68-15.4-.74-2.3-.9-4.75-.97-7.15a68.51 68.51 0 01-.02-3.28zm61.67.5c-2.67 1.58-6.63 2.6-8.93 3.04-3.7.72-8.12 2.56-11.32 5.24a14.57 14.57 0 00-2.65 2.85c-2.63 3.79-3.12 8.75-5.16 12.86-1.02 2.05-2.19 4-3.6 5.84 5.59-1.86 10.9-4.63 16.59-6.2 2.07-.57 4.59-.72 6.22-2.28 1.9-1.81 1.8-4.99 2.44-7.36.87-3.2 2.3-6.2 3.83-9.12.85-1.63 1.74-3.24 2.58-4.87zM91 59.33c-.5 1.17-1.33 2.34-2 3.46-1.34 2.7-1.04 5.9-2.25 8.65a10.69 10.69 0 01-4.15 4.9c-1.55.92-3.35 1.2-5.06 1.75-1.7.54-5.7 1.74-7.54 2.74.67-1.9 1.75-3.6 2.7-5.37.92-1.74 1.35-3.51 2.04-5.32 1.37-3.58 4.84-5.77 8.2-7.37 1.45-.69 2.96-1.19 4.45-1.79A36.8 36.8 0 0091 59.33zM8.68 67.72c-3.1-.04-6.1.76-8.68 2.31v6.43c.88.05 1.57.1 1.78.09a18.8 18.8 0 008.72-2.11c2-1.09 3.54-2.81 5.01-4.52.3-.35.82-1.09 1.49-1.75-2.67.33-5.11-.33-7.81-.44l-.51-.01zM100 70.03a15.34 15.34 0 00-4.67 4.38c-.26.37-.83 1.17-1.2 2.15 1.11-.33 3.96-.2 5.87-.1zm-85.06 7.25a42.2 42.2 0 00-4.37 1.17C8.7 79.2 6.81 80 4.81 80.44c-1.59.34-3.2.5-4.81.68v1.54l.22-.02c2.88-.25 7.11-.06 9.53-1.64-1.06 3.18-4.43 8.5-8.25 8.33-.5-.02-1-.09-1.5-.17v.99c1.44-.04 2.9-.07 4.33-.15 1.82-.1 3.38-1.42 4.17-3 .8-1.61 1.64-3.24 2.54-4.8 1.04-1.77 2.38-3.2 3.9-4.92zM100 81.12c-2.07.23-4.14.47-6.15 1.12-5.18 1.6-5.85 7.6-8.18 11.76 3.83-3.5 9.16-4 13.96-3.84l.37-.01v-1c-1.84-.32-3.64-.96-5.52-.92-1.73.04-3.38 1.02-4.81 1.94.33-1.5 2.58-4.7 3.4-5.32 1.98-1.47 4.53-1.96 6.93-2.19zM9.35 95.5a35.79 35.79 0 01-4.52.18c.95 1.3 1.5 2.81 2.04 4.33h10.91c-2.07-2.66-5-4.57-8.43-4.5zm84.6.62c-2.77.75-6.11 2.6-8.39 3.89h5.78c.27-.57.58-1.12.91-1.65.25-.4 1.44-1.85 1.7-2.24z'  stroke-width='1' stroke='none' fill='hsla(47,80.9%,61%,1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
  background-repeat: repeat;
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
