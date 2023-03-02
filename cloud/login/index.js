// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-4gipvfh4f25a7740'
  })

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
    }
}