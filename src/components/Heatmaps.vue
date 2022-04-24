<template>
  <el-row :gutter="10">
    <el-col :xs="{span: 12, offset: 0}" :sm="{span: 10, offset: 2}" :md="{span: 8, offset: 4}"
            :lg="{span: 6, offset: 4}" :xl="{span: 6, offset: 4}">
      <el-select v-if="datasets" v-model="selectedDatasets" multiple placeholder="Select">
        <el-option
            v-for="dataset in datasets"
            :key="dataset"
            :label="dataset.station.naam + ' ' + dataset.year"
            :value="dataset.name"
        >
          <span style="float: left">{{ dataset.station.naam }}</span>
          <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px; ">{{ dataset.year }}</span>
        </el-option>
      </el-select>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
      <div v-for="dataset in namesToDatasets(selectedDatasets)" :key="dataset">
        <CalendarHeatmap :value="dataset.name"
                                  :name="dataset.station.naam"
                                  :year="dataset.year"
                                  :values="groupDataset(dataset.name)"
        ></CalendarHeatmap>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {groupPerDay, getDataset} from '../js/bicycling-data';
import CalendarHeatmap from './CalendarHeatmap.vue';

export default {
  name: 'Heatmaps',
  components: {CalendarHeatmap},
  props: [
    'selectedStation',
    'datasets'
  ],
  data() {
    return {
      selectedDatasets: [],
    }
  },
  watch: {
    selectedStation: function(newStation) {
      if (newStation) {
        this.selectedDatasets = this.getDatasetsFor(newStation);
      } else {
        this.selectedDatasets = []
      }
    },
  },
  methods: {
    getDatasetsFor(station) {
      return this.datasets.filter((dataset) => dataset.station.naam == station.naam).map(d => d.name)
    },
    namesToDatasets(names) {
      return names.map((name) => this.datasets.find((dataset) => dataset.name == name))
    },
    groupDataset(name) {
      return groupPerDay(getDataset(name));
    },
  },
}
</script>

<style scoped>

</style>
