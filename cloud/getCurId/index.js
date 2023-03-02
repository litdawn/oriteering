// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return getCurId(event);
}

async function getCurId(event) {
  let id = 0;
  await cloud.database().collection("activities")
    .get().then(res =>{
        id=res.data[res.data.length-1].id + 1
  });
  return{
      id: id
    }
  
}
