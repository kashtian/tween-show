import bezier from '../../tween/cubic-bezier';
import { MatchMan } from '../../matchMan';
import pushMsg from '../../push-msg';
import { pushHost } from '../../../config/sys.config';
import ScreenShot from '../../category/canvas/screenshot';

export default {
    name: 'home',

    route: {
        path: '/',
        title: '首页'
    },

    data() {
      return {
        arr: [1,2,3,4,5,6],
        img: null,
        isloading: false,
        time: 0,
        ssUrl: ''
      }
    },

    mounted() {
        bezier.draw(this.$refs.canvas);
        this.createMatchMan();
        // this.createSocketJS();
        pushMsg.init(this.getAppKey);
        this.ssObj = new ScreenShot();
    },

    methods: {
        ss() {
            this.ssObj.cut(this.$refs.ss)
                .then(url => {
                    this.ssUrl = url;
                });
        },
        upload(event) {
            let file = event.target.files[0];
            let reader = new FileReader();
            this.isloading = true;
            let date = Date.now();
            reader.onloadend = () => {
                this.img = reader.result;
                this.isloading = false;
                this.time = Date.now() - date;
            }
            reader.readAsDataURL(file);
            //this.img = file.
            console.log('event: ', file);
        },

        createMatchMan() {
            let canvas = this.$refs.scene;
            let matchMan = new MatchMan(canvas.getContext('2d'));
        },

        createSocketJS() {
            if (typeof window != undefined) {
                let script = document.createElement('script');
                script.src = 'http://localhost:3010/socket.io/socket.io.js';
                script.onload = () => {
                    this.initSocket();
                }
                document.head.appendChild(script);
            }
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
        },

        getAppKey() {
            return fetch(`//${pushHost}/push/getAppKey`)
                .then(res => res.json())
                .then(res => {
                    if (res.code == 200) {
                        return res.data || {};
                    }
                    return {};
                })
        },

        getInteger(str) {
          if (!str) {
            return 0;
          }
          return parseFloat(str.replace(/[a-z]/g, ''));
        },

        deleteItem(event, index) {
          let el = event.currentTarget,
          itemW = el.offsetWidth,
          itemH = el.offsetHeight,
          itemStyle = window.getComputedStyle(el, null),
          extraW = this.getInteger(itemStyle.marginLeft) + this.getInteger(itemStyle.marginRight),
          extraH = this.getInteger(itemStyle.marginTop) + this.getInteger(itemStyle.marginBottom),
          col = Math.round(el.parentNode.offsetWidth / (itemW + extraW));

          let els = document.querySelectorAll('.test-item');
          for (let i = 0, len = els.length; i < len; i++) {
            els[i].style.transition = '';
            if (i > index) {
              if (i % col != 0) {
                els[i].style.transform = `translateX(${itemW + extraW}px)`;
              } else {
                els[i].style.transform = `translate(${-(itemW + extraW) * (col-1)}px, ${itemH + extraH}px)`;
              }          
            } 
          }
          requestAnimationFrame(() => {
            for (let i = 0, len = els.length; i < len; i++) {              
             if (i > index) {
                els[i].style.transition = `transform 0.5s ${0.3 * (i - index - 1)}s`;  
                els[i].style.transform = '';
             }
            }
          })
          this.arr.splice(index,1);
        }
     }
}