// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return getCurGroupId(event);
}

async function getCurGroupId(event) {
  let groupId = 0;
  await cloud.database().collection("groups")
  .where({
    id: event.id
  })
    .get().then(res =>{
        groupId=res.data[res.data.length-1].groupid + 1
  });
  return{
      groupid: groupId
    }
  
}
