<template>
    <div class="cubic-bezier">
        <canvas ref="cubic"></canvas>
        <div class="control-box" :style="{width: opts.width + opts.unit, height: opts.height + opts.unit}">
            <div class="control-point p1"></div>
            <div class="control-point p2"></div>
        </div>
    </div>
</tempalte>

<style lang="less" src="./cubic.less"></style>
<script src="./cubic.js"></script>