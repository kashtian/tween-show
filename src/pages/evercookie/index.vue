<template>
  <div class="cookie-test">
      <div>cookie test</div>
      <div @click="setCookie">设置cookie</div>
      <div @click="log">打印cookie</div>
      <div @click="deleteCookie">删除cookie</div>
      <div @click="setEc">设置evercookie</div>
      <div @click="getEc">获取evercookie</div>
      <div @click="setStorage">设置localStorage</div>
      <div @click="getStorage">获取localStorage</div>
      <div @click="clearStorage">清除localStorage</div>
      <div>your browser's fingerprint: {{uid}}</div>
      <div @click="postInfo">上传hash值</div>
  </div>
</template>

<script>
    export default {
        name: 'evercookie',

        route: {
            path: '/cookie',
            title: '僵尸cookie'
        },

        data() {
            return {
                uid: ''
            }
        },

        mounted() {
            let script = document.createElement('script');
            script.src = '/js/swfobject-2.2.min.js';
            script.onload = () => {
                let script2 = document.createElement('script');
                script2.src = '/js/evercookie.js';
                script2.onload = () => {
                    this.ec = new evercookie();
                }   
                document.body.appendChild(script2);             
            }

            document.body.appendChild(script);

            const fp2 = require('fingerprintjs2')
            new fp2({
                excludeUserAgent: true,
                excludeSessionStorage: true,
                excludeIndexedDB: true,
                excludeOpenDatabase: true,
                excludeCanvas: true,
                excludeWebGL: true
            }).get((result, components) => {
                this.uid = result;
                console.log('result: ', result); //a hash, representing your device fingerprint
                console.log('components: ', components); // an array of FP components
                this.componentsInfo = components
            });
            
        },

        methods: {
            postInfo() {
                fetch('/test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        hash: JSON.stringify(this.componentsInfo)
                    }),
                })
            },

            loadScript(arr, cb) {
                let script = null;
                arr.forEach(v => {
                    script = document.createElement('script');
                    script.src = v;
                    script.onload = cb;
                    document.body.appendChild(script);
                })
            },

            log() {
                console.log('cookie: ', this.getFormatCookie())
            },

            getFormatCookie() {
                let cookieArr = document.cookie.split(';');
                return cookieArr.join('\n\n').replace(/(=)/g, ' $1 ');
            },

            setCookie() {
                document.cookie = 'time=' + Date.now();
            },

            deleteCookie() {
                let date = new Date();
                date.setTime(date.getTime() -1);
                document.cookie = `time=${this.getCookie('time')};expires=${date.toGMTString()}`
            },

            getCookie(name) {
                let reg = new RegExp(`${name}=(\\S+)`);
                let matchArr = document.cookie.match(reg);
                if (matchArr) {
                    return matchArr[1];
                }
                return ''
            },

            setEc() {
                let dateStr = Date.now() + '';
                console.log('set ec time: ', dateStr);
                this.ec.set('ectime', dateStr);
            },

            getEc() {
                this.ec.get('ectime', value => {
                    console.log('get ec: ', value);
                })
            },

            setStorage() {
                let dateStr = Date.now() + '';
                localStorage.lsTime = dateStr;
                console.log('set lsTime:', dateStr)
            },

            getStorage() {
                console.log('localStorage: ', localStorage)
            },
            
            clearStorage() {
                localStorage.clear();
            }
        }
    }
</script>

<style lang="less">
    .cookie-test {
        div {
            margin-top: 10px;
        }
    }
</style>
