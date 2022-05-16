<template>
  <div>
    <h3>Hoe warm is te warm?</h3>
    <p>Hier bekijken we de invloed van de temperatuur.
      Er is duidelijk een stijging van het dagelijks aantal fietsers te zien bij warmere temperaturen. Merk op dat vanaf 30°C, het toch wat te 
      heet wordt voor de Gentenaars. Ook bij heel koude temperaturen wordt er minder voor de fiets gekozen.
    </p>
    <div id="temperature-influence-vis"/>
    <div id="temperature-scatter"/>
    <br>
    <h3>Een beetje tegenwind moet wel kunnen...</h3>
    <p>Of toch niet? Het lijkt erop dat niet enkel de temperatuur, maar ook de wind een impact heeft op wie er die dag de fiets bovenhaalt.
    </p>
    <div id="wind-influence-vis"></div>
    <div id="wind-scatter"/>
    <br>
    <h3>Hoe zit het met de regen?</h3>
    <p>(todo) Hier moet nog een betere grafiek/methode gevonden worden voor een verklaring.</p>
    <div id="rain-influence-vis"/>
    <div id="rain-scatter"/>
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
      // for lines
      const bikesByDay = groupDatasetsByDay(getAllDatasets())
      const weatherByDay = groupWeatherByDay(getWeatherData())
      const dayToData = d3.group(weatherByDay, (day) => day.date);

      // for scatters
      const stationDatasets = groupDatasetsByStation(getDatasets())
      const bikesByDayByDataset = {}
      Array.from(stationDatasets).forEach(([station, datasets]) => {
        bikesByDayByDataset[station] = groupDatasetsByDay(datasets.map(dataset => getDataset(dataset.name)))
      })

      // ====================================================================================================

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

      const tempscatter = {
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

      vegaEmbed('#temperature-scatter', tempscatter);

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
          x: {field: 'temperature', type: 'nominal', title: 'maximum temperatuur in °C'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
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
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
        }
      };

      vegaEmbed('#rain-influence-vis', chart_rain);

      // ====================================================================================================

      const rainTotalsByDataset = {}
      Object.entries(bikesByDayByDataset).forEach(([stationName, bikes]) => {
        rainTotalsByDataset[stationName] = this.cleanUpTotals(bucketObject(this.cleanUpTotals(this.makeTotalsListFor(bikes, dayToData, "rainVolume")), 30))
      })

      const rainScatterData = Object.entries(rainTotalsByDataset).map(([stationName, data]) => {
        return Object.entries(data).map(([rainVolume, totals]) => {
          return {
            rainVolume: parseInt(rainVolume),
            average: totals.reduce((a, b) => a + b) / totals.length,
            station: stationName,
          }
        });
      }).flat()

      const rainscater = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: rainScatterData},
        width: 700,
        mark: 'point',
        encoding: {
          x: {field: 'rainVolume', type: 'quantitative', title: 'neerslag in l/m^2' },
          y: {field: 'average', type: 'quantitative', title: 'aantal fietsers'},
          color: {field: 'station', type: 'nominal'}
        }
      };

      vegaEmbed('#rain-scatter', rainscater);

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
          x: {field: 'averageWindSpeed', type: 'nominal', title: 'gemiddelde windsnelheid in km/u'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
        }
      };

      vegaEmbed('#wind-influence-vis', chart_wind);

      // ====================================================================================================

      const windTotalsByDataset = {}
      Object.entries(bikesByDayByDataset).forEach(([stationName, bikes]) => {
        windTotalsByDataset[stationName] = this.cleanUpTotals(bucketObject(this.cleanUpTotals(this.makeTotalsListFor(bikes, dayToData, "averageWindSpeed")), 30))
      })

      const windScatterData = Object.entries(windTotalsByDataset).map(([stationName, data]) => {
        return Object.entries(data).map(([averageWindSpeed, totals]) => {
          return {
            averageWindSpeed: parseInt(averageWindSpeed),
            average: totals.reduce((a, b) => a + b) / totals.length,
            station: stationName,
          }
        });
      }).flat()

      const windscater = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: windScatterData},
        width: 700,
        mark: 'point',
        encoding: {
          x: {field: 'averageWindSpeed', type: 'quantitative', title: 'neerslag in l/m^2' },
          y: {field: 'average', type: 'quantitative', title: 'aantal fietsers'},
          color: {field: 'station', type: 'nominal'}
        }
      };

      vegaEmbed('#wind-scatter', windscater);

    },
  },
  mounted() {
    this.setLineGraph();
  }
}
</script>

<style scoped>

</style>

