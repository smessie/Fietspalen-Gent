<template>
  <div>
    <div v-if="selectedDatasets">
      <BarChart :name="'rain'" :data="dailyRainData"/>
      <BarChart :name="'norain'" :data="dailyNoRainData"/>
    </div>
  </div>
</template>

<script>
import {getDataset, calculateDailyAveragesRain} from '../js/bicycling-data';
import BarChart from './BarChart.vue'

export default {
  name: 'BarchartsRain',
  components: {BarChart},
  props: [
    'selectedStation',
    'datasets'
  ],
  data() {
    return {
      selectedDatasets: null,
      dailyRainData: null,
      dailyNoRainData: null,
    };
  },
  watch: {
    selectedStation: function (newStation) {
      if (newStation) {
        this.selectedDatasets = this.getDatasetsFor(newStation);
        this.setDailyData();
      } else {
        this.selectedDatasets = [];
        this.dailyData = null;
      }
    },
  },
  methods: {
    getDatasetsFor(station) {
      return this.$props.datasets.filter((dataset) => dataset.station.naam === station.naam).map(d => d.name);
    },
    setDailyData() {
      let dataList = this.selectedDatasets.map(dataset => getDataset(dataset));
      let averages = calculateDailyAveragesRain(dataList);
      console.log(averages);
      this.dailyRainData = averages['rainyDays'];
      this.dailyNoRainData = averages['normalDays'];
    }
  },
}
</script>

<style scoped>

</style>
