const express = require('express')

const path = require('path')

const cookieParser = require('cookie-parser')

// 引入用户模型对象
const UserModel = require('../Model/UserModel')

// 创建路由器对象
const router = express.Router()

router.use(cookieParser())

// 注册UI登录路由
router.get('/login', (request, response) => {
  //let filepath = path.resolve(__dirname, '../public/login.html')
  //response.sendFile(filepath)
  let {email} = request.query
  response.render('login',{Errmsg:{email}})
})

// 注册UI注册路由
router.get('/register',  (request, response) => {
  //let filepath = path.resolve(__dirname, '../public/register.html')
 // response.sendFile(filepath)
 response.render('register',{Errmsg:{}})
})


// 注册UI个人中心路由
router.get('/profile', async (request, response) => {
  const {_id} = request.session
  if (_id) {
    try {
      let findResult = await UserModel.findOne({_id})
      response.render('profile',{nick_name: findResult.nick_name})
    }catch (err) {
      console.log('用户非法修改cookie')
      response.redirect('/login')
    }
  } else {
    response.redirect('/login')
  }
})

module.exports = router

