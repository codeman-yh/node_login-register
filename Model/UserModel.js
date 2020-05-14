const mongoose = require ('mongoose')

// 引入约束schema对象
const schema = mongoose.Schema

// 创建一个约束对象实例
const UserSchema = new schema ({
  email: {
    type: String,
    required: true, // 必填
    unique: true //唯一
  },
  nick_name: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  enable_flag: {
    type: String,
    default: 'Y'
  }
})

// 创建模型对象
module.exports = mongoose.model('users', UserSchema)