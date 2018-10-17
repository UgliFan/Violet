const fs = require('fs');
const _template = require('lodash.template');

const compileOptions = {
    escape: /{{([^{][\s\S]+?[^}])}}/g,
    interpolate: /{{{([\s\S]+?)}}}/g
};

const voidFn = () => { return ''};

export default function (templateParams) {
    const filepath = templateParams.htmlWebpackPlugin.options.realTemplate;
    const template = fs.readFileSync(filepath, 'utf-8');
    const compiled = _template(template, compileOptions);
    const view = {
        ...templateParams.htmlWebpackPlugin.options,
        renderScripts: voidFn,
        renderStyles: voidFn,
        renderState: voidFn,
        renderInlineScript: function(url) {
            return `<script type="text/javascript" src="${url}"></script>`;
        }
    };
    return compiled(view);
};
