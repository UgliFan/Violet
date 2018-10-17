const path = require('path')
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const history = require('connect-history-api-fallback');
const convert = require('koa-connect');
const nodeExternals = require('webpack-node-externals');
const SSRServerPlugin = require('./plugin-ssr-server');
const SSRClientPlugin = require('./plugin-ssr-client');
// const biliBanner = require('./utils/getBiliBanner');
// const { transformSync } = require('@babel/core');

const nodeModulePath = [
    path.resolve(process.cwd(), 'node_modules')
];
const workingpath = path.resolve(process.cwd());

const defaultTitle = 'title';
const defaultMeta = {
    0: { charset: 'utf-8' },
    1: { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    renderer: 'webkit',
    description: '',
    keywords: '',
    spm_prefix: '0'
};

function getOptions({ buildEnv, projectName }) {
    return {
        clientEntry: [path.resolve(workingpath, 'src', projectName, 'entry-client.js')],
        serverEntry: [path.resolve(workingpath, 'src', projectName, 'entry-server.js')],
        outputJsName: buildEnv === 'production' ? `${projectName}.js` : `${projectName}.${buildEnv}.js`,
        outputCssName: buildEnv === 'production' ? `css/${projectName}.[id].css` : `css/${projectName}.[id].${buildEnv}.css`,
        publicPath: buildEnv === 'local' ?  '/static/' : `//s.xxx.com/static/${projectName}/`,
        outputPath: path.resolve(workingpath, 'dist', projectName)
    };
}

module.exports = class ConfigFactory {
    /**
     * @api { constructor } SeedFactory
     * @apiName constructor
     * @apiDescription ConfigFactory init function
     * @apiParam (options) {string} [projectName=process.env.PROJECT_NAME]
     * @apiParam (options) {string} [buildEnv=process.env.NODE_ENV]
     * @apiParam (options) {string} [degradeHtmlPath]
     * @apiParam (options) {array} [externalsWhiteList=[]]
     * @apiSuccess {Instance} instance of ConfigFactory
     *
     */
    constructor(options = {}) {
        const {
            degradeHtmlPath,
            projectName = process.env.PROJECT_NAME,
            buildEnv = process.env.NODE_ENV
        } = options;

        const {
            outputJsName,
            outputCssName,
            publicPath,
            outputPath,
            clientEntry,
            serverEntry
        } = getOptions({ buildEnv, projectName });

        const mode = process.env.WEBPACK_SERVE ? 'development' : 'production';

        this._options = {
            ...options,
            mode,
            projectName,
            buildEnv,
            outputJsName,
            outputCssName,
            publicPath,
            outputPath,
            clientEntry,
            serverEntry,
            degradeHtmlPath
        };

        this._config = {
            mode,
            context: workingpath,
            output: {
                path: outputPath,
                filename: outputJsName,
                publicPath: publicPath
            },
            module: {
                rules: [{
                    test: /\.js(x)?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }, {
                    test: /\.css$/,
                    use: [ExtractCssChunks.loader, {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('postcss-import')({ root: loader.resourcePath }),
                                require('postcss-preset-env')(),
                                require('autoprefixer')(),
                                require('cssnano')()
                            ]
                        }
                    }]
                }, {
                    test: /\.less$/,
                    use: [ExtractCssChunks.loader, {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                            require('postcss-import')({ root: loader.resourcePath }),
                            require('postcss-preset-env')(),
                            require('autoprefixer')(),
                            require('cssnano')()
                            ]
                        }
                    }, 'less-loader']
                }, {
                    test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: 'asserts/[name].[ext]'
                    }
                }]
            },
            plugins: [
                new ExtractCssChunks({
                    filename: outputCssName,
                    hot: mode === 'development'
                }),
                new webpackBar()
            ],
            optimization: {
                minimize: buildEnv === 'production',
            },
            resolve: {
                modules: nodeModulePath.filter(p => {
                    return /node_modules/.test(p)
                }),
                extensions: ['.js', '.json', '.jsx'],
                alias: {
                    'react$': `react/cjs/react.${buildEnv === 'production'? 'production.min' : 'development'}.js`,
                    'react-dom$': `react-dom/cjs/react-dom.${buildEnv === 'production'? 'production.min' : 'development'}.js`,
                    'react-router-dom$': `react-router-dom/umd/react-router-dom${buildEnv === 'production'?'.min':''}.js`,
                    'redux$': `redux/dist/redux${buildEnv === 'production'?'.min':''}.js`,
                    'react-redux$': `react-redux/dist/react-redux${buildEnv === 'production'?'.min':''}.js`,
                    'assets': path.join(workingpath, 'src', projectName, 'assets'),
                    'g-public': path.join(workingpath, 'src', 'public'),
                    '~axios': path.join(workingpath, 'src', 'public', 'js', 'axios', 'caxios.js')
                }
            },
            stats: 'minimal',
            devtool: buildEnv === 'local' ? 'source-map' : '',
            serve: {
                devMiddleware: {
                    publicPath: publicPath
                },
                content: `${workingpath}/dist/`,
                add: (app, middleware, options) => {
                    const historyOptions = {
                        rewrites: [{
                            from: /.*/,
                            to: (context) => {
                                const { pathname } = context.parsedUrl;
                                if (pathname.indexOf(publicPath) === -1) {
                                    return publicPath + '/index.html';
                                } else {
                                    return pathname;
                                }
                            }
                        }]
                    };
                    app.use(convert(history(historyOptions)));
                }
            }
        };

        if (buildEnv !== 'local') {
            this._config.plugins.push(new CleanWebpackPlugin([projectName], {
                root: path.join(workingpath, 'dist')
            }));
        }
    }

    /**
     * @api { call } buildClientConfig
     * @apiName buildClientConfig
     * @apiDescription build webpack config of client
     * @apiParam (customConfig) {object} [{}] merge object
     * @apiSuccess {Object} webpack config
     *
     */
    buildClientConfig (customConfig = {}) {
        const { clientEntry, projectName, mode, buildEnv, degradeHtmlPath } = this._options;
        return merge(this._config, {
            target: 'web',
            entry: clientEntry,
            optimization: {
                splitChunks: { chunks: 'all' }
            },
            plugins: [
                new HtmlWebpackPlugin({
                    filename: buildEnv === 'production' ? `${projectName}.template.html` : `${projectName}.${buildEnv}.template.html`,
                    template: path.join(workingpath, 'src', projectName, `template.html`),
                    inject: false,
                    hash: true,
                    minify: {
                        removeComments: false,
                        collapseWhitespace: mode === 'production',
                        removeAttributeQutes: mode === 'production',
                        minifyJS: true,
                        minifyCSS: true
                    }
                }),
                new HtmlWebpackPlugin({
                    filename: buildEnv === 'production' ? `${projectName}.degrade.html` : `${projectName}.${buildEnv}.degrade.html`,
                    template: path.resolve(__dirname, './html-webpack-template.js'),
                    realTemplate: degradeHtmlPath || path.join(workingpath, 'src', projectName, 'degrade.html'),
                    title: defaultTitle,
                    meta: defaultMeta,
                    inject: 'body',
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true
                    }
                }),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: `'${buildEnv}'`,
                        [`REAÇT_ENV`]: '"client"',
                    }
                }),
                new SSRClientPlugin({
                    filename: `${ buildEnv ==='production' ? `${projectName}.client.json` : `${projectName}.client.${buildEnv}.json` }`
                }),
                // new webpack.BannerPlugin({
                // banner: transformSync(biliBanner, { presets: [['@babel/preset-env']] }).code,
                // raw: true,
                // entryOnly: true,
                // test: new RegExp(`^${projectName}\\..*\\.js$`)
                // })
            ]
        }, customConfig);
    }

    /**
     * @api { call } buildServerConfig
     * @apiName buildServerConfig
     * @apiDescription build webpack config of server
     * @apiParam (customConfig) {object} [{}] merge object
     * @apiSuccess {Object} webpack config
     *
     */
    buildServerConfig (customConfig = {}) {
        const { serverEntry, buildEnv, projectName, externalsWhiteList } = this._options;
        return merge(this._config, {
            target: 'node',
            entry: serverEntry,
            output: {
                filename: 'server-bundle.js',
                libraryTarget: 'commonjs2'
            },
            plugins: [
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: `'${buildEnv}'`,
                        [`REACT_ENV`]: '"server"',
                    },
                }),
                new webpack.optimize.LimitChunkCountPlugin({
                    maxChunks: 1
                }),
                new SSRServerPlugin({
                    filename: `${ buildEnv === 'production' ? `${projectName}.server.json` : `${projectName}.server.${buildEnv}.json` }`
                })
            ],
            externals: nodeExternals({
                whitelist: [/\.css$/, /fbjs/, /react/, /redux/, 'thunk-redux', 'react-helmet', 'history'].concat(externalsWhiteList)
            })
        }, customConfig);
    }

    /**
     * @api { call } buildReactComponentConfig
     * @apiName buildReactComponentConfig
     * @apiDescription build webpack config of react component
     * @apiParam (customConfig) {object} [{}] merge object
     * @apiSuccess {Object} webpack config
     *
     */
    buildReactComponentConfig (customConfig = {}) {
        const { projectName } = this._options;
        return merge(this._config, {
            target: 'web',
            entry: [path.resolve(workingpath, 'src', projectName, 'App.jsx')],
            output: {
                filename: 'index.js',
                libraryTarget: 'umd'
            },
            externals: nodeExternals({ modulesDir: path.join(workingpath, 'node_modules') })
        }, customConfig);
    }
}