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
            time: 200
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
        let box = document.querySelector(this.opts.box),
            dis = 0,
            x1 = null;
        box.addEventListener('touchstart', (event) => {
            x1 = event.changedTouches[0].clientX;
        });
        box.addEventListener('touchend', (event) => {
            dis = event.changedTouches[0].clientX - x1;
            if (Math.abs(dis) > 10) {                
                this.move(this.arr, dis > 0 ? true : false);
            }
        })
    }

    setEmptyValue() {
        if (!this.ePos.length) {
            // @need game over judge
            return;
        }
        let i = Math.floor(Math.random() * this.ePos.length),
            pos = this.ePos[i].split(','),
            row = parseInt(pos[0]),
            col = parseInt(pos[1]),
            item = this.arr[row][col];

        item.value = this.opts.min;
        if (this.els) {
            this.els[row * this.arr.length + col].style.animation = `scaleIn ${this.opts.time}ms`;
        }
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
                if (!(v.value && v.newValue)) {                    
                    this.ePos.push(`${i},${j}`);
                }
            })
        }
        this.setEmptyValue();
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
                    if (!reverse) {                        
                        arr[cur].isMerge = true;
                    } else {
                        arr[cur + num].isMerge = true;
                    }
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
        if (!(item.value || item.newValue)) {
            return;
        }
        let opts = this.opts;
        this.els[index].style.transition = `transform ${opts.time}ms`;
        function handle() {
            this.style.transition = '';
            this.style.transform = '';
            item.value = item.newValue;
            if (item.isMerge) {
               // this.style.animation = `scaleIn ${opts.time}ms`;
                item.isMerge = false;
            }
            this.removeEventListener('transitionend', handle);
        }
        this.els[index].addEventListener('transitionend', handle)
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