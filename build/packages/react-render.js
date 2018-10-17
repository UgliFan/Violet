const path = require('path');
const resolve = require('resolve');
const vm = require('vm');
const NativeModule = require('module');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');
const compile = require('lodash.template');
const compileOptions = { escape: /{{([^{][\s\S]+?[^}])}}/g, interpolate: /{{{([\s\S]+?)}}}/g };

const resolvedModules = {};
const createSandbox = () => {
    const sandbox = {
        Buffer,
        console,
        process,
        setTimeout,
        setInterval,
        setImmediate,
        clearTimeout,
        clearInterval,
        clearImmediate,
    };
    sandbox.global = sandbox;
    return sandbox;
};

const parseTemplate = function (template, contentPlaceholder) {
    if (typeof template === 'object') return template;
    let i = template.indexOf('</head>');
    const j = template.indexOf(contentPlaceholder);
    if (j < 0) throw new Error('Content placeholder not found in template.');
    if (i < 0) {
        i = template.indexOf('<body>');
        if (i < 0) i = j;
    }
    return {
        head: compile(template.slice(0, i), compileOptions),
        neck: compile(template.slice(i, j), compileOptions),
        tail: compile(template.slice(j + contentPlaceholder.length), compileOptions)
    };
};
const bundleLoadModule = (entry, files, runInNewContext=false, cacheModules = {}, basedir) => {
    if (cacheModules[entry]) return cacheModules[entry];
    const script = new vm.Script(NativeModule.wrap(files[entry]), {
        filename: entry,
        displayErrors: true,
    });
    const compiledWrapper = runInNewContext === false ? script.runInThisContext() : script.runInNewContext(createSandbox());
    const m = { exports: {} };
    const r = file => {
        file = path.posix.join('.', file);
        if (Object.keys(files)[file]) {
            return bundleLoadModule(file, files, runInNewContext, cacheModules);
        } else if (basedir) {
            return require(
                resolvedModules[file] ||
                (resolvedModules[file] = resolve.sync(file, { basedir }))
            );
        } else {
            return require(file);
        }
    };
    compiledWrapper.call(m.exports, m.exports, r, m);
    const defaultRes = Object.prototype.hasOwnProperty.call(m.exports, 'default') ? m.exports.default : m.exports;
    cacheModules[entry] = defaultRes;
    return defaultRes;
};
const getResource = (ext, publicPath, all) => {
    const r = all.filter(l => {
        return l.indexOf(ext) !== -1;
    });
    return r.map(l => {
        return `${publicPath}${l}`;
    });
};
const renderCss = (publicPath, all) => {
    return getResource('.css', publicPath, all).reduce((p, n) => {
        return p + `<link rel="stylesheet" href="${n}" />`;
    }, '');
};
const renderScript = (publicPath, all) => {
    return getResource('.js', publicPath, all).reduce((p, n) => {
        return p + `<script type="application/javascript" src="${n}"></script>`;
    }, '');
};
const renderState = (state) => {
    return `<script type="text/javascript">window.__INITIAL_STATE__=${JSON.stringify(state)}</script>`;
};

class ReactBundleRenderer {
    constructor(serverBundle, options) {
        this.serverBundle = serverBundle
        this.templateHtml = options.template || ''
        this.clientManifest = options.clientManifest
        const {
            inject = true,
            runInNewContext = false
        } = options;
        this.options = {
            inject,
            runInNewContext
        };
    }
    compileBundle() {
        return bundleLoadModule(this.serverBundle.entry, this.serverBundle.files, this.options.runInNewContext);
    }
    renderCss() {
        return renderCss(this.clientManifest.publicPath, this.clientManifest.all);
    }
    renderState(state) {
        return renderState(state);
    }
    renderScript() {
        return renderScript(this.clientManifest.publicPath, this.clientManifest.initial);
    }
    renderToString(context) {
        const fn = this.compileBundle();
        return fn(context).then(app => {
            return ReactDOMServer.renderToString(app);
        }).then(innerHtml => {
            const { helmet = Helmet } = context;
            const _helmet = helmet.renderStatic();
            const _templateHtml = this.templateHtml;
            const parsed = parseTemplate(_templateHtml, '<!--react-place-holder-->');

            const templateContext = Object.assign(context);
            if (this.options.inject) {
                return (
                    parsed.head() +
                    this.renderCss() +
                    _helmet.title.toString() +
                    _helmet.meta.toString() +
                    _helmet.link.toString() +
                    parsed.neck() +
                    '<div id="server-app">' +
                    innerHtml +
                    '</div>' +
                    this.renderState(context.state) +
                    this.renderScript() +
                    parsed.tail()
                );
            }
            return (
                parsed.head() +
                parsed.neck() +
                '<div id="server-app">' +
                innerHtml +
                '</div>' +
                parsed.tail()
            );
        })
    }
}

const reactRender = async option => {
    const render = new ReactBundleRenderer(option.bundle, {
        template: option.view,
        clientManifest: option.manifest,
        runInNewContext: option.runInNewContext || false,
        inject: option.inject === false ? false : true,
    });
    return await render.renderToString(option.context);
}

module.exports = reactRender;