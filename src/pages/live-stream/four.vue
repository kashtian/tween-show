<template>
    <div class="live-stream4">
        <div class="title">take photo to friend</div>
        <video autoplay playsinline ref="camera" @loadedmetadata="onMetadataLoaded" class="video"></video>
        <canvas ref="photo" class="video"></canvas>
        <br/>

        <div ref="received"></div>

        <button @click="startConnection" :disabled="!startBtnStatus">start</button>&nbsp;&nbsp;
        <button :disabled="!snapBtnStatus" @click="snapPhoto">snap</button>&nbsp;&nbsp;
        <button :disabled="!sendBtnStatus" @click="sendPhoto">send</button>&nbsp;&nbsp;
        <button :disabled="!stopBtnStatus" @click="sendMessage('bye')">hang up</button>
    </div>
</template>

<script src="./four.js"></script>

