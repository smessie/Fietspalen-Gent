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
        transform: [{
          window: [{
            op: 'sum',
            field: 'amount',
            as: 'total'
          }],
          frame: [null, null]
        },
          {
            calculate: 'round(datum.amount/datum.total * 10000) / 100',
            as: 'PercentOfTotal'
          }],
        encoding: {
          theta: {field: 'amount', type: 'quantitative', stack: true},
          color: {
            field: 'name',
            type: 'nominal',
            legend: null,
            scale: {
              range: ['#4c78a8', '#fcbc7c', '#54a44c', '#9cccec', '#8cd47c', '#f4841c', '#f2cf5b'],
              domain: [
                'Bataviabrug',
                'Zuidparklaan',
                'Groendreef',
                'Bijlokekaai',
                'Gaardeniersbrug',
                'Coupure Links',
                'Dampoort-Zuid'
              ]
            },
          },
          tooltip: [
            {'field': 'name', 'type': 'nominal', 'title': 'Locatie'},
            {'field': 'amount', 'type': 'quantitative', 'title': 'Gemiddeld fietsers per dag'},
            {'field': 'PercentOfTotal', 'type': 'quantitative', 'title': '% van totaal'}]
        },
        layer: [
          {
            mark: {type: 'arc', outerRadius: 90}
          }, {
            mark: {type: 'text', radius: 130},
            encoding: {
              text: {field: 'name', type: 'nominal'},
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
