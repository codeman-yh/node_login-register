// 引入express框架
const express = require('express')

// 引入数据库连接模块
const db = require('./db')

//引入express-session用于在express中操作session
const session = require('express-session')

//引入connect-mongo用于session持久化
const mongonStore = require('connect-mongo')(session)

// 引入UI路由
const UI_router = require('./router/Ui_router')

// 引入业务路由
const Business_router = require('./router/Business_router')


// 创建app服务对象
const app = express()

// 使用ejs模板引擎
app.set('view engine', 'ejs')

// 设置模板引擎存放目录
app.set('views', './views')

//定义一个cookie和session组合使用的配置对象
app.use(session({
  name: 'user',
  secret: 'mongondb',
  saveUninitialized: false,
  resave: true,
  store: new mongonStore({
    url: 'mongodb://localhost:27017/cookies_container',
    touchAfter: 24 * 3600
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 30
  }
}))

// 数据库连接成功后，注册路由
db.then(()=> {
  app.get('/', (request, response) => {
    response.send('ok')
  })
  
  // 使用UI路由
  app.use(UI_router)

  // 使用业务路由
  app.use(Business_router)

}).catch((err)=>{
  console.log(err)
})


// 绑定端口监听
app.listen('5000', (err) => {
  if (!err) {
    console.log('服务器启动')
  } else{
    console.log(err)
  }
})