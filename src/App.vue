<template>
  <div id="app">
    <Navbar id="navbar"></Navbar>
    <router-view />
  </div>
</template>
<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

import router from "./router";
export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      logged: false,
      username: "",
      colorMain: "#ffffff",
      colorSecond: "#ffffff",
      colorMainDark: "#ffffff",
    };
  },
  methods: {
    pokeAPI() {
      axios
        .post("/api/mock")
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    isLogged() {
      axios
        .post(
          "/api/islogged",
          {},
          {
            headers: {
              "auth-token": `${localStorage.getItem("jwtToken")}`,
            },
          }
        )
        .then((response) => {
          if (response.data) {
            this.logged = true;
            this.username = response.data.username;
          } else {
            this.logged = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loggedIn(isLogged, username) {
      this.logged = isLogged;
      if (username) this.username = username;
    },
    loggedOut() {
      axios
        .post("/api/logout")
        .then(() => {
          this.logged = false;
          router.push("logout");
        })
        .catch(() => {});
    },
    changeColorMain: function(color, darkColor) {
      this.colorMain = color;
      this.colorMainDark = darkColor;
      let data = {
        colorMain: this.colorMain,
        colorSecond: this.colorSecond,
        colorMainDark: this.colorMainDark,
      };
      this.changeFavicon(this.colorMain);
      axios
        .post("/api/changeColors", data)
        .then(() => {})
        .catch(() => {});
    },
    changeColorSecond: function(color) {
      this.colorSecond = color;
      let data = {
        colorMain: this.colorMain,
        colorSecond: this.colorSecond,
        colorMainDark: this.colorMainDark,
      };
      axios
        .post("/api/changeColors", data)
        .then(() => {})
        .catch(() => {});
    },
  },
  mounted() {},
};
</script>
<style>
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
