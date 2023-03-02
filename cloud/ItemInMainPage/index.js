// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-4gipvfh4f25a7740'
  })
// 云函数入口函数
exports.main = async (event, context) => {
    return ItemInMainPage(event);
  }
  
  async function ItemInMainPage(event) {
    let result = [];
    await cloud.database().collection("actors").where({
        wxid:event.wxid,
    }).get().then(res =>{
        result = res.data;
    });
    return{
        result: result
    }
  }
// async function ItemInMainPage(event) {
//     const db = cloud.database();
//     const db2 = cloud.database();
//     let result = [];
//     await db.collection("activities").get().then(res =>{
//         result = res.data;
//         for(var i=0;i<result.length;i++){
//             let thisID = result[i].id;
//             if(thisID==0) continue;
//             else{
//             db2.collection("actors").where({
//                 wxid:event.wxid,
//                 id:thisID
//             }).get().then(results =>{
//                 result[i].name = results.data[0].name;
//                 result[i].identity = results.data[0].identity;
//                 console.log(results.data[0])
//                 console.log(result[i])
//             });
//         }
//         }
//     });
//     return{
//         result: result
//     }
// }