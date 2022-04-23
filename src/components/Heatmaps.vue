<template>
  <el-row :gutter="10">
    <el-col :xs="{span: 12, offset: 0}" :sm="{span: 10, offset: 2}" :md="{span: 8, offset: 4}"
            :lg="{span: 6, offset: 4}" :xl="{span: 6, offset: 4}">
      <el-select v-model="selectedStations" multiple placeholder="Select">
        <el-option
            v-for="item in Object.values(stations)"
            :key="item.value"
            :label="item.name + ' ' + item.year"
            :value="item.value"
        >
          <span style="float: left">{{ item.name }}</span>
          <span
              style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        "
          >{{ item.year }}</span
          >
        </el-option>
      </el-select>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
      <div v-for="stationValue in selectedStations" :key="stationValue">
        <CalendarHeatmap :value="stations[stationValue].value"
                                  :name="stations[stationValue].name"
                                  :year="stations[stationValue].year"
                                  :values="groupDatasets[stationValue]"
        ></CalendarHeatmap>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {groupPerDay} from '../js/bicycling-data';
import CalendarHeatmap from './CalendarHeatmap.vue';

export default {
  name: 'Heatmaps',
  components: {CalendarHeatmap},
  props: [
    'stations',
    'datasets'
  ],
  data() {
    return {
      selectedStations: [],
    }
  },
  computed: {
    groupDatasets() {
      const groupedDatasets = {};
      for (const [key, value] of Object.entries(this.datasets)) {
        groupedDatasets[key] = groupPerDay(value);
      }
      return groupedDatasets;
    }
  }
}
</script>

<style scoped>

</style>
