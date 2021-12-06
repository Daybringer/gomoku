<template>
  <!-- FIXME find way to change the terrible string literal comparations on gameEnding and gameState -->
  <view-base>
    <div class="absolute top-16 w-full h-2/6 bg-gray-800  z-0"></div>
    <!-- flex-1 min-h-0 relative flex xl:flex-row flex-col xl:w-3/4 w-90 bg-gray-700 custom-shadow rounded-md  m-auto overflow-hidden -->
    <div
      ref="container"
      class="xl:w-80 w-full overflow-hidden rounded-lg top-0 min-h-full custom-shadow bg-gray-600 z-10 flex xl:flex-row flex-col shadow-2xl"
    >
      <!-- Game container -->
      <div
        ref="gameContainer"
        class="dark:bg-gray-300 w-0 grid-template-15 relative"
      >
        <!-- Game component -->
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
          v-show="afterGameModal === false && gameState == 'ended'"
          @click="afterGameModal = true"
          class="absolute top-2 left-2 p-1 rounded-full bg-gray-200  text-gray-900 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 stroke-current"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M13 5v8h-8" />
            <path d="M17 9v8h-8" />
          </svg>
        </button>
        <!-- Coinflip overlay -->
        <div
          class="absolute z-20 flex place-items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-700"
          v-if="gameState === 'coinflip' || gameState === 'waiting'"
        >
          <div id="coin" :class="coinSide" v-if="gameState === 'coinflip'">
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
            v-show="gameState === 'ended' && afterGameModal"
          >
            <div
              class="w-full h-full rounded-lg p-4 bg-white dark:bg-gray-500 shadow-2xl flex relative flex-col"
            >
              <button
                class="absolute top-3 left-3 p-1 rounded-full bg-gray-200 dark:bg-gray-300 text-gray-900 focus:outline-none"
                @click="afterGameModal = false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 stroke-current"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <h1
                class="w-full text-center text-5xl p-4 xl:text-7xl font-medium text text-gomoku-blue"
              >
                {{ isGameEndingVictory ? "Victory!" : "Defeat!" }}
              </h1>
              <router-link
                to="q/search"
                class="w-full mt-2 xl:mt-8 py-2 text-center rounded-lg text-gray-50 font-medium text-lg bg-gomoku-blue hover:bg-gomoku-blue-dark focus:bg-gomoku-blue-dark"
              >
                New Game
              </router-link>
              <div class="flex-1 relative">
                <!-- Overlay victory -->
                <img
                  :src="victoryConfettiCone"
                  class="absolute bottom-0 xl:bottom-10 left-0 xl:left-10 h-80 xl:h-50"
                  v-show="gameState === 'victory'"
                />
                <svg
                  v-show="isGameEndingVictory"
                  version="1.1"
                  class="absolute bottom-10 right-10 h-0 xl:h-50"
                  id="Layer_2"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 366.636 366.636"
                  style="enable-background:new 0 0 366.636 366.636;transform:rotate(270deg);"
                  xml:space="preserve"
                >
                  <g>
                    <g>
                      <polygon
                        style="fill:#FFB819;"
                        points="7.261,366.636 230.796,262.472 109.313,142.129 		"
                      />
                      <circle
                        style="fill:#FFD26C;"
                        cx="139.46"
                        cy="232.5"
                        r="27.121"
                      />
                      <path
                        style="fill:#FFD26C;"
                        d="M64.791,240.073c7.507,0.439,15.158-2.219,20.866-7.982c10.454-10.552,10.455-27.525,0.076-38.087
			L64.791,240.073z"
                      />
                      <path
                        style="fill:#FFD26C;"
                        d="M34.985,337.966c-5.319,5.371-7.93,12.403-7.847,19.408l44.797-20.876
			C61.238,327.277,45.076,327.78,34.985,337.966z"
                      />
                      <path
                        style="fill:#FFD26C;"
                        d="M142.845,283.129c-6.434,6.495-8.903,15.423-7.436,23.792l47.484-22.127
			c-0.534-0.634-1.093-1.252-1.693-1.846C170.559,272.407,153.387,272.488,142.845,283.129z"
                      />
                      <circle
                        style="fill:#FFD26C;"
                        cx="77.177"
                        cy="286.451"
                        r="27.121"
                      />
                      <polygon
                        style="fill:#004D7A;"
                        points="96.306,170.743 202.305,275.748 230.796,262.472 109.313,142.129 		"
                      />
                    </g>
                    <circle
                      style="fill:#00BCB4;"
                      cx="135"
                      cy="86.679"
                      r="18.497"
                    />
                    <circle
                      style="fill:#00BCB4;"
                      cx="276.53"
                      cy="235.558"
                      r="18.497"
                    />
                    <circle
                      style="fill:#FFB819;"
                      cx="316.74"
                      cy="153.038"
                      r="18.497"
                    />
                    <circle
                      style="fill:#FFB819;"
                      cx="176.102"
                      cy="18.497"
                      r="18.497"
                    />
                    <circle
                      style="fill:#D85C72;"
                      cx="228.315"
                      cy="181.419"
                      r="18.497"
                    />
                    <circle
                      style="fill:#D85C72;"
                      cx="239.536"
                      cy="74.687"
                      r="18.497"
                    />
                    <circle
                      style="fill:#D85C72;"
                      cx="334.385"
                      cy="83.179"
                      r="18.497"
                    />
                    <path
                      style="fill:#00BCB4;"
                      d="M133.624,143.693c-3.767,0-6.819-3.053-6.819-6.819c0-3.766,3.052-6.819,6.819-6.819
		c25.377,0,46.024-20.646,46.024-46.024c0-32.898,26.764-59.662,59.662-59.662c32.897,0,59.661,26.764,59.661,59.662
		c0,3.766-3.053,6.818-6.818,6.818c-3.765,0-6.818-3.052-6.818-6.818c0-25.378-20.647-46.024-46.024-46.024
		c-25.378,0-46.024,20.646-46.024,46.024C193.285,116.929,166.52,143.693,133.624,143.693z"
                    />
                    <path
                      style="fill:#FFB819;"
                      d="M312.259,210.037c-25.978,0-47.115-21.136-47.115-47.115c0-18.459-15.019-33.479-33.478-33.479
		c-18.46,0-33.479,15.019-33.479,33.479c0,3.766-3.053,6.818-6.817,6.818c-3.767,0-6.819-3.052-6.819-6.818
		c0-25.979,21.136-47.115,47.115-47.115c25.979,0,47.115,21.136,47.115,47.115c0,18.46,15.018,33.478,33.478,33.478
		s33.478-15.018,33.478-33.478c0-3.766,3.054-6.818,6.82-6.818c3.764,0,6.817,3.052,6.817,6.818
		C359.375,188.901,338.239,210.037,312.259,210.037z"
                    />
                  </g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                  <g></g>
                </svg>
                <!-- Overlay defeat -->
                <svg
                  v-show="!isGameEndingVictory"
                  viewBox="0 0 347.51588 263.47151"
                  class="absolute bottom-0 left-0 xl:bottom-10 xl:left-10 h-80 xl:h-50"
                >
                  <g
                    id="g1711"
                    transform="rotate(-8.7469605,292.09447,77.905402)"
                  >
                    <path
                      style="fill:#e3e3e3;fill-opacity:1;stroke:#e3e3e3;stroke-width:5.58765;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill"
                      d="m 294.08631,37.11958 c -14.84909,5.19165 -29.32191,11.4597 -43.88598,17.40956 -3.46862,1.58282 -7.1904,2.78501 -10.45092,4.7379 2.31695,7.49453 5.59426,14.81941 8.31576,22.23121 8.53411,21.78968 16.85655,43.67248 25.74827,65.31596 0.64755,1.90789 3.09568,3.21781 4.6936,1.53543 5.0123,-5.83544 8.61123,-13.23252 15.52555,-17.20201 7.78387,-4.96248 17.56448,-5.83448 26.33903,-3.44947 3.10426,0.46775 6.67522,1.95315 9.6063,0.67495 0.0187,-4.99101 -2.82509,-9.44423 -4.23643,-14.12152 -9.59836,-24.67324 -19.1041,-49.39235 -29.23769,-73.85112 -0.68211,-1.04184 -0.95182,-3.09194 -2.41749,-3.28089 z"
                      id="path1623"
                    />
                    <g id="g1621" transform="translate(-29.992401,-94.684841)">
                      <g
                        id="g1582"
                        transform="matrix(1.2628907,3.2078573,-3.2078573,1.2628907,328.96012,74.816535)"
                      >
                        <g id="g1525">
                          <g id="g1523">
                            <path
                              style="fill:#89979f;fill-opacity:1"
                              d="m 9.66,51.48 c 2.523,0 4.5,-2.416 4.5,-5.5 V 27.5 h 27.732 c 1.89,0 3.362,-0.732 4.039,-2.009 0.678,-1.277 0.458,-2.907 -0.601,-4.473 l -1.392,-2.054 c -1.208,-1.784 -1.194,-4.788 0.031,-6.56 l 1.315,-1.902 C 46.758,8.371 46.318,6.794 45.925,6.044 45.531,5.294 44.485,4.036 41.893,4.036 H 13.985 C 13.471,1.69 11.765,0 9.66,0 7.137,0 5.161,2.416 5.161,5.5 v 40.48 c 0,3.084 1.976,5.5 4.499,5.5 z M 43.266,7.438 c 0.073,0.139 0.072,0.602 -0.451,1.359 L 41.5,10.699 c -1.921,2.778 -1.942,7.147 -0.047,9.947 l 1.392,2.054 c 0.45,0.665 0.541,1.184 0.435,1.384 -0.106,0.2 -0.586,0.415 -1.389,0.415 H 14.16 V 7.037 h 27.732 c 0.921,0 1.302,0.263 1.374,0.401 z M 8.161,5.5 C 8.161,4.069 8.953,3 9.66,3 c 0.708,0 1.5,1.069 1.5,2.5 v 40.48 c 0,1.431 -0.792,2.5 -1.5,2.5 -0.707,0 -1.499,-1.069 -1.499,-2.5 z"
                              id="path1521"
                            />
                          </g>
                        </g>
                        <g id="g1527"></g>
                        <g id="g1529"></g>
                        <g id="g1531"></g>
                        <g id="g1533"></g>
                        <g id="g1535"></g>
                        <g id="g1537"></g>
                        <g id="g1539"></g>
                        <g id="g1541"></g>
                        <g id="g1543"></g>
                        <g id="g1545"></g>
                        <g id="g1547"></g>
                        <g id="g1549"></g>
                        <g id="g1551"></g>
                        <g id="g1553"></g>
                        <g id="g1555"></g>
                      </g>
                      <rect
                        style="fill:none;fill-opacity:1;stroke:#467e9f;stroke-width:13;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;paint-order:stroke markers fill"
                        id="rect1599"
                        width="168.07716"
                        height="21.935196"
                        x="104.35231"
                        y="214.47029"
                        rx="13.301043"
                        ry="10.418743"
                        transform="rotate(-21.889447)"
                      />
                    </g>
                  </g>
                  <g
                    id="g1258"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1260"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1262"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1264"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1266"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1268"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1270"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1272"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1274"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1276"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1278"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1280"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1282"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1284"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g
                    id="g1286"
                    transform="translate(-12.492253,-99.017375)"
                  ></g>
                  <g id="g1256" transform="translate(-7.261,-103.1645)">
                    <g id="g1236">
                      <polygon
                        style="fill:#ffb819;fill-opacity:0.33606"
                        points="7.261,366.636 230.796,262.472 109.313,142.129 "
                        id="polygon1222"
                      />
                      <circle
                        style="fill:#f6d37f;fill-opacity:1"
                        cx="139.46001"
                        cy="232.5"
                        r="27.121"
                        id="circle1224"
                      />
                      <path
                        style="fill:#f6d37f;fill-opacity:1"
                        d="m 64.791,240.073 c 7.507,0.439 15.158,-2.219 20.866,-7.982 10.454,-10.552 10.455,-27.525 0.076,-38.087 z"
                        id="path1226"
                      />
                      <path
                        style="fill:#f6d37f;fill-opacity:1"
                        d="m 34.985,337.966 c -5.319,5.371 -7.93,12.403 -7.847,19.408 l 44.797,-20.876 c -10.697,-9.221 -26.859,-8.718 -36.95,1.468 z"
                        id="path1228"
                      />
                      <path
                        style="fill:#f6d37f;fill-opacity:1"
                        d="m 142.845,283.129 c -6.434,6.495 -8.903,15.423 -7.436,23.792 l 47.484,-22.127 c -0.534,-0.634 -1.093,-1.252 -1.693,-1.846 -10.641,-10.541 -27.813,-10.46 -38.355,0.181 z"
                        id="path1230"
                      />
                      <circle
                        style="fill:#f6d37f;fill-opacity:1"
                        cx="77.177002"
                        cy="286.45099"
                        r="27.121"
                        id="circle1232"
                      />
                      <polygon
                        style="fill:#467e9f;fill-opacity:1"
                        points="109.313,142.129 96.306,170.743 202.305,275.748 230.796,262.472 "
                        id="polygon1234"
                      />
                    </g>
                  </g>
                </svg>
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
        <div class="flex flex-col">
          <social-blade
            :symbol="mySymbol"
            :symbolColor="myColor"
            :time="myTime"
            :nickname="myNickname"
          ></social-blade>
          <div class="m-auto my-3 text-3xl text-white font-semibold">VS</div>
          <social-blade
            :symbol="enemySymbol"
            :symbolColor="enemyColor"
            :time="enemyTime"
            :nickname="enemyNickname"
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
            <svg
              v-show="muted"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 stroke-current"
              viewBox="0 0 24 24"
              stroke-width="1.3"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="3" y1="3" x2="21" y2="21" />
              <path
                d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1"
              />
              <path
                d="M5 10a7 7 0 0 0 10.846 5.85m2.002 -2a6.967 6.967 0 0 0 1.152 -3.85"
              />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <svg
              v-show="!muted"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 stroke-current"
              viewBox="0 0 24 24"
              stroke-width="1.3"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <rect x="9" y="2" width="6" height="11" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </button>
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
            class="w-full rounded-full h-12 border-4 xl:px-8 p-2 px-4 border-gray-700 flex flex-row overflow-hidden justify-between"
          >
            <input
              class="h-full bg-transparent placeholder-gray-400 dark:placeholder-gray-400 w-auto xl:flex-1 p-0 border-0 border-b-2 border-gray-500 dark:border-gray-300 text-gray-900 dark:text-gray-50 text-lg float-left focus:border-gomoku-blue focus:ring-transparent"
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
    <div>
      <svg
        data-v-69bfb0ac=""
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 7.684 7.684"
        id="svgCrossOrigin"
        class="hidden"
      >
        <g
          data-v-69bfb0ac=""
          transform="rotate(33.203 -466.024 -176.195)"
          :fill="!amIStartingPlayer ? myColor : enemyColor"
          paint-order="markers fill stroke"
        >
          <rect
            data-v-69bfb0ac=""
            transform="rotate(-168.89)"
            ry="0"
            y="277.865"
            x="28.526"
            height="9.29"
            width="1.484"
          ></rect>
          <rect
            data-v-69bfb0ac=""
            transform="rotate(-78.89)"
            ry="0"
            y="-33.912"
            x="281.768"
            height="9.29"
            width="1.484"
          ></rect>
        </g>
      </svg>
      <CircleOrigin
        :amIStartingPlayer="amIStartingPlayer"
        :enemyColor="enemyColor"
        :myColor="myColor"
      />
    </div>
  </view-base>
