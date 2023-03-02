import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

// pages/listpage/listpage.js
Page({

  data: {
    // 改一次存一次？
    actId: 0,
    managerArray: [], // 来自数据库

    participantArray: [], // 来自数据库

    managerNUM: 0,
    partNUM: 0
  },


  // dbSyn(){
  //   var var_manager = [];
  //   for(var i=0; i<this.data.db_manager.length; i++){
  //     var_manager.push(this.data.db_manager[i].name);
  //   }
  //   var var_participants = [];
  //   for(var i=0; i<this.data.db_participants.length; i++){
  //     var_participants.push(this.data.db_participants[i].name);
  //   }
  //   this.setData({
  //     managerArray: var_manager,
  //     participantArray: var_participants
  //   })
    
  // },

  onLoad: function (options) {
    // 从上一个页面获取actID
    const eventChannel = this.getOpenerEventChannel();
    var tmp;
    new Promise((resolve, reject) => {
      eventChannel.on('list', function(data) {
        tmp = data
        resolve(tmp)
      })
    }).then((res) => {
      this.setData({ actId:tmp})
      console.log(tmp)
      //从数据库获得成员列表
      const db=wx.cloud.database();
      console.log(this.data.actId);
      wx.cloud.callFunction({
        name: 'findEveryone',
        data: {
          id: this.data.actId
        },
        success: res => {
          this.setData({
            managerNUM: res.result.managers.length,
            partNUM: res.result.parts.length,
            managerArray: res.result.managers,
            participantArray: res.result.parts
          })
        }



  })









    })
    
  

    
},

  OnMinusManager(e) {
    if(this.data.managerNUM == 1){
      Toast.fail('管理员至少一人！');
      return;
    }
    Toast.success('移除管理员成功！');
    var managerToMinus = e.target.dataset.name;
    var MTM_id = "";
    var managerTemp = this.data.managerArray;
    for(var i=0; i<managerTemp.length; i++){
      if(managerTemp[i] == managerToMinus){       
        managerTemp.splice(i, 1);
        break;
      }
    }
    var participantTemp = this.data.participantArray;
    participantTemp.push(managerToMinus);
    this.setData({
      managerArray: managerTemp,
      participantArray: participantTemp,
      managerNUM: this.data.managerNUM - 1,
      partNUM: this.data.partNUM + 1
    })


    const db=wx.cloud.database();
    db.collection('actors')
    .where({
      id: this.data.actId,
      name: managerToMinus,
    })
    .get()
    .then(res=>{
      // if(res.data.length == 0)
      console.log(res.data);
      MTM_id = res.data[0]._id;


      //修改数据库的值
    wx.cloud.callFunction({
      name: 'updatelist',
      data: {
        _id: MTM_id,
        identity: 2
      },
      success: res => {
      }
    })
      

  })
    

  },


  OnAddManager(e) {
    Toast.success('增加管理员成功！');
    var partToAdd = e.target.dataset.name;
    var participantTemp = this.data.participantArray;
    var PTA_id = "";
    for(var i=0; i<participantTemp.length; i++){
      if(participantTemp[i] == partToAdd){        
        participantTemp.splice(i, 1);
        break;
      }
    }
    var managerTemp = this.data.managerArray;
    managerTemp.push(partToAdd);
    this.setData({
      managerArray: managerTemp,
      participantArray: participantTemp,
      managerNUM: this.data.managerNUM + 1,
      partNUM: this.data.partNUM - 1
    })

    //修改数据库的值
    const db=wx.cloud.database();
    db.collection('actors')
    .where({
      id: this.data.actId,
      name: partToAdd,
    })
    .get()
    .then(res=>{
      console.log(res.data);
      PTA_id = res.data[0]._id;


      //修改数据库的值
    wx.cloud.callFunction({
      name: 'updatelist',
      data: {
        _id: PTA_id,
        identity: 1
      },
      success: res => {
        console.log("成功",res.data._id)
      }
    })
      

  })




  }

})