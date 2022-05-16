<template>
  <div id="HighlightWeekVsWeekendVisualisation"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'
import {combineMinutesToHours, getDataForDate, getDataset} from '../js/bicycling-data';

export default {
  name: 'HighlightWeekVsWeekendLineGraph',
  props: [],
  methods: {
    setup() {
      const weekendData = combineMinutesToHours(getDataForDate(getDataset('coupure-links-2021'), '2021-09-19'));
      const weekdayData = combineMinutesToHours(getDataForDate(getDataset('coupure-links-2021'), '2021-09-20'));

      this.setLineGraph(weekendData, weekdayData);
    },
    setLineGraph(dataset1, dataset2) {
      dataset1 = dataset1.map((elem) => {
        elem.time = new Date(elem.datum + ' ' + elem.uur5minuten);
        return elem;
      });
      dataset2 = dataset2.map((elem) => {
        elem.time = new Date(elem.datum + ' ' + elem.uur5minuten);
        return elem;
      });
      const dataset = dataset1.map((elem1, index) => {
        return {
          d1: elem1,
          d2: dataset2[index]
        }
      });

      const chart = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        data: {values: dataset},
        layer: [
          {
            mark: {type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'd1.time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'Uur van de dag', sort: null},
              y: {field: 'd1.totaal', type: 'quantitative', title: 'Totaal aantal fietsers'},
              color: {
                datum: 'Zondag',
                scale: {
                  range: ['#92d28f', '#0266d4']
                }
              }
            }
          },
          {
            mark: {type: 'line', point: true, interpolate: 'natural'},
            encoding: {
              x: {field: 'd2.time', timeUnit: 'hoursminutes', type: 'ordinal', title: 'Uur van de dag', sort: null},
              y: {field: 'd2.totaal', type: 'quantitative', title: 'Totaal aantal fietsers'},
              color: {
                datum: 'Maandag',
                scale: {
                  range: ['#92d28f', '#0266d4']
                }
              }
            },
          },
        ],
      };
      vegaEmbed('#HighlightWeekVsWeekendVisualisation', chart);
    },
  },
  mounted() {
    this.setup();
  }
}
</script>

<style scoped>

</style>
