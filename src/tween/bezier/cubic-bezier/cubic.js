export default {
    name: 'cubic-bezier',

    props: {
        options: Object
    },

    data() {
        return {
            opts: Object.assign({
                width: 200,
                height: 200,
                unit: 'px'
            }, this.options)
        }
    },

    methods: {
        init() {
            let canvas = this.$refs.cubic;
            canvas.width = this.opts.width;
            canvas.height = this.opts.height;
            this.ctx = canvas.getContext('2d');
        }
    }
}