import game2048 from '../../game/2048';
import Vue from 'vue';

export default {
    name: 'game-2048',
    route: {
        path: '/2048',
        title: '2048小游戏'
    },
    data() {
        return {
            arr: []
        }
    },

    mounted() {
        this.init();
        document.addEventListener('touchmove', function(event) {
            event.preventDefault();
        })
    },

    methods: {
        init() {
            let self = this;
            let g2048 = new game2048({
                redraw: (row, col) => {
                    //Vue.set(self.arr[row], col, self.arr[row][col]);
                }
            });
            this.arr = g2048.arr;
        }
    }
}