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
    />
  </div>
</template>
<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

import router from "./router";

// axios.interceptors.request.use((config) => {
//   config.headers.authorization = `Bearer ${localStorage.getItem("jwtToken")}`;
// });
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
    // googleSession(email) {
    //   // Check for name in database
    //   axios
    //     .post("/api/googleLogin", { email: email })
    //     .then((response) => {
    //       const { username } = response.data;
    //       this.loggedIn(true, username);
    //     })
    //     .catch((err) => {
    //       if (err) console.log(err);
    //     });
    // },
  },
  mounted() {
    this.isLogged();
    // if (this.$gAuth.isAuthorized) {
    //   console.log("cookie is here", this.$gAuth.GoogleAuth);
    //   this.googleSession(this.$gAuth.GoogleAuth.currentUser.le.tt.bu);
    // } else {
    //   console.log("cookie missing", this.$gAuth.GoogleAuth, this.$gAuth);
    // }
  },
};
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Cantarell", sans-serif;
  box-sizing: border-box;
}
a {
  text-decoration: none !important;
}
a:active {
  outline: none !important;
}
</style>
