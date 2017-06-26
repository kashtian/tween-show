import bezier from '../../tween/cubic-bezier';
import pushMsg from '../../push-msg';

export default {
    name: 'home',

    route: {
        path: '/',
        title: '首页'
    },

    mounted() {
        bezier.draw(this.$refs.canvas);
        pushMsg.init(this.getAppKey);
    },

    methods: {
        getAppKey() {
            return fetch('http://localhost:3010/crypto/appServerKey')
                .then(res => res.json())
                .then(res => {
                    if (res.code == 200) {
                        return res.data || {};
                    }
                    return {};
                })
        }
    }
}