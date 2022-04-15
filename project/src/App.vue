<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HeatmapsComponent from './components/HeatmapsComponent.vue';</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>Fietsend Gent, een leugen of toch wel frequent?</h1>
        <h4>Freya Van Speybroeck, Thor Dossche & Ieben Smessaert</h4>
      </el-header>
      <el-main>
        <h2>Heatmap visualisatie van aantal fietsers voor bepaald station</h2>
        <HeatmapsComponent :stations="stations" :datasets="getAllDatasets()"></HeatmapsComponent>
      </el-main>
      <el-main>
        <h2>Dag visualisatie van aantal fietsers voor bepaald station</h2>
        <HeatmapsComponent :stations="stations" :datasets="getAllDatasets()"></HeatmapsComponent>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {getAllDataFromStation} from '/src/js/bicycling-data.js';

export default {
  data() {
    return {
      stations: {
        'coupure-links-2021': {
          value: 'coupure-links-2021',
          name: 'Coupure Links',
          year: '2021',
        },
        'bijlokekaai-2021': {
          value: 'bijlokekaai-2021',
          name: 'Bijlokekaai',
          year: '2021',
        },
        'gaardeniersbrug-2021': {
          value: 'gaardeniersbrug-2021',
          name: 'Gaardeniersbrug',
          year: '2021',
        },
        'gaardeniersbrug-2020': {
          value: 'gaardeniersbrug-2020',
          name: 'Gaardeniersbrug',
          year: '2020',
        },
        'bataviabrug-2021': {
          value: 'bataviabrug-2021',
          name: 'Bataviabrug',
          year: '2021',
        },
        'bataviabrug-2020': {
          value: 'bataviabrug-2020',
          name: 'Bataviabrug',
          year: '2020',
        },
        'bataviabrug-2019': {
          value: 'bataviabrug-2019',
          name: 'Bataviabrug',
          year: '2019',
        },
        'bataviabrug-2018': {
          value: 'bataviabrug-2018',
          name: 'Bataviabrug',
          year: '2018',
        },
        'groendreef-2021': {
          value: 'groendreef-2021',
          name: 'Groendreef',
          year: '2021',
        },
        'groendreef-2020': {
          value: 'groendreef-2020',
          name: 'Groendreef',
          year: '2020',
        },
        'groendreef-2019': {
          value: 'groendreef-2019',
          name: 'Groendreef',
          year: '2019',
        },
        'groendreef-2018': {
          value: 'groendreef-2018',
          name: 'Groendreef',
          year: '2018',
        },
        'dampoort-zuid-2021': {
          value: 'dampoort-zuid-2021',
          name: 'Dampoort Zuid',
          year: '2021',
        },
        'dampoort-zuid-2020': {
          value: 'dampoort-zuid-2020',
          name: 'Dampoort Zuid',
          year: '2020',
        },
        'dampoort-zuid-2019': {
          value: 'dampoort-zuid-2019',
          name: 'Dampoort Zuid',
          year: '2019',
        },
        'dampoort-zuid-2018': {
          value: 'dampoort-zuid-2018',
          name: 'Dampoort Zuid',
          year: '2018',
        },
        'zuidparklaan-2021': {
          value: 'zuidparklaan-2021',
          name: 'Zuidparklaan',
          year: '2021',
        },
        'zuidparklaan-2020': {
          value: 'zuidparklaan-2020',
          name: 'Zuidparklaan',
          year: '2020',
        },
        'zuidparklaan-2019': {
          value: 'zuidparklaan-2019',
          name: 'Zuidparklaan',
          year: '2019',
        },
        'zuidparklaan-2018': {
          value: 'zuidparklaan-2018',
          name: 'Zuidparklaan',
          year: '2018',
        }
      }
    }
  },
  methods: {
    getAllDatasets() {
      const datasets = {};
      for (const station of Object.keys(this.stations)) {
        getAllDataFromStation(station).then(result => {
          datasets[station] = result;
        });
      }
      return datasets;
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
