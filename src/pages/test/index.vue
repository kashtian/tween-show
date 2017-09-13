<template>
    <div class="test-page">
        <button @click="openDg1('1-1')">打开弹窗1-1</button>
        <br/>
        <button @click="openDg1('1-2')">打开弹窗1-2</button>
        <br/>
         <button @click="openDg3(1)">打开图片弹窗1-1</button>
        <br/>
        <button @click="openDg3(2)">打开图片弹窗1-2</button>
        <br/>
        <button @click="openDg2">打开弹窗2</button>
        <div class="pop" v-show="isShowDg1">
            <div class="content">
                我是弹窗{{dg1Content}}
                <button @click="closeDg1">点我关闭</button>
            </div>
        </div>
        <div class="pop" v-show="isShowDg2">
             <div class="content">
                我是弹窗2
                <button @click="closeDg2">点我关闭</button>
            </div>
        </div>
        <div class="pop" v-show="isShowDg3">
            <div class="content">
                <img :src="img" class="img"/>
                <button @click="closeDg1">点我关闭</button>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped src="./test.less"></style>

<script src="./test.js"></script>
