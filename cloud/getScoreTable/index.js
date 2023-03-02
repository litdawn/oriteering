// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return getScoreTable(event);
}

async function getScoreTable(event) {
  let result = [];
  await cloud.database().collection("scorepapersTable").where({
    id:event.id,
  }).get().then(res =>{
        result=res;
  });
  return{
      result: result
  }
  
}
