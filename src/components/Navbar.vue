<template>
  <div class="navbar" id="navbar">
    <div class="logo-container">
      <router-link to="/" @click.native="scrollToTop">
        <svg viewBox="0 0 25.265 4.105" xmlns="http://www.w3.org/2000/svg" class="logoSVG">
          <g transform="translate(-102.84 -127.6)" paint-order="markers fill stroke">
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
              <path d="M111.9 127.83h.369v3.83h-.369zM115.55 127.88h.369v3.83h-.369z" />
              <path d="M115.548 127.88l.23.23-1.855 1.856-.23-.23z" />
              <path d="M114.162 129.719l-.26.26-1.89-1.888.262-.26z" />
            </g>
          </g>
        </svg>
      </router-link>
    </div>
    <router-link v-if="!logged" to="login">
      <div class="account-window" :style="cssVars">
        <div class="account-name">Login</div>

        <div class>
          <svg viewBox="0 0 3.753 3.418" xmlns="http://www.w3.org/2000/svg" class="svg_login">
            <path
              class
              d="M1.88 0C.844 0 .003.765.003 1.709S.844 3.418 1.88 3.418s1.877-.766 1.877-1.71S2.916 0 1.88 0zm0 .512c.314 0 .562.227.562.512s-.248.512-.562.512c-.314 0-.562-.226-.562-.512s.248-.512.562-.512zm0 2.426c-.468 0-.882-.221-1.125-.55.006-.34.752-.528 1.125-.528s1.119.188 1.125.528c-.243.329-.657.55-1.125.55z"
              fill="#fff"
              fill-opacity="1"
            />
          </svg>
        </div>
      </div>
    </router-link>

    <div v-if="logged" class="dropdown" @click="dropdownMenu">
      <button class="dropbtn" id="dropbtn" :style="cssVars">
        {{ username }}
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content" id="dropdown-content">
        <router-link id="first-link" to="/dashboard">Dashboard</router-link>
        <router-link to="/settings">Settings</router-link>
        <a id="last-link" @click="$emit('loggedOut')" to="/settings">Logout</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "navbar",
  props: ["logged", "username", "colorMain", "colorSecond"],
  mounted: function() {},
  methods: {
    scrollFix: function(hashbang) {
      location.hash = hashbang;
    },
    scrollToTop: function() {
      if (location.pathname === "/") {
        this.scrollFix("#home");
      }
    },
    dropdownMenu: function() {
      if ("ontouchstart" in document.documentElement) {
        console.log("clicked");
        console.log(document.getElementById("dropdown-content").style);
        if (
          document.getElementById("dropdown-content").style.display ===
            "none" ||
          !document.getElementById("dropdown-content").style.display
        ) {
          document.getElementById("dropdown-content").style.display = "block";
        } else {
          document.getElementById("dropdown-content").style.display = "none";
        }
      }
    }
  },
  computed: {
    cssVars() {
      return {
        "--main": this.colorMain,
        "--second": this.colorSecond
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
router-link {
  margin: 0;
  padding: 0;
}
.navbar {
  z-index: 1000;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 6vh;
  min-height: 3rem;
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
