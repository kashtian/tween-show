<template>
    <div class="game-2048">
        <div class="box-wrapper">
            <div class="grid">
                <div class="item-wrapper" v-for="subArr in arr">
                    <div class="item" v-for="item in subArr"></div>
                </div>
            </div>
            <div class="box-2048">
                <template class="item-wrapper" v-for="subArr in arr">
                    <div :class="{item: true, color: item.value}" :style="{transform: 'translateX(' + item.transX + 'px)'}" v-for="item in subArr">{{item.value || ''}}</div>
                </template>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped src="./game-2048.less"></style>
<script src="./game-2048.js"></script>