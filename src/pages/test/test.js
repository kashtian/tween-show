export default {
    name: 'test',

    route: {
        path: '/test',
        title: '测试页面'
    },

    data() {
        return {
            isShowDg1: false,
            isShowDg2: false,
            dg1Content: ''
        }
    },

    methods: {
        openDg1(content) {
            this.isShowDg1 = true;
            this.dg1Content = content;
        },

        closeDg1() {
            this.isShowDg1 = false;
        },

        openDg2() {
            this.isShowDg2 = true;
        },

        closeDg2() {
            this.isShowDg2 = false;
        },
        
    }
}