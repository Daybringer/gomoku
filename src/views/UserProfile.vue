<template>
  <div class="min-height-screen-calc bg-gray-100  dark:bg-gray-700">
    <h1 class="p-4 text-center text-4xl text-gray-900 dark:text-gray-200">
      This is my profile
    </h1>
  </div>
</template>

<script lang="ts">
// Axios repos
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
const UsersRepository = RepositoryFactory.getUserRepository;
// Pinia
import { useStore } from "@/store/store";

// Components
import { defineComponent } from "vue";
export default defineComponent({
  name: "",
  data() {
    return {};
  },
  components: {},
  methods: {
    async fetchUserData() {
      const store = useStore();
      return UsersRepository.getOwnUserProfile()
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));
    },
  },
  async beforeMount() {
    const userData = await this.fetchUserData();
    console.log(userData);
  },
});
</script>

<style scoped></style>
