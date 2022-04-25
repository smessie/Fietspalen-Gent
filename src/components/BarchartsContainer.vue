<template>
<div>
	<div v-if="selectedDatasets">
		<BarChart :data="dailyData"/>
	</div>
</div>
</template>

<script>
import { getDataset, calculateDailyAverages } from '../js/bicycling-data';
import  BarChart from './BarChart.vue' 
    
export default {
  name: 'BarchartsContainer',
  components: { BarChart },
  props: [
		'selectedStation',
    'datasets'
  ], 
  data() {
   return {
      selectedDatasets: null,
      dailyData: null,
   };
 },
  watch: {
    selectedStation: function(newStation) {
      if (newStation) {
        this.selectedDatasets = this.getDatasetsFor(newStation);
        this.setDailyData()
      } else {
        this.selectedDatasets = []
        this.dailyData = null
      }
    },
  },
  methods: {
    getDatasetsFor(station) {
      return this.$props.datasets.filter((dataset) => dataset.station.naam == station.naam).map(d => d.name)
    },
    setDailyData() {
      this.dailyData = calculateDailyAverages(this.selectedDatasets.map(dataset => getDataset(dataset)));
    }
  },
}
</script>

<style scoped>

</style>
