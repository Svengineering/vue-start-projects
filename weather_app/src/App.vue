<template>
  <section class="hero">
    <h1><span class="text">Weather Service</span><br /><span class="text">Your location</span></h1>
  </section>
  <section class="map-section">
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
    <div class="map-control-panel">

      <div class="map-control">
        <button class="button-primary" @click="getWeather">Get weather</button>
        <button @click="putMarkerInCenter">Move marker to center</button>
      </div>

      <div class="weather-info">
       
        <div class="info-box temperature">
        <img class="weather-icon" src="./assets/temperature_day.png" alt="Icon for temperature">
        <div>
          <div class="label">Temperature</div>
          <div class="data">{{ temperature }}° C</div></div>
       </div>
       
       <div class="info-box humidity">
        <img class="weather-icon" src="./assets/humidity2.png" alt="Icon for humidity level">
        <div>
          <div class="label">Humidity</div>
          <div class="data">{{ humidity }} %</div></div>
       </div>
       
       <div class="info-box wind-speed">
        <img class="weather-icon" src="./assets/windsock.png" alt="Icon of a windsock">
        <div>
          <div class="label">Wind Speed</div>
          <div class="data">{{ windSpeed }} km/h</div></div>
       </div>
       
       <div class="info-box time">
        <img class="weather-icon" src="./assets/clock.png" alt="Icon of a clock">
        <div>
          <div class="label">Time</div>
          <div class="data">11:00 AM</div>
        </div>
       </div>

      </div>      
      
      <div>Zoom ist {{ zoom }}</div>
      
      <div>Marker Position ist {{ markerPosition }}</div>
      
      <div><pre>{{ weatherData }}</pre></div>
    </div>
  </section>
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
      temperature: null,
      humidity: null,
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
          this.temperature = weatherData?.current?.temperature_2m;
          this.humidity = weatherData?.current?.relative_humidity_2m;
          this.windSpeed = weatherData?.current?.wind_speed_10m;
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


@font-face {
  font-family: 'Fira Sans';
  src: url('./assets/FiraSans-Regular.ttf')  format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Fira Sans';
  src: url('./assets/FiraSans-Bold.ttf')  format('truetype');
  font-weight: bold;
  font-style: normal;
}


* {
    box-sizing:border-box;
}

.hero {
  height:66vh;
  background-image:url('./assets/volcano-6.jpg');
  background-size:cover;
  background-position:0% 40%;
  background-repeat: no-repeat;
  border-bottom:1px solid #cccccc90;
}

h1 {
  color:white;
  font-size:3rem;
  top:15%;
  position:relative;
  margin:0 auto;
  max-width:1140px;
}

h1 .text {
  background-color: hsla(216, 71%, 20%, 0.9);
  padding: 0.2em 0.5em;
  display:inline-block;
  margin-bottom:0.6rem;
}

body {
  margin:0;
  padding:0;
  /*background-color:#40968B;*/
  /*background-color:#3c463a; */
  background-color:#001a3e;
  color:white;
  font-family:'Fira Sans', sans-serif;
}

.map-wrap {
  position:relative;
  top:-250px;
  border:10px solid white;
  border-radius:20px;
  box-shadow:0 0 20px rgba(0, 0, 0, 0.274);
  max-width:60vw;
  height:500px;
}

.map-section {
  max-width:1140px;
  margin:0 auto;
  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-row:auto;
  gap:50px;
}

.map-control {
  display:flex;
  gap:50px;
  align-items:start;
  margin-top:2rem;
}

button {
  appearance: none;
  -webkit-appearance: none;
  background-color:transparent;
  color:white;
  cursor:pointer;
  font-size:1.5rem;
  border-radius:20px;
  padding:1rem;
  border:1px solid white;
  font-family:'Fira Sans', sans-serif;
  transition: transform 0.2s ease-in-out;
}

button:hover {
  transform:scale(1.05);
}

.button-primary {
  background-color:#e8b500;
  border:1px solid #fdda99;
  color:#001a3e;
}

.weather-icon {
  filter:invert(1);
  max-height:60px;
  aspect-ratio: 1/1;
}

.weather-info {
  margin-top:2rem;
  margin-bottom:2rem;
  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-row: auto;
  gap: 20px 0px;
}

.weather-info .info-box {
  display:flex;
  gap:10px;
}

.weather-info .info-box .label {
  font-size:1.1rem;
  color:#ccc;
}

.weather-info .info-box .data {
  font-size:2.5rem;
  font-weight:bold;
}

</style>
