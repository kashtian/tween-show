<template>
    <div class="live-stream-page">

        <div class="step-one">
            省略step one(只演示了getUserMedia,step two有)
        </div>

        <div class="step-two">
            <div class="title">peer to peer 本地演示</div>
            <video autoplay playsinline ref="two_video_1" class="video" @loadedmetadata="traceMetadata('video1')">我发起了视频聊天</video>
            <video autoplay playsinline ref="two_video_2" class="video" @resize="video2Resize" @loadedmetadata="traceMetadata('video2')">我接收了视频</video>
            <br/>
            <button @click="start">start</button>&nbsp;&nbsp;
            <button @click="call">call</button>&nbsp;&nbsp;
            <button @click="hangup">hang up</button>
        </div>

        <live-stream2 />
        <live-stream3 />
        <live-stream4 />
        <live-stream5 />
    </div>
</template>

<style lang="less">
.live-stream-page {
    .video {
        width: 50%;
        height: 200px;
    }
    .title {
        background-color: silver;
        text-align: center;
    }
    .text-area {
        width: 45%;
        border: 1px solid black;
    }
}
</style>

<script src="./live.js"></script>
