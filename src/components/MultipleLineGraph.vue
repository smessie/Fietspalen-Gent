<template>
  <div id="vis"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'
import {getLabelForDirection} from '../js/bicycling-data';
import moment from 'moment';

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
        elem.time = moment(elem.datum + ' ' + elem.uur5minuten, 'YYYY-MM-DD HH:mm').toDate();
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
              color: {
                datum: getLabelForDirection(this.station, 'hoofdrichting'),
                scale: {
                  range: ['#92d28f', '#0266d4']
                }
              }
            }
          },
          {
            mark: {type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'Uur van de dag'},
              y: {field: 'tegenrichting', type: 'quantitative', title: 'Totaal aantal fietsers'},
              color: {
                datum: getLabelForDirection(this.station, 'tegenrichting'),
                scale: {
                  range: ['#92d28f', '#0266d4']
                }
              }
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
