// pages/mainPage/mainPage.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scroll_height: 350,
        code:'',
        active:0,
        sideBarActiveKey:0,
        powerActivities:[],//获取活动权限，来自数据库
        activities:[],//所有的活动，来自数据库
        activitiesOnGoing:[],//正在进行的活动，来自数据库
        activitiesYetBegin:[],//尚未开始的活动，来自数据库
        activitiesAlready:[],//已结束的活动，来自数据库
        allActivitiesYetBegin:[],
        activityID:0,//参加活动时此处获取ID。
        activityID_str:'',
        activityKey:'',//参加活动时此处获取密码
        begin:false,
        showPopup:false,
        showRight:false,
        showWrong:false,
        haveLoggedIn:false,
        activityid_trans:0,//。
        user_id:'',
        name:'',
        user_activity_in_actors:[],
        times:0,
        achievements:[],
        format:0,
        openid:''
    },
    /**
     * 
     * 加入活动
     */
    showPopup() {
        this.setData({ show: true });
    },
    onIDDone(event){
        this.setData({
            activityID_str : event.detail
        })
    },
    onKeyDone(event){
        this.setData({
            activityKey : event.detail
        })
    },
    onNameDone(event){
        this.setData({
            name : event.detail
        })
    },
    onDone(){
        if(this.data.name==""){
            Toast.fail("请输入昵称")
            return;
        }
        this.onClose();
        let str_to_int_id = parseInt(this.data.activityID_str)
        this.setData({
            activityID:str_to_int_id
        })
        let Key = this.data.activityKey;
        const db=wx.cloud.database();
        db.collection('activities')
        .where({
            id: this.data.activityID
        })
        .get()
        .then(res=>{
            if(res.data[0]==null) {
                Toast.fail("活动不存在")
            }
            else{
                this.setData({
                    format : res.data[0].format
                })
                var state = res.data[0].state;
                var password = res.data[0].password;
                try{
                    wx.cloud.callFunction({
                        name: 'whetherHaveAdded',
                        data: {
                          wxid: this.data.openid,
                          id: this.data.activityID
                        },
                      }).then(res=>{
                        var addTmp = true;
                        if(res.result.boo == false)
                            addTmp = false;
                        console.log(this.data.name)
                        wx.cloud.callFunction({
                            name: 'whetherHaveName',
                            data: {
                                name: this.data.name,
                                id: this.data.activityID
                            },
                            }).then(res=>{
                                var nameTmp = true;
                                console.log(res.result)
                                if(res.result.boo==false) nameTmp=false;
                                if(state==2&&password==Key&&addTmp&&nameTmp){
                                    Toast.success('加入成功');
                                    this.testName_achievements();
                                    this.participateIn();
                                }
                                else if(state==2&&password==Key&&!addTmp){
                                    Toast.fail('     已加入\n无需重复加入')
                                }
                                else if(state==2&&password==Key&&addTmp&&!nameTmp){
                                    Toast.fail('该昵称已被占用')
                                }
                                else{
                                    if(password!=key) Toast.fail('密码有误\n 请重试')
                                    else if(state!=2) Toast.fail('活动已开始\n 无法加入');
                                    else Toast.fail('加入失败\n 请重试')
                                    this.setData({
                                        activityID:0,
                                    })
                                }
                            })
                      }).catch(err=>{
                          console.log(err)
                          console.log("fail")
                      })
                }catch(e){
                    console.log(e)
                }
            }
        })
        this.setData({
            activityKey:'',
            activityID_str:''
        })
    },
    /*双向绑定关闭加入活动窗口*/
    onClose() {
        this.setData({ 
            showPopup: false 
        });
    },
    //起名鬼才判定
    testName_achievements(){
        let str = this.data.name;
        if(str.indexOf("?") != -1||str.indexOf("*") != -1||str.indexOf("!") != -1||
           str.indexOf("。")!=-1||str.indexOf("？") != -1||str.indexOf("、") != -1||
           str.indexOf("\\")!=-1||str.indexOf("！") != -1||str.indexOf("%") != -1||
           str.indexOf("~") != -1||str.indexOf("<") != -1||str.indexOf(">") != -1){
            let ach=this.data.achievements;
            console.log("before change"+ach)
            if(ach[3]==1&&ach[5]==1) return;
            if(this.data.format!=2&&ach[3]==1) return;
            if(this.data.format==2) ach[5]=1;
            ach[3]=1;
            console.log("after change"+ach)
            this.setData({
                achievements:ach
            })
            wx.cloud.callFunction({
                name: 'UpdateAchievements',
                data: {
                _id: this.data.user_id,
                achievements:this.data.achievements
                },
            })
            .then(res=>{})
        }
    },
    /*将本用户加入actors中*/
    participateIn(){
            let a = []
            a.push({"id":this.data.activityID,"identity":2,"name":this.data.name,"wxid":this.data.openid})
            let b=this.data.times
            b=b+1
            this.setData({
                user_activity_in_actors:a,
                times:b
            })
            this.decideAchievements();
            wx.cloud.callFunction({
                name: 'participateIn',
                data: {
                    user_id:this.data.user_id,
                    actors_item:this.data.user_activity_in_actors,
                    times:this.data.times
                },
                success:(res)=>{
                    wx.redirectTo({
                      url: '/pages/mainPage/mainPage',
                    })
                }
            })
    },
    /**
     * 
     *  底部标签栏跳转 
     */
    onChange(event) {
        // event.detail 的值为当前选中项的索引
        this.setData({ active: event.detail });
        if(this.data.active==1)
          wx.redirectTo({
            url: '/pages/minePage/minePage',
          })
      },
    onActivityChange(event){
      this.setData({sideBarActiveKey:event.detail});
    },
    /**
     * 
     * 单个活动详情跳转
     */
    onJump(e){
        this.setData({
            activityid_trans:e.currentTarget.dataset.buttommsg.id
        })
        let already =false;
        for(let i=0;i<this.data.activitiesAlready.length;i++){
            if(this.data.activitiesAlready[i].id==this.data.activityid_trans){
                already = true;
            }
        }
        for(var i=0;i<this.data.powerActivities.length;i++){
            if(this.data.activityid_trans==this.data.powerActivities[i].id){
                //1是管理员，2是普通成员
                if(this.data.powerActivities[i].identity==1){//管理员活动详情
                    wx.navigateTo({
                        url: '/pages/detailpage_formanager/detailpage_formanager',
                        success:(res)=>{
                            res.eventChannel.emit('activity',this.data.activityid_trans)
                        }
                    })
                }
                else if(this.data.powerActivities[i].identity==2&&!already){//普通成员 活动正在进行
                    wx.navigateTo({
                        url: '/pages/detailpage_forparticipants/detailpage_forparticipants',//活动详情
                        success:(res)=>{
                            res.eventChannel.emit('activity',this.data.activityid_trans)
                        }
                    })
                }
                else if(this.data.powerActivities[i].identity==2&&already){//普通成员，活动已结束
                    wx.navigateTo({
                        url: '/pages/detail_done/detail_done',//活动详情
                        success:(res)=>{
                        console.log(this.data.activityid_trans)
                        res.eventChannel.emit('activity',this.data.activityid_trans)
                        }
                    })
                }
            }
        }
    },


    navi(){
        wx.navigateTo({
            url: '/pages/showpage/showpage',//发起活动
        })
    },
    
    onClose() {
      this.setData({ show: false });
    },
    /**
       * 
       * 单个活动详情跳转
       */
    joinActivity(){
        this.setData({
            show:true
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
        })
        .then(res=>{ 
            this.setData({ 
                openid:res.result.openid 
            }) 
            const db = wx.cloud.database();
            db.collection('users')
            .where({
                wxid: this.data.openid
            })
            .get()
            .then(res=>{
                if(res.data[0]==null){
                    this.addNewUser();
                }else{
                    this.setData({
                        times:res.data[0].times,
                        user_id:res.data[0]._id,
                        achievements:res.data[0].achievements
                    })
                    this.findThisPersonInDataBase() 
                }
            })
        }) 
      //滚动轴高度设置
      var windowHeight = wx.getSystemInfoSync().windowHeight;

      let query = wx.createSelectorQuery().in(this);
        // 然后逐个取出navbar和header的节点信息
        // 选择器的语法与jQuery语法相同
        query.select('#col').boundingClientRect();
        query.select('#tabbar').boundingClientRect();


        // 执行上面所指定的请求，结果会按照顺序存放于一个数组中，在callback的第一个参数中返回
        query.exec((res) => {
            let tabbarTop = res[1].top;
            let colTop = res[0].top;
        
            // 然后就是做个减法
            let scroll_height = tabbarTop - colTop;
            this.setData({
              scroll_height:scroll_height
            })  
      })
    },
    //积极分子判定
    decideAchievements(){
       if(this.data.times==10){
            let ach=this.data.achievements;
            ach[1]=1;
            this.setData({
                achievements:ach
            })
        wx.cloud.callFunction({
            name: 'UpdateAchievements',
            data: {
              _id: this.data.user_id,
              achievements:this.data.achievements
            },
          })
          .then(res=>{})
       }
    },
    //同一账号是否多次加入同一活动
    // 加入了重复的：false；没加：true
    whetherHaveAdded(){
        wx.cloud.callFunction({
            name: 'whetherHaveAdded',
            data: {
                wxid: this.data.wxid,
                id: this.data.activityID
            },
        }).then(res=>{
            return res.result.boo
        })
    },
    whetherHaveName(){
        wx.cloud.callFunction({
            name: 'whetherHaveName',
            data: {
                name:this.data.name
            },
        }).then(res=>{
            return res.result.boo;
        })
    },
    addNewUser(){ 
        wx.cloud.callFunction({ 
            name: 'addNewUser', 
            data: { 
                openid: this.data.openid, 
            }, 
        })
        .then(result=>{ 
            const db=wx.cloud.database(); 
            db.collection("users") 
            .where({ 
                wxid:this.data.openid 
            }) 
            .get() 
            .then(res=>{ 
                console.log(res)
                this.setData({ 
                    user_id:res.data[0]._id, 
                    times:res.data[0].times,
                    achievements:res.data[0].achievements 
                }) 
                this.findThisPersonInDataBase()
            }) 
        }) 
         
    }, 
    findThisPersonInDataBase(){ 
        wx.cloud.callFunction({
            name: 'ItemInMainPage',
            data: {
                wxid:this.data.openid
            },
        })
        .then(result=>{ 
            const db=wx.cloud.database();
            this.setData({ 
                powerActivities:result.result.result
            }) 
            for(var i=0;i<this.data.powerActivities.length;i++){
                let id_this = this.data.powerActivities[i].id; 
                let act = this.data.activities; 
                db.collection("activities") 
                .where({ 
                    id:id_this 
                }) 
                .get() 
                .then(res=>{ 
                    act.push(res.data[0]) 
                    this.setData({ 
                        activities:act 
                    }) 
                    this.otherthreeInit(); 
                }) 
            } 
        }) 
    }, 
    otherthreeInit(){
        var length=this.data.activities.length;
        for(var i = length-1;i<length;i++){
            switch(this.data.activities[i].state){
                case 1:{
                    let act = this.data.activitiesOnGoing;
                    act.push(this.data.activities[i])
                    this.setData({
                        activitiesOnGoing:act
                    })
                    break;
                }
                case 2:{
                    let act = this.data.activitiesYetBegin;
                    act.push(this.data.activities[i])
                    this.setData({
                        activitiesYetBegin:act
                    })
                    break;
                }
                case 3:{
                    let act = this.data.activitiesAlready;
                    act.push(this.data.activities[i])
                    this.setData({
                        activitiesAlready:act
                    })
                    break;
                }
            }
        }
    },
    //////////////////////////////////////////////////////////////////
})