import bezier from '../../tween/cubic-bezier';

export default {
    name: 'home',

    route: {
        path: '/',
        title: '首页'
    },

    mounted() {
        bezier.draw(this.$refs.canvas);
    }
}