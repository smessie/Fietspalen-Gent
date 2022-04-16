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
<div id="line-chart"></div>
</div>
</template>

<script>
import {getDataFromResultObject, getDataFromDate, combineMinutesToHours} from '../js/bicycling-data';
import * as d3 from 'd3';
    
export default {
  name: 'DailyLineGraphComponent',
  props: [
    'stations',
    'datasets'
  ], 
  data() {
   return {
     width: 750,
     height: 400,
     margin: {
       top: 50,
       right: 50,
       left: 50,
       bottom: 50,
     },
      selectedStation: null,
	  date: null,
   };
 },
  watch: {
	  selectedStation: function(val){
		  this.updateDailyData()
	  },
	  date: function(val){
		  this.updateDailyData()
	  }
  },
  methods: {
	getLineGraph(records){
		const width = 600;
		const height = 300;
		const padding = {top: 20, left: 40, right: 40, bottom: 50};
		const graph = d3
       .select("#line-chart")
       .append("svg")
         .attr("width", this.width)
         .attr("height", this.height)
       .append("g")
       .style(
         "transform",
         `translate(${this.margin.left}px, ${this.margin.top}px)`
       );
		
		const formatTime = d3.timeFormat("%H:%M");
		const timeParse = d3.timeParse("%H:%M");
		
		const data = records;

		const [startDate, endDate] = d3.extent(data, d => timeParse(d.uur5minuten));
		
		const xScale = d3.scaleTime()
							//.domain([d3.timeDay.offset(startDate, -1), d3.timeDay.offset(endDate, 1)])
							.domain([startDate, endDate])
							.range([padding.left, width - padding.right]);
		
		const yScale = d3.scaleLinear()
							.domain([0, d3.max(data, d => d.totaal)+10])
							.range([height - padding.bottom, padding.top]);
		
		const xAxis = d3.axisBottom()
							.scale(xScale)
							.ticks(24)
							.tickFormat(formatTime);
		
		const yAxis = d3.axisLeft()    
							.scale(yScale)
							.ticks(10);
		
		const line = d3.line()                         // create a new line helper
							.x(d => xScale(timeParse(d.uur5minuten)))
							.y(d => yScale(d.totaal));
		
		graph.append("path")                          // draw the path using the helper
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "hotpink")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5)
			.attr("d", line);
		
		graph.append("g") 
			.attr("class", "x axis")
			.attr("transform", `translate(0, ${height - padding.bottom})`)
			.call(xAxis)
			.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-45)");
		
		graph.append("g")                                   
			.attr("class", "y axis")
			.attr("transform", `translate(${padding.left}, 0)`) 
			.call(yAxis);
		
		graph.select(".y.axis")
			.append("text")
			.text("Totaal aantal fietsers")
			.style("text-anchor", "end")
			.attr("dx", -padding.top)
			.attr("dy", "1em")
			.attr("transform", "rotate(-90)")
			.attr("fill", "black");
		
		return graph.node();
    },
    updateDailyData() {

		const graph = d3.select("#line-chart").html("")
		const records = getDataFromResultObject(this.datasets[this.selectedStation]);
		if (this.date) {
			console.log(this.date)
			const dayRecords = getDataFromDate(records, this.date.toString());
			const hourlyDayRecords = combineMinutesToHours(dayRecords);
			this.getLineGraph(hourlyDayRecords)
		}
    }
  },
}
</script>

<style scoped>

</style>