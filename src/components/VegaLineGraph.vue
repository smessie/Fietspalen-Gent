<template>
  <div id="total-vis"></div>
</template>

<script>
import vegaEmbed from 'vega-embed';
import moment from 'moment';

export default {
  name: 'VegaLineGraph',
  props: ['data'],
  watch: {
    data: function () {
      this.setLineGraph();
    }
  },
  methods: {
    setLineGraph() {
      if (!this.$props.data) return;
      const data = this.$props.data.map((elem) => {
        elem.time = moment(elem.datum + ' ' + elem.uur5minuten, 'YYYY-MM-DD HH:mm').toDate();
        return elem;
      });
      console.log(data);
      const chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: data},
        layer: [
          {
            mark: {type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'Uur van de dag'},
              y: {field: 'totaal', type: 'quantitative', title: 'Totaal aantal fietsers '},
              color: {value:"#4ca1fc"},
            }
          },
        ],
      };
      vegaEmbed('#total-vis', chart);
    },
  },
  mounted() {
    this.setLineGraph();
  }
}
</script>

<style scoped>

</style>
