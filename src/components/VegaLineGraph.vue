<template>
  <div id="total-vis"></div>
</template>

<script>
import vegaEmbed from 'vega-embed';

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
              y: {field: 'totaal', type: 'quantitative', title: 'Totaal aantal fietsers'},
              color: {datum: 'totaal'}
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
