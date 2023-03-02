// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    var db = cloud.database();
    try {
      return await db.collection('users').doc(event._id).update({
        data: {
          achievements:event.achievements
        }
        
      })
    }
     catch (e) {
      console.error(e)
    }
}