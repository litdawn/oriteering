// pages/achievements/achievements.js
import {achievements} from '../../data/achievements'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        achievements,
        ifNot:{name:"请君探索",icon:"https://636c-cloud1-4gipvfh4f25a7740-1311027024.tcb.qcloud.la/%E6%88%90%E5%B0%B1/%E8%AF%B7%E5%90%9B%E6%8E%A2%E7%B4%A2.png?sign=784fda337dcb13586afa59fcca6444ed&t=1652600051",condition:'?'},
        tempachievements:[],//从数据库中获取
        hadachievements:[],
        yetachievements:[],
        percentage:0,
        shareTempFilePath:'',
        openid:'',
        ratio:0,
        canvasHeight:'',
        canvasWidth:'',
        showShare:false,
        options: [
            { name: '微信', icon: 'wechat', openType: 'share' },
          ],
    },
    onClick(event) {
        console.log("yes")
        this.setData({ showShare: true });
      },
      onClose() {
        this.setData({ showShare: false });
      },
      onSelect(event) {
        this.onClose();
      },
      onShareAppMessage: function (res) {
        if (res.from === 'button') {
          // 来自页面内转发按钮
          console.log(res.target)
        }
        var str = "我的成就";
        return {
          title: str,
          path: 'pages/mainPage/mainPage', // 这里改成首页url
          imageUrl: "https://636c-cloud1-4gipvfh4f25a7740-1311027024.tcb.qcloud.la/%E6%88%90%E5%B0%B1/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202022-05-15%20184848.png?sign=81bf26848339e33a90420540d5af1054&t=1652612443"
        }
      },
    getTempFilePath:function(){
        wx.canvasToTempFilePath({
          canvasId: 'share',
          success: (res) => {
            this.setData({
              shareTempFilePath: res.tempFilePath
            })
          }
        })
    },
    saveImageToPhotosAlbum:function(){
        if (!this.data.shareTempFilePath){
          wx.showModal({
            title: '提示',
            content: '图片绘制中，请稍后重试',
            showCancel:false
          })
        }
        wx.saveImageToPhotosAlbum({
          filePath: this.data.shareTempFilePath,
          success:(res)=>{
            console.log(res)
          },
          fail:(err)=>{
            console.log(err)
          }
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
                  openid:res.result.openid 
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
                    tempachievements:res.data[0].achievements,
                })
                console.log(res.data[0].achievements)
                console.log(this.data.tempachievements)
                let tempYet=[];
                let temphad=[];
                for(var i=0;i<this.data.tempachievements.length;i++){
                    if(this.data.tempachievements[i]==0){
                        tempYet.push(this.data.ifNot)
                    }else{
                        temphad.push(this.data.achievements[i]);
                    }
                }
                console.log(tempYet)
                console.log(temphad)
                this.setData({
                    hadachievements:temphad,
                    yetachievements:tempYet,
                    percentage:temphad.length*100/(temphad.length+tempYet.length)
                })
            })
          })
        wx.getSystemInfo({
            success: res => {
              // console.log(res)
                this.setData({
                    canvasWidth : res.screenWidth + 'px',
                    ratio : 750 / res.screenWidth,
                    canvasHeight : 1000 / this.ratio + 'px'
                })
                console.log(this.data.canvasHeight)
            }
          })
    },
    onJump(e){
        console.log(e.currentTarget.dataset.buttommsg)
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