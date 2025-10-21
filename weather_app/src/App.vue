<template>
  <div style="height:600px; width:800px">
    <l-map 
      ref="map" 
      v-model:zoom="zoom" 
      :center="initialMapPosition"
      >

      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <l-marker 
        v-model:lat-lng="markerPosition"
        v-bind:draggable="true"
        @click="console.log('Marker clicked')" />
    </l-map>
  </div>
  <div>Zoom ist {{ zoom }}</div>
  <div>Marker Position ist {{ markerPosition }}</div>
  <button @click="putMarkerInCenter">Put marker into center</button>
  <button @click="getWeather">Get weather</button>
  <div><pre>{{ weatherData }}</pre></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import weatherService from "./weaterService";
import L, { marker } from 'leaflet';
import { LCircle, LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";


const BRUSSELS_LAT_LNG = [50.84, 4.39];
const INITIAL_ZOOM = 8;

export default {
  components: {
    LMap,
    LTileLayer,
    LCircle,
    LMarker,
  },
  data() {
    return {
      zoom: INITIAL_ZOOM,
      markerPosition: {lat: 50.84, lng: 4.39},
      initialMapPosition: BRUSSELS_LAT_LNG,
      weatherData: null,
    };
  },
  methods: {
    putMarkerInCenter() {
      const mapObject = this.$refs.map.leafletObject;
      const center = mapObject.getCenter();
      this.markerPosition = {lat: center.lat, lng: center.lng};
    },
    getWeather() {

      const lat = this.markerPosition.lat;
      const lon = this.markerPosition.lng;
      weatherService.getWeather(lat, lon)
        .then((weatherData) => {
          this.weatherData = weatherData;
        })
        .catch((error) => {
          alert(`Failed to get weather data: ${error}`);
        });
      /*
      const bounds = this.$refs.map.leafletObject.getBounds();
      if(!bounds.contains(this.markerPosition)) {
        this.$refs.map.leafletObject.flyTo(this.markerPosition);
      }*/
    }
  },
};
</script>

<style scoped></style>
