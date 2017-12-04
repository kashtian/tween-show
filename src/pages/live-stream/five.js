export default {
    name: 'live-stream5',

    data() {
        return {
            start: true,
            startRecord: false,
            stopRecord: false,
            canDownload: false,
            canPlay: false
        }
    },

    mounted() {
        
    },

    methods: {
        getMedia(constraints) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                return Promise.reject('not supported getUserMedia')
            }
            return navigator.mediaDevices.getUserMedia(Object.assign({
                audio: false,
                video: true
            }, constraints)).then(stream => {
                this.start = false;
                this.startRecord = true;
                this.localStream = stream;
                console.log('received local stream: ', stream);
                this.setStreamToEle(this.$refs.gum, stream);
            }).catch(err => console.error('get media error: ', err))
        },

        setStreamToEle(ele, stream) {
            if (!ele || !stream) {
                return;
            }
            ele.srcObject = stream;
        },

        startRecording() {
            this.recordedBlobs = [];
            this.mimeType = this.getVideoMime();
            let options = {
                mimeType: this.mimeType
            };
            try {
                this.mRecorder = new MediaRecorder(this.localStream, options)
            } catch (e) {
                console.error('Exception while creating MediaRecorder: ', e);
                return;
            }
            this.mRecorder.onstop = () => {
                console.log('recorder stoped.');
            }
            this.mRecorder.ondataavailable = event => {
                console.log('recorder data available: ', event.data);
                if (event.data && event.data.size > 0) {
                    this.canDownload = true;
                    this.canPlay = true;
                    this.recordedBlobs.push(event.data);
                }
            }
            // 按10ms分割成单独的区块
            this.mRecorder.start(10);
            this.startRecord = false;
            this.stopRecord = true;
            console.log('media recorder started.');
        },

        stopRecording() {
            this.mRecorder.stop();
            this.startRecord = true;
            this.stopRecord = false;
        },

        playVideo() {
            let superBuffer = new Blob(this.recordedBlobs, {
                type: this.mimeType
            });
            this.$refs.recorded.src = window.URL.createObjectURL(superBuffer);
        },

        onMetadataLoaded() {
            console.log('video duration: ', this.$refs.recorded.duration);
        },

        download() {
            let blob = new Blob(this.recordedBlobs, {
                type: this.mimeType
            });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'test.webm';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100)
        },

        getVideoMime() {
            let mimes = [
                'video/webm;codecs=vp9',
                'video/webm;codecs=vp8',
                'video/webm'
            ]
            for (let i = 0, len = mimes.length; i < len; i++) {
                if (MediaRecorder.isTypeSupported(mimes[i])) {
                    console.log('video mime type is: ', mimes[i])
                    return mimes[i];
                }
            }
            console.log('video mime type is: empty');
            return '';
        }
    }
}