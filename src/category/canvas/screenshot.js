export default class ScreenShot {
    constructor(options) {
        this.opts = Object.assign({
            w: 500,
            h: 500,
            bgColor: '#fff'
        }, options)
        this.init();
    }

    // 初始化，创建canvas以便截图
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.opts.w;
        this.canvas.height = this.opts.h;
        this.canvas.style.display = 'none';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }

    // 获取svg包裹的html截图数据
    getData(html) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${this.opts.w}" height="${this.opts.h}">
                    <foreignObject width="100%" height="100%">
                    ${html}
                    </foreignObject>
                </svg>`
    }

    // 将html序列化为字符串
    getHtml2Xml(html) {
        if (!html.style.backgroundColor) {
            html.style.backgroundColor = this.opts.bgColor;
        }
        let doc = document.implementation.createHTMLDocument('');
        doc.body.appendChild(html);

        doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI)
        return (new XMLSerializer).serializeToString(doc);
    }

    cut(el) {
        let htmlStr = this.getHtml2Xml(el.cloneNode(true));
        let data = this.getData(htmlStr.replace('<!DOCTYPE html>', ''));
        let DOMURL = window.URL || window.webkitURL || window;

        let img = new Image();
        // let svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        let svg = `data:image/svg+xml;charset=utf-8,${data}`;
        //let url = DOMURL.createObjectURL(svg);

        return new Promise((resolve, reject) => {
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0);
                //DOMURL.revokeObjectURL(url);
                resolve(this.canvas.toDataURL('image/jpeg', 0.8));
            }
    
            img.onerror = (err) => {
                reject('img load error');
            }
            // img.src = url;
            img.src = svg
        })        
    }

}