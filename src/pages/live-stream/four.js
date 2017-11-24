export default {
    name: 'live-stream4',

    data() {
        return {
            startBtnStatus: true,
            sendBtnStatus: false,
            stopBtnStatus: false,
            snapBtnStatus: false
        }
    },

    mounted() {
        this.createSocketJS();
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
            this.startBtnStatus = false;
            this.stopBtnStatus = true;
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
            let room = 'live_stream_4';

            if (!room) {
                return;
            } 
            socket.emit('createOrJoin', room);
            console.log('Attempted to create or join room: ', room);

            socket.on('created', room => {
                console.log('Created room ' + room);
                this.isInitiator = true;
            })

            socket.on('joined', (room, clientId) => {
                console.log(`${clientId} joined room ${room}`)
            })

            socket.on('full', room => {
                console.log(`Room ${room} is full`);
            })

            socket.on('ready', () => {
                this.createPeerConnection();
                console.log('all peer ready, start connection')
            })
            
            socket.on('message', message => {
                if (message.type == 'offer') {
                    this.peerConnection.setRemoteDescription(message);
                    this.peerConnection.createAnswer().then(desc => {
                        this.peerConnection.setLocalDescription(desc);
                        this.sendMessage(desc)
                    })
                } else if (message.type == 'answer') {
                    this.peerConnection.setRemoteDescription(message);
                } else if (message.type == 'candidate') {
                    this.peerConnection.addIceCandidate(message.content)
                        .then(() => console.log('add ice candidate success'))
                        .catch(err => console.error('add ice faild, error: ', err))
                } else if (message == 'bye') {
                    this.hangup();
                }
            })
        },

        createPeerConnection() {
            let servers = null;

            this.peerConnection = new RTCPeerConnection(servers);
            this.peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    this.sendMessage({
                        type: 'candidate',
                        content: event.candidate
                    })
                }
            }

            if (this.isInitiator) {
                this.dataChannel = this.peerConnection.createDataChannel('photos');
                this.addDataChannelEvent();
                this.peerConnection.createOffer().then(desc => {
                    this.peerConnection.setLocalDescription(desc);
                    this.sendMessage(desc);
                }).catch(err => console.error('create offer error: ', err))
            } else {
                this.peerConnection.ondatachannel = event => {
                    this.dataChannel = event.channel;
                    this.addDataChannelEvent();
                }
            }
        },

        addDataChannelEvent() {
            this.dataChannel.onopen = () => {
                this.sendBtnStatus = true;
                console.log('data channel state is: ', this.dataChannel.readyState)                                
            }
            this.dataChannel.onclose = () => {
                this.sendBtnStatus = false;
                console.log('data channel state is: ', this.dataChannel.readyState)
            }
            this.dataChannel.onmessage = event => {
                empty();
            }
        },

        sendMessage(message) {
            console.log('Client sending message: ', message);
            this.socket.emit('message', message);
        },

        hangup() {
            console.log('Session terminated.');
            this.peerConnection && this.peerConnection.close();
            this.peerConnection = null;
            this.isInitiator = false;
            this.$refs.camera.srcObject = null;
            this.startBtnStatus = true;
            this.stopBtnStatus = false;
            this.snapBtnStatus = false;
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
                this.setStreamToEle(this.$refs.camera, stream);
            }).catch(err => console.error('get media error: ', err))
        },

        setStreamToEle(ele, stream) {
            if (!ele || !stream) {
                return;
            }
            ele.srcObject = stream;
        },

        onMetadataLoaded() {
            this.snapBtnStatus = true;
            this.$refs.photo.width = this.pw = this.$refs.camera.videoWidth;
            this.$refs.photo.height = this.ph = this.$refs.camera.videoHeight;
        },

        snapPhoto() {
            let ctx = this.$refs.photo.getContext('2d');
            ctx.drawImage(this.$refs.camera, 0, 0, this.pw, this.ph)
        }, 

        sendPhoto() {

        }
    }
}