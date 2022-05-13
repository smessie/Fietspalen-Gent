<template>
  <div>
    <div v-if="selectedDatasets">
      <div id="year-compare-vis"></div>
    </div>
  </div>
</template>

<script>
import vegaEmbed from 'vega-embed'
import { getDataset, groupPerWeek } from '../js/bicycling-data';

export default {
  name: 'YearlyLineGraph',
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
    selectedStation: function (newStation) {
      if (newStation) {
        this.selectedDatasets = this.getDatasetsFor(newStation);
        this.setLineGraph();
      } else {
        this.selectedDatasets = [];
      }
    },
  },
  methods: {
    getDatasetsFor(station) {
      return this.$props.datasets.filter((dataset) => dataset.station.naam === station.naam).map(d => d.name);
    },
    setLineGraph() {
      if (!this.selectedDatasets) return;

      const weeklyData = this.selectedDatasets.map(dataset => groupPerWeek(getDataset(dataset))).flat().filter(week => week.totaal > 0);

      const chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: weeklyData},
        mark: {type: 'line', interpolate: 'natural'},
        encoding: {
          x: {field: 'week', type: 'nominal', title: 'Week nummer'},
          y: {field: 'totaal', type: 'quantitative', title: 'Totaal aantal fietsers'},
          color: {field: 'year', type: 'ordinal'}
        }
      };

      vegaEmbed('#year-compare-vis', chart);
    },
  },
  mounted() {
    this.setLineGraph();
  }
}
</script>

<style scoped>

</style>

