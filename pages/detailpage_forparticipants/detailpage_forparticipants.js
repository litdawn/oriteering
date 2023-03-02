// pages/detailpage_forparticipants/detailpage_forparticipants.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({


  data: {
    routesNum_detailpageForParticipants:1,
    //以下来自activities
    actId: 0,
    actName: "",
    actTime: "",
    actArea: "",
    actHost: "",
    actPassword: "",
    actkind: 0,
    groupSize: 0,
    trueLeaderKey:"",
    openid: "",
    actState: 0,


    //以下来自actors
    wxid:"",
    openid:"",
    groupid: -1,
    actorIdentity_int: -1, //0未加入，1队长，2成员


    leaderKey:"",
    showShare: false,
    showBecomeLeader: false,
    showChangeGroup: false,
    actorIdentity: "",
    memberArray: [], //队员姓名列表
    leaderName: "",
    teamNum: 1,
    list:"",
    freeArray: [], //groupid=0人 
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
    ],
  },




  onLoad(o) {},



  actorIdentity_intToSTr(){
    var intVer = this.data.actorIdentity_int;
    if(intVer == 0){
      this.setData({ actorIdentity: "未加入小队"});
    }else if(intVer == 1){
      this.setData({ actorIdentity: "队长"});
    }else{
      this.setData({ actorIdentity: "队员"});
    }
  },


  onShow(o) {
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


      const db=wx.cloud.database();
      db.collection("actors")
      .where({
        wxid: this.data.wxid,
        id: this.data.actId,
      })
      .get()
      .then(res=>{
        this.setData({
          groupid: res.data[0].groupid,
          openid: res.data[0]._id,
          actorIdentity_int: res.data[0].whetherLeader
        })
        this.actorIdentity_intToSTr();
        console.log(this.data.groupid);

      

//从数据库获得路线数量

db.collection("pointsTable")
.where({
  id: this.data.actId
})
.get()
.then(res=>{
  this.setData({
    routesNum_detailpageForParticipants: res.data[0].routesNum
  })
})



      
//从数据库获得活动简要信息
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
    actPassword: res.data[0].password,
    actkind: res.data[0].format,
    actState: res.data[0].state
  })
  if(res.data[0].format == 2){
    this.setData({
      groupSize: res.data[0].groupsize,
      trueLeaderKey: res.data[0].leaderkey
    })
  }
  if(this.data.groupid != 0){

  
  wx.cloud.callFunction({ 
    name:'findMember',
    data:{  
      id: this.data.actId,
      groupid: this.data.groupid
    }
  }).then(res=>{ 
    console.log(res.result);
      this.setData({ 
          memberArray: res.result.result,
          leaderName: res.result.leader,
          teamNum: 1 + res.result.result.length
      })
      var list = ""; 
      list += this.data.leaderName + "\n";
    for(var i=0; i<this.data.memberArray.length; i++)
      list += this.data.memberArray[i] + "\n";

    this.setData({ list: list});
    console.log(this.data.list);
  })
}

  
    })
})
    })

  })
    


  },

 

    //以下4个函数与邀请相关
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

    // onShareTimeline: function (res) {
    //   var str = "活动编号：" + this.data.actId + " 密码：" + this.data.actPassword;
    //   return {
    //     title: str,
    //     path: 'pages/mainPage/mainPage', // 这里改成首页url
    //     imageUrl: 'https://636c-cloud1-4gipvfh4f25a7740-1311027024.tcb.qcloud.la/%E5%8D%8A%E5%BC%A0.png?sign=a80dd8e3a5f94e5cbab7077e6245fb0c&t=1652014496'
    //   }
    // },

    
    onLinkToProcess: function (e) { // 改用了xwz的管道传输方法
      console.log(e.target.id);// e.target.id 是 “比赛进程n” 按键的id号，里面有index来确定路线

      wx.navigateTo({
        url: '../testpage/testpage?ID=' + this.data.actId + '&ROUTENO=' + e.target.id.substring(7),
      });

    },


    //以下5个函数与成为队长有关
    toBecomeLeader: function (e) {
      this.setData({ showBecomeLeader: true });
    },
    onCloseBL() {
      this.setData({ showBecomeLeader: false });
    },
    onLeaderKeyDone(event){
      this.setData({ leaderKey : event.detail });
    },
    onDone(){
      this.onCloseBL();
      if(this.data.trueLeaderKey == this.data.leaderKey){
        Toast.success('成为队长成功')
        this.leaderIn();
      }else{
        Toast.fail('成为队长失败')
      }
    },
    leaderIn(){
      this.setData({ actorIdentity_int: 1});
      this.actorIdentity_intToSTr();
      //TODO 创建团队，同时把队长信息写入数据库
      wx.cloud.callFunction({
        name:'getCurGroupId',
        data:{
          id: this.data.actId,
        }
      }).then(res=>{
        console.log(res.result);
          this.setData({ 
              groupid: res.result.groupid
          })
        // wx.cloud.callFunction({ 
        //   name:'findMember',
        //   data:{
        //     id: this.data.actId,
        //     groupid: res.result.groupid
        //   }
        // }).then(res=>{ 
        //     this.setData({ 
        //         memberArray: res.result.result,
        //         leaderName: res.result.leader,
        //         teamNum: 1 + res.result.result.length

        //     })
        wx.cloud.callFunction({
          name:'login', 
          data:{ 
            message:'helloCloud', 
          } 
        }).then(res=>{ 
            this.setData({ 
                openid:res.result.openid 
            })
            db.collection('actors')
            .where({
              wxid: this.data.openid,
              id: this.data.actId
            }) 
            .get().then(res=>{
              var list = "";
              list += res.data[0].name;
              this.setData({list:list})
            })
          //   console.log(res.result);
          //   var list = ""; 
          //   list += this.data.leaderName + "\n";
          // for(var i=0; i<this.data.memberArray.length; i++)
          //   list += this.data.memberArray[i] + "\n";
          // this.setData({ list: list});
          // console.log(this.data.list);
        })

        const db=wx.cloud.database();
        db.collection('groups')
        .add({
          data:{
            groupid: this.data.groupid,
            id: this.data.actId
          }
        })
        .then(res=>{
          wx.cloud.callFunction({
            name: 'updateGroupid',
            data: {
              _id: this.data.openid,
              groupid: this.data.groupid
            },
            success: res => {
              console.log("成功",res.result)
            }
          })

          wx.cloud.callFunction({
            name: 'updateWhetherLeader',
            data: {
              _id: this.data.openid,
            },
            success: res => {
              console.log("成功",res.result)
            }
          })
        })
      })
    },

    // 以下函数与队伍成员有关
    toChangeList: function (e) {
      wx.cloud.callFunction({ 
        name:'findFreeman',
        data:{
          id: this.data.actId,
        }
      }).then(res=>{ 
          this.setData({ 
              freeArray: res.result.result
          }) 
          console.log(this.data.freeArray);

          wx.cloud.callFunction({ 
            name:'findMember',
            data:{
              id: this.data.actId,
              groupid: this.data.groupid
            }
          }).then(res=>{ 
              this.setData({ 
                  memberArray: res.result.result,
                  leaderName: res.result.leader,
                  teamNum: 1 + res.result.result.length

              }) 
            console.log(this.data.memberArray);

          }).then(res=>{
            this.setData({ showChangeGroup: true });
            console.log("smg");
          })

      })
      
    },
    onCloseCL() {

    var list = ""; 
    list += this.data.leaderName + "\n";
    for(var i=0; i<this.data.memberArray.length; i++)
      list += this.data.memberArray[i] + "\n";
    this.setData({ list: list});
      this.setData({ showChangeGroup: false });
    },

    OnMinusMember(e) {

      Toast.success('移除成功！');
      var memberToMinus = e.target.dataset.name;
      var MTM_id = "";
      var memberTemp = this.data.memberArray;
      for(var i=0; i<memberTemp.length; i++){
        if(memberTemp[i] == memberToMinus){       
          memberTemp.splice(i, 1);
          break;
        }
      }
      var freeTemp = this.data.freeArray;
      freeTemp.push(memberToMinus);
      this.setData({
        memberArray: memberTemp,
        freeArray: freeTemp,
        teamNum: memberTemp.length + 1
      })
  
  
      const db=wx.cloud.database();
      db.collection('actors')
      .where({
        id: this.data.actId,
        name: memberToMinus,
      })
      .get()
      .then(res=>{
        // if(res.data.length == 0)
        console.log(res.data);
        MTM_id = res.data[0]._id;
  
  
        //修改数据库的值
      wx.cloud.callFunction({
        name: 'updateGrouplist',
        data: {
          _id: MTM_id,
          groupid: 0,
          wl: 0
        },
        success: res => {
        }
      })
        
  
    })
    },

    OnAddMember(e) {
      if(this.data.teamNum == this.data.groupSize){
        Toast.fail('队伍已满！');
        return;
      }
      Toast.success('添加成功！');

      var memberToAdd = e.target.dataset.name;
      var freeTemp = this.data.freeArray;
      var MTA_id = "";
      for(var i=0; i<freeTemp.length; i++){
        if(freeTemp[i] == memberToAdd){  
          freeTemp.splice(i, 1);
          break;
        }
      }
      var memberTemp = this.data.memberArray;
      memberTemp.push(memberToAdd);
      this.setData({
        memberArray: memberTemp,
        freeArray: freeTemp,
        teamNum: memberTemp.length + 1
      })
  
      //修改数据库的值
      const db=wx.cloud.database();
      db.collection('actors')
      .where({
        id: this.data.actId,
        name: memberToAdd,
      })
      .get()
      .then(res=>{
        console.log(res.data);
        MTA_id = res.data[0]._id;
  
  
        //修改数据库的值
      wx.cloud.callFunction({
        name: 'updateGrouplist',
        data: {
          _id: MTA_id,
          groupid: this.data.groupid,
          wl: 2
        },
        success: res => {
        }
      })
        
  
    })
  
  
  
  
    }



})