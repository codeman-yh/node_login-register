// 引入mongoose框架
const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

// 定义数据库地址
const DB_URL = 'localhost:27017' 

// 定义数据库名字
const DB_NAME = 'LG&RG'

// 连接数据库
mongoose.connect(`mongodb://${DB_URL}/${DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true})


// 暴露数据库连接模块
module.exports = new Promise ((resove, reject) => {
  mongoose.connection.on('open' , (err)=> {
    if (!err) {
      console.log('数据库连接成功！')
      resove()
    } else {
      console.log(err)
      reject()
    }
  })

})