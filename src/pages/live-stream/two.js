export default {
    name: 'live-stream2',

    data() {
        return {
            startStatus: true,
            sendStatus: false,
            stopStatus: false
        }
    },

    methods: {
        // 创建连接
        createConnection() {
            var servers = null,
                pcConstraint = null,
                dataConstraint = null;

            this.localConnection = new RTCPeerConnection(servers, pcConstraint);
            this.sendChannel = this.localConnection.createDataChannel('sendDataChannel', dataConstraint);   

            // 当RTCICECandidate对象被添加时触发(交换信息时触发)
            this.localConnection.onicecandidate = this.createIceCandidateFn(() => this.remoteConnection, 'local');
            // 当两个connection对象那个都添加了彼此的iceCandidate后触发open事件
            this.sendChannel.onopen = this.traceChannelState.bind(this, 'Send');
            this.sendChannel.onclose = this.traceChannelState.bind(this, 'Send');

            this.remoteConnection = new RTCPeerConnection(servers, pcConstraint);
            this.remoteConnection.onicecandidate = this.createIceCandidateFn(() => this.localConnection, 'remote');
            /**
             * 当一个RTCDataChannel被添加到连接时触发
             * (当远方伙伴调用createDataChannel时该事件被添加到连接中，open时会触发该事件)
             */
            this.remoteConnection.ondatachannel = event => {
                console.log('remote datachannel callback')
                this.receiveChannel = event.channel;
                this.receiveChannel.onmessage = msgEvent => {
                    this.$refs.textReceive.value = msgEvent.data;
                };
                this.receiveChannel.onopen = this.traceChannelState.bind(this, 'Receive');
                this.receiveChannel.onclose = this.traceChannelState.bind(this, 'Receive');
            }

            this.localConnection.createOffer().then(
                desc => {
                    this.localConnection.setLocalDescription(desc);
                    this.remoteConnection.setRemoteDescription(desc);
                    this.remoteConnection.createAnswer().then(rDesc => {
                        this.remoteConnection.setLocalDescription(rDesc);
                        this.localConnection.setRemoteDescription(rDesc);
                    }, err => console.error('create answer error: ', err))
                },
                err => console.error('create offer error: ', err)
            )

            this.startStatus = false;
            this.stopStatus = true;
        },

        sendData() {
            this.sendChannel.send(this.$refs.textSend.value);
            console.log('send data: ', this.$refs.textSend.value)
        },

        closeDataChannels() {
            console.log('close data channels');
            this.sendChannel.close();
            this.receiveChannel.close();
            this.localConnection.close();
            this.remoteConnection.close();
            this.localConnection = null;
            this.remoteConnection = null;
            this.startStatus = true;
            this.sendStatus = false;
            this.stopStatus = false;
        },

        // 记录信道状态
        traceChannelState(type) {
            if (type == 'Send' && this.sendChannel.readyState == 'open') {
                this.sendStatus = true;
            }
            console.log(`${type} channel state is: `, this.sendChannel.readyState);
        },

        // 给peer connection对象生成onicecandidate事件
        createIceCandidateFn(getConnection, name) {
            return event => {
                if (event.candidate) {
                    getConnection().addIceCandidate(
                        event.candidate
                    ).then(() => {
                        console.log(`${name} ice candidate emit`)
                    }, err => {
                        console.log('ice candidate error: ', err)
                    })
                }
            }            
        }
    }
}