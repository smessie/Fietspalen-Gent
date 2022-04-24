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
      v-model="date"
      type="date"
      format="DD/MM/YYYY"
      value-format="YYYY-MM-DD">
</el-date-picker>
</div>
<MultipleLineGraph :fields="['hoofdrichting', 'tegenrichting']" :data="hourlyDayRecords"/>
<LineGraph :name="'totaal'" :data="hourlyDayRecords" :direction="'totaal'"></LineGraph>
<LineGraph :name="'hoofd'" :data="hourlyDayRecords" :direction="'hoofd'"></LineGraph>
<LineGraph :name="'tegen'" :data="hourlyDayRecords" :direction="'tegen'"></LineGraph>
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
    'datasets'
  ], 
  data() {
   return {
      selectedDataset: null,
			date: null,
			hourlyDayRecords: null,
   };
 },
  watch: {
	  selectedDataset: function(){
		  this.updateDailyData()
	  },
	  date: function(){
		  this.updateDailyData()
	  }
  },
  methods: {
    updateDailyData() {
			if (this.selectedDataset && this.date) {
				const data = getDataset(this.selectedDataset)
				console.log(this.date)
				const dayRecords = getDataForDate(data, this.date.toString());
				this.hourlyDayRecords = combineMinutesToHours(dayRecords);
			}
		},
  },
}
</script>

<style scoped>

</style>
