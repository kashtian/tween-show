export default class ScreenShot {
    constructor() {
        this.init();
    }

    // 初始化，创建canvas以便截图
    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }

    // 获取svg包裹的html截图数据
    getData(html) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                    <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">
                        ${html}
                    </div>
                    </foreignObject>
                </svg>`
    }

    // 将html序列化为字符串
    getHtml2Xml(html) {
        let doc = document.implementation.createHTMLDocument('');
        doc.write(html);

        doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI)
        return (new XMLSerializer).serializeToString(doc);
    }

    cut(el) {
        let htmlStr = this.getHtml2Xml(el);
        let data = this.getData(el.innerHTML);
        let DOMURL = window.URL || window.webkitURL || window;

        let img = new Image();
        let svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        let url = DOMURL.createObjectURL(svg);

        img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
            DOMURL.revokeObjectURL(url);
        }

        img.src = url;
    }


}