// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return findFreeman(event);
}

async function findFreeman(event) {
  let result = [];
  await cloud.database().collection("actors").where({
    groupid: 0,
    id: event.id,
    identity: 2
  }).get().then(res =>{
    for(var i=0; i<res.data.length; i++)
      result.push(res.data[i].name);
  });
  return{
      result: result
    }
  
}
