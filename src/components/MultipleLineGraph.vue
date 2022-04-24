<template>
	<div id="vis"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'

export default {
  name: 'MultipleLineGraph',
  props: ['data'],
  watch: {
    data: function() {
      this.setLineGraph()
    }
  },
  methods: {
		setLineGraph(){
      if (!this.$props.data) return
      let data = this.$props.data.map((elem) => {
        elem.time = new Date(elem.datum + ' ' + elem.uur5minuten)
        return elem
      })

			let chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: { values: data },
        layer: [
          {
            mark: { type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'uur'},
              y: {field: 'hoofdrichting', type: 'quantitative', title: 'aantal'},
              color: {datum: 'hoofdrichting'}
            }
          },
          {
            mark: { type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'uur'},
              y: {field: 'tegenrichting', type: 'quantitative', title: 'aantal'},
              color: {datum: 'tegenrichting'}
            },
          },
        ],
      };
      vegaEmbed('#vis', chart);
    },
  },
  mounted() {
    this.setLineGraph()
  } 
}
</script>

<style scoped>

</style>
