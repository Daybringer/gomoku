<template>
  <div>
    <div id="dashSkewedDiv">
      <div class="centered-div">
        <span class="headline">Dashboard</span>
      </div>
    </div>
    <div id="dashboardContentBox">
      <div class="dashBox">
        <span>Elo:</span>
        <span>{{ currElo }}</span>
      </div>
      <div id="eloGraph">
        <LineChart :chartdata="chartData" :options="chartOptions"></LineChart>
      </div>
      <div class="dashBox">
        <label>New Password:</label>
        <input />
      </div>
      <div class="dashBox">
        <label>Confirm Password:</label>
        <input />
      </div>
      <button>Reset</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import LineChart from "@/components/LineChart.vue";
export default {
  name: "Dashboard",
  components: { LineChart },
  mounted() {
    this.resizeSkew();
    window.onresize = () => this.resizeSkew();
    this.fetchDashData();
  },
  methods: {
    resizeSkew() {
      let mDiv = document.getElementById("dashSkewedDiv");
      let dashContent = document.getElementById("dashboardContentBox");
      let navHeight = document.getElementById("smallNav").clientHeight;
      mDiv.style.top =
        (mDiv.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180) +
        navHeight +
        "px";
      dashContent.style.top =
        navHeight +
        mDiv.offsetHeight +
        mDiv.offsetWidth * Math.tan((7.5 * Math.PI) / 180) +
        "px";
    },
    fetchDashData() {
      axios
        .post("/api/dash")
        .then((response) => {
          this.currElo = response.data.currElo;
        })
        .catch(() => {});
    },
  },
  data() {
    return {
      currElo: "1200",
      chartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "ELO History",
            borderColor: "#00b3fe",
            fill: "false",
            tension: 0,
            data: [40, 20, 30, 39, 50, 40, 39, 80, 40, 20, 112, 111],
          },
        ],
      },
      chartOptions: {},
    };
  },
};
</script>
<style scoped>
.dashBox {
  display: flex;
  flex-flow: row;
  justify-content: center;
}
#dashSkewedDiv {
  background-color: #8f8f8f;
  width: 100%;
  height: 15vh;
  transform: skewY(-7.5deg);
  position: absolute;
  text-align: center;
  margin-top: -1px;
  z-index: 1;
}
#dashboardContentBox {
  position: absolute;
  text-align: center;
  margin-top: -1px;
  z-index: 1;
  width: 100%;
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
</style>
