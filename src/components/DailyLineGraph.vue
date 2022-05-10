<template>
  <div>
    <div style="display:flex">
      <el-select v-model="selectedDataset" placeholder="Select">
        <el-option v-for="dataset in datasets"
                   :key="dataset.name"
                   :label="dataset.station.naam + ' ' + dataset.year"
                   :value="dataset.name"
        >
          <span style="float: left">{{ dataset.station.naam }}</span>
          <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">{{ dataset.year }}</span>
        </el-option>
      </el-select>
      <el-date-picker
          v-if="selectedDataset"
          v-model="date"
          type="date"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          :default-value="new Date(date)"
          :disabled-date="disableDate"
      />
    </div>
    <div v-if="selectedDataset && date">
      <VegaLineGraph :data="hourlyDayRecords"/>
      <MultipleLineGraph :data="hourlyDayRecords" :station="selectedDataset.substring(0, selectedDataset.length - 5)"/>
    </div>
    <p v-else>Selecteer eerst een fietstelpaal en datum om de visualisatie te zien te krijgen.</p>
  </div>
</template>

<script>
import {getDataset, getDataForDate, combineMinutesToHours, groupPerDay} from '../js/bicycling-data';
import LineGraph from './LineGraph.vue'
import VegaLineGraph from './VegaLineGraph.vue'
import MultipleLineGraph from './MultipleLineGraph.vue'

export default {
  name: 'DailyLineGraph',
  components: {LineGraph, MultipleLineGraph, VegaLineGraph},
  props: [
    'selectedStation',
    'datasets'
  ],
  data() {
    return {
      selectedDataset: null,
      date: null,
      hourlyDayRecords: null,
      disableMap: null,
    };
  },
  watch: {
    selectedDataset: function () {
      if (this.selectedDataset) {
        const dataByDay = groupPerDay(getDataset(this.selectedDataset))

        // make map to see when date needs to be disabled
        this.disableMap = new Map()
        dataByDay.forEach(day => {
          this.disableMap.set(day.date.setHours(0,0,0,0), day.totaal)
        })

        // set first non zero day as current date
        let currentIndex = 0
        while (this.disableDate(dataByDay[currentIndex].date)) {
          currentIndex++;
        }
        this.date = dataByDay[currentIndex + 1].date.toISOString().split('T')[0]
      }
    },
    date: function () {
      this.updateDailyData();
    },
    selectedStation: function (newStation) {
      if (newStation) {
        this.selectedDataset = this.getDatasetFor(newStation);
      } else {
        this.selectedDataset = null;
        this.disableMap = null;
      }
    },
  },
  methods: {
    getDatasetFor(station) {
      // !!!!!! takes last element not all
      return this.$props.datasets.filter((dataset) => dataset.station.naam === station.naam).map(d => d.name)[0];
    },
    updateDailyData() {
      if (this.selectedDataset && this.date) {
        const data = getDataset(this.selectedDataset);
        const dayRecords = getDataForDate(data, this.date);
        this.hourlyDayRecords = combineMinutesToHours(dayRecords);
      }
    },
    disableDate(date) {
      date = new Date(date)
      if (!this.selectedDataset || !this.disableMap) return false;
      if (!this.disableMap.get(date.setHours(0,0,0,0))) return true;
      return this.disableMap.get(date.setHours(0,0,0,0)) <= 0;
    }
  },
}
</script>

<style scoped>

</style>
