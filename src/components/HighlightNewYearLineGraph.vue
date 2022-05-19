<template>
  <div id="HighlightNewYearVisualisation"></div>
</template>

<script>
import vegaEmbed from 'vega-embed'
import {getDataForDate, getDataset} from '../js/bicycling-data';

export default {
  name: 'HighlightNewYearLineGraph',
  props: [],
  methods: {
    setup() {
      const end2019data = getDataForDate(getDataset('dampoort-zuid-2019'), '2019-12-31');
      const begin2020data = getDataForDate(getDataset('dampoort-zuid-2020'), '2020-01-01');
      const end2020data = getDataForDate(getDataset('dampoort-zuid-2020'), '2020-12-31');
      const begin2021data = getDataForDate(getDataset('dampoort-zuid-2021'), '2021-01-01');

      const newYear2020data = end2019data.slice(-12).concat(begin2020data.slice(0, 12));
      const newYear2021data = end2020data.slice(-12).concat(begin2021data.slice(0, 12));

      this.setLineGraph(newYear2020data, newYear2021data);
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
                datum: 'Nieuwjaar 2020',
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
                datum: 'Nieuwjaar 2021',
                scale: {
                  range: ['#92d28f', '#0266d4']
                }
              }
            },
          },
        ],
      };
      vegaEmbed('#HighlightNewYearVisualisation', chart);
    },
  },
  mounted() {
    this.setup();
  }
}
</script>

<style scoped>

</style>
