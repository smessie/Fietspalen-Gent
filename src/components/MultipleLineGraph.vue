<template>
  <div id="vis"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'
import {getLabelForDirection} from '../js/bicycling-data';

export default {
  name: 'MultipleLineGraph',
  props: [
    'data',
    'station'
  ],
  watch: {
    data: function () {
      this.setLineGraph();
    }
  },
  methods: {
    setLineGraph() {
      if (!this.$props.data) return
      const data = this.$props.data.map((elem) => {
        elem.time = new Date(elem.datum + ' ' + elem.uur5minuten);
        return elem;
      });

      const chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: data},
        layer: [
          {
            mark: {type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'Uur van de dag'},
              y: {field: 'hoofdrichting', type: 'quantitative', title: 'Totaal aantal fietsers'},
              color: {datum: getLabelForDirection(this.station, 'hoofdrichting')}
            }
          },
          {
            mark: {type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'Uur van de dag'},
              y: {field: 'tegenrichting', type: 'quantitative', title: 'Totaal aantal fietsers'},
              color: {datum: getLabelForDirection(this.station, 'tegenrichting')}
            },
          },
        ].sort((x, y) => x.encoding.color.datum < y.encoding.color.datum ? -1 : 1),
      };
      vegaEmbed('#vis', chart);
    },
  },
  mounted() {
    this.setLineGraph();
  }
}
</script>

<style scoped>

</style>
