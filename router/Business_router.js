const express = require('express')

// 创建路由器对象
const router = express.Router()

// 引入用户模型对象
const UserModel = require('../Model/UserModel')

// 进行数据加密
const sha1 = require('sha1')

//使用内置中间件获取请求体
router.use(express.urlencoded({extended: true}))

// 注册路由业务逻辑
router.post('/register', async (request, response)=> {
  // 获取注册信息
  const {email, nick_name, password, re_password} = request.body

  // 定义数据的合法性
  const emailReg = /^[a-zA-Z0-9]{2,16}@[a-zA-Z0-9]{2,16}\.com$/
  const nick_nameReg = /^[a-zA-Z\u4e00-\u9fa5]{2,10}$/
  const passwordReg = /^[a-zA-Z0-9_#.]{6,16}$/

  // 检验数据的合法性
  let Errmsg = {}
  if (!emailReg.test(email)) {
    Errmsg.emailErrmsg = '要求邮箱用户名2-16位不包含特殊字符，邮箱主机名2-16位'
   // response.send('邮箱输入不合法！要求邮箱用户名2-16位不包含特殊字符，邮箱主机名2-16位')
  } 
  if (!nick_nameReg.test(nick_name)) {
    // response.send('昵称输入不合法,名称长度应大于二位小于十位')
    Errmsg.nick_nameErrmsg = '昵称输入不合法,名称不应包含数字且长度应大于二位小于十位'
  } 
  if (!passwordReg.test(password)) {
    Errmsg.passwordErrmsg = '密码输入不合法，密码应为6-16位字符不包含特殊字符'
    //response.send('密码输入不合法，密码应为6-16位字符不包含特殊字符')
  } 
  if (password  !== re_password){
    Errmsg.re_passwordErrmsg = '两次输入的密码不一致'
  }  

  // 处理错误信息,出错则返回
  if (JSON.stringify(Errmsg) !== '{}'){
    response.render('register',{Errmsg})
    return
  }

  // 与数据库交互，先查找用户是否注册过，没有则将用户信息添加进数据库
  try {
    let findResult = await UserModel.findOne({email})
    if (findResult) {
      Errmsg.repeatRegister = '该邮箱已经注册过了'
      response.render('register', {Errmsg})
      return
    } else {
      await UserModel.create({email, nick_name, password:sha1(password)})
         response.redirect(`/login?email=${email}`)
         console.log(`邮箱为${email},昵称为${nick_name}注册成功`)
    }
  } catch (err) {
    console.log(err)
    Errmsg.netErr = '网络不稳定，请稍后重试。'
    response.render('register', {Errmsg})
  }

})

// 登录路由业务逻辑
router.post('/login', async (request, response)=> {
  const {email, password} = request.body
  let Errmsg = {}
  //定义的合法性
  const emailReg = /^[a-zA-Z0-9]{2,16}@[a-zA-Z0-9]{2,16}\.com$/
  const passwordReg = /^[a-zA-Z0-9_#.]{6,16}$/

  // 校验数据合法性
  if (!emailReg.test(email)) {
    Errmsg.emailErrmsg = '要求邮箱用户名2-16位不包含特殊字符，邮箱主机名2-16位'
  }
  if (!passwordReg.test(password)) {
    Errmsg.passwordErrmsg = '密码输入不合法，密码应为6-16位字符不包含特殊字符'
  }
  if (JSON.stringify(Errmsg) !== '{}') {
    response.render('login',{Errmsg})
    return
  }
  try {
    let findResult = await UserModel.findOne({email, password:sha1(password)})
    if (findResult) {
    /*  response.render('profile',{nick_name: findResult.nick_name})
       // 种cookie
       response.cookie('_id',findResult._id, {maxAge:30*1000}) */

      // 使用session
      request.session._id = findResult._id
      
      response.redirect('/profile')
    } else {
      Errmsg.loginErr = '邮箱或密码输入错误'
      response.render('login',{Errmsg})
    }
  } catch (err) {
    Errmsg.netErr = '网路不稳定，请稍后重试'
    response.render('login',{Errmsg})
    console.log(err)
  }
})

module.exports = router


