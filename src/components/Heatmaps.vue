<template>
  <el-row :gutter="10">
    <el-col :xs="{span: 12, offset: 0}" :sm="{span: 10, offset: 2}" :md="{span: 8, offset: 4}"
            :lg="{span: 6, offset: 4}" :xl="{span: 6, offset: 4}">
      <el-select v-if="stations" v-model="selectedStations" multiple placeholder="Select">
        <el-option
            v-for="station in stations.filter(station => !selectedStations.includes(station)).map(station => this.nameToObject(station))"
            :key="station.name"
            :label="station.name + ' ' + station.year"
            :value="station.datasetName"
        >
          <span style="float: left">{{ station.name }}</span>
          <span
              style="
          float: right;
          color: var(--el-text-color-secondary);
          font-size: 13px;
        "
          >{{ station.year }}</span
          >
        </el-option>
      </el-select>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
      <div v-for="station in selectedStations.map(station => this.nameToObject(station))" :key="station">
        <CalendarHeatmap :value="station.datasetName"
                                  :name="station.name"
                                  :year="station.year"
                                  :values="groupDataset(station.datasetName)"
        ></CalendarHeatmap>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {groupPerDay, getAllDatasetNamesWithout, getAllDatasetNamesFor, getDataset} from '../js/bicycling-data';
import CalendarHeatmap from './CalendarHeatmap.vue';

export default {
  name: 'Heatmaps',
  components: {CalendarHeatmap},
  props: [
    'selectedStation',
  ],
  data() {
    return {
      selectedStations: [],
      stations: getAllDatasetNamesWithout(),
    }
  },
  watch: {
    selectedStation: function(newStation) {
      if (newStation) {
        this.selectedStations = getAllDatasetNamesFor(newStation);
      } else {
        this.selectedStations = []
      }
      this.stations = getAllDatasetNamesWithout(this.selectedStation)
    },
  },
  methods: {
    groupDataset(name) {
      return groupPerDay(getDataset(name));
    },
    nameToObject(datasetName) { // this code: https://media.giphy.com/media/dOl2LFw0RbTMc/giphy.gif
      let splitted = datasetName.split("-")
      let name = ""
      for (let i = 0; i < splitted.length - 1; i++) {
        name += splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1) + " ";
      }
      name = name.trim()
      return { datasetName, name, year: parseInt(splitted[splitted.length - 1]) }
    }
  },
}
</script>

<style scoped>

</style>
