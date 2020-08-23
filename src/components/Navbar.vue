<template>
  <div>
    <div class="navbar" id="smallNav">
      <div style="width:100%;background-color:#363636;height:100%;">
        <router-link to="/" @click.native="scrollToTop">
          <svg
            viewBox="0 0 25.265 4.105"
            xmlns="http://www.w3.org/2000/svg"
            class="logoSVG"
          >
            <g
              transform="translate(-102.84 -127.6)"
              paint-order="markers fill stroke"
            >
              <circle
                cx="109.42"
                cy="129.65"
                r="1.86"
                fill="none"
                :stroke="colorMain"
                stroke-linejoin="round"
                stroke-width=".385"
              />
              <circle
                cx="118.39"
                cy="129.65"
                r="1.86"
                fill="none"
                :stroke="colorMain"
                stroke-linejoin="round"
                stroke-width=".385"
              />
              <g :fill="colorMain">
                <path
                  d="M120.874 127.79h.375v3.913h-.375zM121.355 129.516l.265-.265 2.187 2.187-.265.265z"
                />
                <path d="M123.273 127.597l.265.266-1.918 1.918-.265-.265z" />
              </g>
              <path d="M127.73 127.71h.378v2.081h-.378z" :fill="colorMain" />
              <path
                d="M127.92 129.78a1.746 1.746 0 01-1.746 1.739 1.746 1.746 0 01-1.746-1.739"
                fill="none"
                :stroke="colorMain"
                stroke-linejoin="round"
                stroke-width=".378"
              />
              <g :fill="colorMain">
                <path d="M124.23 127.71h.378v2.081h-.378z" />
                <path
                  d="M104.89 127.6c-1.131 0-2.053.921-2.053 2.053s.922 2.052 2.053 2.052c.576 0 1.126-.242 1.515-.667l-.284-.26a1.668 1.668 0 11.437-1.125c0 .3-.01.632-.169.816l.25.235c.264-.304.304-.722.304-1.051a2.056 2.056 0 00-2.053-2.053z"
                  color="#000"
                  style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;text-decoration-color:#000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"
                />
                <path
                  d="M106.12 131.3l-1.715-1.714.272-.272 1.728 1.728-.027.029-.028.028-.045.045-.053.049-.042.036-.051.041z"
                />
              </g>
              <g :fill="colorMain" stroke-width="0">
                <path
                  d="M111.9 127.83h.369v3.83h-.369zM115.55 127.88h.369v3.83h-.369z"
                />
                <path d="M115.548 127.88l.23.23-1.855 1.856-.23-.23z" />
                <path d="M114.162 129.719l-.26.26-1.89-1.888.262-.26z" />
              </g>
            </g>
          </svg>
        </router-link>
        <tasty-burger-button
          id="hamburger-icon"
          ref="hamburger"
          :type="buttonType"
          :active="isActive"
          :size="size"
          :color="color"
          :active-color="activeColor"
          v-on:toggle="burgerToggle"
        />
        <div id="dropdown-content" @click="closeMenu">
          <a></a>
          <router-link
            @click="$emit(loggedOut)"
            to="/login"
            style="color:#00b3fe"
            >Log In</router-link
          >
          <router-link @click.native="scrollToMatches" to="/"
            >Matches</router-link
          >
          <router-link @click.native="scrollToRules" to="/">Rules</router-link>
          <router-link to="/about">About</router-link>
          <a id="last-fake-link"></a>
        </div>
      </div>
      <div
        id="skewed-nav"
        style="background-color:#363636;width:100%;height:20vh;transform: skewY(-7.5deg);position:absolute;text-align:center;z-index:-1;"
      ></div>
    </div>
  </div>
</template>

