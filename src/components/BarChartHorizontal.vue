<template>
  <div :id="name"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'

export default {
  name: 'BarChartHorizontal',
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
      let totals = this.$props.data.map(el => el.total);
      const min = Math.min(...totals);
      const max = Math.max(...totals);

      const chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: this.$props.data},
        layer: [
          {
            width: 300,
            height: 200,
            mark: {type: 'point', width: {band: 0.8}},
            encoding: {
              x: {field: 'total', aggregate: 'sum', title: 'gemiddeld aantal fietsers', 
                  scale: { domain: [min - (min%500), max + (500-(max%500))], nice: false }},
              y: {
                field: 'day', title: '', type: 'ordinal',
                sort: weekdays
              },
              color: {'field': 'type dag',
              'legend': {},
              "scale": {"domain": ["Regen dag", "Droge dag"], "range": ["#46A0F0", "#F55442"]}

              },

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
