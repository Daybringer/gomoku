<template>
  <div>
    <div id="dashSkewedDiv">
      <div class="centered-div">
        <span class="headline">Dashboard</span>
      </div>
    </div>
    <div id="dashboardContentBox">
      <div class="dashBox">
        <span>Current elo:</span>
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
import router from "../router";
import LineChart from "@/components/LineChart.vue";
export default {
  name: "Dashboard",
  components: { LineChart },
  mounted() {
    if (this.logged) {
      this.resizeSkew();
      window.onresize = () => this.resizeSkew();
      this.fetchDashData();
    } else {
      router.push("/login");
    }
  },
  props: ["logged", "username"],
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
      console.log("data fetched");
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
      currElo: "1000",
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
            label: "Month",
            borderColor: "#00b3fe",
            fill: "false",
            tension: 0,
            data: [40, 20, 30, 39, 50, 40, 39, 80, 40, 20, 112, 111],
          },
        ],
      },
      chartOptions: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        title: {
          display: true,
          text: "Elo history",
          padding: 5,
          fontSize: 20,
        },
      },
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
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) and (max-width: 1200px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  #dashSkewedDiv {
    transform: skewY(0deg) !important;
    top: 3rem !important;
  }
  #dashboardContentBox {
    top: calc(3rem + 15vh);
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>
