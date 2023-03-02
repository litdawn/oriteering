// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return whetherHaveName(event);
}

async function whetherHaveName(event) {
  let boo = true;
  let dt = [];
  await cloud.database().collection("actors").where({
    id:event.id,
  }).get().then(res =>{
    dt = res.data;
    for(let i=0;i<res.data.length;i++){
        if(res.data[i].name==event.name){
            boo = false;
        }
    }
  });
  return {boo,dt};
  
}