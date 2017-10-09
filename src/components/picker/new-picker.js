export default {
    name: 'picker',

    props: ['list', 'value', 'options'],

    data() {
        return {
            arr: this.initList(),
            opts: Object.assign({
                itemH: 30,  // 每个元素的高度
                r: 100      // 半径
            }, this.options),
            boxStyle: null,
            curIndex: 0,
            scrollY: 0,     // 已经滚动的值
            realY: 0      // 实时滚动值
        }
    },

    methods: {
        // 遍历数组，设置每个元素的style, 形成以x为轴的圆形
        initList() {
            if (!Array.isArray(this.list)) {
                return [];
            }
            let deg = this.getUnitDeg(),
                obj = {};

            return this.list.map((v, i) => {
                obj.hidden = (deg * i > 180);
                obj.deg = deg * i;
                obj.style = `transform: rotateX(${-deg * i}deg) translateZ(${this.opts.r}px);`;
                return Object.assign({}, v, obj)
            })
        },

        // 根据列表元素的高度和半径，算出单位角度
        getUnitDeg() {
            return Math.ceil(Math.asin(this.itemH / 2 / this.r) * 2 * 180 / Math.PI);
        },

        start(event) {

        }
    
    }
}