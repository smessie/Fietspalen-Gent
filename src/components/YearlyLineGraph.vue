<template>
<div>
	<div v-if="selectedDatasets">
    <div id="year-compare-vis"></div>
	</div>
</div>
</template>

<script>
import vegaEmbed from 'vega-embed'
import { getDataset, groupPerDay, groupPerWeek } from '../js/bicycling-data';
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
   };
 },
  watch: {
    selectedStation: function(newStation) {
      if (newStation) {
        this.selectedDatasets = this.getDatasetsFor(newStation);
        this.setLineGraph()
      } else {
        this.selectedDatasets = []
      }
    },
  },
  methods: {
    getDatasetsFor(station) {
      return this.$props.datasets.filter((dataset) => dataset.station.naam == station.naam).map(d => d.name)
    },
		setLineGraph(){
      if (!this.selectedDatasets) return
      this.selectedDatasets.map(dataset => groupPerWeek(getDataset(dataset)));

      let dailyData = this.selectedDatasets.map(dataset => {
        return groupPerDay(getDataset(dataset)).map(record => {
          record.year = record.date.getFullYear()
          return record
        })
      }).flat();

      let weeklyData = this.selectedDatasets.map(dataset => groupPerWeek(getDataset(dataset))).flat();

			let chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: { values: weeklyData },
        mark: { type: 'line'},
        encoding: {
          x: {field: 'week', type: 'nominal', title: 'week'},
          y: {field: 'totaal', type: 'quantitative', title: 'aantal'},
          color: {field: 'year', type: 'nominal'}
        }
      };

      vegaEmbed('#year-compare-vis', chart);
    },
  },
  mounted() {
    this.setLineGraph()
  } 
}
</script>

<style scoped>

</style>

