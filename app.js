// app.js
App({
  onLaunch() {
    this.autoUpdate()
    wx.cloud.init({
        env:'cloud1-4gipvfh4f25a7740'
    })
  },
  autoUpdate(){
      var self=this
      // 获取小程序更新机制兼容
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        //1. 检查小程序是否有新版本发布
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            //2. 小程序有新版本，则静默下载新版本，做好更新准备
            updateManager.onUpdateReady(function () {
              console.log(new Date())
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  } 
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
              })
            })
          }
        })
      } 
    }
    
  

  //   // 展示本地存储能力
  //   const logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)

  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //     }
  //   })
  // globalData: {
  //   userInfo: null
  // }
  
})
