import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
// pages/new/new.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        format: 0,
        actId: 1,
        act_id: "",
        cannotClick:false,
        wxid: '',
        scorelist: [],
        wxid_temp:'',
        //先调一下等下记得改
        beforeStart: false,
        afterStart: false,
        afterStart_team: false,
        //打卡点不包括clear
        pointslist: [],
        //显示哪一个打卡点情况
        pointTab: '',
        tablist: [],
        viewTableHeight: 0,
        scroll_height: 0
    },
    
    onStart(){
        Dialog.confirm({
            title: '提醒',
            message: '活动开始后打卡设置将无法改动，是否开始活动？',
        }) 
        .then(() => {
            // on confirm
            this.setData({
                beforeStart: false,
                //afterstart为单人
                // afterStart: true
            })
            
            const db=wx.cloud.database();
            db.collection('activities')
            .where({
              id: this.data.actId,
            })
            .get()
            .then(res=>{
                console.log(res.data[0].format)
                this.setData({format: res.data[0].format})
                if(this.data.format == 2){
                    this.setData({ afterStart_team:true })
                }else{
                    this.setData({ afterStart:true })
                }
                console.log(format)
            })

            wx.cloud.callFunction({
                name: 'updateStatetoOngoing',
                data: {
                  _id: this.data.act_id,
                },
                success: res => {
                  console.log("成功")
                }
            })  
          })
          .catch(() => {
            // on cancel
          });     
    },

    onTerminate(){
        if( this.data.cannotClick == true ){
            return 0 
        }
        Dialog.confirm({
            title: '提醒',
            message: '活动结束后参赛者将无法继续打卡，是否结束活动？',
          })
            .then(() => {
              // on confirm
              Toast.success('结束成功');
              wx.cloud.callFunction({
                name: 'updateState',
                data: {
                  _id: this.data.act_id,
                },
                success: res => { 
                }
            })  
              //没屁用就是变灰了，还得去函数里面禁用
              this.setData({
                  cannotClick:true
              })
            })
            .catch(() => {
              // on cancel
            });     
    },

    onLoad: function (options) {
        //滚动轴高度设置
      var windowHeight = wx.getSystemInfoSync().windowHeight;

      let query = wx.createSelectorQuery().in(this);
        // 然后逐个取出navbar和header的节点信息
        // 选择器的语法与jQuery语法相同
        query.select('#tabbar').boundingClientRect();
        query.select('#button').boundingClientRect();


        // 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
        query.exec((res) => {
            console.log(res);
            let tabbarBot = res[0].bottom;
            let tabbarTop = res[0].top;
            let buttonTop = res[1].top;
        
            // 然后就是做个减法
            let scroll_height = tabbarBot - buttonTop - 10;
            let view_height = tabbarTop - buttonTop - 10;
            this.setData({
              scroll_height:scroll_height,
              viewTableHeight: view_height
            })  
      })

        // 从上一个页面获取actID
    const eventChannel = this.getOpenerEventChannel();
    var tmp;
     new Promise((resolve, reject) => {
      eventChannel.on('manage', function(data) {
        tmp = data
        resolve(tmp)
      })
    }).then(() => {
      this.setData({ actId:tmp})
        const db=wx.cloud.database();
        db.collection('activities')
        .where({
          id: this.data.actId,
        })
        .get()
        .then(res=>{
          console.log(res.data);
        this.setData({
            act_id: res.data[0]._id
        })

        //format
        const db=wx.cloud.database();
        db.collection('activities')
        .where({
            id: this.data.actId,
        })
        .get()
        .then(res=>{
            console.log(res.data[0].format)
            this.setData({format: res.data[0].format})
        })
        
        //若活动State不为2（未开始），统统不要显示开始按钮（beforeStart=false,afterStart=true）
        // const db=wx.cloud.database();
        db.collection('activities')
        .where({
          id: this.data.actId,
        })
        .get()
        .then(res=>{
            if(res.data[0].state!=2){
                this.setData({
                    beforeStart: false,
                    // afterStart: true
                })
                //团队个人
                db.collection('activities')
                .where({
                    id: this.data.actId,
                })
                .get()
                .then(res1=>{
                    console.log(res1.data[0].format)
                    this.setData({format: res1.data[0].format})
                })
                console.log(this.data.format)

                if(this.data.format==2){
                    this.setData({afterStart_team:true})
                }else{
                    this.setData({afterStart: true})
                }
                if(res.data[0].state==3){
                    this.setData({
                        cannotClick:  true
                    })
                    console.log(this.data.cannotClick)
                }
            }else{
                this.setData({
                    beforeStart: true
                })
            }
        })
    })

    
     //从数据库获取成绩列表展示总成绩表格
     console.log(this.data.actId)
     wx.cloud.callFunction({ 
        name:'getScoreTable', 
        data:{ 
          id: this.data.actId 
        } 
      }).then(resscore=>{ 
        console.log(resscore)
        //再获得format
        db.collection('activities')
        .where({
            id: this.data.actId,
        })
        .get()
        .then(res2=>{
            console.log(res2.data[0].format)
            this.setData({format: res2.data[0].format})
        })
        console.log(this.data.format)
        
        if(this.data.format==1){
            var that = this;
            for(var i=0; i<resscore.result.result.data.length;i++){
                if(resscore.result.result.data[i].sumOfTime != 0){ 
                    let var_score = {
                        "name": '',
                        "routeNO": resscore.result.result.data[i].routeNO+1,
                        "sumOfTime": resscore.result.result.data[i].sumOfTime,
                    };
                    if(resscore.result.result.data[i].sumOfTime == "NaNd:NaNh:NaNm:NaNs"){
                        var_score.sumOfTime="NaN"
                    }
                    console.log(var_score)
                    //根据wxid找昵称
                    this.setData({
                        wxid_temp: resscore.result.result.data[i].wxid,
                    })
                    db.collection('actors')
                    .where({
                        wxid:this.data.wxid_temp,
                        id: this.data.actId
                    })
                    .get()
                    .then(res=>{
                        var_score.name=res.data[0].name
                        let a = that.data.scorelist;
                        a.push(var_score)
                        console.log(a)
                        that.setData({
                            scorelist: a
                        });
                    })
                    
                }
            }
        }else{
            var that = this;
            for(var i=0; i<resscore.result.result.data.length;i++){
                if(resscore.result.result.data[i].sumOfTime != 0){ 
                    let var_score = {
                        "groupid": '',
                        "name": '',
                        "routeNO": resscore.result.result.data[i].routeNO+1,
                        "sumOfTime": resscore.result.result.data[i].sumOfTime,
                    };
                    if(resscore.result.result.data[i].sumOfTime == "NaNd:NaNh:NaNm:NaNs"){
                        var_score.sumOfTime="NaN"
                    }
                    console.log(var_score)
                    //根据wxid找昵称
                    this.setData({
                        wxid_temp: resscore.result.result.data[i].wxid,
                    })
                    db.collection('actors')
                    .where({
                        wxid:this.data.wxid_temp,
                        id: this.data.actId
                    })
                    .get()
                    .then(res=>{
                        var_score.name=res.data[0].name
                    })
                     //根据openid找groupid
                     this.setData({
                        openid: resscore.result.result.data[i]._openid,
                    })
                    db.collection('groups')
                    .where({
                        _openid:this.data.openid,
                        id: this.data.actId
                    })
                    .get()
                    .then(resthis=>{
                        console.log(resthis.data[0].groupid)
                        var_score.groupid=resthis.data[0].groupid
                        let a = that.data.scorelist;
                        a.push(var_score)
                        console.log(a)
                        that.setData({
                            scorelist: a
                        });
                    })
                    
                }
            }
            console.log(this.data.scorelist)
        }
       
    
       
      })



   //打印打卡点Tabs
   db.collection('pointsTable')
        .where({
          id: this.data.actId,
        })
        .get()
        .then(res=>{
            console.log(res.data);
            console.log(res.data[0].pointsNum);
            let tmplist = this.data.pointslist;
            for(var i=0;i<res.data[0].pointsNum;i++){
                console.log(res.data[0].points[i].title)
                if(res.data[0].points[i].title!="CLEAR"){
                    tmplist.push(res.data[0].points[i].title)
                }
            }
            this.setData({
                pointslist: tmplist
            })
            console.log(this.data.pointslist);
        })

    })

},

    onTabChange(e) { // 选择查看哪个打卡点
        this.setData({
            tablist: [],
            pointTab: e.detail.title,
        }) 
        console.log(e.detail.title)
        const db=wx.cloud.database();

        wx.cloud.callFunction({ 
            name:'getResTable', 
            data:{ 
              id: this.data.actId 
            } 
          }).then(res=>{ 
              console.log(res.result)
              db.collection('activities')
              .where({
                  id: this.data.actId,
              })
              .get()
              .then(res4=>{
                  console.log(res4.data[0].format)
                  this.setData({format: res4.data[0].format})
              })
              console.log(this.data.format)

              if(this.data.format==1){
                for(var i=0; i<res.result.result.length;i++){
                    console.log(res.result.result[i].point.title)
                    if(res.result.result[i].point.title == this.data.pointTab){ 
                        let point_score = {
                            "name": '',
                            "routeNO": res.result.result[i].routeNO+1,
                            "curTime": res.result.result[i].time.split(" ")[1],
                        };
                        console.log(point_score)
                        this.setData({
                            wxid_temp: res.result.result[i].wxid,
                        })
                        db.collection('actors')
                        .where({
                            wxid:this.data.wxid_temp,
                            id: this.data.actId
                        })
                        .get()
                        .then(res=>{
                            console.log(res.data[0].name)
                            point_score.name=res.data[0].name
                            let a = this.data.tablist;
                            a.push(point_score)
                            console.log(a)
                            this.setData({
                                tablist: a
                            });
                        })
                    }
                }
            }else{
                for(var i=0; i<res.result.result.length;i++){
                    console.log(res.result.result[i].point.title)
                    if(res.result.result[i].point.title == this.data.pointTab){ 
                        let point_score = {
                            "groupid": '',
                            "name": '',
                            "routeNO": res.result.result[i].routeNO+1,
                            "curTime": res.result.result[i].time.split(" ")[1],
                        };
                        console.log(point_score)
                        this.setData({
                            wxid_temp: res.result.result[i].wxid,
                        })
                        db.collection('actors')
                        .where({
                            wxid:this.data.wxid_temp,
                            id: this.data.actId
                        })
                        .get()
                        .then(res=>{
                            console.log(res.data[0].name)
                            point_score.name=res.data[0].name
                        })
                        db.collection('groups')
                        .where({
                            _openid:this.data.wxid_temp,
                            id: this.data.actId
                        })
                        .get()
                        .then(res5=>{
                            console.log(res5.data[0].groupid)
                            point_score.groupid=res5.data[0].groupid
                            let a = this.data.tablist;
                            a.push(point_score)
                            console.log(a)
                            this.setData({
                                tablist: a
                            });
                        })
                    }
                }
            }
            console.log(this.data.tablist)
        
            })
        
    },

   

});