<template>
  <div class="center">
    <l-map style="height:50vh" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker v-for="station in stations" :key="station" 
        :lat-lng="station.geo_point_2d" 
        v-on:click="selectStation(station)"
      >
       <l-popup ref="popup">
        {{ station.naam }}
      </l-popup> 
      </l-marker>
    </l-map>
  </div>
  <h3 style="color: red" v-if="mapSelectedStation">De data voor {{ mapSelectedStation.naam }} is niet beschikbaar</h3>
</template>

<script>
// DON'T load Leaflet components here!
// Its CSS is needed though, if not imported elsewhere in your application.
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { getStations, dataIsAvailable } from '../js/bicycling-data';


export default {
  name: 'Map',
  emits: ['change-selected'],
  props: [
    'selectedStation',
  ],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 13,
      center: [51.052709, 3.724825],
      stations: [],
      mapSelectedStation: null,
    };
  },
  methods: {
    selectStation(station) {
      if (dataIsAvailable(station)) {
        this.$emit('change-selected', station)
        this.mapSelectedStation = null
      } else {
        this.$emit('change-selected', null)
        this.mapSelectedStation = station
      }
    },
  },
  mounted() {
    this.stations = getStations()
  },
};
</script>

<style scoped>
.center {
  margin: auto;
  width: 50%;
  border: 3px solid black;
  padding: 10px;
}
</style>


