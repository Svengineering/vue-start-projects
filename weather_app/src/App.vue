<template>
  <div style="height:600px; width:800px">
    <l-map ref="map" v-model:zoom="zoom" :center="[44.48865, 11.3317]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <l-circle :lat-lng="[44.48865, 11.3317]" :radius="5000" color="green" />
    </l-map>    
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { LCircle, LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LCircle,
  },
  data() {
    return {
      zoom: 11,
    };
  },
};
</script>

<style scoped></style>
