'use strict';

/*  */

var isJS = function (file) { return /\.js(\?[^.]+)?$/.test(file); };

var ref = require('chalk');
var red = ref.red;
var yellow = ref.yellow;

var prefix = "[server-renderer-webpack-plugin]";
var warn = exports.warn = function (msg) { return console.error(red((prefix + " " + msg + "\n"))); };
var tip = exports.tip = function (msg) { return console.log(yellow((prefix + " " + msg + "\n"))); };
var entryShowError = true

var validate = function (compiler) {
    if (compiler.options.target !== 'node') {
        warn('webpack config `target` should be "node".');
    }

    if (compiler.options.output && compiler.options.output.libraryTarget !== 'commonjs2') {
        warn('webpack config `output.libraryTarget` should be "commonjs2".');
    }

    if (!compiler.options.externals) {
        tip(
            'It is recommended to externalize dependencies in the server build for ' +
            'better build performance.'
        );
    }
};

var SSRServerPlugin = function SSRServerPlugin (options) {
    if ( options === void 0 ) options = {};

    this.options = Object.assign({
        filename: 'ssr-server-bundle.json'
    }, options);
};

SSRServerPlugin.prototype.apply = function apply (compiler) {
    var this$1 = this;
    validate(compiler);
    compiler.hooks.emit.tap('my-ssr-plugin-server', function (compilation) {
        var AllHash = compilation.hash;
        var stats = compilation.getStats().toJson();
        var entryName = Object.keys(stats.entrypoints)[0];
        var entryInfo = stats.entrypoints[entryName];
        var entryAssets = entryInfo.assets.filter(isJS);

        this$1.options.filename = this$1.options.filename.replace("[hash]", AllHash.substring(0, 8));

        if (entryAssets.length > 1 && entryShowError) {
            throw new Error(
                "Server-side bundle should have one single entry file. "
            )
        }

        var entry = entryAssets[0];
        if (!entry || typeof entry !== 'string') {
            throw new Error(
                ("Entry \"" + entryName + "\" not found. Did you specify the correct entry option?")
            )
        }

        var bundle = {
            entry: entry,
            files: {},
            maps: {}
        };

        stats.assets.forEach(function (asset) {
            if (asset.name.match(/\.js$/)) {
                bundle.files[asset.name] = compilation.assets[asset.name].source();
            } else if (asset.name.match(/\.js\.map$/)) {
                bundle.maps[asset.name.replace(/\.map$/, '')] = JSON.parse(compilation.assets[asset.name].source());
            }
            // do not emit anything else for server
            delete compilation.assets[asset.name];
        });

        var json = JSON.stringify(bundle, null, 2);
        var filename = this$1.options.filename;

        compilation.assets[filename] = {
            source: function () { return json; },
            size: function () { return json.length; }
        };

        // no need to show error when hotReload done next run this fn
        entryShowError = false
    });
};

module.exports = SSRServerPlugin;
