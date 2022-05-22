<template>
  <div>
    <h3>Hoe warm is te warm?</h3>
    <p>Hier bekijken we de invloed van de temperatuur.
      Er is duidelijk een stijging van het dagelijks aantal fietsers te zien bij warmere temperaturen. Merk op dat vanaf 31°C, het toch wat te
      heet wordt voor de Gentenaars. Ook bij heel koude temperaturen wordt er minder voor de fiets gekozen.
    </p>
    <div id="temperature-influence-vis"/>
    <p>Hieronder wordt meer in detail getoond wat de invloed is van het weer per fietstelpaal. Aangezien niet alle fietstelpalen beschikbaar waren
      op dezelfde momenten, zijn er soms geen metingen gebeurd. Toch kunnen we dezelfde conclusie trekken voor de meeste locaties. Bij heel lage of heel hoge metingen,
      zijn er minder fietsers. Het is valt ook op dat voor sommige locaties, het weer minder invloed heeft.
    </p>
    <div id="temperature-scatter"/>
    <br>
    <h3>Een beetje tegenwind moet wel kunnen...</h3>
    <p>Of toch niet? Het lijkt erop dat niet enkel de temperatuur, maar ook de wind een impact heeft op wie er die dag de fiets bovenhaalt.
    </p>
    <div id="wind-influence-vis"></div>
    <p>Als we hier ook meer in detail gaan, zien we opnieuw dat voor sommige fietstelpalen er niet zo veel invloed is. Neem bv. eens een kijkje
      naar Bataviabrug.
      De invloed over de andere fietstelpalen is ook niet heel sterk, maar op een heel winderige dag (zie bv. 63km/u) is het toch wel opmerkzaam dat het fietsen zo goed als stil ligt.
    </p>
    <div id="wind-scatter"/>
    <br>
    <h3>Hoe zit het met de regen?</h3>
    <p>In onderstaande grafiek is er een lichte dalende trend te zien in het aantal fietsers tegenover de regen, maar dit is niet zo duidelijk door een paar uitschieters.</p>
    <div id="rain-influence-vis"/>
    <p>Hieronder zien we wel een verschil tussen de uitsterte punten. Het aantal fietsers op een helemaal droge dag (0 liter neerslag),
      of op een heel natte dag (19 liter neerslag) is opvallend. De punten hiertussen, lijken in het algemeen wel te dalen, maar het is interessant om te zien
      dat het ook heel hard kan schommelen, en misschien zelfs wat op toeval kan aankomen.
    </p>
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
            average: Math.ceil(totals.reduce((a, b) => a + b) / totals.length),
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
          x: {field: 'temperature', type: 'quantitative', title: 'maximum temperatuur in °C' },
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
          color: {field: 'station', type: 'nominal'},
          tooltip: [
            {field: 'temperature', title: 'Temperatuur'},
            {field: 'average', title: 'Gemiddelde'}],
        }
      };

      vegaEmbed('#temperature-scatter', tempscatter);

      // ====================================================================================================

      const temperatureToTotals = this.cleanUpTotals(this.makeTotalsListFor(bikesByDay, dayToData, "maxTemp"))

      const temperatureAverageTotal = Object.entries(temperatureToTotals).map(([temperature, totals]) => {
        return {
          temperature: parseInt(temperature),
          average: Math.ceil(totals.reduce((a, b) => a + b) / totals.lengt),
        }
      });

      const chart_temp = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: temperatureAverageTotal},
        width: 700,
        mark: {type: 'line', point: true},
        encoding: {
          x: {field: 'temperature', type: 'quantitative', title: 'maximum temperatuur in °C'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
        tooltip: [
          {field: 'temperature', title: 'Temperatuur'},
          {field: 'average', title: 'Gemiddelde'}],
        },
      };

      vegaEmbed('#temperature-influence-vis', chart_temp);

      // ====================================================================================================

      const rainToTotals = this.cleanUpTotals(bucketObject(this.cleanUpTotals(this.makeTotalsListFor(bikesByDay, dayToData, "rainVolume")), 30))

      const rainAverageTotal = Object.entries(rainToTotals).map(([rainVolume, totals]) => {
        return {
          rainVolume: parseInt(rainVolume),
          average: Math.ceil(totals.reduce((a, b) => a + b) / totals.length)
        }
      });

      const chart_rain = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: rainAverageTotal},
        width: 700,
        mark: {type: 'line', point: true},
        encoding: {
          x: {field: 'rainVolume', type: 'quantitative', title: 'totale dagneerslag in l/m²'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
        tooltip: [
          {field: 'rainVolume', title: 'Regen'},
          {field: 'average', title: 'Gemiddelde'}],
        },
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
            average: Math.ceil(totals.reduce((a, b) => a + b) / totals.length),
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
          x: {field: 'rainVolume', type: 'quantitative', title: 'totale dagneerslag in l/m²' },
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
          color: {field: 'station', type: 'nominal'},
          tooltip: [
          {field: 'rainVolume', title: 'Regen'},
          {field: 'average', title: 'Gemiddelde'}],
        },
      };

      vegaEmbed('#rain-scatter', rainscater);

      // ====================================================================================================

      const windToTotals = this.cleanUpTotals(bucketObject(this.cleanUpTotals(this.makeTotalsListFor(bikesByDay, dayToData, "averageWindSpeed")), 30))

      const windAverageTotal = Object.entries(windToTotals).map(([averageWindSpeed, totals]) => {
        return {
          averageWindSpeed: parseFloat(averageWindSpeed),
          average: Math.ceil(totals.reduce((a, b) => a + b) / totals.length)
        }
      });

      const chart_wind = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: windAverageTotal},
        width: 700,
        mark: {type: 'line', point: true},
        encoding: {
          x: {field: 'averageWindSpeed', type: 'quantitative', title: 'gemiddelde windsnelheid in km/u'},
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
          tooltip: [
          {field: 'avrageWindSpeed', title: 'Wind'},
          {field: 'average', title: 'Gemiddelde'}],
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
            average: Math.ceil(totals.reduce((a, b) => a + b) / totals.length),
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
          x: {field: 'averageWindSpeed', type: 'quantitative', title: 'gemiddelde windsnelheid in km/u' },
          y: {field: 'average', type: 'quantitative', title: 'gemiddeld aantal fietsers per dag'},
          color: {field: 'station', type: 'nominal'},
          tooltip: [
          {field: 'averageWindSpeed', title: 'Wind'},
          {field: 'average', title: 'Gemiddelde'}],
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

