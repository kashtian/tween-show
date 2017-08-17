const path = require('path');
const fs = require('fs');
const express = require('express');
const LRU = require('lru-cache');
const serialize = require('serialize-javascript');

const port = require('./config/sys.config').port;
const createBundleRenderer = require('vue-server-renderer').createBundleRenderer;

let indexHtml,  // generated by html-webpack-plugin
    renderer;   // created from the webpack-generated server bundle

function createRenderer(serverBundle) {
    return createBundleRenderer(serverBundle, {
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        })
    })
}

function parseIndex(template) {
    const contentMarker = '<!--APP-->';
    const i = template.indexOf(contentMarker);
    return {
        head: template.slice(0, i),
        tail: template.slice(i + contentMarker.length)
    }
}

const app = express();

app.use(express.static('public'));

if (process.argv.indexOf('--development') > -1) {    
    require('./build/setup-dev-server')(app, {
        bundleUpdated: serverBundle => {
            renderer = createRenderer(serverBundle);    
        },
        indexUpdated: indexTpl => {
            indexHtml = parseIndex(indexTpl);
        }
    })
} else {
    const bundlePath = path.resolve(process.cwd(), './dist/server/server-bundle.js');
    const indexTplPath = path.resolve(process.cwd(), './dist/static/index.html');
    renderer = createRenderer(fs.readFileSync(bundlePath, 'utf-8'));
    indexHtml = parseIndex(fs.readFileSync(indexTplPath, 'utf-8'));
    app.use('/static', express.static(path.resolve(process.cwd(), 'dist/static')));
}

app.get('/test', (req, res) => {
    if(!renderer) {
        return res.end('waiting for compilation... refresh in a moment.');
    }
    const context = {
        path: req.path
    }
    const renderStream = renderer.renderToStream(context);

    res.setHeader('Content-Type', 'text/html');
    res.write(indexHtml.head);

    renderStream.on('data', chunk => {
        res.write(chunk);
    });

    renderStream.on('end', () => {
        res.write(
            `<script>
                window.__INITIAL_STATE__= ${serialize(context.initialState, {isJSON: true})}
            </script>`
        );
        res.end(indexHtml.tail);
    });

    renderStream.on('error', err => {
        if (err && err.code == '404') {
            res.status(404).end('404 | Page Not Found');
            return ;
        }
        res.status(500).end('Internal Error 500');
        console.error(`error during render: ${req.path}`);
        console.error(err);
    })
});

console.log('fjkdsjfkdjkfjkdjfkdjfk  master')

app.listen(port, () => {
    console.log(`==> Listening at http://localhost:${port}`)
})
