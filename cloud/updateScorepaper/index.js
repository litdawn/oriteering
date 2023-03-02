// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  var db = cloud.database();
  try {
    return await db.collection('scorepapersTable').doc(event._id).update({
      data: {
        result: event.tunnel_result,
        isValid: event.tunnel_isValid,// 最终成绩是否有效
        sumOfTime: event.tunnel_sumOfTime,// 最终的总时间
      }
    })
    
  }
   catch (e) {
    console.error(e)
  }

}