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
          this.changeFavicon(this.colorMain);
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
      this.changeFavicon(this.colorMain);
      axios
        .post("/api/changeColors", data)
        .then(() => {})
        .catch(() => {});
    },
    changeFavicon(hexColor) {
      console.log(hexColor);
      switch (hexColor) {
        case "#ff006e":
          document
            .getElementById("favicon")
            .setAttribute("href", "pink_favicon32.png");
          break;
        case "#3a86ff":
          document
            .getElementById("favicon")
            .setAttribute("href", "blue_favicon32.png");
          break;
        case "#44bba4":
          document
            .getElementById("favicon")
            .setAttribute("href", "aqua_favicon32.png");
          break;
        case "#ffbf00":
          document
            .getElementById("favicon")
            .setAttribute("href", "yellow_favicon32.png");
          break;
        case "#ff822e":
          document
            .getElementById("favicon")
            .setAttribute("href", "orange_favicon32.png");
          break;
        case "#a937c8":
          document
            .getElementById("favicon")
            .setAttribute("href", "purple_favicon32.png");
          break;
        case "#0cce6b":
          document
            .getElementById("favicon")
            .setAttribute("href", "green_favicon32.png");
          break;
        case "#d94a3f":
          document
            .getElementById("favicon")
            .setAttribute("href", "red_favicon32.png");
          break;

        default:
          document
            .getElementById("favicon")
            .setAttribute("href", "pink_favicon32.png");
          break;
      }
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
