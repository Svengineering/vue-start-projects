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

        <l-control position="bottomleft" class="leaflet-ui-info">
          <div class="leaflet-ui-info-content">
            <strong>How to:</strong> Drag the marker to its new position or move the map and click "Move marker to center".<br/>
            Click "Get weather" to fetch weather data for the marker.
          </div>
        </l-control>

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
        <div v-for="(entry, index) in forecast" :key="index" class="time-series">
          <span class="day-of-week">{{ entry.day_of_week }}</span>
          <span class="time">{{ entry.time }}</span>
          <span class="temp">{{ entry.temp ? Math.round(entry.temp) + '°' : '-' }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";
import weatherService from "./weaterService";
import L, { marker } from 'leaflet';
import { LMap, LTileLayer, LMarker, LControl } from "@vue-leaflet/vue-leaflet";
import img_day from './assets/temperature_day.png';
import img_night from './assets/temperature_night.png';


const BRUSSELS_LAT_LNG = [50.84, 4.39];
const INITIAL_ZOOM = 8;

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControl
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
      time: null, //string like 2025-11-04T05:45
      is_day: true,
      forecast: [ //max. 5 entries
        // { time: '18:00', temp: 19, day_of_week: 'Tue' },
        // { time: '00:00', temp: 17, day_of_week: 'Wed' },
        // ,,,
      ]
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

          //#1 set weather data
          this.weatherData = weatherData;
          this.temperature_cel = weatherData?.current?.temperature_2m;
          this.humidity_rel = weatherData?.current?.relative_humidity_2m;
          //wind speed seems correct (esp. unit km/h), after comparing with other services
          this.windSpeed_kmh = weatherData?.current?.wind_speed_10m; 

          this.time = weatherData?.current?.time;

          this.is_day = weatherData?.current?.is_day === 1;

          //#2 pan map to marker position
          //const bounds = this.$refs.map.leafletObject.getBounds();
          //if(!bounds.contains(this.markerPosition)) {
          this.$refs.map.leafletObject.flyTo(this.markerPosition);
          //}

          //#3 fill forecast data
          const date_obj = new Date(this.time);
          let first_forecast_hour = (Math.floor(date_obj.getHours() / 6) + 1) * 6; //start of next 6-hour block 

          //first_forecast_hour possible values: 6, 12, 18, 24
          const forecast = [];
          for (let i = 0; i < 5; i++) {
            let forecast_hour = first_forecast_hour + i * 6;

            if(forecast_hour % 24 == 0) {
              date_obj.setDate(date_obj.getDate() + 1); //move to next day
            }

            const day_of_week = date_obj.toLocaleDateString([], { weekday: 'short' });

            if(forecast_hour >= 24) { //deduct 24 hours if next day 
              forecast_hour = forecast_hour % 24;
            }

            const date_time_string_iso = 
              date_obj.getFullYear() + 
              '-' + 
              String(date_obj.getMonth() + 1).padStart(2, '0') + //❤️ JS Date
              '-' + 
              String(date_obj.getDate()).padStart(2, '0') + 'T' 
              + String(forecast_hour).padStart(2, '0') + ':00';

            if( ! Array.isArray(weatherData?.hourly?.time) ) {
              continue;
            }

            for(const [index, time_string] of weatherData.hourly.time.entries()) {
              if(time_string === date_time_string_iso) {
                const temp = weatherData.hourly.temperature_2m[index];
                forecast.push({
                  time: `${String(forecast_hour).padStart(2, '0')}:00`,
                  temp: temp,
                  day_of_week: day_of_week
                });
              }
            }

          }
          this.forecast = forecast;

        })
        .catch((error) => {
          alert(`Failed to get weather data: ${error}`);
        });

    }
  },
  mounted() {
    this.getWeather();
  }
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
  min-height:55vh;
  background-image:url('./assets/volcano-6.jpg');
  background-size:cover;
  background-position:0% 40%;
  background-repeat: no-repeat;
  border-bottom:1px solid #cccccc90;

}

.hero .hero-content {
  max-width:1140px;
  min-height:55vh; /* the same height as .hero, purpose: the grid should fill the hero section vertically */
  margin:0 auto;
  display:grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows:auto;
  grid-template-areas:
  "heading heading"
  "left right";
  column-gap:50px;
  row-gap:20px;
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
  margin-top:1rem;
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
  margin-top: -200px;
  border:10px solid white;
  border-radius:20px;
  box-shadow:0 0 20px rgba(0, 0, 0, 0.274);
  max-width:60vw;
  min-height:400px;
}

@media screen and ( max-height: 850px ) { 
  .map-wrap {
    margin-top: -120px;
  }
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
  margin-bottom:2rem;
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
  align-items:start;
}

.time-series .day-of-week {
  font-size:1.0rem;
  font-weight:bold;
  padding-bottom:0.25rem;
}

.time-series .temp {
  font-size:2rem;
  font-weight:bold;
  padding-bottom:rem;
}

.time-series .time {
  font-size:1.1rem;
  color:#ccc;
  padding-bottom:0.5rem;
}

.info-card {
    background-color: #ffffff10;
    border-radius: 10px;
    padding: 10px;
    border:1px solid #8b8b8bd8;
}

.leaflet-ui-info {
  background-color: #ffffffcc;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  color: #333;
}

</style>
