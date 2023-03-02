// pages/detailpage_formanager/detailpage_formanager.js
Page({


  data: {
    showPopup: false,
    actId: 0,
    actName: "",
    actTime: "",
    actArea: "",
    actHost: "",
    actPassword: "",
    showShare: false,
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
    ],

  },
  onShow(o){

    
    
  },

  onLoad: function (options) {
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
          //从数据库获得活动简要信息
        const db=wx.cloud.database();
        db.collection("activities")
        .where({
          id: this.data.actId
        })
        .get()
        .then(res=>{
          this.setData({
            actId: res.data[0].id,
            actName: res.data[0].name,
            actHost: res.data[0].host,
            actTime: res.data[0].time,
            actArea: res.data[0].area,
            actPassword: res.data[0].password
          })
        })
        })

  },
  onClickPopup(e){
    this.setData({ showPopup: true});
  },
  onClosePopup(e){
    this.setData({ showPopup: false});
  },
  //以下三个函数与邀请相关
  onClick(event) {
    this.setData({ showShare: true });
  },
  onClose() {
    this.setData({ showShare: false });
  },
  onSelect(event) {
    Toast(event.detail.name);
    this.onClose();
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var str = "活动编号：" + this.data.actId + " 密码：" + this.data.actPassword;
    return {
      title: str,
      path: 'pages/mainPage/mainPage', // 这里改成首页url
      imageUrl: 'https://636c-cloud1-4gipvfh4f25a7740-1311027024.tcb.qcloud.la/%E5%8D%8A%E5%BC%A0.png?sign=a80dd8e3a5f94e5cbab7077e6245fb0c&t=1652014496'
    }
  },

  onLinkToInformation(){
      
        wx.navigateTo({
          url: '../information_formanager/information_formanager?ID=' + this.data.actId,
        });

        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+this.data.actId);

  },

  onLinkToList(){
    wx.navigateTo({
      url: '/pages/listpage/listpage',//参与者列表
      success:(res)=>{
      res.eventChannel.emit('list',this.data.actId)
      }
  })
  },

  onLinkToManage(){
    wx.navigateTo({
      url: '/pages/new/new',//管理
      success:(res)=>{
      res.eventChannel.emit('manage',this.data.actId)
      }
  })
  }


  


})