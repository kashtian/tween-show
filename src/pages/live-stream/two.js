export default {
    name: 'live-stream2',

    methods: {
        createConnection() {
            var servers = null,
                pcConstraint = null,
                dataConstraint = null;

            this.localConnection = new RTCPeerConnection(servers, pcConstraint);
            // 当RTCICECandidate对象被添加时触发
            this.localConnection.onicecandidate = this.createIceCandidateFn(this.localConnection);

            this.sendChannel = this.localConnection.createDataChannel('sendDataChannel', dataConstraint);   
            this.sendChannel.onopen = this.traceChannelState;
            this.sendChannel.onclose = this.traceChannelState;

            this.remoteConnection = new RTCPeerConnection(servers, pcConstraint);
            this.remoteConnection.onicecandidate = this.createIceCandidateFn(this.remoteConnection);
            // 当一个RTCDataChannel被添加到连接时触发
            this.remoteConnection.ondatachannel = event => {
                this.receiveChannel = event.channel;
                this.receiveChannel.onmessage 
            }
        },

        // 记录信道状态
        traceChannelState() {
            console.log('Send channel state is: ', this.sendChannel.readyState);
        },

        // 给peer connection对象生成onicecandidate事件
        createIceCandidateFn(connection) {
            return event => {
                if (event.candidate) {
                    connection.addIceCandidate(
                        event.candidate
                    )
                }
            }
            
        }
    }
}