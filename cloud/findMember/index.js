// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-4gipvfh4f25a7740'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return findMember(event);
}

async function findMember(event) {
  let result = [];
  let leader = "";
  await cloud.database().collection("actors").where({
    groupid: event.groupid,
    id: event.id,
    identity: 2
  }).get().then(res =>{
    for(var i=0; i<res.data.length; i++){
      if(res.data[i].whetherLeader == 1)
        leader = res.data[i].name;
      else
        result.push(res.data[i].name);
    }
      
  });
  return{
      result: result,
      leader: leader
    }
  
}
