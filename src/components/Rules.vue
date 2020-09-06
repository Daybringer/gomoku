<template>
  <div>
    <div id="rulesSkewedDiv">
      <div class="centered-div">
        <span class="headline">Rules</span>
      </div>
    </div>
    <div id="rulesContainer">
      <carousel
        id="rules-carousel"
        :per-page="1"
        :paginationColor="'#363636'"
        :paginationActiveColor="'#00b3fe'"
      >
        <slide class="rule-container">
          <div>
            <h3 class="rule-heading">Basics</h3>
            <ul class="rule-list">
              <li class="rule-point">Gomoku is a game for 2 players</li>
              <li class="rule-point">
                It is played on 15x15 gameboard
              </li>
              <li class="rule-point">
                Players alternate turns placing their stone/circle/cross
              </li>
              <li class="rule-point">
                The winner is the first player to form an unbroken chain of five
                stones horizontally, vertically, or diagonally
              </li>
            </ul>
            <button
              class="modal-show-example"
              @click="
                () => {
                  exampleModalState = 'basics';
                }
              "
            >
              Show example
            </button>
          </div>
        </slide>
        <slide class="rule-container">
          <div>
            <h3 class="rule-heading">SWAP Rule</h3>
            <ul class="rule-list">
              <li class="rule-point">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </li>
              <li class="rule-point">
                Accusantium alias quis sunt nisi veniam molestias deserunt natus
                hic!
              </li>
              <li class="rule-point">
                Cumque quibusdam placeat quos omnis.
              </li>
              <li class="rule-point">
                Consectetur corrupti adipisci similique, quo recusandae ratione.
              </li>
            </ul>
            <button
              class="modal-show-example"
              @click="
                () => {
                  exampleModalState = 'swap1';
                }
              "
            >
              Show example
            </button>
          </div>
        </slide>
        <slide class="rule-container">
          <div>
            <h3 class="rule-heading">SWAP2 Rule</h3>
            <ul class="rule-list">
              <li class="rule-point">
                Rule used in <b>ranked games</b> to even out the advantage of
                starting player. It is used on all international tournaments
              </li>
              <li class="rule-point">
                Order:
                <ol>
                  <li>
                    Starting player places 3 stones (e.g. 2 crosses, 1 circle)
                  </li>
                  <li>
                    An opponent can either choose a side or place next 2 stones
                  </li>
                  <li>The player with least stones plays</li>
                </ol>
              </li>
            </ul>
            <button
              class="modal-show-example"
              @click="
                () => {
                  exampleModalState = 'swap2';
                }
              "
            >
              Show example
            </button>
          </div>
        </slide>
      </carousel>
    </div>
    <GifModal
      @closeModal="closeModal"
      :modalState="exampleModalState"
    ></GifModal>
    <footer class="footer" id="footer">
      <a class="grad-link" href="https://daybringer.github.io/"
        >Michal Vaňata</a
      >
      <p class="footer-text">©2020</p>
    </footer>
  </div>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
import GifModal from "@/components/GifModal.vue";
export default {
  name: "Rules",
  components: {
    Carousel,
    Slide,
    GifModal,
  },
  methods: {
    closeModal() {
      this.exampleModalState = "none";
    },
    resizeSkew() {
      let mDiv = document.getElementById("rulesSkewedDiv");
      let navHeight = document.getElementById("smallNav").clientHeight;
      let rulesContainer = document.getElementById("rulesContainer");
      let footerHeight = document.getElementById("footer").clientHeight;

      let cornerHeight =
        (mDiv.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180);

      mDiv.style.top = cornerHeight + navHeight + "px";
      rulesContainer.style.bottom = footerHeight + "px";

      let viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      rulesContainer.style.height =
        viewHeight - mDiv.offsetHeight - footerHeight - navHeight + "px";
    },
  },
  props: ["logged"],
  data() {
    return {
      exampleModalState: "none",
    };
  },
  mounted() {
    this.resizeSkew();
    window.onresize = () => this.resizeSkew();

    let els3 = document.getElementsByClassName("VueCarousel-pagination");
    [].forEach.call(els3, function(el) {
      el.style.marginTop = "-15px";
    });
    let els2 = document.getElementsByClassName("VueCarousel-dot-container");
    [].forEach.call(els2, function(el) {
      el.style.marginTop = "0px";
    });
  },
};
</script>
<style scoped>
.rule-list {
  text-align: left;
  list-style-type: none;
}

.rule-point::before {
  content: "■";
  color: #00b3fe;
  float: left;
  width: 1em;
  margin: 0.4em -1.4em;
  font-size: 60%;
}

.rule-point {
  margin-bottom: 1rem;
  color: #363636;
  font-weight: 400;
  padding-left: 0.5rem;
  font-size: 1rem;
}
.modal-show-example {
  position: absolute;
  bottom: 0;
  transform: translate(-50%, 0);
  border: #363636 solid 2px;
  background-color: #00b3fe;
  color: white;
  padding: 0.25rem 1rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
.rule-heading {
  text-align: center;
  color: #363636;
  font-weight: 700;
  font-size: 1.5rem;
  margin-top: 0;
}
.rule-container {
  height: 50vh;
  text-align: center;
}
#rules-carousel {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100%;
}
#rulesContainer {
  position: absolute;
  background-color: white;
  width: 100%;
  z-index: 0;
  height: 100%;
}
#rulesSkewedDiv {
  background-color: #8f8f8f;
  width: 100%;
  height: 15vh;
  transform: skewY(-7.5deg);
  position: absolute;
  text-align: center;
  margin-top: -1px;
  z-index: 1;
}
.centered-div {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.headline {
  font-weight: 700;
  font-size: 3rem;
  color: #363636;
  user-select: none;
}

.grad-link {
  text-decoration: none;
  position: relative;
  display: inline;
  font-size: 1rem;
  font-weight: 700;
  color: #8f8f8f;
  font-family: "Roboto", sans-serif;
  overflow: hidden;
  background: linear-gradient(to right, #00b3fe, #00b3fe 50%, #8f8f8f 50%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;
  background-position: 100%;
  transition: background-position 275ms ease;
}
.grad-link:visited {
  color: black;
}
.grad-link:hover {
  background-position: 0 100%;
}
.footer {
  position: absolute;
  bottom: 0;
  margin-bottom: -1px;
  text-align: center;
  width: 100%;
  color: #8f8f8f;
  font-size: 1rem;
  font-weight: 700;
  background-color: #363636;
  padding: 0.5rem;
  font-family: "Roboto", sans-serif;
}
.footer-text {
  display: inline;
  position: relative;
  font-size: 1em;
  margin-left: 1rem;
  font-weight: 700;
  color: #8f8f8f;
}
</style>
