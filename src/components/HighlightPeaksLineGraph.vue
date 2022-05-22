<template>
  <div id="HighlightPeaksVisualisation"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'
import {getDataForDate, getDataset} from '../js/bicycling-data';
import moment from 'moment';

export default {
  name: 'HighlightPeaksLineGraph',
  props: [],
  methods: {
    setup() {
      const weekdayData = getDataForDate(getDataset('coupure-links-2021'), '2021-09-20');

      this.setLineGraph(weekdayData);
    },
    setLineGraph(dataset) {
      dataset = dataset.map((elem) => {
        elem.time = moment(elem.datum + ' ' + elem.uur5minuten, 'YYYY-MM-DD HH:mm').toDate();
        return elem;
      });

      const chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: dataset},
        layer: [
          {
            mark: {type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'Uur van de dag', sort: null},
              y: {field: 'tegenrichting', type: 'quantitative', title: 'Totaal aantal fietsers'},
              color: {
                datum: 'Gent in',
                scale: {
                  range: ['#92d28f', '#0266d4']
                }
              }
            }
          },
          {
            mark: {type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'Uur van de dag', sort: null},
              y: {field: 'hoofdrichting', type: 'quantitative', title: 'Totaal aantal fietsers'},
              color: {
                datum: 'Gent uit',
                scale: {
                  range: ['#92d28f', '#0266d4']
                }
              }
            },
          },
        ],
      };
      vegaEmbed('#HighlightPeaksVisualisation', chart);
    },
  },
  mounted() {
    this.setup();
  }
}
</script>

<style scoped>

</style>
