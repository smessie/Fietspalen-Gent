<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>Fietsend Gent, een leugen of toch wel frequent?</h1>
        <h4>Freya Van Speybroeck, Thor Dossche & Ieben Smessaert</h4>
      </el-header>
      <el-main v-if="!loaded">
        <div class="loadingio-spinner-wedges-uak1yzl8zv"><div class="ldio-wtj2n53k5w">
            <div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
        </div></div>
        <p>De data wordt momenteel ingeladen...</p>
      </el-main>
      <el-main v-if="loaded">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="Fietspalen" name="first">
            <h2>Map</h2>
            <Map :selectedStation="selectedStation" @change-selected="changeSelected"/>
            <h2>Heatmap visualisatie van aantal fietsers voor bepaald station</h2>
            <Heatmaps :selectedStation="selectedStation" :datasets="datasets" id="heatmaps" :offset-x="offsetX"
                      :offset-y="offsetY"/>
            <h2>Visualisatie van gemiddeld aantal fietsers per dag</h2>
            <BarchartsContainer :selectedStation="selectedStation" :datasets="datasets"/>
            <h2>Dag visualisatie van aantal fietsers voor bepaald station</h2>
            <DailyLineGraph :selectedStation="selectedStation" :datasets="datasets"/>
          </el-tab-pane>
          <el-tab-pane label="Weer" name="second">

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
import {getDatasets, load} from '/src/js/bicycling-data.js';
import {ref} from 'vue'

export default {
  components: {
    Heatmaps,
    DailyLineGraph,
    Map,
    BarchartsContainer,
    YearData,
  },
  data() {
    return {
      selectedStation: null,
      datasets: getDatasets(),
      activeName: ref('first'),
      loaded: false,
      offsetX: 0,
      offsetY: 0
    }
  },
  methods: {
    changeSelected(newStation) {
      this.selectedStation = newStation;
    }
  },
  mounted() {
    load().then(() => {
      this.loaded = true;
      this.$nextTick(() => {
        const rect = document.getElementById('heatmaps').getBoundingClientRect();
        this.offsetX = rect.x;
        this.offsetY = rect.y;
      });
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

/* LOADING ANIMATION */
@keyframes ldio-wtj2n53k5w {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
}

.ldio-wtj2n53k5w > div > div {
  transform-origin: 100px 100px;
  animation: ldio-wtj2n53k5w 3.0303030303030303s linear infinite;
  opacity: 0.8
}

.ldio-wtj2n53k5w > div > div > div {
  position: absolute;
  left: 30px;
  top: 30px;
  width: 70px;
  height: 70px;
  border-radius: 70px 0 0 0;
  transform-origin: 100px 100px
}

.ldio-wtj2n53k5w > div div:nth-child(1) {
  animation-duration: 0.7575757575757576s
}

.ldio-wtj2n53k5w > div div:nth-child(1) > div {
  background: #e15b64;
  transform: rotate(0deg);
}

.ldio-wtj2n53k5w > div div:nth-child(2) {
  animation-duration: 1.0101010101010102s
}

.ldio-wtj2n53k5w > div div:nth-child(2) > div {
  background: #f47e60;
  transform: rotate(0deg);
}

.ldio-wtj2n53k5w > div div:nth-child(3) {
  animation-duration: 1.5151515151515151s
}

.ldio-wtj2n53k5w > div div:nth-child(3) > div {
  background: #f8b26a;
  transform: rotate(0deg);
}

.ldio-wtj2n53k5w > div div:nth-child(4) {
  animation-duration: 3.0303030303030303s
}

.ldio-wtj2n53k5w > div div:nth-child(4) > div {
  background: #abbd81;
  transform: rotate(0deg);
}

.loadingio-spinner-wedges-uak1yzl8zv {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: #ffffff;
}

.ldio-wtj2n53k5w {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}

.ldio-wtj2n53k5w div {
  box-sizing: content-box;
}
</style>
