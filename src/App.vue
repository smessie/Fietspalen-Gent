<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>Fietsend Gent, een leugen of toch wel frequent?</h1>
        <h4>Freya Van Speybroeck, Thor Dossche & Ieben Smessaert</h4>
      </el-header>
      <el-main>
        <h2>Map</h2>
        <Map :selectedStation="selectedStation" @change-selected="changeSelected"/>
      </el-main>
      <el-main>
        <h2>Heatmap visualisatie van aantal fietsers voor bepaald station</h2>
        <Heatmaps :selectedStation="selectedStation"></Heatmaps>
      </el-main>
      <el-main>
        <h2>Dag visualisatie van aantal fietsers voor bepaald station</h2>
        <!-- <DailyLineGraph :stations="stations" :datasets="getAllDatasets()"></DailyLineGraph> -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Heatmaps from './components/Heatmaps.vue';
import DailyLineGraph from './components/DailyLineGraph.vue'
import Map from './components/Map.vue'
import {data} from '/src/js/bicycling-data.js';

export default {
  components: {
    Heatmaps,
    DailyLineGraph,
    Map,
  },
  data() {
    return {
      selectedStation: null,
    }
  },
  methods: {
    changeSelected(newStation) {
      this.selectedStation = newStation 
    }
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
</style>
