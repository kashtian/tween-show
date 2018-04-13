<template>
  <div class="tencent-map">
    <div class="map-container" ref="mapBox"></div>
  </div>
</template>

<script>
export default {
  name: 'tencent-map',

  route: {
    path: '/map',
    title: '腾讯地图'
  },

  data() {
    return {
      map: ''
    }
  },

  mounted() {
    this.initMap()
  },

  methods: {
    initMap() {
      let center = new qq.maps.LatLng(39.916527,116.397128)
      this.map = new qq.maps.Map(this.$refs.mapBox, {
        center: center
      })
      this.marker = new qq.maps.Marker({
        position: center,
        map: this.map
      })
    }
  }
}
</script>

<style lang="less" scoped>
.map-container {
  min-width: 600px;
  min-height: 700px;
}
</style>
