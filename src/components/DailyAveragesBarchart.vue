<template>
	<div id="bar"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'

export default {
  name: 'DailyAveragesBarchart',
  props: [
    'selectedStation',
    'datasets',
  ], 
  watch: {
    selectedStation: function(newStation) {
      if (newStation) {
		  // todo: dit errort voor een reden
        this.selectedDatasets = this.getDatasetsFor(newStation);
		console.log(this.selectedDatasets);
      } else {
        this.selectedDatasets = null 
      }
      this.setLineGraph()
    }
  },
  methods: {
    getDatasetsFor(station) {
      return this.$props.datasets.filter((dataset) => dataset.station.naam == station.naam).map(d => d.name)
    },
	setLineGraph(){
		// todo: zet selectedDatasets om met getDataset naar een lijst van de data (nu is het een lijst van dataset namen)
		// geef dan door aan calculateDailyAverages in bycicling-data
      if (!this.$props.data) return
      let data = this.$props.data.map((elem) => {
        elem.time = new Date(elem.datum + ' ' + elem.uur5minuten)
        return elem
      })

			let chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: { values: data },
        layer: [
          {
            mark: { type: 'bar', interpolate: 'natural'},
            encoding: {
              x: {field: 'time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'uur'},
              y: {field: 'hoofdrichting', type: 'quantitative', title: 'aantal'},
              color: {datum: 'hoofdrichting'}
            }
          },
        ],datasets
      };
      vegaEmbed('#bar', chart);
    },
  },
  mounted() {
    this.setLineGraph()
  } 
}
</script>

<style scoped>

</style>
