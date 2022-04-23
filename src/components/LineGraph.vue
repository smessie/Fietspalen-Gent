<template>
<div id="line-chart"></div>
</template>

<script>
import * as d3 from 'd3';
import {getDataLambda,
		getYScaleLambda } from '../js/bicycling-data';
    
export default {
  name: 'LineGraph',
  props: [
    'data',
	'direction',
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
   };
 },
  watch: {
	  data: function(){
		  this.setLineGraph()
	  }
  },
  methods: {
	setLineGraph(){
		// reset graph

		if (this.data) {
			let graph = d3.select("#line-chart").html("")

			const width = 600;
			const height = 300;
			const padding = {top: 20, left: 40, right: 40, bottom: 50};
			graph = d3
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
			
			const data = this.data;

			const [startDate, endDate] = d3.extent(data, d => timeParse(d.uur5minuten));
			
			const xScale = d3.scaleTime()
								.domain([startDate, endDate])
								.range([padding.left, width - padding.right]);
			
			const yScale = d3.scaleLinear()
								.domain([0, d3.max(data, getDataLambda(this.direction))+10])
								.range([height - padding.bottom, padding.top]);
			
			const xAxis = d3.axisBottom()
								.scale(xScale)
								.ticks(24)
								.tickFormat(formatTime);
			
			const yAxis = d3.axisLeft()    
								.scale(yScale)
								.ticks(10);
			
			const line = d3.line() 
								.x(d => xScale(timeParse(d.uur5minuten)))
								.y(getYScaleLambda(yScale, this.direction));
			
			graph.append("path") 
				.datum(data)
				.attr("fill", "none")
				.attr("stroke", "blue")
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
		}
    },
  },
}
</script>

<style scoped>

</style>
