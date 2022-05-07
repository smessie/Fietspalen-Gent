<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>Fietsend Gent, een leugen of toch wel frequent?</h1>
        <h4>Freya Van Speybroeck, Thor Dossche & Ieben Smessaert</h4>
      </el-header>
      <el-main v-if="!bicycleDataLoaded || !weatherDataLoaded">
        <span class="loader"></span>
        <p>De data wordt momenteel ingeladen...</p>
      </el-main>
      <el-main v-else>
        <el-tabs v-model="activeName" class="demo-tabs">
          <h2 v-if="activeName !== 'third'">Map</h2>
          <Map v-if="activeName !== 'third'" :selectedStation="selectedStation" @change-selected="changeSelected"/>
          <el-tab-pane label="Fietspalen" name="first">
            <h2>Heatmap visualisatie van aantal fietsers voor bepaald station</h2>
            <Heatmaps :selectedStation="selectedStation" :datasets="datasets" id="heatmaps" :offset-x="offsetX"
                      :offset-y="offsetY"/>
            <h2>Visualisatie van gemiddeld aantal fietsers per dag</h2>
            <BarchartsContainer :selectedStation="selectedStation" :datasets="datasets"/>
            <h2>Visualisatie fietsers door de jaren heen</h2>
            <yearly-line-graph :selectedStation="selectedStation" :datasets="datasets"/>
            <h2>Dag visualisatie van aantal fietsers voor bepaald station</h2>
            <DailyLineGraph :selectedStation="selectedStation" :datasets="datasets"/>
          </el-tab-pane>
          <el-tab-pane label="Weer" name="second">
            <h2>Visualisatie van verband tussen neerslag en aantal fieters per maand</h2>
            <BarLineGraph :selectedStation="selectedStation" :datasets="datasets"/>
          </el-tab-pane>
          <el-tab-pane label="Uitgelicht" name="third">
            <h2>piechart</h2>
            <YearData :datasets="datasets"/>

          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Heatmaps from './components/Heatmaps.vue';
import DailyLineGraph from './components/DailyLineGraph.vue'
import BarchartsContainer from './components/BarchartsContainer.vue'
import Map from './components/Map.vue'
import YearData from './components/YearData.vue'
import YearlyLineGraph from './components/YearlyLineGraph.vue'
import {getDatasets, load as loadBicyclingData} from '/src/js/bicycling-data.js';
import {ref} from 'vue'
import {load as loadWeatherData} from '/src/js/weather-data.js';
import BarLineGraph from './components/BarLineGraph.vue';

export default {
  components: {
    BarLineGraph,
    Heatmaps,
    DailyLineGraph,
    Map,
    BarchartsContainer,
    YearData,
    YearlyLineGraph,
  },
  data() {
    return {
      selectedStation: null,
      datasets: getDatasets(),
      activeName: ref('first'),
      bicycleDataLoaded: false,
      weatherDataLoaded: false,
      offsetX: 0,
      offsetY: 0
    }
  },
  methods: {
    changeSelected(newStation) {
      this.selectedStation = newStation;
    },
    configureHeatmapsOffset() {
      this.$nextTick(() => {
        const rect = document.getElementById('heatmaps').getBoundingClientRect();
        this.offsetX = rect.x;
        this.offsetY = rect.y;
      });
    }
  },
  mounted() {
    loadWeatherData().then(() => {
      this.weatherDataLoaded = true;
      if (this.bicycleDataLoaded) {
        this.configureHeatmapsOffset();
      }
    });
    loadBicyclingData().then(() => {
      this.bicycleDataLoaded = true;
      if (this.weatherDataLoaded) {
        this.configureHeatmapsOffset();
      }
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.el-main {
  margin-top: 5em;
}

h2 {
  padding-top: 32px;
}

/* BICYCLING LOADING ANIMATION, src: https://cssloaders.github.io */
.loader {
  width: 106px;
  height: 86px;
  display: block;
  margin: 30px auto;
  background-image: linear-gradient(#e15b64 50px, transparent 0), linear-gradient(#f8b26a 50px, transparent 0), linear-gradient(#f47e60 50px, transparent 0), linear-gradient(#f47e60 50px, transparent 0), radial-gradient(circle 14px, #f8b26a 100%, transparent 0);
  background-size: 48px 15px, 15px 35px, 15px 35px, 25px 15px, 28px 28px;
  background-position: 25px 5px, 58px 20px, 25px 17px, 2px 37px, 76px 0px;
  background-repeat: no-repeat;
  position: relative;
  transform: rotate(-45deg);
  box-sizing: border-box;
}

.loader::after,
.loader::before {
  content: '';
  position: absolute;
  width: 56px;
  height: 56px;
  border: 6px solid #abbd81;
  border-radius: 50%;
  left: -45px;
  top: -10px;
  background-repeat: no-repeat;
  background-image: linear-gradient(#f8b26a 64px, transparent 0), linear-gradient(#f47e60 66px, transparent 0), radial-gradient(circle 4px, #abbd81 100%, transparent 0);
  background-size: 40px 1px, 1px 40px, 8px 8px;
  background-position: center center;
  box-sizing: border-box;
  animation: rotation 0.3s linear infinite;
}

.loader::before {
  left: 25px;
  top: 60px;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
