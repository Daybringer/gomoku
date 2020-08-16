<template>
  <div>
    <full-page :options="options" id="fullpage" ref="fullpage">
      <div class="section" id="home-section">
        <Index :logged="logged"></Index>
      </div>
      <div class="section" style="background-color:#363636;">
        <Matches :logged="logged"></Matches>
      </div>
      <div class="section" style="background-color:#363636;">
        <Rules :logged="logged"></Rules>
      </div>
    </full-page>
  </div>
</template>
<script>
import Index from "@/components/Index.vue";
import Matches from "@/components/Matches.vue";
import Rules from "@/components/Rules.vue";

export default {
  name: "App",
  props: ["logged"],
  components: {
    Index,
    Matches,
    Rules,
  },
  mounted() {},
  data() {
    return {
      props: {
        logged: this.logged,
      },
      options: {
        //Navigation
        menu: "#menu",
        lockAnchors: false,
        anchors: ["home", "matches", "rules", "contact"],
        navigation: false,
        navigationPosition: "right",
        navigationTooltips: ["Home", "Matches", "Rules", "Contact"],
        showActiveTooltip: false,
        slidesNavigation: false,
        slidesNavPosition: "bottom",

        //Scrolling
        css3: true,
        scrollingSpeed: 700,
        autoScrolling: true,
        fitToSection: true,
        fitToSectionDelay: 1000,
        scrollBar: false,
        easing: "easeInOutCubic",
        easingcss3: "ease",
        loopBottom: false,
        loopTop: false,
        loopHorizontal: true,
        continuousVertical: false,
        continuousHorizontal: false,
        scrollHorizontally: false,
        interlockedSlides: false,
        dragAndMove: false,
        offsetSections: false,
        resetSliders: false,
        fadingEffect: false,
        normalScrollElements: "#element1, .element2",
        scrollOverflow: false,
        scrollOverflowReset: false,
        scrollOverflowOptions: null,
        touchSensitivity: 15,
        bigSectionsDestination: null,

        //Accessibility
        keyboardScrolling: true,
        animateAnchor: true,
        recordHistory: true,

        //Design
        controlArrows: true,
        verticalCentered: true,
        sectionsColor: [],
        paddingTop: "3em",
        paddingBottom: "10px",
        fixedElements: ".navbar",
        responsiveWidth: 0,
        responsiveHeight: 0,
        responsiveSlides: false,
        parallax: false,
        parallaxOptions: {
          type: "reveal",
          percentage: 62,
          property: "translate",
        },
        cards: false,
        cardsOptions: {
          perspective: 100,
          fadeContent: true,
          fadeBackground: true,
        },

        //Custom selectors
        sectionSelector: ".section",
        slideSelector: ".slide",

        lazyLoading: true,
      },
    };
  },
};
</script>
<style scoped></style>
