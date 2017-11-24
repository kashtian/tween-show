import LiveStream2 from './two.vue';
import LiveStream3 from './three.vue';
import LiveStream4 from './four.vue';

export default {
    name: 'live-stream',

    route: {
        path: '/liveStream',
        title: '直播'
    },

    components: {
        LiveStream2,
        LiveStream3,
        LiveStream4
    },

    data() {
        return {
            stream: null,
            p2pPoints: []
        }
    },

    mounted() {
    },

    methods: {
        // 通过navigator.getUserMedia方法获取媒体流
        getMedia(constraints) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                return Promise.reject('not supported getUserMedia')
            }
            return navigator.mediaDevices.getUserMedia(Object.assign({
                audio: false,
                video: true
            }, constraints)).then(stream => {
                this.trace('received local stream: ', stream);
                this.setStreamToEle(this.$refs.two_video_1, stream);
                this.localStream = stream;
            }).catch(err => console.error('get media error: ', err))
        },

        // 根据不同情况对video元素添加视频
        setStreamToEle(ele, stream) {
            if (!ele || !stream) {
                return;
            }
            // if (window.URL) {
            //     ele.src = window.URL.createObjectURL(stream);
            // } else {
            //     ele.srcObject = stream;
            // }
            ele.srcObject = stream;
        },

        stopVideo(stream) {
            stream.getVideoTracks()[0].stop();
        },

        // 记录通常是navigationStart事件发生时刻到调用该方法时刻的秒数
        trace(text) {
            if (window.performance) {
                let now = (window.performance.now() / 1000).toFixed(3);
                console.log(`${now}: ${text}`)
            } else {
                console.log(text)
            }
        },

        // 记录video的元数据(如分辨率和时长)加载时的时长
        traceMetadata(name) {
            this.trace(`${name} loadedmetadata!!!`)
        },

        video2Resize() {
            this.trace('video2 size change');
        },

        // 开始录制视频
        start() {
            this.trace('requesting local stream')
            this.getMedia()
        },

        // 发起视频邀请
        call() {
            this.trace('starting call');
            // 此处server没有设置，需要指定STUN and TURN servers;
            let servers = null;

            this.pc1 = new RTCPeerConnection(servers);
            this.pc1.name = 'pc1';
            this.p2pPoints.push(this.pc1);
            this.trace('created local peer connection object pc1');
            this.pc1.onicecandidate = e => {
                this.onIceCandidate(this.pc1, e);
            }

            this.pc2 = new RTCPeerConnection(servers);
            this.pc2.name = 'pc2';
            this.p2pPoints.push(this.pc2);
            this.trace('created remote peer connection object pc2');
            this.pc2.onicecandidate = e => {
                this.onIceCandidate(this.pc2, e);
            }

            this.pc1.oniceconnectionstatechange = e => {
                this.onIceStateChange(this.pc1, e)
            }
            this.pc2.oniceconnectionstatechange = e => {
                this.onIceStateChange(this.pc2, e)
            }

            this.pc2.onaddstream = event => {
                this.remoteStream = event.stream;
                this.setStreamToEle(this.$refs.two_video_2, event.stream);
                this.trace('pc2 received remote stream')
            }

            this.pc1.addStream(this.localStream);
            this.trace('add local stream to pc1');

            this.trace('pc1 createOffer start')
            this.pc1.createOffer({
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            }).then(this.onCreateOfferSuccess, err => {
                this.trace(`failed to create seesion description, error: ${err}`)
            })
        },

        getOtherPCs(pc) {
            return this.p2pPoints.filter(v => {
                return v != pc;
            })
        },

        // 给除自己外的各pc添加交互连接信息
        onIceCandidate(pc, event) {
            if (event.candidate) {
                this.trace(`${pc.name} ICE candidate: ${event.candidate}`)
                let others = this.getOtherPCs(pc);
                others.forEach(item => {
                    item.addIceCandidate(
                        new RTCIceCandidate(event.candidate)
                    ).then(() => {
                        this.trace(item.name + ' addIceCandidate success')
                    }, err => {
                        this.trace(`${item.name} addIceCandidate failed, error: ${err}`)
                    })
                })
            }
        },

        onIceStateChange(pc, event) {
            if (pc) {
                this.trace(`${pc.name} ICE state: ${pc.icConnectionState}`)
            }
        },

        onCreateOfferSuccess(desc) {
            this.trace('from pc1 sdp: ' + desc.sdp);
            this.pc1.setLocalDescription(desc)
                .then(() => {
                    this.trace('pc1 set local description success')
                }, err => {
                    console.log('set session description failed: ', err)
                })

            this.pc2.setRemoteDescription(desc)
                .then(() => {
                    this.trace('pc2 set remote description success')
                }, err => {
                    console.log('set session description failed: ', err)
                })

            this.pc2.createAnswer().then(this.onCreateAnswerSuccess, err => {
                console.log('cteate answer error: ', err)
            })
        },

        onCreateAnswerSuccess(desc) {
            this.trace('from pc2 sdp: ' + desc.sdp);
            this.pc2.setLocalDescription(desc)
                .then(() => {
                    this.trace('pc2 set local description success')
                }, err => {
                    console.log('set session description failed: ', err)
                })

            this.pc1.setRemoteDescription(desc)
                .then(() => {
                    this.trace('pc1 set remote description success')
                }, err => {
                    console.log('set session description failed: ', err)
                })
        },

        hangup() {
            this.trace('ending call');
            this.pc1.close();
            this.pc2.close();
            this.pc1 = null;
            this.pc2 = null;
        }
    }
}