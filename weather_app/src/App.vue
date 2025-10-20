<template>
  <div style="height:600px; width:800px">
    <l-map 
      ref="map" 
      v-model:zoom="zoom" 
      :center="[50.84, 4.39]"
      @click="addMarker"
      @update:center="updateCenter"
      >

      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <l-marker 
        :lat-lng="markerPosition"
        @click="console.log('Marker clicked')" />
    </l-map>
  </div>
  <div>Zoom ist {{ zoom }}</div>
  <div>Marker Position ist {{ markerPosition }}</div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L, { marker } from 'leaflet';
import { LCircle, LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LCircle,
    LMarker,
  },
  data() {
    return {
      zoom: 11,
      markerPosition: [50.84, 4.39],
    };
  },
  methods: {
    updateCenter(newCenter) {
      //console.log("Map center updated to:", newCenter);
      this.markerPosition = newCenter;
    },
    addMarker() {
      console.log("Map clicked");
    }
  },
};
</script>

<style scoped></style>
