<template>
  <div id="app">
    <Navbar
      id="navbar"
      :colorMain="colorMain"
      :colorSecond="colorSecond"
      @loggedOut="loggedOut"
      :username="username"
      :logged="logged"
    ></Navbar>
    <router-view
      :colorMain="colorMain"
      :colorSecond="colorSecond"
      @colorMain="changeColorMain"
      @colorSecond="changeColorSecond"
      @loggedIn="loggedIn"
      :username="username"
      :logged="logged"
      :colorMainDark="colorMainDark"
      @updatePort="updatePort"
      :port="port"
    />
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
      port: "3000",
    };
  },
  methods: {
    isLogged() {
      axios
        .post("/api/islogged")
        .then((response) => {
          this.logged = true;
          this.username = response.data.username;
          let [
            colorMain,
            colorSecond,
            colorMainDark,
          ] = response.data.colors.split(",");
          this.colorMain = colorMain;
          this.colorSecond = colorSecond;
          this.colorMainDark = colorMainDark;
        })
        .catch(() => {
          this.colorMain = "#ff006e";
          this.colorSecond = "#3a86ff";
          this.colorMainDark = "#EE0063";
          this.logged = false;
        });
    },
    updatePort(port) {
      this.port = port;
    },
    loggedIn() {
      this.isLogged();
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
  beforeMount() {
    this.isLogged();
  },
};
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
  box-sizing: border-box;
}
a {
  text-decoration: none !important;
}
a:active {
  outline: none !important;
}
</style>
