<template>
  <Navbar id="navbar" :activeIntersection="activeIntersection"></Navbar>
  <!-- FIXME MIGHT Be careful of :key attribute, might cause higher response time (my insight) -->

  <RouterView
    :activeUsers="onlineUsers"
    :key="route.fullPath"
    class="min-height-screen-calc"
    @intersectionCrossed="setIntersection" />
  <!-- NOTIFICATIONS -->
  <div
    class="fixed w-full flex flex-col place-items-center z-50 bottom-8 gap-2">
    <TransitionGroup name="notification-list">
      <BaseToast
        v-for="notification in notifications"
        :key="notification.UUID"
        :notification="notification" />
    </TransitionGroup>
  </div>
</template>
<script setup lang="ts">
import { io, Socket } from "socket.io-client";
import { SocketIOEvents, UpdateActiveUsersDTO } from "@/shared/socketIO";
import { useProfileStore } from "@/store/profile";
import { ref, reactive, onMounted, onBeforeUnmount, onBeforeMount } from "vue";
import Navbar from "@/components/TheNavbar.vue";
import BaseToast from "./components/BaseToast.vue";
import { useNotificationsStore } from "./store/notifications";
import { useRoute } from "vue-router";

let socket: Socket;
const profileStore = useProfileStore();
const notifications = reactive(useNotificationsStore().$state.notifications);
const route = ref(useRoute());

// FIXME implement server check whether token is still valid and in case of nonvalid token
// invalid LOCAL token and logout user
if (profileStore.token) {
  profileStore.setBearer(profileStore.token);
  profileStore.fetchOwnProfile();
}
const onlineUsers = ref(0);
const activeIntersection = ref("");

const setIntersection = (intersectionName: string) => {
  activeIntersection.value = intersectionName;
};

onMounted(() => {
  socket = io("/app");

  socket.on(
    SocketIOEvents.UpdateActiveUsers,
    (updateActiveUsersDTO: UpdateActiveUsersDTO) => {
      onlineUsers.value = updateActiveUsersDTO.activeUsers;
    }
  );
});

onBeforeMount(() => {
  if (profileStore.darkModeToggled) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

onBeforeUnmount(() => {
  socket.close();
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
  font-display: swap;
  font-family: "Fira Sans", sans-serif;
  box-sizing: border-box;
  scroll-behavior: smooth;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
}

/* body * {
  @apply transition-colors duration-0;
} */

a {
  text-decoration: none !important;
}
a:active {
  outline: none !important;
}

/* ---------- NOTIFICATIONS ---------- */
.notification-list-move,
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.notification-list-enter-from {
  opacity: 0;
  transform: translate(-80px);
}
.notification-list-leave-to {
  opacity: 0;
  transform: translateX(80px);
}
</style>
