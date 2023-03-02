// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-4gipvfh4f25a7740'
  })

// 云函数入口函数
exports.main = async (event, context) => {
    var db = cloud.database();
    await db.collection('actors').add({
        data: {
            id:event.actors_item[0].id,
            identity:event.actors_item[0].identity,
            name:event.actors_item[0].name,
            wxid:event.actors_item[0].wxid,
            groupid:0,
            whetherLeader:0
        }
    })
    return await db.collection('users').doc(event.user_id).update({
        data: {
            times:event.times
        }
    })
}