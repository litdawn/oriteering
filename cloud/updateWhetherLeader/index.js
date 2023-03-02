// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  var db = cloud.database();
  try {
    return await db.collection('actors').doc(event._id).update({
      data: {
        whetherLeader: 1
      }
    })
  }
   catch (e) {
    console.error(e)
  }

}