import bezier from '../../tween/cubic-bezier';
import { MatchMan } from '../../matchMan';

export default {
    name: 'home',

    route: {
        path: '/',
        title: '首页'
    },

    mounted() {
        bezier.draw(this.$refs.canvas);
        this.createMatchMan();
        if (typeof window != undefined) {
            let script = document.createElement('script');
            script.src = 'http://localhost:3010/socket.io/socket.io.js';
            script.onload = () => {
                this.initSocket();
            }
            document.head.appendChild(script);
        }
    },

    methods: {
        createMatchMan() {
            let canvas = this.$refs.scene;
            let matchMan = new MatchMan(canvas.getContext('2d'));
        },

        initSocket() {
            let socket = io.connect('http://localhost:3010');

            socket.on('clientTest', () => {
                this.notice();
            })

            socket.emit('test');

            Notification.requestPermission().then(result => {
                console.log('user attitude: ', result);
            })
        },

        notice() {
            let n = new Notification(`消息通知`, {    
                body: `当前时间：${new Date().toLocaleString()}`
            });
        }
     }
}