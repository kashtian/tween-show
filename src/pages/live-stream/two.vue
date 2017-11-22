<template>
    <div class="live-stream2">
        <div class="title">data exchange文本演示</div>
        <textarea ref="textSend" class="text-area"></textarea>
        <textarea ref="textReceive" class="text-area"></textarea>
        <br/>
        <button type="button" @click="createConnection" :disabled="!startStatus">Start</button>&nbsp;&nbsp;
        <button type="button" @click="sendData" :disabled="!sendStatus">Send</button>&nbsp;&nbsp;
        <button type="button" @click="closeDataChannels" :disabled="!stopStatus">Stop</button>
    </div>
</template>

<script src="./two.js"></script>
