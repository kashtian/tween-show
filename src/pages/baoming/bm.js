import Picker from '@/components/picker/new';

export default {
    name: 'baoming',
    route: {
        path: '/picker',
        title: '选择器'
    },

    components: {
        Picker
    },

    created() {
        this.initList();
    },

    data() {
        return {
            info: {},
            pList: [],
            pickerVal: 50
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
        },

        initList() {
            for (let i = 0; i <= 50; i++) {
                this.pList.push(i);
            }
        },
    }
}