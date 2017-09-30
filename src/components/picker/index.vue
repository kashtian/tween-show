<template>
    <div class="dir-picker" @touchstart="start" @touchmove="move" @touchend="end">
        <div class="line"></div>
        <ul class="list-wrapper" :style="boxStyle">
            <li class="item" :class="{active: index == curIndex ,hidden: !(item.deg > Math.abs(realDis) -  180 && item.deg < Math.abs(realDis) + 180)}" v-for="(item,index) in test" :key="item.value" :style="item.style">{{item.value}}</li>
        </ul>
    </div>
</template>

<style lang="less">
    .dir-picker {
        position: relative;
        background: silver;
        .line {
            position: absolute;
            top: 50%;
            width: 100%;
            height: 30px;
            margin-top: -16px;
            border: 1px solid yellow;
            border-width: 1px 0px;
        }
        .list-wrapper {
            position: relative;
            width: 200px;
            height: 200px;
            transform-style: preserve-3d;
            .item {
                position: absolute;
                top: 50%;
                width: 100%;
                height: 30px;
                margin-top: -15px;
                line-height: 30px;
                list-style: none;
                backface-visibility: hidden;
                visibility: visible;
                &.active {
                    color: red;
                }
                &.hidden {
                    visibility: hidden;
                }
            }
        }
    }
</style>

<script src="./picker.js"></script>