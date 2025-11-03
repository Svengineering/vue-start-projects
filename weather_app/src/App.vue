<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="heading"><span class="text">Weather Service</span><br /><span class="text">Your location</span></h1>
      <div class="map-control">
        <button class="button-primary" @click="getWeather">Get weather</button>
        <button @click="putMarkerInCenter">Move marker to center</button>
      </div>
    </div>
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
    <div class="data-control-panel">

      <h2>Now</h2>
      <div class="weather-info info-card">
       
        <div class="info-box temperature">
          <div class="icon-wrap"><img class="weather-icon" :src="imgTemperature" alt="Icon for temperature"></div>
          <div>
            <div class="label">Temperature</div>
            <div class="data">{{ temperature_cel ? temperature_cel + '° C' : '-' }}</div></div>
        </div>
       
        <div class="info-box humidity">
          <div class="icon-wrap"><img class="weather-icon" src="./assets/humidity2.png" alt="Icon for humidity level"></div>
          <div>
            <div class="label">Humidity</div>
            <div class="data">{{ humidity_rel ? humidity_rel + ' %' : '-' }}</div></div>
        </div>
       
        <div class="info-box wind-speed">
          <div class="icon-wrap"><img class="weather-icon" src="./assets/windsock.png" alt="Icon of a windsock"></div>
          <div>
            <div class="label">Wind Speed</div>
            <div class="data">{{ windSpeed_kmh ? windSpeed_kmh + ' km/h' : '-' }}</div></div>
        </div>
       
        <div class="info-box time">
          <div class="icon-wrap"><img class="weather-icon" src="./assets/clock.png" alt="Icon of a clock"></div>
          <div>
            <div class="label">Time</div>
            <div class="data">{{ timeDisplay }}</div>
          </div>
        </div>

      </div>

      <h2>Forecast</h2>
      <div class="forecast info-card">
        <div class="time-series">
          <span class="temp">- 19°</span>
          <span class="time">18:00</span>
        </div>
        <div class="time-series">
          <span class="temp">- 17°</span>
          <span class="time">00:00</span>
        </div>
        <div class="time-series">
          <span class="temp">- 14°</span>
          <span class="time">06:00</span>
        </div>
        <div class="time-series">
          <span class="temp">- 10°</span>
          <span class="time">12:00</span>
        </div>
        <div class="time-series">
          <span class="temp">- 11°</span>
          <span class="time">18:00</span>
        </div>
      </div>
      
      <div style="margin-top:200px"><pre>{{ weatherData }}</pre></div>
    </div>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";
import weatherService from "./weaterService";
import L, { marker } from 'leaflet';
import { LCircle, LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import img_day from './assets/temperature_day.png';
import img_night from './assets/temperature_night.png';


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
      temperature_cel: null,
      humidity_rel: null,
      windSpeed_kmh: null,
      time: null,
      is_day: true
    };
  },
  computed: {
    timeDisplay() {
      const now = this.time ? new Date(this.time) : new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    imgTemperature() {
      return this.is_day ? img_day : img_night;
    }
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
          this.temperature_cel = weatherData?.current?.temperature_2m;
          this.humidity_rel = weatherData?.current?.relative_humidity_2m;
          //wind speed seems correct (esp. unit km/h), after comparing with other services
          this.windSpeed_kmh = weatherData?.current?.wind_speed_10m; 

          this.time = weatherData?.current?.time;

          this.is_day = weatherData?.current?.is_day === 1;

          //const bounds = this.$refs.map.leafletObject.getBounds();
          //if(!bounds.contains(this.markerPosition)) {
          this.$refs.map.leafletObject.flyTo(this.markerPosition);
          //}

        })
        .catch((error) => {
          alert(`Failed to get weather data: ${error}`);
        });

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
  height:55vh;
  background-image:url('./assets/volcano-6.jpg');
  background-size:cover;
  background-position:0% 40%;
  background-repeat: no-repeat;
  border-bottom:1px solid #cccccc90;

}

.hero .hero-content {
  max-width:1140px;
  height:100%;
  margin:0 auto;
  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows:auto;
  grid-template-areas:
  "heading heading"
  "left right";
  column-gap:50px;
}

.map-control {
  display:flex;
  gap:50px;
  align-items:start;
  grid-area: right;
  align-self:end; /* within the hero grid */
  margin-bottom:50px;
}

h1.heading {
  color:white;
  font-size:3rem;
  padding-top:10vh;
  grid-area: heading;
  margin:0;
}

h1 .text {
  background-color: hsla(216, 71%, 20%, 0.9);
  padding: 0.2em 0.5em;
  display:inline-block;
  margin-bottom:0.6rem;
}

h2 {
  font-size:1.5rem;
  margin-top:2rem;
  margin-bottom:1rem;
  color:#ccc;
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
  top:-220px;
  border:10px solid white;
  border-radius:20px;
  box-shadow:0 0 20px rgba(0, 0, 0, 0.274);
  max-width:60vw;
  height:600px;
}

.map-section {
  max-width:1140px;
  margin:0 auto;
  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-row:auto;
  gap:50px;
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

.icon-wrap {
  width:25%;
  text-align:center; /*horizonally center img icon */
}

.weather-icon {
  filter:invert(1);
  max-height:55px;
  aspect-ratio: 1/1;
}

/* make time icon a little bit smaller */
.time .weather-icon {
  max-height:52px;
}

/* make icon for relative humidity a little bit larger */
.humidity .weather-icon {
  max-height:58px;
}

.weather-info {
  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-row: auto;
  gap: 20px 0px;
}

.weather-info .info-box {
  display:flex;
  gap:10px;
  align-items:center;
}

.weather-info .info-box .label {
  font-size:1.1rem;
  color:#ccc;
}

.weather-info .info-box .data {
  font-size:2rem;
  font-weight:bold;
}

.forecast {
  display:flex;
  gap:10px;
  justify-content: space-around;
}

.time-series {
  display:flex;
  flex-direction:column;
  align-items:center;
}

.time-series .temp {
  font-size:2rem;
  font-weight:bold;
  padding-bottom:1rem;
}

.time-series .time {
  font-size:1.1rem;
  color:#ccc;
}

.info-card {
    background-color: #ffffff10;
    border-radius: 10px;
    padding: 10px;
    border:1px solid #8b8b8bd8;
}

</style>
