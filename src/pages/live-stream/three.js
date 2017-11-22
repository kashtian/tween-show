export default {
    name: 'live-stream3',

    mounted() {
        this.createSocketJS();
    },

    beforeRouteLeave() {
        this.sendMsg('bye');
    },

    methods: {
        createSocketJS() {
            if (typeof window != undefined) {
                let script = document.createElement('script');
                script.src = '/socket.io/socket.io.js';
                script.onload = () => {
                    
                }
                document.head.appendChild(script);
            }
        },

        startConnection() {
            this.initSocket();
            this.getMedia();
        },

        initSocket() {
            if (this.isInit) {
                this.socket.emit('createOrJoin', room);
                return;
            }
            this.isInit = true;
            let socket = this.socket = io.connect();
            let room = 'test';

            if (!room) {
                return;
            } 
            socket.emit('createOrJoin', room);
            console.log('Attempted to create or join room: ', room);
            
            socket.on('created', room => {
                console.log('Created room ' + room);
                this.isInitiator = true;
            })

            socket.on('join', room => {
                console.log('Another peer made a request to join room: ', room);
                this.isChannelReady = true;
            })

            socket.on('joined', room => {
                console.log('joined: ', room);
                this.isChannelReady = true;
            })

            socket.on('full', room => {
                console.log(`Room ${room} is full`);
            })

            socket.on('ready', () => {
                console.log('all peer ready')
            })

            // 客户端通过服务的socket交换信息（自己发送的消息自己不会收到)
            socket.on('message', message => {
                console.log('Client received message: ', message);
                if (message == 'gotUserMedia') {
                    this.maybeStart();
                } else if (message.type == 'offer') {
                    if (!this.isInitiator && !this.isStarted) {
                        this.maybeStart();
                    }
                    this.pc.setRemoteDescription(new RTCSessionDescription(message));
                    this.doAnswer();
                } else if (message.type == 'answer' && this.isStarted) {
                    this.pc.setRemoteDescription(new RTCSessionDescription(message));
                } else if (message.type == 'candidate' && this.isStarted) {
                    this.pc.addIceCandidate(
                        // 为什么不直接用new RTCIceCandidate(event.candidate)
                        // new RTCIceCandidate({
                        //     sdpMLineIndex: message.label,
                        //     candidate: message.candidate
                        // })
                        // 感觉直接用new RTCIceCandidate(event.candidate)效果会清晰许多
                        new RTCIceCandidate(message.content)
                    )
                } else if (message == 'bye' && this.isStarted) {
                    this.hangup();
                }
            })
        },

        sendMsg(message) {
            console.log('Client sending message: ', message);
            this.socket.emit('message', message);
        },

        maybeStart() {
            console.log('>>>>>> maybeStart', this.isStarted, this.localStream, this.isChannelReady);
            if (!this.isStarted && this.localStream && this.isChannelReady) {
                console.log('>>>>>>>> creating peer connection: ');
                this.pc = new RTCPeerConnection(null);
                this.pc.onicecandidate = event => {
                    if (event.candidate) {
                        console.log('>>>>>>> pc oncandidate: ', event)
                        this.sendMsg({
                            type: 'candidate',
                            content: event.candidate
                            // label: event.candidate.sdpMLineIndex,
                            // id: event.candidate.sdpMid,
                            // candidate: event.candidate.candidate
                        })
                    } else {
                        console.log('end of candidates=====>')
                    }
                };

                // fire on remote stream added
                this.pc.onaddstream = event => {
                    console.log('Remote stream added.')
                    this.setStreamToEle(this.$refs.remoteVideo, event.stream);
                    this.remoteStream = event.stream;
                };

                this.pc.onremovestream = event => {
                    console.log('Remote stream removed. Event: ', event);
                };

                this.pc.addStream(this.localStream);
                this.isStarted = true;
                if (this.isInitiator) {
                   this.doCall();
                }
            }
        },

        doCall() {
            console.log('Sending offer to peer');
            this.pc.createOffer({
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            }).then(this.setLocalAndSendMsg, err => {
                console.error('create offer error: ', err)
            })
        },

        doAnswer() {
            console.log('Sending answer to peer.')
            this.pc.createAnswer().then(this.setLocalAndSendMsg, err => {
                console.error('create answer error: ', err)
            })
        },

        setLocalAndSendMsg(sessionDescription) {
            console.log('set local and sendMsg')
            this.pc.setLocalDescription(sessionDescription).then(() => {
                console.log('set local description success')
            }, err => {
                console.log('set local description failed, error: ', err)
            })
            this.sendMsg(sessionDescription)
        },

        hangup() {
            console.log('Session terminated.');
            this.isStarted = false;
            this.pc.close();
            this.pc = null;
            this.isInitiator = false;
            this.$refs.localVideo.srcObject = null;
            this.$refs.remoteVideo.srcObject = null;
        },

        getMedia(constraints) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                return Promise.reject('not supported getUserMedia')
            }
            return navigator.mediaDevices.getUserMedia(Object.assign({
                audio: false,
                video: true
            }, constraints)).then(stream => {
                console.log('received local stream: ', stream);
                this.setStreamToEle(this.$refs.localVideo, stream);
                this.localStream = stream;
                this.sendMsg('gotUserMedia');
                if (this.isInitiator) {
                    this.maybeStart();
                }
            }).catch(err => console.error('get media error: ', err))
        },

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
    }
}