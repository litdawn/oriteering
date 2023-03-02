// pages/minePage/minePage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:1,
        canIUseGetUserProfile:false,
        loading : true,
        userimage:'',//用户头像，来自获取用户信息
        username:'',//用户名，来自获取用户信息
        times:0,
        buttonName:'登录',
        openid:'',
        _id:''
    },
    // /**
    //  * 显示骨架屏
    //  */
    // onReady() {
    //   this.setData({
    //     loading: false,
    //   });
    // },
    /**
     * 
     *  底部标签栏跳转 
     */
    
  
    async getUserProfile(e) {
        const res = await wx.getUserProfile({
            desc: '用于完善会员资料',
          });
    },
    onChange(event) {
        // event.detail 的值为当前选中项的索引
        this.setData({ active: event.detail });
        if(this.data.active==0)
          wx.redirectTo({
            url: '/pages/mainPage/mainPage',
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.cloud.callFunction({ 
            name:'login', 
            data:{ 
              message:'helloCloud', 
            } 
          }).then(res=>{ 
              this.setData({ 
                  openid:res.result.openid,
              }) 
              console.log(this.data.openid)
            const db=wx.cloud.database();
            db.collection('users')
            .where({
                wxid: this.data.openid
            })
            .get()
            .then(res=>{
                this.setData({
                    times:res.data[0].times,
                    _id:res.data[0]._id
                })
            })
          }) 
        
    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        if(!this.data.canIUseGetUserProfile)
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res.userInfo)
            this.setData({
              userimage:res.userInfo.avatarUrl,
              username:res.userInfo.nickName,
              canIUseGetUserProfile:true,
              buttonName:'已登录'
            })
          }
        })
      },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})