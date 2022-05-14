<template>
  <div :class="value" :id="value"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'CalendarHeatmap',
  props: [
    'value',
    'name',
    'year',
    'values',
    'max',
    'offsetX',
    'offsetY',
    'highlight'
  ],
  mounted() {
    this.makeGraph();
  },
  methods: {
    makeGraph: function () {
      const firstDayOfYear = new Date(this.year, 0, 1);
      const daysOffset = new Date(this.year, 0, 1).getDay() - 1;
      const dataset = Array.from(Array(371).keys()).map(i => ({
        date: new Date(new Date().setTime(firstDayOfYear.getTime() + (i - daysOffset - 1) * (24 * 60 * 60 * 1000))),
        totaal: 0,
        hoofdrichting: 0,
        tegenrichting: 0
      }));


      for (const entry of this.values) {
        const day = Math.floor((entry.date - new Date(entry.date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        dataset[day + daysOffset] = entry;
      }

      const width = 850;
      const height = 220;

      const cScale = d3.scaleSequential().interpolator(d3.interpolateGreens);
      cScale.domain([0, this.max]);

      const div = d3.select('.' + this.value).append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);

      const graph = d3.select('.' + this.value).append('svg').attr('width', width).attr('height', height);
      const rectangles = graph
          .selectAll('rect')
          .data(dataset).enter()
          .append('rect');

      rectangles.attr('x', (d, i) => (Math.floor(i / 7)) * 15 + 30)
          .attr('y', (d, i) => ((i % 7) * 15 + 60))
          .attr('width', 13)
          .attr('height', 13)
          .attr('fill', d => d.totaal === 0 ? 'lightgray' : cScale(d.totaal))
          .attr('stroke', (d, i) => this.highlight && parseInt(this.highlight) === i ? 'red' : '')
          .attr('stroke-width', (d, i) => this.highlight && parseInt(this.highlight) === i ? '3' : '')
          .on('mouseover', (event, d) => {
            div.transition()
                .duration(200)
                .style('opacity', .9);
            div.html(`${d.totaal} fietsers<br>op ${d.date.toLocaleDateString()}`)
                .style('left', (event.pageX - this.offsetX) + 'px')
                .style('top', (event.pageY - this.offsetY - 28) + 'px');
          })
          .on('mouseout', (event, d) => {
            div.transition()
                .duration(500)
                .style('opacity', 0);
          });

      this.text = graph
          .append('text')
          .text(this.name + ' ' + this.year)
          .attr('x', 425)
          .attr('y', 25)
          .style('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
          .attr('font-size', '16px')
          .attr('font-weight', 'bold')
          .attr('fill', 'black');

      this.text = graph
          .append('text')
          .text('Aantal fietsers per dag')
          .attr('x', 425)
          .attr('y', 185)
          .style('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
          .attr('font-size', '14px')
          .attr('fill', 'black');

      ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].forEach((name, i) => {
        this.text = graph
            .append('text')
            .text(name)
            .attr('x', 15)
            .attr('y', 70 + 15 * i)
            .style('text-anchor', 'middle')
            .attr('font-family', 'sans-serif')
            .attr('font-size', '12px')
            .attr('fill', 'black');
      });

      ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'].forEach((name, i) => {
        this.text = graph
            .append('text')
            .text(name)
            .attr('x', 45 + 15 * 4.5 * i)
            .attr('y', 55)
            .style('text-anchor', 'middle')
            .attr('font-family', 'sans-serif')
            .attr('font-size', '12px')
            .attr('fill', 'black');
      });
    }
  }
}
</script>

<style>
.tooltip {
  position: absolute;
  text-align: center;
  width: 90px;
  height: 28px;
  padding: 2px;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0;
  border-radius: 8px;
  pointer-events: none;
}
</style>
