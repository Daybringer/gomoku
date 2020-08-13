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
        <svg
          id="svg3027"
          version="1.1"
          viewBox="0 0 21.876072 15.96943"
          class="burgerSVG"
        >
          <g transform="translate(-104.543,-120.08387)" id="layer1">
            <g
              transform="matrix(-5.345316,0,0,5.345316,317.63418,-203.25082)"
              style="fill:#ff006e;fill-opacity:1"
              id="g1539-2-9-3-2-3"
            >
              <rect
                style="fill:#00b3fe;fill-opacity:1;stroke:none;stroke-width:1.76305;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.360234"
                id="rect1513-26-4-6-0-2"
                width="4.092567"
                height="0.60670787"
                x="35.772461"
                y="62.870197"
                rx="0.25578544"
                ry="0.30335394"
              />
              <rect
                ry="0.30335394"
                rx="0.22700049"
                y="61.679771"
                x="36.233021"
                height="0.60670787"
                width="3.6320078"
                id="rect1513-9-1-8-7-2-0"
                style="fill:#00b3fe;fill-opacity:1;stroke:none;stroke-width:1.66089;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.360234"
              />
              <rect
                ry="0.30335394"
                rx="0.19730575"
                y="60.489349"
                x="36.708138"
                height="0.60670787"
                width="3.1568921"
                id="rect1513-2-0-1-5-3-6"
                style="fill:#00b3fe;fill-opacity:1;stroke:none;stroke-width:1.54845;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.360234"
              />
            </g>
          </g>
        </svg>
      </div>
      <div
        id="skewed-nav"
        style="background-color:#363636;width:100%;height:20vh;transform: skewY(-7.5deg);position:absolute;text-align:center;z-index:-1;"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "navbar",
  props: ["logged"],
  data() {
    return {
      colorMain: "#00b3fe",
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
    scrollFix: function(hashbang) {
      location.hash = hashbang;
    },
    scrollToTop: function() {
      if (location.pathname === "/") {
        this.scrollFix("#home");
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.burgerSVG {
  height: 70%;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  margin-right: 1em;
  right: 0;
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
  .burgerSVG {
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
