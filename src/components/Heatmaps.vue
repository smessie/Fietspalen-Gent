<template>
  <div>
    <el-select v-if="datasets" v-model="viewType" placeholder="Selecteer">
      <el-option label="geselecteerde paal" value="station"/>
      <el-option label="per jaar" value="year"/>
    </el-select>
    <label v-if="viewType !== 'station'" for="yearSelect" class="second-select">Jaar: </label>
    <el-select v-if="viewType !== 'station'" id="yearSelect" v-model="selectedYear" placeholder="Selecteer">
      <el-option :value="2018"/>
      <el-option :value="2019"/>
      <el-option :value="2020"/>
      <el-option :value="2021"/>
    </el-select>
    <div v-for="dataset in getAllDatasets()" :key="dataset">
      <CalendarHeatmap :max="maxValue"
                       :name="dataset.station.naam"
                       :offset-x="offsetX"
                       :offset-y="offsetY"
                       :value="dataset.name"
                       :values="groupDataset(dataset.name)"
                       :year="dataset.year"
      />
    </div>
  </div>
</template>

<script>
import {getDataset, groupPerDay} from '../js/bicycling-data';
import CalendarHeatmap from './CalendarHeatmap.vue';
import * as d3 from 'd3';

export default {
  name: 'Heatmaps',
  components: {CalendarHeatmap},
  props: [
    'selectedStation',
    'datasets',
    'offsetX',
    'offsetY'
  ],
  data() {
    return {
      viewType: 'station',
      selectedDatasets: [],
      selectedYear: 2021,
    }
  },
  watch: {
    selectedStation: function (newStation) {
      if (newStation) {
        this.selectedDatasets = this.getDatasetsFor(newStation);
      } else {
        this.selectedDatasets = [];
      }
    },
  },
  methods: {
    getDatasetsFor(station) {
      return this.datasets.filter((dataset) => dataset.station.naam === station.naam).map(d => d.name);
    },
    groupDataset(name) {
      return groupPerDay(getDataset(name));
    },
    getAllDatasets() {
      if (this.viewType === 'station') {
        return this.selectedDatasets.map((name) => this.datasets.find((dataset) => dataset.name === name));
      } else {
        return this.datasets.filter(dataset => dataset.year === this.selectedYear);
      }
    }
  },
  computed: {
    maxValue() {
      if (this.viewType === 'station') {
        return d3.max(this.selectedDatasets.map(name => this.groupDataset(name)).flat(), d => d.totaal);
      } else {
        return d3.max(this.datasets.filter(dataset => dataset.year === this.selectedYear).map(dataset => this.groupDataset(dataset.name)).flat(), d => d.totaal);
      }
    }
  }
}
</script>

<style>
.second-select {
  margin-left: 3em;
}
</style>
