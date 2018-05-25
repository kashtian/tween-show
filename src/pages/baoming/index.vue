<template>
  <div class="baoming">
      <div>
          picker value: {{this.pickerVal}}
      </div>

      <picker :list="pList" :is-plain="true" v-model="pickerVal" is-cycle="true"/>
  </div>
</template>

<style lang="less" scoped>
    .baoming {
        padding: 50px;
        .input-wrapper {
            margin: 10px 0px;
        }
    }
</style>

<script src="./bm.js"></script>
