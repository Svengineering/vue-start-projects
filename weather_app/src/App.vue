<template>
  <div class="hero">
    <h1>Weather Service</h1>
  </div>
  <div class="map-section">
    <div class="map-wrap">
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

<style>

* {
    box-sizing:border-box;
}

.hero {
  height:66vh;
  background-image:url('./assets/volcano-6.jpg');
  background-size:cover;
  background-position:0% 40%;
  background-repeat: no-repeat;
}

h1 {
  color:white;
  font-family:sans-serif;
  font-size:4rem;
  padding-top:5%;
  margin:0 auto;
  max-width:1140px;
}

body {
  margin:0;
  padding:0;
  /*background-color:#40968B;*/
  /*background-color:#3c463a; */
  background-color:#001a3e;

}

.map-wrap {
  position:relative;
  top:-250px;
  border:10px solid white;
  border-radius:20px;
  box-shadow:0 0 20px rgba(0, 0, 0, 0.274);
  max-width:60vw;
  width:500px;
  height:500px;
}

.map-section {
  max-width:1140px;
  margin:0 auto;
}


</style>