</template>
<script lang="ts">
// Types
import { GameState, Ending } from "@/types";
// SVGs
import victoryConfettiCone from "@/assets/svg/victoryConfettiCone.svg";
import circleOrigin from "@/assets/svg/circleOrigin.svg";
import CircleOrigin from "@/components/svg/CircleOrigin.vue";
enum Symbol {
  Cross,
  Circle,
}

// Components
import ViewBase from "@/components/ViewBase.vue";
import SocialBlade from "@/components/SocialBlade.vue";
import ChatMessage from "@/components/mini/ChatMessage.vue";
// Utils
import { defineComponent } from "vue";

export default defineComponent({
  name: "GameBase",
  components: { ViewBase, SocialBlade, ChatMessage, CircleOrigin },
  props: {
    myTime: Number,
    enemyTime: String,
    amIStartingPlayer: Boolean,
    myNickname: String,
    enemyNickname: String,
    myColor: String,
    enemyColor: String,
    messages: Array,
    lastPositionID: Number,
    round: Number,
    gameState: String,
    gameEnding: String,
  },
  setup() {
    return {
      victoryConfettiCone,
      circleOrigin,
    };
  },
  data() {
    return {
      chatInput: "",
      afterGameModal: true,
      muted: false,
    };
  },
  computed: {
    coinSide(): string {
      return this.amIStartingPlayer ? "heads" : "tails";
    },
    mySymbol(): string {
      if (
        this.gameState == GameState.Coinflip ||
        this.gameState == GameState.Waiting
      )
        return "";
      return this.amIStartingPlayer ? "circle" : "cross";
    },
    enemySymbol(): string {
      if (
        this.gameState == GameState.Coinflip ||
        this.gameState == GameState.Waiting
      )
        return "";
      return !this.amIStartingPlayer ? "circle" : "cross";
    },
    isGameEndingVictory(): boolean {
      return (
        this.gameEnding === "victoryFiveInRow" ||
        this.gameEnding === "victoryTimeout" ||
        this.gameEnding === "victoryDisconnect"
      );
    },
    genArray() {
      const array: number[] = [];

      for (let i = 0; i < 225; i++) {
        array.push(i);
      }

      return array;
    },
  },
  watch: {
    lastPositionID: function() {
      this.placeStone(this.lastPositionID!);
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
    },
    sendMessage() {
      this.chatInput = this.chatInput.trim();
      if (this.chatInput) {
        const message = { author: "me", text: this.chatInput };
        this.addMessage(message);
        this.chatInput = "";
      }
    },
    addMessage(message: { author: string; text: string }) {
      // @ts-ignore
      // this.messages.push(message);
      // const chatContainer = document.getElementById(
      //   "chatContainer"
      // ) as HTMLElement;
      // setTimeout(() => {
      //   chatContainer.scrollTop = chatContainer.scrollHeight;
      // }, 1);
    },
    //
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
