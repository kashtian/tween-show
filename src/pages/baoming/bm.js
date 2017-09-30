import { Picker } from '../../components';

export default {
    name: 'baoming',
    route: {
        path: '/bm',
        title: '报名'
    },

    components: {
        Picker
    },

    data() {
        return {
            info: {}
        }
    },

    methods: {
        baoming() {
            let keys = Object.keys(this.info);
            if (!keys.length) {
                alert('请输入内容');
                return;
            }
            if (_vds) {
                _vds.push(['setCS3', 'name', this.info.name])
                _vds.push(['setCS4', 'tel', this.info.tel])
            }
            console.log('bao ming: ', this.info);
        }
    }
}