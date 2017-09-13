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
            isShowDg3: false,
            isShowDg4: false,
            img: null,
            type: 'one',
            dg1Content: '',
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

        openDg3(type) {
            this.isShowDg3 = true;
            if (type == 1) {
                this.img = require('./img/one.png');
            } else {
                this.img = require('./img/two.png');
            }
        },

        closeDg3() {
            this.isShowDg3 = false;
        },

        openDg4(type) {
            this.isShowDg4 = true;
            this.type = type;
        },

        closeDg4() {
            this.isShowDg4 = false;
        },
        
    }
}