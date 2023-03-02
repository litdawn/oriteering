// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return whetherhaveadded(event);
}

async function whetherhaveadded(event) {
  let boo = false;
  let dt = [];
  await cloud.database().collection("actors").where({
    wxid:event.wxid,
    id:event.id,
  }).get().then(res =>{
    dt = res.data
    if(res.data.length!=0){
      boo = false;
    }else{
      boo = true;
    }
  });
  return {boo,dt};
  
}
