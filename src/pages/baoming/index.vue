<template>
  <div class="baoming">
      <div class="input-wrapper">
          <input type="text" name="username" growing-track='true' placeholder="请输入您的名字" v-model="info.name"/>
          
      </div>
      <div class="input-wrapper">
          <input type="text" name="usertel" growing-track='true' placeholder="请输入您的电话" v-model="info.tel" />
      </div>
      <div>
          <button @click="baoming">我要报名</button>
      </div>
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
