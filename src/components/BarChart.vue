<template>
  <div :id="name"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'

export default {
  name: 'BarChart',
  props: [
    'data',
    'name',
  ],
  watch: {
    data: function(){
      this.setLineGraph();
    }
  },
  methods: {
    setLineGraph() {
      const weekdays = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
      if (!this.$props.data) return;

      const chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: this.$props.data},
        layer: [
          {
            width: 300,
            height: 200,
            mark: {type: 'bar', width: {band: 0.8}},
            encoding: {
              x: {
                field: 'day', title: '', type: 'ordinal',
                sort: weekdays
              },
              y: {field: 'total', aggregate: 'sum', title: 'Gemiddeld aantal fietsers'},
            }
          },
        ],
      };
      vegaEmbed("#"+this.$props.name, chart);
    },
  },
  mounted() {
    this.setLineGraph();
  }
}
</script>

<style scoped>

</style>
