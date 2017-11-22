<template>
    <div class="live-stream3">
        <div class="title">socket + webRTC</div>
        <video autoplay playsinline ref="localVideo" class="video"></video>
        <video autoplay playsinline ref="remoteVideo" class="video"></video>
        <button @click="startConnection">开始连线</button>
        <button @click="sendMsg('bye')">挂断</button>
    </div>
</template>

<script src="./three.js"></script>
