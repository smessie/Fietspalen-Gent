<template>
  <div :id="name"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'

export default {
  name: 'YearTotalPieChart',
  props: ['name', 'data'],
  watch: {
    data: function () {
      this.drawPieChart();
    }
  },
  methods: {
    drawPieChart() {
      if (!this.$props.data) return;

      const chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: this.$props.data},
        encoding: {
          theta: {field: 'amount', type: 'quantitative', stack: true},
          color: {field: 'name', type: 'nominal', legend: null}
        },
        layer: [
          {
            mark: {type: 'arc', outerRadius: 80}
          }, {
            mark: {type: 'text', radius: 90},
            encoding: {
              text: {field: 'name', type: 'nominal'}
            }
          }
        ]
      };
      vegaEmbed('#' + this.$props.name, chart);
    },
  },
  mounted() {
    this.drawPieChart();
  }
}
</script>

<style scoped>

</style>
