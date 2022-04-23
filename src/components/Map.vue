<template>
  <div class="center">
    <l-map style="height:50vh" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker v-for="bikePole in bikePoles" :key="bikePole" 
        :lat-lng="bikePole.fields.geo_point_2d" 
        v-on:click="selectPole(bikePole)"
      >
       <l-popup ref="popup">
        {{ bikePole.fields.naam }}
      </l-popup> 
      </l-marker>
    </l-map>
  </div>
  <h1 v-if="selectedPole">huidige paal: {{ selectedPole.fields.naam }}</h1>
</template>

<script>
// DON'T load Leaflet components here!
// Its CSS is needed though, if not imported elsewhere in your application.
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { getBikePoles } from '../js/bicycling-data';


export default {
  name: 'Map',
  emits: ['changeSelected'],
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
      bikePoles: [],
      selectedPole: null,
    };
  },
  methods: {
    selectPole(pole) {
      this.selectedPole = pole
      this.$emit('change-selected', pole);
    },
  },
  mounted() {
    this.bikePoles = getBikePoles()
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


