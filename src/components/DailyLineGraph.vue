<template>
  <div>
    <div v-if="selectedDatasets">
      <el-date-picker
          v-if="selectedDatasets"
          v-model="date"
          type="date"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          :default-value="new Date(date)"
          :disabled-date="disableDate"
      />
    </div>
    <div v-if="selectedDatasets && date">
      <VegaLineGraph :data="hourlyDayRecords"/>
      <MultipleLineGraph :data="hourlyDayRecords" :station="selectedDatasets[0].substring(0, selectedDatasets[0].length - 5)"/>
    </div>
    <p v-else-if="selectedDatasets">Selecteer eerst een fietstelpaal en datum om de visualisatie te zien te krijgen.</p>
  </div>
</template>

<script>
import {getDataForDate, getDataset, groupPerDay} from '../js/bicycling-data';
import VegaLineGraph from './VegaLineGraph.vue'
import MultipleLineGraph from './MultipleLineGraph.vue'

export default {
  name: 'DailyLineGraph',
  components: {MultipleLineGraph, VegaLineGraph},
  props: [
    'selectedStation',
    'datasets'
  ],
  data() {
    return {
      selectedDatasets: null,
      date: null,
      hourlyDayRecords: null,
      disableMap: null,
    };
  },
  watch: {
    selectedDatasets: function () {
      if (this.selectedDatasets) {
        const dataByDay = groupPerDay(this.selectedDatasets.map(name => getDataset(name)).flat());

        // make map to see when date needs to be disabled
        this.disableMap = new Map();
        dataByDay.forEach(day => {
          this.disableMap.set(day.date.setHours(0,0,0,0), day.totaal);
        });

        // set first non-zero day as current date
        let currentIndex = 0;
        while (this.disableDate(dataByDay[currentIndex].date)) {
          currentIndex++;
        }
        this.date = dataByDay[currentIndex + 1].date.toISOString().split('T')[0];
      }
    },
    date: function () {
      this.updateDailyData();
    },
    selectedStation: function (newStation) {
      if (newStation) {
        this.selectedDatasets = this.getDatasetsFor(newStation);
      } else {
        this.selectedDatasets = null;
        this.disableMap = null;
      }
    },
  },
  methods: {
    getDatasetsFor(station) {
      return this.$props.datasets.filter((dataset) => dataset.station.naam === station.naam).map(d => d.name);
    },
    updateDailyData() {
      if (this.selectedDatasets && this.date) {
        const data = this.selectedDatasets.map(name => getDataset(name)).flat();
        this.hourlyDayRecords = getDataForDate(data, this.date);
      }
    },
    disableDate(date) {
      date = new Date(date);
      if (!this.selectedDatasets || !this.disableMap) return false;
      if (!this.disableMap.get(date.setHours(0,0,0,0))) return true;
      return this.disableMap.get(date.setHours(0,0,0,0)) <= 0;
    }
  },
}
</script>

<style scoped>

</style>
