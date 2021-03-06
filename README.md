# Maius

A framework for nodejs


## Todo

- [x] controller 和 service 的 this 指向问题
- [ ] controller 和 service 可以递归的加载多层级的文件夹
- [x] public 静态资源文件夹
- [x] ServiceLoader 对非 Class Function 的支持
- [ ] maius-static 中间件在洋葱模型中的位置可以通过配置来调整
- [ ] 怎么配置 node_modules 中的 middleware
- [ ] 拓展 koa-router 的功能, Restful API 的支持
- [ ] CLI 工具
    - init
    - create controller [name]
    - create service [name]
- [ ] model 层
- [ ] benchmark
- [ ] 框架直接支持 TS 语言开发（后期考虑）

## 使用

### 项目结构

```
.
├── controller  # 控制器目录
├── service     # 服务层目录
├── middleware  # 中间件目录
├── app.js      # 项目入口
├── config.js   # maius 配置文件
└── router.js   # 路由
```

### app.js 入口

```js
// app.js

const Maius = require('maius');

const app = new Maius({
  rootDir: __dirname,
  port: 3123,
});

app.listen().then(() => {
  console.log('http://localhost:3123');
});
```

### router.js 路由

```js
// router.js

module.exports = ({ router, controller }) => {
  router.get('/', controller.home.hello);
};
```

### controller 控制器

```js
// controller/home.js

const { Controller } = require('maius');

module.exports = class HomeController extends Controller {
  constructor() {
    super();
    this.hello = this.hello.bind(this);
    this.number = this.number.bind(this);
  }

  async hello(ctx, next) {
    ctx.body = 'hello world';
  }
  async number(ctx, next) {
    const number = await this.service.home.number(10);
    ctx.body = number;
  }
};
```

### service 服务

```js
// service/home.js

const { Service } = require('maius');

module.exports = class HomeService extends Service {
  constructor() {
    super();
    this.number = this.number.bind(this);
  }
  async number(num) {
    return num + 100;
  }
};
```

### middleware 中间件

```js
// middleware/log.js

module.exports = options => async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`time: ${Date.now() - start}ms`);
};
```
然后需要在 config.js 中配置一下

```js
// config.js

module.exports = {
  /**
   * 依赖于 Koa 的洋葱模型，中间件将根据下面的先后顺序从外层至内层的开始的包裹。
   *
   * 可以直接写 middleware 对应的文件名，来进行简洁的中间件加载
   * 或者通过一个对象进行详细配置。
   */
  middleware: [
    'log', // log 中间件将被包裹在洋葱模型的最外层
    {
      name: 'after', // 中间件对应的文件名
      options: { name: 'nihao' }, // 这个字段的值将最为中间件的参数传入。
      afterRouter: true, // 如果该值为 true, 该中间件将会被放在 router 之后执行
    },
  ],
};

```

## CLI 工具

开发中...

## Contribute

### 本地开发

```
npm run dev
```

### 打包生产环境代码

```
npm run build
```
