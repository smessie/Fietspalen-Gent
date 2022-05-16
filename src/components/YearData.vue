<template>
  <el-row justify="center">
    <div v-for="year in Object.keys(yeardata)" :key="year">
      <h3>{{ year }}</h3>
      <year-total-pie-chart :data="yeardata[year]" :name="'piechart-' + year"/>
    </div>
  </el-row>
</template>

<script>
import {calculateTotalsByYear} from '../js/bicycling-data';
import YearTotalPieChart from './YearTotalPieChart.vue';

export default {
  name: 'YearData',
  components: {YearTotalPieChart},
  props: [
    'datasets'
  ],
  data() {
    return {
      yeardata: {},
    }
  },
  methods: {
    setYearData() {
      this.yeardata = calculateTotalsByYear(this.datasets);
    }
  },
  mounted() {
    this.setYearData();
  },
}
</script>

<style scoped>

</style>
