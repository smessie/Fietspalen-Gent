<template>
  <el-row :gutter="10">
    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
      <el-select v-if="datasets" v-model="viewType" placeholder="Select">
        <el-option label="geselecteerde paal" value="station"/>
        <el-option label="per jaar" value="year"/>
      </el-select>
      <div v-if="viewType === 'station'">
        <div v-for="dataset in namesToDatasets(selectedDatasets)" :key="dataset">
          <CalendarHeatmap :value="dataset.name"
                           :name="dataset.station.naam"
                           :year="dataset.year"
                           :values="groupDataset(dataset.name)"
                           :max="maxValue"
                           :offset-x="offsetX"
                           :offset-y="offsetY"
          />
        </div>
      </div>
      <div v-else>
        <label for="yearSelect">Jaar: </label>
        <el-select id="yearSelect" v-if="datasets" v-model="selectedYear" placeholder="Select">
          <el-option :value="2018"/>
          <el-option :value="2019"/>
          <el-option :value="2020"/>
          <el-option :value="2021"/>
        </el-select>
        <div v-for="dataset in getAllDatasetsForYear(selectedYear)" :key="dataset">
          <CalendarHeatmap :value="dataset.name"
                           :name="dataset.station.naam"
                           :year="dataset.year"
                           :values="groupDataset(dataset.name)"
                           :max="maxValue"
                           :offset-x="offsetX"
                           :offset-y="offsetY"
        />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {groupPerDay, getDataset, getDatasets} from '../js/bicycling-data';
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
      viewType: "station",
      selectedDatasets: [],
      selectedYear: 2021,
    }
  },
  watch: {
    selectedStation: function (newStation) {
      if (newStation) {
        this.selectedDatasets = this.getDatasetsFor(newStation);
      } else {
        this.selectedDatasets = []
      }
    },
  },
  methods: {
    getDatasetsFor(station) {
      return this.datasets.filter((dataset) => dataset.station.naam === station.naam).map(d => d.name)
    },
    namesToDatasets(names) {
      return names.map((name) => this.datasets.find((dataset) => dataset.name === name))
    },
    groupDataset(name) {
      return groupPerDay(getDataset(name));
    },
    getAllDatasetsForYear(year) {
      return getDatasets().filter(dataset => dataset.year === year)
    }
  },
  computed: {
    maxValue() {
      return d3.max(this.selectedDatasets.map(name => this.groupDataset(name)).flat(), d => d.totaal);
    }
  }
}
</script>

<style scoped>

</style>
