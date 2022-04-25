<template>
<div>
	<div v-if="selectedDatasets">
		<MultipleLineGraph :data="dailyData"/>
	</div>
</div>
</template>

<script>
import { getDataset, getDataForDate, calculateDailyAverages } from '../js/bicycling-data';
import LineGraph from './LineGraph.vue' 
import VegaLineGraph from './VegaLineGraph.vue' 
import MultipleLineGraph from './MultipleLineGraph.vue' 
    
export default {
  name: 'BarchartsContainer',
  components: { LineGraph, MultipleLineGraph, VegaLineGraph },
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