<script>
import { TastyBurgerButton } from "vue-tasty-burgers";
export default {
  name: "navbar",
  props: ["logged"],
  data() {
    return {
      colorMain: "#00b3fe",
      buttonType: "elastic",
      isActive: false,
      buttonIsActiv: false,
      size: "s",
      color: "#00b3fe",
      activeColor: "#00b3fe",
    };
  },
  mounted: function() {
    let skewedNav = document.getElementById("skewed-nav");
    let navHeight = document.getElementById("smallNav").clientHeight;
    skewedNav.style.top =
      (skewedNav.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180) -
      skewedNav.offsetHeight +
      navHeight +
      "px";
    window.onresize = function() {
      let skewedNav = document.getElementById("skewed-nav");
      let navHeight = document.getElementById("smallNav").clientHeight;
      skewedNav.style.top =
        (skewedNav.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180) -
        skewedNav.offsetHeight +
        navHeight +
        "px";
    };
  },
  methods: {
    closeMenu() {
      document.getElementById("hamburger-icon").click();
    },
    burgerToggle: function(active) {
      if (active) {
        this.buttonIsActiv = true;
        document.getElementById("dropdown-content").style.display = "block";
        document.getElementById("dropdown-content").classList.add("slide-in");
        document
          .getElementById("dropdown-content")
          .classList.remove("slide-out");
      } else {
        this.buttonIsActiv = false;
        document.getElementById("dropdown-content").classList.add("slide-out");
        document
          .getElementById("dropdown-content")
          .classList.remove("slide-in");
      }
    },
    scrollFix: function(hashbang) {
      location.hash = hashbang;
    },
    scrollToTop: function() {
      if (this.buttonIsActiv) {
        this.closeMenu();
        console.log("yay");
      }

      document.getElementById("dropdown-content").classList.remove("slide-out");
      document.getElementById("dropdown-content").classList.remove("slide-in");
      if (location.pathname === "/") {
        this.scrollFix("#home");
      }
    },
    scrollToRules: function() {
      if (location.pathname === "/") {
        this.scrollFix("#rules");
      }
    },
    scrollToMatches: function() {
      if (location.pathname === "/") {
        this.scrollFix("#matches");
      }
    },
  },
  computed: {
    cssVars() {
      return {
        "--main": this.colorMain,
        "--second": this.colorSecond,
      };
    },
  },
  components: {
    "tasty-burger-button": TastyBurgerButton,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#last-fake-link {
  transform: skewY(-7.5deg);
  height: 2rem;
  position: absolute;
  bottom: -1rem;
  width: 100%;
  z-index: -1;
}
#dropdown-content {
  position: absolute;
  right: 0;
  top: 3rem;
  display: none;
  transform: translateY(-110%);
  z-index: -1;
}
.slide-in {
  animation: slide-in 0.75s forwards;
}
@keyframes slide-in {
  0% {
    transform: translateY(-110%);
  }
  100% {
    transform: translateY(0%);
  }
}
.slide-out {
  animation: slide-out 0.75s forwards;
}
@keyframes slide-out {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-110%);
  }
}
#dropdown-content a {
  display: block;
  color: #8f8f8f;
  background-color: #363636;
  padding: 0.5em 2rem;
  font-size: 1.1rem;
  font-weight: 700;
}
#hamburger-icon {
  right: 1em;
  top: 50%;
  transform: translate(0, -50%);
  position: absolute;
}
.navbar {
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 3rem;
  background-color: #ffffff;
}
.logo {
  height: 100%;
  position: absolute;
}

.logoSVG {
  height: 70%;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  margin-left: 1em;
  left: 0;
}

.account-window {
  background-color: var(--main);
  width: auto;
  min-width: 15rem;
  position: absolute;
  right: 0;
  height: 100%;
  border-bottom-left-radius: 1rem;
  cursor: pointer;
}

.svg_login {
  height: 60%;
  margin-right: 2em;
  right: 0;
  top: 0;
  margin-bottom: auto;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}

.account-name {
  color: #fafefcff;
  font-weight: 700;
  font-size: 1.8em;
  height: 60%;
  right: 40%;
  top: 0;
  margin-bottom: auto;
  position: absolute;
  top: 50%;
  transform: translate(0, -60%);
}
/* The dropdown container */
.dropdown {
  float: right;
  overflow: hidden;
  height: 100%;
  min-width: 15%;
}

/* Dropdown button */
.dropdown .dropbtn {
  font-weight: 700;
  font-size: 1.8em;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  color: white;
  padding: 0 2rem;
  background-color: var(--main);
  font-family: inherit; /* Important for vertical align on mobile phones */
  margin: 0; /* Important for vertical align on mobile phones */
  border-bottom-left-radius: 1rem;
}
#dropbtn::-moz-focus-inner {
  border: 0;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-bottom-left-radius: 1rem;
  border-top-left-radius: 1rem;
}

/* Links inside the dropdown */
.dropdown-content a {
  float: none;
  color: black;
  padding: 1rem 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  overflow: hidden;
  cursor: pointer;
}

/* Add a grey background color to dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd;
}
a:active {
  outline: none;
}
a:focus {
  outline: none;
}
.dropdown-content #last-link:hover {
  border-bottom-left-radius: 1rem;
}
.dropdown-content #first-link:hover {
  border-top-left-radius: 1rem;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .logoSVG {
    height: 50%;
  }
  .account-window {
    background-color: var(--main);
    width: auto;
    min-width: 10rem;
    position: absolute;
    right: 0;
    height: 90%;
    border-bottom-left-radius: 1rem;
    cursor: pointer;
  }

  .svg_login {
    display: none;
  }

  .account-name {
    font-weight: 500;
    height: 100%;
    right: 50%;
    position: absolute;
    top: 50%;
    transform: translate(50%, -45%);
  }
  /* The dropdown container */
  .dropdown {
    float: right;
    overflow: hidden;
    height: 100%;
    min-width: 15%;
  }

  /* Dropdown button */
  .dropdown .dropbtn {
    font-weight: 500;
    font-size: 1.5em;
    max-width: 12rem;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    color: white;
    padding: 0 1rem;
    background-color: var(--main);
    font-family: inherit; /* Important for vertical align on mobile phones */
    margin: 0; /* Important for vertical align on mobile phones */
    border-bottom-left-radius: 1rem;
  }
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    width: 100%;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-bottom-left-radius: 1rem;
    border-top-left-radius: 1rem;
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    float: none;
    color: black;
    padding: 1rem 16px;
    text-decoration: none;
    display: block;
    text-align: left;
    overflow: hidden;
    cursor: pointer;
  }

  /* Add a grey background color to dropdown links on hover */
  .dropdown-content a:hover {
    background-color: #ddd;
  }
  a:active {
    outline: none;
  }
  a:focus {
    outline: none;
  }
  .dropdown-content #last-link:hover {
    border-bottom-left-radius: 1rem;
  }
  .dropdown-content #first-link:hover {
    border-top-left-radius: 1rem;
  }

  /* Show the dropdown menu on hover */
  .dropdown:hover .dropdown-content {
    display: block;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>
