<template>
  <GameBase
    :round="round"
    :gameState="gameState"
    :gameEnding="gameEnding"
    :lastPositionID="lastPositionID"
    :myUserID="me.userID"
    :myIconName="me.iconName"
    :myLogged="me.logged"
    :myTime="me.time"
    :myNickname="me.nickname"
    :myColor="store.user.playerColor"
    :amIStartingPlayer="amIStartingPlayer"
    :enemyLogged="opponent.logged"
    :enemyIconName="opponent.iconName"
    :enemyUserID="opponent.userID"
    :enemyTime="opponent.time"
    :enemyColor="store.user.enemyColor"
    :enemyNickname="opponent.nickname"
    :messages="messages"
    @gameClick="gameClick"
    @sendMessage="sendMessage"
  />
</template>
<script lang="ts">
// Types
import { GameState, Ending } from "@/types";
import { COIN_SPIN_DURATION } from "@/shared/constants";
// Backend-frontend shared types
import { position, GameClickDTO, GameEvents, GameType } from "@/shared/types";
import {
  GameStartedEventDTO,
  GameStartedEventPlayerInfo,
} from "@/shared/socketioEvents.dto";

// SocketIO
let socket: any;
// Components
import GameBase from "@/components/TheGameBase.vue";
// Pinia
import { useStore } from "@/store/store";
// Utils
import { defineComponent } from "vue";
import { io } from "socket.io-client";

export default defineComponent({
  name: "Game",
  components: { GameBase },
  data() {
    return {
      amIStartingPlayer: true,
      me: {
        nickname: "-",
        userID: 0,
        iconName: "",
        logged: false,
        time: 0,
      },
      opponent: {
        nickname: "-",
        iconName: "",
        userID: 0,
        logged: false,
        time: 0,
      },
      chatInput: "",
      lastPositionID: 0,
      round: 0,
      gameState: GameState.Waiting,
      gameEnding: Ending.None,
      messages: [] as Array<Record<string, string>>,
      boardSize: 15,
    };
  },
  setup() {
    const store = useStore();

    return { store };
  },
  methods: {
    /**
     * Forwards click event from GameBase component to game server
     */
    gameClick(position: position): void {
      const gameClickDTO: GameClickDTO = {
        roomID: this.getRoomIDFromURL || "",
        position: position,
      };
      socket.emit(GameEvents.GameClick, gameClickDTO);
    },
    /**
     *
     */
    sendMessage(message: string) {
      const messageObj = { author: "me", text: message };
      this.messages.push(messageObj);
      socket.emit(GameEvents.SendMessage, message);
    },
  },
  async mounted() {
    socket = io("/game/quick", { port: "3001" });

    const logged = this.store.isAuthenticated;
    // TODO not logged in, temporary solution for nicknames
    if (!logged) {
      await this.store
        .getRandomName()
        .then((res) => {
          this.me.nickname = res;
        })
        .catch();
    } else {
      this.me.nickname = this.store.user.username;
    }

    if (this.getGameTypeFromURL === GameType.Quick) {
      socket.emit(GameEvents.JoinGame, {
        roomID: this.getRoomIDFromURL,
        logged: logged,
        username: this.me.nickname,
      });
    } else {
      // TODO implement ranked,customs, etc.
      this.$router.push("/");
    }

    socket.on(GameEvents.InvalidRoomID, () => {
      // TODO show some notification
      this.$router.push("/");
    });

    // Game has begun
    socket.on(
      GameEvents.GameStarted,
      (gameStartedEventDTO: GameStartedEventDTO) => {
        this.amIStartingPlayer =
          socket.id === gameStartedEventDTO.startingPlayerSocketID;

        let me: GameStartedEventPlayerInfo,
          opponent: GameStartedEventPlayerInfo;
        const socketIDs = Object.keys(gameStartedEventDTO.players);
        socketIDs.forEach((key) => {
          console.log(key, gameStartedEventDTO.players);
          if (key === socket.id) {
            me = gameStartedEventDTO.players[key];
          } else {
            opponent = gameStartedEventDTO.players[key];
          }
        });
        console.log(me!, opponent!, socketIDs);

        this.me.nickname = me!.username;
        this.opponent.nickname = opponent!.username;
        this.me.userID = me!.userID;
        this.opponent.userID = opponent!.userID;
        this.me.iconName = String(me!.profileIcon);
        this.opponent.iconName = String(opponent!.profileIcon);
        this.me.logged = me!.logged;
        this.opponent.logged = opponent!.logged;
        this.me.time = this.opponent.time =
          gameStartedEventDTO.timeLimitInSeconds;

        console.log(this.me, this.opponent);

        this.gameState = GameState.Coinflip;

        // FIXME magic numbers (200)
        setTimeout(() => {
          if (this.gameState === GameState.Coinflip) {
            this.gameState = GameState.Running;
          }
        }, COIN_SPIN_DURATION - 200);
      }
    );

    socket.on(
      GameEvents.TimeCalibration,
      (socketTimeDict: Record<string, number>) => {
        for (const socketID in socketTimeDict) {
          //FIXME this scenario only works with exactly two socket IDs in the dict
          // socketID is mine
          if (socketID == socket.id) {
            this.me.time = socketTimeDict[socketID];
          } else {
            this.opponent.time = socketTimeDict[socketID];
          }
        }
      }
    );

    // New message
    socket.on(GameEvents.RecieveMessage, (message) => {
      this.messages.push({ author: "opponent", text: message });
    });

    // Player made a move
    socket.on(GameEvents.StonePlaced, (data) => {
      const { position, times } = data;

      this.round++;
      this.lastPositionID = position[1] * this.boardSize + position[0];

      for (const socketID in times) {
        //FIXME this scenario only works with exactly two socket IDs in the dict
        // socketID is mine
        if (socketID == socket.id) {
          this.me.time = times[socketID];
        } else {
          this.opponent.time = times[socketID];
        }
      }
    });

    // Different game endings
    socket.on(GameEvents.GameEndedByDisconnect, (socketID: string) => {
      // I have been disconnected
      if (socket.id === socketID) {
        this.gameState = GameState.Ended;
        this.gameEnding = Ending.DefeatDisconnect;
        // Enemy has been disconnected
      } else {
        this.gameState = GameState.Ended;
        this.gameEnding = Ending.VictoryDisconnect;
      }
    });

    socket.on(GameEvents.GameEndedByCombination, (socketID: string) => {
      this.gameState = GameState.Ended;
      this.gameEnding =
        socketID !== socket.id
          ? Ending.VictoryFiveInRow
          : Ending.DefeatFiveInRow;
    });

    socket.on(GameEvents.GameEndedByTimeout, (socketID: string) => {
      // I have timed out
      if (socket.id === socketID) {
        this.gameState = GameState.Ended;
        this.gameEnding = Ending.DefeatTimeout;
        // Enemy has timed out
      } else {
        this.gameState = GameState.Ended;
        this.gameEnding = Ending.VictoryTimeout;
      }
    });
  },
  computed: {
    getURLParams() {
      return new URLSearchParams(window.location.search);
    },
    getGameTypeFromURL(): string | null {
      return this.getURLParams.get("type");
    },
    getRoomIDFromURL(): string | null {
      return this.getURLParams.get("roomID");
    },
  },
  beforeUnmount() {
    socket.close();
  },
});
</script>
