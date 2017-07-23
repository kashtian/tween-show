class Game2048 {
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
            min: 2
        }, options);

        this.init();
    }

    init() {
        this.initPos();
        for (let i = 0; i < 2; i++) {
            this.setEmptyValue();
        }
    }

    // 将数组元素的位置（row,col）存入ePos数组
    initPos() {
        this.arr.forEach((item, i) => {
            item.forEach((v, j) => {
                !v && this.ePos.push(`${i},${j}`);
            })
        })
    }

    initEvent() {
        let box = document.querySelector(this.opts.box);
        
    }

    setEmptyValue() {
        if (!this.ePos.length) {
            // @need game over judge
            return;
        }
        let i = Math.floor(Math.random() * this.ePos.length),
        pos = this.ePos[i].split(',');

        this.arr[pos[0]][pos[1]] = this.opts.min;
        this.ePos.splice(i, 1);
    }

    // 往左滑正，往右反；往上滑正，往下滑反。
    move(wholeArr, reverse) {
        let arr = [];
        this.ePos.length = 0;
        for (let i = 0, len = wholeArr.length; i < len; i++) {            
            arr = wholeArr[i]; 
            this.computeRowArr(arr, reverse); 
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

    computeRowArr(arr, reverse) {
        let i = 0,
            cur = null, 
            next = null;
        if (reverse) {
            i = arr.length - 1;
        }

        while(reverse ? i >= 0 : i < arr.length) {
            if (!arr[i]) {
                arr.splice(i, 1);
                continue;
            }
            if (cur == null) {
                cur = i;
            } else {
                next = i;
            }
            if (next != null && arr[cur] == arr[next]) {
                arr[cur] += arr[next];
                arr.splice(next, 1);
                if (reverse) {
                    i--;
                }
                cur = null;
                next = null;
                continue;
            }
            if (reverse) {
                i--;
            } else {
                i++;
            }
        }
          
        this.fillArr(arr, reverse);
    }

    fillArr(arr, reverse) { 
        if (arr.length < this.arr.length) {
            let len = this.arr.length - arr.length;
            for (let i = 0; i < len; i++ ) {
                if (reverse) {
                    arr.unshift(0);
                } else {
                    arr.push(0);
                }
            }
        }
    }

    removeItem(str, arr) {
        let i = arr.indexOf(str);
        if (i < 0) {
            return;
        }
        arr.splice(i, 1);
    }
}