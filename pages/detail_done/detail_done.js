// pages/detailpage_forparticipants/detailpage_forparticipants.js
Page({


  data: {
    actId: 1,
    actName: "",
    actTime: "",
    actArea: "",
    actHost: "",
    actPassword: "",
    wxid: "",
    result: ""

  },




  onLoad(o) {
    wx.cloud.callFunction({ 
      name:'login', 
      data:{ 
        message:'helloCloud', 
      } 
    }).then(res=>{ 
        this.setData({ 
            wxid:res.result.openid 
        }) 
    
      //从上一个页面获取actID
    const eventChannel = this.getOpenerEventChannel();
    var tmp;
    new Promise((resolve, reject) => {
      eventChannel.on('activity', function(data) {
        tmp = data
        resolve(tmp)
      })
    }).then((res) => {
      this.setData({ actId:tmp})
      console.log(tmp)
    }).then((res) => {
      

      
  //从数据库获得活动简要信息
  const db=wx.cloud.database();

  db.collection("activities")
  .where({
    id: this.data.actId
  })
  .get()
  .then(res=>{
    this.setData({
      actName: res.data[0].name,
      actHost: res.data[0].host,
      actTime: res.data[0].time,
      actArea: res.data[0].area,
      actPassword: res.data[0].password

    })
    
    wx.cloud.callFunction({ 
      name:'findScorepaper', 
      data:{ 
        wxid: this.data.wxid,
        id: this.data.actId 
      } 
    }).then(res=>{ 
      console.log(res);
        this.setData({ 
          
            result:res.result.result
        }) 

      })
  })

    })
  }) 
  },



  onShow(o) {



    


  },


  
 
    
})