<template>
  <div>
    <div id="temperature-influence-vis"></div>
    <div id="rain-influence-vis"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import vegaEmbed from 'vega-embed'
import { getAllDatasets, groupDatasetsByDay } from '../js/bicycling-data';
import { getWeatherData, groupWeatherByDay } from '../js/weather-data';

export default {
  name: 'TemperatureInfluence',
  props: [
    'datasets'
  ],
  methods: {
    getDatasetsFor(station) {
      return this.$props.datasets.filter((dataset) => dataset.station.naam === station.naam).map(d => d.name);
    },
    makeTotalsListFor(bikesByDay, map, field) {
      const totals = {}
      bikesByDay.forEach(day => {
        if (!map.get(day.date)) return
        if (map.get(day.date)[0][field] in totals) {
          totals[map.get(day.date)[0][field]].push(day.totaal)
        } else {
          totals[map.get(day.date)[0][field]] = [day.totaal]
        }
      })
      return totals

    },
    setLineGraph() {
      const bikesByDay = groupDatasetsByDay(getAllDatasets())
      const weatherByDay = groupWeatherByDay(getWeatherData())
      const dayToData = d3.group(weatherByDay, (day) => day.date);

      const temperatureToTotals = this.makeTotalsListFor(bikesByDay, dayToData, "maxTemp")

      const temperatureAverageTotal = Object.entries(temperatureToTotals).map(([temperature, totalsList]) => {
        const totalsListFiltered = totalsList.filter(amount => amount > 0)
        return {
          temperature: parseInt(temperature),
          average: totalsListFiltered.reduce((a, b) => a + b) / totalsListFiltered.length
        }
      });

      const chart_temp = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: temperatureAverageTotal},
        mark: {type: 'line', point: true},
        encoding: {
          x: {field: 'temperature', type: 'nominal', title: 'temperatuur'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers'},
        }
      };

      vegaEmbed('#temperature-influence-vis', chart_temp);

      const rainToTotals = this.makeTotalsListFor(bikesByDay, dayToData, "rainVolume")

      const rainAverageTotal = Object.entries(rainToTotals).map(([rainVolume, totalsList]) => {
        const totalsListFiltered = totalsList.filter(amount => amount > 0)
        return {
          rainVolume: parseInt(rainVolume),
          average: totalsListFiltered.reduce((a, b) => a + b) / totalsListFiltered.length
        }
      });

      const chart_rain = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: rainAverageTotal},
        mark: {type: 'line', point: true},
        encoding: {
          x: {field: 'rainVolume', type: 'nominal', title: 'rainVolume'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers'},
        }
      };

      vegaEmbed('#rain-influence-vis', chart_rain);
    },
  },
  mounted() {
    this.setLineGraph();
  }
}
</script>

<style scoped>

</style>

