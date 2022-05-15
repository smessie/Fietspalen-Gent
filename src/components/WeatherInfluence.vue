<template>
  <div>
    <h3>Hoe warm is te warm?</h3>
    <p>Hier bekijken we de invloed van de temperatuur.
      Er is duidelijk een stijging van het dagelijks aantal fietsers te zien bij warmere temperaturen. Merk op dat vanaf 30°C, het toch wat te 
      heet wordt voor de Gentenaars. Ook bij heel koude temperaturen wordt er minder voor de fiets gekozen.
    </p>
    <div id="temperature-influence-vis"></div>
    <br>
    <h3>Een beetje tegenwind moet wel kunnen...</h3>
    <p>Of toch niet? Het lijkt erop dat niet enkel de temperatuur, maar ook de wind een impact heeft op wie er die dag de fiets bovenhaalt.
    </p>
    <div id="wind-influence-vis"></div>
    <br>
    <h3>Hoe zit het met de regen?</h3>
    <p>(todo) Hier moet nog een betere grafiek/methode gevonden worden voor een verklaring.</p>
    <div id="rain-influence-vis"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import vegaEmbed from 'vega-embed'
import { getAllDatasets, groupDatasetsByDay, bucketObject } from '../js/bicycling-data';
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
          x: {field: 'temperature', type: 'nominal', title: 'maximum temperatuur in °C'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
        }
      };

      vegaEmbed('#temperature-influence-vis', chart_temp);

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
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
        }
      };

      vegaEmbed('#rain-influence-vis', chart_rain);

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
          x: {field: 'averageWindSpeed', type: 'nominal', title: 'gemiddelde windsnelheid in km/u'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
        }
      };

      vegaEmbed('#wind-influence-vis', chart_wind);
    },
  },
  mounted() {
    this.setLineGraph();
  }
}
</script>

<style scoped>

</style>

