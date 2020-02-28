const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const api = new require('./api').Api;

router.get('/', async (ctx, next) => {
    ctx.body = 'Hello World';
});

router.get('/hello', async (ctx, next) => {
    ctx.body = '<b>Hello World</b>';
});

app.use(bodyParser());
router.post('/api', async (ctx, next) => {
    const data = ctx.request.body;
    ctx.body = api.process(data);
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
