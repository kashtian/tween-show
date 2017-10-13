<template>
    <div class="dir-picker" @touchstart="start" @touchmove="move" @touchend="end" :style="{height: this.opts.r * 2 + 'px'}">
        <ul class="list-wrapper" :style="boxStyle">
            <li class="item" :class="{hidden: !(item.deg > Math.abs(realY) -  180 && item.deg < Math.abs(realY) + 180)}" v-for="(item,index) in arr" :key="item.value" :style="item.style">{{item.value}}</li>
        </ul>
        <div class="mask-wrapper" :style="{transform: 'translateZ(' + this.opts.r + 'px)'}">
            <div class="mask" :style="{height: (this.opts.r * 2 - this.opts.itemH - 2) / 2 + 'px'}"></div>
            <div class="line" :style="{height: this.opts.itemH + 'px'}"></div>
            <div class="mask reverse" :style="{height: (this.opts.r * 2 - this.opts.itemH - 2) / 2 + 'px'}"></div>
        </div>
    </div>
</template>

<style lang="less">
    .dir-picker {
        position: relative;
        background: rgba(120, 144, 160, 0.5);
        .mask-wrapper {
            position: absolute;
            z-index: 2;
            top: 0px;
            width: 100%;
            height: 100%;
            .mask {
                background-image: linear-gradient(180deg, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.1));
                &.reverse {
                    background-image: linear-gradient(0deg, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.1));
                }
            }
        }
        .line {
            border: 1px solid #aba9a9;
            border-width: 1px 0px;
        }
        .list-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            margin: 0px;
            padding: 0px;
            transform-style: preserve-3d;
            .item {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 50%;
                left: 0px;
                width: 100%;
                list-style: none;
                backface-visibility: hidden;
                visibility: visible;
                &.hidden {
                    visibility: hidden;
                }
            }
        }
    }
</style>

<script src="./picker.js"></script>