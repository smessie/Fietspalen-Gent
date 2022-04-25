<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>Fietsend Gent, een leugen of toch wel frequent?</h1>
        <h4>Freya Van Speybroeck, Thor Dossche & Ieben Smessaert</h4>
      </el-header>
      <el-main>
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="Fietspalen" name="first">
            <h3>Map</h3>
            <Map :selectedStation="selectedStation" @change-selected="changeSelected"/>
            <h3>Heatmap visualisatie van aantal fietsers voor bepaald station</h3>
            <Heatmaps :selectedStation="selectedStation" :datasets="datasets"/>
            <h3>Visualisatie van gemiddeld aantal fietsers per dag</h3>
            <BarchartsContainer :selectedStation="selectedStation" :datasets="datasets"/>
            <h3>Dag visualisatie van aantal fietsers voor bepaald station</h3>
            <DailyLineGraph :selectedStation="selectedStation" :datasets="datasets"/>
          </el-tab-pane>
          <el-tab-pane label="Weer" name="second">

          </el-tab-pane>
          <el-tab-pane label="Uitgelicht" name="third">
            <h3>piechart</h3>
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
import { getDatasets } from '/src/js/bicycling-data.js';
import { ref } from 'vue'

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
      activeName: ref('first')
    }
  },
  methods: {
    changeSelected(newStation) {
      this.selectedStation = newStation
    },
    changeTab() {
      return
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

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
