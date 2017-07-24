export default class Game2048 {
    constructor(options) {
        this.arr = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        this.ePos = [];  // empty value postion

        this.opts = Object.assign({
            box: '.box-2048',
            min: 2,
            row: 4,
            el: '.item',
            time: 3000
        }, options);

        this.init();
    }

    getInteger(str) {
        if (!str) {
        return 0;
        }
        return parseFloat(str.replace(/[a-z]/g, ''));
    }

    getItemW() {
        let el = document.querySelector(this.opts.box + ' ' + this.opts.el);
        let itemStyle = window.getComputedStyle(el, null);
        return el.offsetWidth + this.getInteger(itemStyle.marginLeft) + this.getInteger(itemStyle.marginRight);
    }

    init() {
        this.initArr();
        this.initPos();
        this.initEvent();
        for (let i = 0; i < 2; i++) {
            this.setEmptyValue();
        }
    }

    initArr() {
        this.arr = [];
        for (let i = 0; i < this.opts.row; i++) {
            this.arr.push([]);
            for (let j = 0; j < this.opts.row; j++) {
                this.arr[i].push({
                    value: 0
                })
            }
        }
    }

    // 将数组元素的位置（row,col）存入ePos数组
    initPos() {
        this.arr.forEach((item, i) => {
            item.forEach((v, j) => {
                !v.value && this.ePos.push(`${i},${j}`);
            })
        })
    }

    initEvent() {
        let box = document.querySelector(this.opts.box);
        box.addEventListener('touchstart', (event) => {

        });
        box.addEventListener('touchend', (event) => {
            this.move(this.arr);
        })
    }

    setEmptyValue() {
        if (!this.ePos.length) {
            // @need game over judge
            return;
        }
        let i = Math.floor(Math.random() * this.ePos.length),
            pos = this.ePos[i].split(',');

        this.arr[pos[0]][pos[1]].value = this.opts.min;
        this.ePos.splice(i, 1);
    }

    // 往左滑正，往右反；往上滑正，往下滑反。
    move(wholeArr, reverse) {
        let arr = [];
        this.ePos.length = 0;
        this.itemW = this.getItemW();
        if (!this.els) {
            this.els = document.querySelectorAll(this.opts.box + ' ' + this.opts.el);
        }
        for (let i = 0, len = wholeArr.length; i < len; i++) {
            arr = wholeArr[i];
            this.computeRowArr(arr, i, reverse);
            arr.forEach((v, j) => {
                this.ePos.push(`${i},${j}`);
            })
        }
    }

    getV2HArr(arr) {
        let newArr = [];
        for (let i = 0, len = arr.length; i < len; i++) {

        }

    }

    moveVertical() {

    }

    computeRowArr(arr, row, reverse) {
        let i = 0,
            cur = null,
            next = null,
            //每个元素应该移动的位置个数
            num = 0,                  
            temp = arr.map(v => {
                return v.value;
            })
        
        if (reverse) {
            i = arr.length - 1;
        }

        while (reverse ? i >= 0 : i < temp.length) {
            if (!temp[i]) {
                num++;                
                temp.splice(i, 1);
                
                if (!reverse) {                    
                    arr[i + num - 1].num = num;  
                } else {
                    arr[i].num = num;
                    i--;
                }
                continue;
            }
            if (cur == null) {
                cur = i;
            } else {
                next = i;
            }
            if (!reverse) {                
                arr[cur + num].num = num;
            } else {
                arr[cur].num = num;
            }
            if (next != null) {
                if (!reverse) {                    
                    arr[next + num].num = num;
                } else {
                    arr[next].num = num;
                }
                if (temp[cur] == temp[next]) {
                    temp[cur] += temp[next];
                    temp[next] = 0;
                    cur = null;
                    next = null;
                    continue;
                } else {
                    cur = next;
                    next = null;
                }
            }
            if (reverse) {
                i--;
            } else {
                i++;
            }
        }

        this.fillArr(temp, reverse);
        temp.forEach((v, i) => {
            arr[i].newValue = v;
            arr[i].transDis = reverse ? arr[i].num * this.itemW : -arr[i].num * this.itemW;       
            this.setAnimation(arr[i], row * this.arr.length + i);
            this.opts.redraw && this.opts.redraw(row, i);
        })
    }

    setAnimation(item, index) {
        if (!item.transDis || !item.value) {
            return;
        }
        this.els[index].style.transition = `transform ${this.opts.time}ms`;
        this.els[index].addEventListener('transitionend', function() {
            this.style.transition = '';
            this.style.transform = '';
            item.value = item.newValue;
        })
        requestAnimationFrame(() => {
            this.els[index].style.transform =  `translateX(${item.transDis}px)`;
        }) 
    }

    fillArr(arr, reverse) {
        if (arr.length < this.arr.length) {
            let len = this.arr.length - arr.length;
            for (let i = 0; i < len; i++) {
                if (reverse) {
                    arr.unshift(0);
                } else {
                    arr.push(0);
                }
            }
        }
    }
}