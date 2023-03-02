// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return findEveryone(event);
}

async function findEveryone(event) {
  let managers = [];
  let parts = [];
  await cloud.database().collection("actors").where({
    id: event.id,
  }).get().then(res =>{
    for(var i=0; i<res.data.length;i++){
      if(res.data[i].identity == 2){ // participants
        parts.push(res.data[i].name);

      }else{
        managers.push(res.data[i].name);
      }
    }
      
  });
  return{
    managers: managers,
    parts: parts
    }
  
}
