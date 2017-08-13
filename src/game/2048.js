export default class Game2048 {
    constructor(options) {
        this.arr = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];

        this.oldPos = [];
        this.ePos = [];  // empty value postion
        this.queue = [];

        this.opts = Object.assign({
            box: '.box-2048',
            min: 2,
            row: 4,
            el: '.item',
            time: 150
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
        this.initAnimation();
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
            disX = 0,
            disY = 0,
            x1 = null,
            y1 = null;
        box.addEventListener('touchstart', (event) => {
            x1 = event.changedTouches[0].clientX;
            y1 = event.changedTouches[0].clientY;
        });
        box.addEventListener('touchend', (event) => {
            disX = event.changedTouches[0].clientX - x1;
            disY = event.changedTouches[0].clientY - y1;
            if (Math.abs(disX) > 10 || Math.abs(disY) > 10) {
                if (Math.abs(disX) > Math.abs(disY)) {
                    this.move(this.arr, disX > 0 ? true : false);
                } else {
                    this.move(this.getV2HArr(this.arr), disY > 0 ? true : false, true);
                }
            }
        })
    }

    isEqual(arr1, arr2) {
        if (arr1.length != arr2.length) {
            return false;
        }
        arr1.sort();
        arr2.sort();
        for (let i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    }

    isGameOver() {
        let arr = this.arr;
        for (let i = 0, len = arr.length; i < len; i++) {
            for (let j = 0; j < len; j++) {
                if (j != 0 && arr[i][j].value == arr[i][j - 1].value) {
                    return false;
                }
                if (j < len - 1 && arr[i][j].value == arr[i][j + 1].value) {
                    return false;
                }
                if (i != 0 && arr[i][j].value == arr[i - 1][j].value) {
                    return false;
                }
                if (i < len - 1 && arr[i][j].value == arr[i + 1][j].value) {
                    return false;
                }
            }
        }
        this.gameOver = true;
        return true;
    }

    initAnimation(temp, time) {
        if (this.gameOver) {
            return;
        }
        time = time || Date.now();
        if (temp && (Date.now() - time < this.opts.time)) {
            this.noMove = true;
        } else {
            this.noMove = false;
            if (Array.isArray(temp)) {
                temp.forEach(v => {
                    v.el.style.transition = '';
                    v.el.style.transform = '';
                    v.item.value = v.item.newValue;
                    v.item.num = v.item.newValue = 0;
                    if (v.item.isMerge) {
                        v.el.style.animation = `scaleIn ${this.opts.time}ms ease-in`;
                        v.item.isMerge = false;
                        function animationhandle() {
                            this.style.animation = '';
                            this.removeEventListener('animationend', animationhandle);
                        }
                        v.el.addEventListener('animationend', animationhandle);
                    }
                })
            } else if (typeof temp == 'object' && temp.el) {
                temp.el.style.animation = '';
            }
            temp = this.queue.shift();
            if (temp) {
                if (Array.isArray(temp)) {
                    temp.forEach(v => {
                        v.el.style[v.key] = v.value;
                    })
                } else {
                    temp.cb && temp.cb();
                }
                time = Date.now();
            }
        }
        requestAnimationFrame(() => {
            this.initAnimation(temp, time);
        })
    }

    setEmptyValue(animateObj) {
        if (!this.ePos.length) {
            if (this.isGameOver()) {
                alert('game over');
            }
            return;
        }
        if (this.isEqual(this.oldPos, this.ePos)) {
            return;
        }
        let i = Math.floor(Math.random() * this.ePos.length),
            pos = this.ePos[i].split(','),
            row = parseInt(pos[0]),
            col = parseInt(pos[1]),
            item = this.arr[row][col];

        item.value = this.opts.min;
        if (this.els) {
            let el = this.els[row * this.arr.length + col];
            animateObj && (animateObj.el = el);
            el.style.animation = `fadeIn ${this.opts.time}ms`;
        }
        this.ePos.splice(i, 1);
    }

    // 往左滑正，往右反；往上滑正，往下滑反。
    move(wholeArr, reverse, isY) {
        if (this.noMove) {
            return;
        }
        let arr = [], transArr = [], animateObj = {};
        transArr.indexs = [];
        transArr.count = 0;

        this.oldPos = this.ePos.map(item => item);
        this.ePos.length = 0;
        this.itemW = this.getItemW();
        if (!this.els) {
            this.els = document.querySelectorAll(this.opts.box + ' ' + this.opts.el);
        }
        for (let i = 0, len = wholeArr.length; i < len; i++) {
            arr = wholeArr[i];
            this.computeRowArr(arr, i, reverse, isY, transArr);
            arr.forEach((v, j) => {
                if (!v.newValue) {
                    if (!isY) {
                        this.ePos.push(`${i},${j}`);
                    } else {
                        this.ePos.push(`${j},${i}`);
                    }
                }
            })
        }
        this.queue.push(transArr);
        animateObj = {
            name: 'setEmptyValue', cb: () => {
                this.setEmptyValue(animateObj);
            }
        }
        this.queue.push(animateObj);
    }

    getV2HArr(arr) {
        let newArr = [];
        for (let col = 0, len = arr.length; col < len; col++) {
            if (!newArr[col]) {
                newArr[col] = [];
            }
            for (let row = 0, len = arr.length; row < len; row++) {
                newArr[col].push(arr[row][col]);
            }
        }
        return newArr;
    }

    computeRowArr(arr, row, reverse, isY, transArr) {
        let temp = arr.map(v => {
            return v.value;
        })

        this.merge(temp, arr, reverse);

        this.fillArr(temp, reverse);
        temp.forEach((v, i) => {
            arr[i].newValue = v;
            arr[i].transDis = reverse ? arr[i].num * this.itemW : -arr[i].num * this.itemW;
            this.setAnimation(arr[i], isY ? i * this.arr.length + row : row * this.arr.length + i, isY, transArr);
        })
    }

    merge(temp, arrSrc, isReverse) {
        let i = 0,
            cur = null,
            next = null,
            //每个元素应该移动的位置个数
            num = 0,
            arr = arrSrc;

        if (isReverse) {
            temp.reverse();
            arr = arrSrc.map(v => {
                return { value: v.value }
            })
            arr.reverse();
        }

        while (i < temp.length) {
            if (!temp[i]) {
                num++;
                temp.splice(i, 1);

                arr[i + num - 1].num = arr[i + num - 1].value ? num : 0;
                continue;
            }
            if (cur == null) {
                cur = i;
            } else {
                next = i;
            }
            arr[cur + num].num = arr[cur + num].value ? num : 0;
            if (next != null) {
                arr[next + num].num = arr[next + num].value ? num : 0;
                if (temp[cur] == temp[next]) {
                    arr[cur].isMerge = true;
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
            i++;
        }
        if (isReverse) {
            temp.reverse();
            arr.reverse();
            arr.forEach((v, i) => {
                arrSrc[i].num = v.num;
                arrSrc[i].isMerge = v.isMerge;
            })
        }
    }

    setAnimation(item, index, isY, transArr) {
        if (!(item.value || item.newValue)) {
            return;
        }
        let self = this;
        let opts = this.opts;
        this.els[index].style.transition = `transform ${opts.time}ms`;
        transArr.push({ el: this.els[index], item: item, key: 'transform', value: `${isY ? 'translateY' : 'translateX'}(${item.transDis}px)` })
    }

    // 判断是否所有元素的transition都结束了
    isAllEnd() {
        let flag = this.arr.some(item => {
            return item.some(v => {
                return !!v.num;
            })
        })
        return !flag
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