import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import koaWebpack from 'koa-webpack';

export default async (options) => {
    const appName = options.appName || 'home';
    const nodeEnv = options.nodeEnv || 'local';
    const fs = new MemoryFS();
    const configPath = options.configPath;
    const ROOT_PATH = path.resolve(process.cwd());
    if (nodeEnv !== 'local') {
        throw new Error('This script only work in NODE_ENV === local');
    }

    const config = {
        serverBundleFilename: `${appName}.server.${nodeEnv}.json`,
        clientManifestFilename: `${appName}.client.${nodeEnv}.json`,
        htmlTemplateFilename: `${appName}.${nodeEnv}.template.html`
    };

    const wc = require(path.resolve(ROOT_PATH, configPath))
    const compiler = webpack(wc)

    compiler.outputFileSystem = fs

    let clientManifestJson = {}
    let htmlTemplate = ''
    let serverBundleJson = {}

    compiler.hooks.done.tap('compiler-done', () => {
        const { outputFileSystem } = compiler.compilers[0]
        clientManifestJson = JSON.parse(outputFileSystem.readFileSync(path.join(wc[0].output.path, config.clientManifestFilename)).toString());
        htmlTemplate = outputFileSystem.readFileSync(path.join(wc[0].output.path, config.htmlTemplateFilename)).toString();
        serverBundleJson = JSON.parse(outputFileSystem.readFileSync(path.join(wc[0].output.path, config.serverBundleFilename)).toString());
        setTimeout(() => {
            console.log(`Compiler done. Server is listening on port ${process.env.PORT || 8080}`);
        }, 1000);
    });

    const kwm = await koaWebpack({
        compiler: compiler,
        devMiddleware: {
            publicPath: wc[0].output.publicPath,
            stats: {
                chunks: false,
                colors: true
            }
        },
        // hotClient: {
        //   path: '/__hmr',
        //   log: console.log.bind(console)
        // },
    });

    return async (ctx, next) => {
        ctx.clientManifestJson = clientManifestJson;
        ctx.htmlTemplate = htmlTemplate;
        ctx.serverBundleJson = serverBundleJson;

        return await kwm(ctx, next);
    }
}