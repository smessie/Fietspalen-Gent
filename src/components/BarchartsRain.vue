<template>
  <div>
    <div>
      <BarChartHorizontal :name="'rain-averages'" :data="averages"/>
    </div>
  </div>
</template>

<script>
import {getDataset, calculateDailyAveragesRain, getAllDatasets} from '../js/bicycling-data';
import BarChartHorizontal from './BarChartHorizontal.vue'

export default {
  name: 'BarchartsRain',
  components: {BarChartHorizontal},
  props: [
    'datasets'
  ],
  data() {
    return {
      selectedDatasets: null,
      dailyRainData: null,
      dailyNoRainData: null,
      averages: null,
    };
  },
  mounted(){
    this.setData();
  },
  methods: {
    setData() {
      this.averages = calculateDailyAveragesRain(getAllDatasets());
    }
  },
}
</script>

<style scoped>

</style>
