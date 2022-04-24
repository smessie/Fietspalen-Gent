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
			<span style="float: right; color: var(--el-text-color-secondary); font-size: 13px;" >{{ dataset.year }}</span>
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
		<MultipleLineGraph :data="hourlyDayRecords"/>
	</div>
</div>
</template>

<script>
import { getDataset, getDataForDate, combineMinutesToHours } from '../js/bicycling-data';
import LineGraph from './LineGraph.vue' 
import MultipleLineGraph from './MultipleLineGraph.vue' 
    
export default {
  name: 'DailyLineGraph',
  components: { LineGraph, MultipleLineGraph },
  props: [
		'selectedStation',
    'datasets'
  ], 
  data() {
   return {
      selectedDataset: null,
			date: null,
			hourlyDayRecords: null,
			dateLowerBound: null, 
			dateUpperBound: null,
   };
 },
  watch: {
	  selectedDataset: function(){
		  this.setDatumVariables()
	  },
	  date: function(){
		  this.updateDailyData()
	  },
    selectedStation: function(newStation) {
      if (newStation) {
        this.selectedDataset = this.getDatasetFor(newStation);
      } else {
        this.selectedDataset = null 
      }
		},
  },
  methods: {
    getDatasetFor(station) {
      return this.$props.datasets.filter((dataset) => dataset.station.naam == station.naam).map(d => d.name)[0]
    },
    updateDailyData() {
			if (this.selectedDataset && this.date) {
				const data = getDataset(this.selectedDataset)
				const dayRecords = getDataForDate(data, this.date);
				this.hourlyDayRecords = combineMinutesToHours(dayRecords);
			}
		},
		setDatumVariables() {
			if (this.selectedDataset) {
				const data = getDataset(this.selectedDataset)
				this.date = data[0].datum
				this.dateLowerBound = new Date(data[0].datum)
				this.dateLowerBound.setDate(this.dateLowerBound.getDate() - 1)
				this.dateUpperBound = new Date(data[data.length - 1].datum)
			}
		},
		disableDate(date) {
			if (!this.selectedDataset || !this.dateLowerBound || !this.dateUpperBound) return false
			return date < this.dateLowerBound || this.dateUpperBound < date
		}
  },
}
</script>

<style scoped>

</style>
