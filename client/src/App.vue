<template>
  <navbar id="navbar" :activeIntersection="activeIntersection"></navbar>
  <!-- FIXME MIGHT Be careful of :key attribute, might cause higher response time (my insight) -->
  <router-view
    :key="$route.fullPath"
    :activeUsers="this.onlineUsers"
    class="min-height-screen-calc "
    @intersectionCrossed="setIntersection"
  />
</template>
<script lang="ts">
import { io, Socket } from "socket.io-client";
let socket: Socket;
import { SocketIOEvents, UpdateActiveUsersDTO } from "@/shared/socketIO";
import { useStore } from "@/store/store";
import { defineComponent, ref, reactive, toRefs, onMounted } from "vue";
import Navbar from "@/components/TheNavbar.vue";
export default defineComponent({
  name: "App",
  components: { Navbar },
  setup() {
    const store = useStore();

    if (store.token) {
      store.setBearer(store.token);
      store.fetchOwnProfile();
    }
    let onlineUsers = reactive(ref(0));
    const state = reactive({ activeIntersection: "" });

    const setIntersection = (intersectionName: string) => {
      state.activeIntersection = intersectionName;
    };

    onMounted(() => {
      socket = io("/app", { port: 3001 });
      socket.on(
        SocketIOEvents.UpdateActiveUsers,
        (updateActiveUsersDTO: UpdateActiveUsersDTO) => {
          onlineUsers.value = updateActiveUsersDTO.activeUsers;
        }
      );
    });

    return {
      ...toRefs(state),
      setIntersection,
      onlineUsers,
    };
  },
  mounted() {},
  beforeUnmount() {
    socket.close();
  },
});
</script>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.min-height-screen-calc {
  min-height: calc(100vh - 4rem);
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: "Fira Sans", sans-serif;
  box-sizing: border-box;
  scroll-behavior: smooth;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
}

a {
  text-decoration: none !important;
}
a:active {
  outline: none !important;
}
</style>
