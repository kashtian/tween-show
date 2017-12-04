<template>
    <div class="live-stream5">
        <div class="title">video record</div>
        <video autoplay playsinline ref="gum" class="video"></video>
        <video ref="recorded" class="video" controls playsinline @loadedmetadata="onMetadataLoaded"></video>
        <br/>

        <button @click="getMedia" :disabled="!start">打开摄像头</button>&nbsp;&nbsp;
        <button @click="startRecording" :disabled="!startRecord">开始录制</button>&nbsp;&nbsp;
        <button @click="stopRecording" :disabled="!stopRecord">停止录制</button>&nbsp;&nbsp;
        <button @click="playVideo" :disabled="!canPlay">播放</button>&nbsp;&nbsp;
        <button @click="download" :disabled="!canDownload">下载</button>
    </div>
</template>

<script src="./five.js"></script>

