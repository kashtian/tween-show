export class MatchMan {
    /**
     * 传入canvas context
     * @param {*} context 
     */
    constructor(context) {
        this.ctx = context;
        this.size = 1;
        this.x = 0;
        this.y = 0;
        this.draw();
    }

    draw() {
        this.drawHead();
    }

    drawHead() {
        let width = 50, height = 50;
        let cSize = this.getCanvasSize();
        // 设置canvas偏移值
        this.x = cSize.w / 2 - 100;
        this.y = cSize.h / 2 - 100;
        this.render(() => {
            this.ctx.beginPath();
            this.ctx.strokeRect(0, 0, width, height);
            this.x += width / 2;
            this.y += height / 2;
        })
    }

    drawBody() {
        let width = 25, height = 125;

        
    }

    render(renderFn) {
        this.ctx.save();
        this._transform();
        renderFn && renderFn();
        this.ctx.restore();
    }

    _transform() {
        this.ctx.translate(this.x * this.size, this.x * this.size);
        if (this.size !== 1) {
            this.ctx.scale(this.size, this.size);
        }
    }

    getCanvasSize() {
        let canvas = this.ctx.canvas;
        return {
            w: this.getNumber(canvas.attributes.width && canvas.attributes.width.value),
            h: this.getNumber(canvas.attributes.height && canvas.attributes.height.value)
        }
    }

    getNumber(vStr) {
        if (vStr) {
            return vStr.replace(/px/, '');
        }
        return 0;
    }

    setSize(newSize) {
        this.size = newSize;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
}