<template>
<div>
	<div style="display:flex">
<el-select v-model="selectedStation" placeholder="Select">
<el-option
	v-for="item in Object.values(stations)"
	:key="item.value"
	:label="item.name + ' ' + item.year"
	:value="item.value"
>
	<span style="float: left">{{ item.name }}</span>
	<span
		style="
	float: right;
	color: var(--el-text-color-secondary);
	font-size: 13px;
"
	>{{ item.year }}</span
	>
</el-option>
</el-select>
	<el-date-picker
      v-model="date"
      type="date"
      format="DD/MM/YYYY"
      value-format="YYYY-MM-DD">
</el-date-picker>
</div>
<LineGraphComponent :data="this.hourlyDayRecords" :direction="'totaal'"></LineGraphComponent>
</div>
</template>

<script>
import {getDataFromResultObject, 
		getDataFromDate,
		combineMinutesToHours,
		} from '../js/bicycling-data';
import LineGraphComponent from './LineGraphComponent.vue' 
    
export default {
  name: 'DailyLineGraphComponent',
  components: {LineGraphComponent},
  props: [
    'stations',
    'datasets'
  ], 
  data() {
   return {
      selectedStation: null,
	  date: null,
	  hourlyDayRecords: null,
   };
 },
  watch: {
	  selectedStation: function(){
		  this.updateDailyData()
	  },
	  date: function(){
		  this.updateDailyData()
	  }
  },
  methods: {
    updateDailyData() {
		const records = getDataFromResultObject(this.datasets[this.selectedStation]);
		if (this.date) {
			const dayRecords = getDataFromDate(records, this.date.toString());
			this.hourlyDayRecords = combineMinutesToHours(dayRecords);
		}
    },
  },
}
</script>

<style scoped>

</style>