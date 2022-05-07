<template>
  <div>
    <div style="display:flex">
      <el-select v-model="selectedDataset" placeholder="Select">
        <el-option v-for="dataset in datasets.filter(x => x.name.slice(0, -1).endsWith('202'))"
                   :key="dataset.name"
                   :label="dataset.station.naam + ' ' + dataset.year"
                   :value="dataset.name"
        >
          <span style="float: left">{{ dataset.station.naam }}</span>
          <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">{{ dataset.year }}</span>
        </el-option>
      </el-select>
    </div>
    <div v-if="selectedDataset">
      <div id="bicyclers-weather-vis"></div>
    </div>
    <p>Nu wordt gewoon de neerslag gesommeerd voor alle dagen in de maand. Soms zie je op een minder regenachtige maand
      dat er meer fietsers zijn, maar niet altijd. Een andere mogelijkheid zou zijn om een threshold te vinden voor een
      regendag en dan het aantal regendagen per maand te tellen in de plaats, en deze dan in de bar te visualiseren. Dit
      zou een extra visualisatie kunnen zijn of ter vervanging van deze? Een andere visualisatie dat misschien mogelijk
      kan zijn is ipv de neerslag de gemiddelde temperatuur per maand weer te geven in de balkjes.</p>
  </div>
</template>

<script>
import vegaEmbed from 'vega-embed'
import {getDataset, groupPerMonth as groupBicyclingPerMonth} from '../js/bicycling-data';
import {groupPerMonth as groupWeatherPerMonth} from '../js/weather-data';

export default {
  name: 'BarLineGraph',
  props: [
    'selectedStation',
    'datasets'
  ],
  data() {
    return {
      selectedDataset: null,
    };
  },
  watch: {
    selectedStation: function (newStation) {
      if (newStation) {
        this.selectedDataset = this.getDatasetFor(newStation);
      } else {
        this.selectedDataset = null;
      }
    },
    selectedDataset: function () {
      this.setGraph();
    }
  },
  methods: {
    getDatasetFor(station) {
      // !!!!!! takes last element not all
      return this.$props.datasets.filter((dataset) => dataset.station.naam === station.naam).map(d => d.name).at(-1);
    },
    setGraph() {
      if (!this.selectedDataset) return;

      const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'Septempber', 'Oktober', 'November', 'December'];
      const monthlyBicycleData = groupBicyclingPerMonth(getDataset(this.selectedDataset));
      const monthlyWeatherData = groupWeatherPerMonth();
      const monthlyData = monthlyBicycleData.map(value => (
          {
            bicycle: value,
            weather: monthlyWeatherData[value.month]
          }));
      console.log(monthlyData);

      const chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        width: 600,
        height: 300,
        data: {values: monthlyData},
        layer: [
          {
            mark: {type: 'bar', width: {band: 0.8}, opacity: 0.8},
            encoding: {
              x: {field: 'bicycle.monthName', type: 'ordinal', title: 'Maand', sort: monthNames},
              y: {field: 'weather.rainVolume', type: 'quantitative', title: 'Neerslag'},
            }
          },
          {
            mark: {type: 'line', stroke: '#ff0000'},
            encoding: {
              x: {field: 'bicycle.monthName', type: 'ordinal', title: 'Maand', sort: monthNames},
              y: {field: 'bicycle.totaal', type: 'quantitative', title: 'Aantal fietsers'},
              color: {field: 'bicycle.year', type: 'nominal', title: 'Jaar'}
            }
          }
        ],
        resolve: {scale: {y: 'independent'}}
      };

      vegaEmbed('#bicyclers-weather-vis', chart);
    },
  },
  mounted() {
    this.setGraph();
  }
}
</script>

<style scoped>

</style>

