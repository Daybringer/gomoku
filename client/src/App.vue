<template>
  <navbar id="navbar" :activeIntersection="activeIntersection"></navbar>
  <!-- FIXME MIGHT Be careful of :key attribute, might cause higher response time (my insight) -->
  <router-view
    :key="$route.fullPath"
    :activeUsers="onlineUsers"
    class="min-height-screen-calc"
    @intersectionCrossed="setIntersection"
  />
  <div
    class="fixed w-full flex flex-col place-items-center z-50 bottom-8 gap-2"
  >
    <transition-group name="notification-list">
      <base-toast
        v-for="notification in notifications"
        :key="notification.UUID"
        :text="notification.text"
        :type="notification.type"
        :autoDismiss="notification.autoDismiss"
        :duration="notification.duration"
        :imageName="notification.imageName"
        :UUID="notification.UUID"
      />
    </transition-group>
  </div>
</template>
<script lang="ts">
import { io, Socket } from "socket.io-client";
let socket: Socket;
import { SocketIOEvents, UpdateActiveUsersDTO } from "@/shared/socketIO";
import { useStore } from "@/store/store";
import { defineComponent, ref, reactive, toRefs, onMounted } from "vue";
import Navbar from "@/components/TheNavbar.vue";
import BaseToast from "./components/BaseToast.vue";
import { useNotificationsStore } from "./store/notifications";
export default defineComponent({
  name: "App",
  components: { Navbar, BaseToast },
  setup() {
    const store = useStore();
    const notificationStore = useNotificationsStore();
    const notifications = reactive(notificationStore.$state.notifications);

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
      notifications,
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
.notification-list-move,
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
/* .notification-list-leave-active {
  position: absolute;
} */
.notification-list-enter-from {
  opacity: 0;
  transform: translate(-80px);
}
.notification-list-leave-to {
  opacity: 0;
  transform: translateX(80px);
}
</style>
