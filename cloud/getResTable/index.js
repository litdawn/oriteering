// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return getResTable(event);
}

async function getResTable(event) {
  let result = [];
  await cloud.database().collection("results").where({
    id:event.id,
  }).get().then(res =>{
       result=res.data;
  });
  return{
      result: result
  }
  
}
