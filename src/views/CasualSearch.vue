<template>
  <SearchBase :logged="logged"></SearchBase>
</template>
<script>
import io from "socket.io-client";
import router from "../router";
import SearchBase from "../components/SearchBase";
let socket;
export default {
  name: "App",
  components: { SearchBase },
  props: ["logged"],
  mounted() {
    socket = io("/q/search");
    socket.on("gameCreated", function(roomID) {
      setTimeout(function() {
        router.push({ path: "/q/game", query: { roomID: roomID } });
      }, 1000);
    });
  },
  beforeDestroy() {
    socket.close();
  },
};
</script>
