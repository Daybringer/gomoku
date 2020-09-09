<template>
  <SearchBase :logged="logged" :username="username"></SearchBase>
</template>
<script>
import io from "socket.io-client";
import router from "../router";
import SearchBase from "../components/SearchBase";
let socket;
export default {
  name: "App",
  components: { SearchBase },
  props: ["logged", "username"],
  mounted() {
    socket = io("/r/search");
    if (this.logged) {
      socket.emit("beginSearch", this.username);
    } else {
      // Player has to login
      router.push("/login");
    }
    socket.on("gameCreated", function(roomID) {
      setTimeout(function() {
        router.push({ path: "/r/game", query: { roomID: roomID } });
      }, 1000);
    });
  },
  beforeDestroy() {
    socket.close();
  },
};
</script>
