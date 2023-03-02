const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-4gipvfh4f25a7740'
  })
// 云函数入口函数
exports.main = async (event, context) => {
    const db = cloud.database()
    let achievement=[0,0,0,0,0,0]
    // for(var i=0;i<num;i++){
    //     achievement.push(0);
    // }
      return await db.collection('users').add({
        data: {
            achievements:[0,0,0,0,0,0],
            times:0,
            wxid:event.openid
        },

      })
}
