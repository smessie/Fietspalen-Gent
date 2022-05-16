<template>
  <div>
    <h2>Visualisatie van verband tussen temperatuur en gemiddeld aantal fietsers</h2>
    <div id="temperature-influence-vis"></div>
    <div id="temperature-scatter"></div>
    <h2>Visualisatie van verband tussen hoeveelheid regen en gemiddeld aantal fietsers</h2>
    <div id="rain-influence-vis"></div>
    <div id="rain-scatter"></div>
    <h2>Visualisatie van verband tussen hoeveelheid wind en gemiddeld aantal fietsers</h2>
    <div id="wind-influence-vis"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import vegaEmbed from 'vega-embed'
import { getAllDatasets, groupDatasetsByDay, bucketObject, getDatasets, groupDatasetsByStation, getDataset } from '../js/bicycling-data';
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
    cleanUpTotals(totals) {
      Object.keys(totals).forEach(key => {
        const totalsListFiltered = totals[key].filter(amount => amount > 0)
        if (!totalsListFiltered.length) {
          delete totals[key]
        } else {
          totals[key] = totalsListFiltered
        }
      })
      return totals
    },
    async setLineGraph() {
      const bikesByDay = groupDatasetsByDay(getAllDatasets())
      const weatherByDay = groupWeatherByDay(getWeatherData())
      const dayToData = d3.group(weatherByDay, (day) => day.date);

      // ====================================================================================================

      const stationDatasets = groupDatasetsByStation(getDatasets())
      const bikesByDayByDataset = {}

      Array.from(stationDatasets).forEach(([station, datasets]) => {
        bikesByDayByDataset[station] = groupDatasetsByDay(datasets.map(dataset => getDataset(dataset.name)))
      })

      const temperatureTotalsByDataset = {}
      Object.entries(bikesByDayByDataset).forEach(([stationName, bikes]) => {
        temperatureTotalsByDataset[stationName] = this.cleanUpTotals(this.makeTotalsListFor(bikes, dayToData, "maxTemp"))
      })

      const temperatureScatterData = Object.entries(temperatureTotalsByDataset).map(([stationName, data]) => {
        return Object.entries(data).map(([temperature, totals]) => {
          return {
            temperature: parseInt(temperature),
            average: totals.reduce((a, b) => a + b) / totals.length,
            station: stationName,
          }
        });
      }).flat()

      const testchart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: temperatureScatterData},
        width: 700,
        mark: 'point',
        encoding: {
          x: {field: 'temperature', type: 'quantitative', title: 'temperatuur in °C' },
          y: {field: 'average', type: 'quantitative', title: 'aantal fietsers'},
          color: {field: 'station', type: 'nominal'}
        }
      };

      vegaEmbed('#temperature-scatter', testchart);

      // ====================================================================================================

      const temperatureToTotals = this.cleanUpTotals(this.makeTotalsListFor(bikesByDay, dayToData, "maxTemp"))

      const temperatureAverageTotal = Object.entries(temperatureToTotals).map(([temperature, totals]) => {
        return {
          temperature: parseInt(temperature),
          average: totals.reduce((a, b) => a + b) / totals.length
        }
      });

      const chart_temp = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: temperatureAverageTotal},
        mark: {type: 'line', point: true},
        encoding: {
          x: {field: 'temperature', type: 'nominal', title: 'temperatuur in °C'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers'},
        }
      };

      vegaEmbed('#temperature-influence-vis', chart_temp);

      // ====================================================================================================

      const rainToTotals = this.cleanUpTotals(bucketObject(this.cleanUpTotals(this.makeTotalsListFor(bikesByDay, dayToData, "rainVolume")), 30))

      const rainAverageTotal = Object.entries(rainToTotals).map(([rainVolume, totals]) => {
        return {
          rainVolume: parseInt(rainVolume),
          average: totals.reduce((a, b) => a + b) / totals.length
        }
      });

      const chart_rain = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: rainAverageTotal},
        mark: {type: 'line', point: true},
        encoding: {
          x: {field: 'rainVolume', type: 'nominal', title: 'neerslag in l/m^2'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers'},
        }
      };

      vegaEmbed('#rain-influence-vis', chart_rain);

      // ====================================================================================================

      const windToTotals = this.cleanUpTotals(bucketObject(this.cleanUpTotals(this.makeTotalsListFor(bikesByDay, dayToData, "averageWindSpeed")), 30))

      const windAverageTotal = Object.entries(windToTotals).map(([averageWindSpeed, totals]) => {
        return {
          averageWindSpeed: parseFloat(averageWindSpeed),
          average: totals.reduce((a, b) => a + b) / totals.length
        }
      });

      const chart_wind = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: windAverageTotal},
        mark: {type: 'line', point: true},
        encoding: {
          x: {field: 'averageWindSpeed', type: 'nominal', title: 'windsnelheid in km/u'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers'},
        }
      };

      vegaEmbed('#wind-influence-vis', chart_wind);

      // ====================================================================================================
    },
  },
  mounted() {
    this.setLineGraph();
  }
}
</script>

<style scoped>

</style>

