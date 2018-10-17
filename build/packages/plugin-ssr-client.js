'use strict';
var isJS = function (file) { return /\.js(\?[^.]+)?$/.test(file); };
var hash = require('hash-sum');
var uniq = require('lodash.uniq');

var SSRClientPlugin = function SSRClientPlugin(options) {
    if (options === void 0) options = {};
    this.options = Object.assign({
        filename: 'ssr-client-manifest.json'
    }, options);
};

SSRClientPlugin.prototype.apply = function apply(compiler) {
    var this$1 = this;
    compiler.hooks.emit.tap('my-ssr-plugin-client', function (compilation) {
        var AllHash = compilation.hash;
        var stats = compilation.getStats().toJson();
        this$1.options.filename = this$1.options.filename.replace("[hash]", AllHash.substring(0, 8));
        var allFiles = uniq(stats.assets.map(function (a) { return a.name; }));
        var initialFiles = uniq(Object.keys(stats.entrypoints).map(function (name) { return stats.entrypoints[name].assets; }).reduce(function (assets, all) { return all.concat(assets); }, []).filter(isJS));
        var asyncFiles = allFiles.filter(isJS).filter(function (file) { return initialFiles.indexOf(file) < 0; });
        var manifest = {
            publicPath: stats.publicPath,
            all: allFiles,
            initial: initialFiles,
            async: asyncFiles,
            modules: { /* [identifier: string]: Array<index: number> */ }
        };
        var assetModules = stats.modules.filter(function (m) { return m.assets.length; });
        var fileToIndex = function (file) { return manifest.all.indexOf(file); };
        stats.modules.forEach(function (m) {
            // ignore modules duplicated in multiple chunks
            if (m.chunks.length === 1) {
                var cid = m.chunks[0];
                var chunk = stats.chunks.find(function (c) { return c.id === cid; });
                if (!chunk || !chunk.files) {
                    return
                }
                var files = manifest.modules[hash(m.identifier)] = chunk.files.map(fileToIndex);
                // find all asset modules associated with the same chunk
                assetModules.forEach(function (m) {
                    if (m.chunks.some(function (id) { return id === cid; })) {
                        files.push.apply(files, m.assets.map(fileToIndex));
                    }
                });
            }
        });
        var json = JSON.stringify(manifest, null, 2);
        compilation.assets[this$1.options.filename] = {
            source: function () { return json; },
            size: function () { return json.length; }
        };
    });
};

module.exports = SSRClientPlugin;
