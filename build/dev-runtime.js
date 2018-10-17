import Koa from 'koa';
import koaRouter from 'koa-router';
import program from 'commander';
import packageJson from '../package.json';
import koaWebpack from './packages/koa-webpack';
import reactrender from './packages/react-render';

const app = new Koa();
const router = koaRouter()
const PROJECT_NAME = process.env.PROJECT_NAME || 'tbk_fe';
const NODE_ENV = process.env.NODE_ENV || 'local';

const defaultTitle = '';
const defaultMeta = {
    0: { charset: "utf-8" },
    1: { 'http-equiv': "X-UA-Compatible", content: "IE=edge" },
    renderer: "webkit",
    description: "",
    keywords: "",
    spm_prefix: "0"
};

program.version(packageJson.version)
    .option('-p, --path [path]', 'wpc.all.js', `./build/wpc.all.js`)
    .parse(process.argv);

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        switch (e.status) {
          case 302:
              ctx.redirect(302, e.redirect);
              break
          case 404:
              ctx.throw(404, e.message);
              break
          default:
              ctx.throw(500, e.message);
        }
    }
});

router.get('/favicon.ico', async ctx => {
    ctx.body = 'ok';
});

router.get('*', async ctx => {
    const context = {
        url: ctx.url,
        path: ctx.path,
        querystring: ctx.querystring,
        query: ctx.query,
        cookie: ctx.headers.cookie,
        title: defaultTitle, // compat old meta strings
        meta: defaultMeta // compat old meta strings
    };

    ctx.body = await reactrender({
        context,
        manifest: ctx.clientManifestJson,
        view: ctx.htmlTemplate,
        bundle: ctx.serverBundleJson
    });
});

koaWebpack({
    appName: PROJECT_NAME,
    nodeEnv: NODE_ENV,
    configPath: program.path
}).then(m => {
    app.use(m);
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(process.env.PORT || 8080);
});
