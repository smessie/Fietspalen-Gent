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
    addDayLines(chart, weekdays) {
      for (let weekday of weekdays){
        let dayData = this.$props.data.filter(r => r.day == weekday);
        let rain = dayData.filter(r => r.rainy == true)[0];
        let norain = dayData.filter(r => r.rainy == false)[0];
        let part = {
              mark: {type: 'rule', width: {band: 0.8}},
              encoding: {
                x: {field: 'total', datum: rain.total, aggregate: 'sum'},
                y: {
                  field: 'day', datum: weekday, type: 'ordinal',
                },
                x2: {field: 'total', datum: norain.total, aggregate: 'sum'},
                color: {'value': 'gray'},
              },
              }
        chart.layer.push(part);
      }
      return chart;
    },
    setLineGraph() {
      const weekdays = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
      if (!this.$props.data) return;
      let totals = this.$props.data.map(el => el.total);
      const min = Math.min(...totals);
      const max = Math.max(...totals);

      let chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: this.$props.data},
        layer: [
          {
            width: 300,
            height: 200,
            mark: {type: 'point', width: {band: 0.8}},
            encoding: {
              x: {field: 'total', aggregate: 'sum', title: 'gemiddeld aantal fietsers', 
                  scale: { domain: [min - 100 - ((min-100)%500), max + 600 -((max+100)%500)], nice: false }},
              y: {
                field: 'day', title: '', type: 'ordinal',
                sort: weekdays,
              },
              color: {'field': 'type dag',
              'legend': {},
              "scale": {"domain": ["Regen dag", "Droge dag"], "range": ["#46A0F0", "#F55442"]}

              },
               "tooltip": [
              {"field": "total", "title": "Gemiddeld"},
              {"field": "day", "title": "Dag"},
    ]

            }
          },
        ],
      };
      chart = this.addDayLines(chart, weekdays);
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
