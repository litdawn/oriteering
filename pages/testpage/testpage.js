import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

// 引入util.formatTime()方法，实现获得当前时间
var util = require('../../utils/util.js')
// 获取应用实例
const app = getApp()

Page({
  data: {
    actId: 0,
    routeNO: 100,// 路线编号 0-4
    openid:0,
    // 二维码的内容
    qRCodeMsg:"",
    // //地图的初始定位经纬度
    // mapLongitude : 118.95444,
    // mapLatitude : 32.11583,
    //输入框的初始化值
    initialValue:"",
    activeNames_rank: ['1'],
    activeNames_point: ['1'],
    active_step: -1,
    currentPoint:-1,//上一个打卡的打卡点
    currentArray:0,
    steps: [//属于“成绩记录”组件，同时可以作为 正确点标旗号序列correctFlagArray（可能会有一个点标旗跑两次）
      {
        text: '正在加载，请稍等......',
        desc: '',
      },
    ],
    
        
      //点标旗列表
      flags: [
        {
          order: -1, //打点顺序（地图实际顺序）（目前无用）
          password:54188,//点标旗的密码（注意：不能为“000”！！！）
          title: 'CLEAR', //名称（趣味定向中，可作为活动名称）
          weight: 1,//权重
          active: true,//是否被激活（有些隐藏点，部分参赛者没有权限）
        },{
          order: 0, 
          password:100, 
          title: 'START',  
          weight: 1, 
          active: true, 
        },{
          order: 1, 
          password:111, 
          title: '点标旗1', 
          weight: 1, 
          active: true, 
        },{
          order: 2, 
          password:222, 
          title: '点标旗2', 
          weight: 1, 
          active: true,
        },{
          order: 3,
          password:333,
          title: '点标旗3',
          weight: 1,
          active: true,
        },{
          order: 4,
          password:444,
          title: 'THE END',
          weight: 1,
          active: true,
        }
      ],
      //正确点标旗号序列（可能会有一个点标旗跑两次）
      correctFlagArray :  ['START','点标旗1','点标旗2','点标旗3','点标旗2','THE END'],

      //成绩单
      scoreOfTime:[],//每一项有效打卡的时间
      scoreOfFlag:[],//每一项有效打卡的点标旗（对象）
      finalResult:"",//最后输出的成绩（本次比赛成绩无效/有效 & sumOfTime）
      sumOfTime:0,//最后输出的总时间
      isValid:false,//最后输出的成绩单是否有效


  },


    
  onShow(o) {
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad(o) {
    let actId_tmp = JSON.parse(o.ID)// 获取 活动id
    let routeNO_tmp = JSON.parse(o.ROUTENO)// 获取 路线号
    this.setData({
      actId:actId_tmp,
      routeNO:routeNO_tmp,  
    })
    console.log("1 |||||||||||||||||||||||||"+this.data.actId);
    console.log("2 |||||||||||||||||||||||||"+this.data.routeNO);
    


    // 因为涉及到异步，所以使用then()层层嵌套。先获取wxid，再获取points routes steps，最后获取页面备份
    // 读取用户的wxid
    wx.cloud.callFunction({
      name:'login',
    }).then(res=>{
      this.setData({
          openid:res.result.openid
      })
    }).then(res=>{
    
      const db=wx.cloud.database();
  
      // pointsTable中，有 点 (points) 和 路线 (routes)
      db.collection('pointsTable')
      .where({
        id: this.data.actId
      })
      .get()
      .then(res=>{
        // 1. 根据id和routeNO，从数据库获得 点 和 路线
        this.setData({
          flags: res.data[0].points,
          correctFlagArray: res.data[0].routes[this.data.routeNO]
        })        
      })
      .then(res=>{
        // 2. 根据 点 和 路线，生成新的steps
        var step_tmp = {};
        var steps_tmp = [];
        
        for (let i = 0; i < this.data.correctFlagArray.length; i++) {
          step_tmp = {text:this.data.correctFlagArray[i],desc:''};
          steps_tmp.push(step_tmp);
        }
    
        this.setData({
          steps:steps_tmp
        })
        
      })
      .then(res=>{

  
      // 从 testpage_backup 中，获取 testpage 之前的状态
      db.collection('testpage_backup')
      .where({
        actId: this.data.actId,//pk
        routeNO:this.data.routeNO,// 路线号 
        openid:this.data.openid,//微信ID
      })
      .get()
      .then(res=>{
        if(res.data.length == 0){// 即 collection中没有需要的元组
          // 创建空表，data区为默认值
                      db.collection('testpage_backup')
                      .get().then(res=>{
                          db.collection('testpage_backup')
                              .add({
                                  data:{
                                      actId: this.data.actId,//pk
                                      routeNO:this.data.routeNO,// 路线号 
                                      openid:this.data.openid,//微信ID
  
                                      active_step: this.data.active_step,
                                      currentPoint: this.data.currentPoint,
                                      currentArray: this.data.currentArray,
                                      steps: this.data.steps,
                                      scoreOfTime: this.data.scoreOfTime,
                                      scoreOfFlag: this.data.scoreOfFlag,
                                      
                                  }
                              })
                              
                      })
  
                      
        }else{// 即 collection中有需要的元组
          
                  this.setData({
                    active_step: res.data[0].active_step,
                    currentPoint: res.data[0].currentPoint,
                    currentArray: res.data[0].currentArray,
                    steps: res.data[0].steps,
                    scoreOfTime: res.data[0].scoreOfTime,
                    scoreOfFlag: res.data[0].scoreOfFlag,
                    
                  })
  
  
        }
        
        
  
        
  
    })





      })

  
  
      



    })
    console.log("3 |||||||||||||||||||||||||"+this.data.openid);


    
  },

  
  //最终成绩单折叠面板
  onChange_rank(event) {
    this.setData({
      activeNames_rank: event.detail,
    });
  },

  //打卡记录折叠面板
  onChange_point(event) {
    this.setData({
      activeNames_point: event.detail,
    });
  },

  
  // 打卡方式：扫描二维码（调用checkPassword）
  getQRCode: function(){
    var _this = this;
    
      wx.scanCode({ // 扫描二维码 API
        success: function(res){
          _this.setData({
            qRCodeMsg: res.result
          })
          
          _this.checkPassword(_this.data.qRCodeMsg)// 调用checkPassword

        }

      });
  },

  // 打卡方式：输入密码（调用checkPassword）
  getInputCode: function(event){
    this.checkPassword(event.detail.value);// 调用checkPassword
  },


  // 处理密码
  checkPassword: function (m_password) {
    //获取当前时间
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var TIME = util.formatTime(new Date());

    //tip=0打卡失败，tip=1打卡成功，tip=2清除成功
    var tip = 0;

    // 创建云数据库对象
    const db=wx.cloud.database();

    if (this.data.flags[0].password == m_password) { // if 输入的m_password是 “清除”
      //清除提示 tip
      tip = 2;
      Toast.success('清除成功');

      //清除“最终成绩单”中所有的成绩记录（m_password是输入的点标旗的密码）
      this.data.scoreOfTime=[];//每一项有效打卡的时间
      this.data.scoreOfFlag=[];//每一项有效打卡的点标旗（对象）

      //清除“打卡记录”(steps组件)中所有的成绩记录
      var copy = this.data.steps;
      for ( ; this.data.currentPoint >= 0;  this.data.currentPoint--) {
        copy[this.data.currentPoint].desc = "";
      }

      this.data.currentArray = 0;

      this.setData({
        //打卡记录前进
        active_step: -1,
        //记录当前时间
        steps: copy,
      })


    }else{
      for (let i = 1 ; i < this.data.flags.length ; i++) {// 判断 是否 输入的password是 常规点
        const flag = this.data.flags[i];

        if (flag.password == m_password) {
          //点镖旗输入正确
          tip = 1;
          Toast.success('打卡成功');
          if(flag.title == this.data.correctFlagArray[this.data.currentArray]){
            //有效打卡
            this.data.currentArray ++;
            this.data.currentPoint ++;
            var copy = this.data.steps;
            copy[this.data.currentPoint].desc = TIME.toString();
            this.setData({
              //打卡记录前进
              active_step: this.data.currentPoint,
              //记录当前时间
              steps: copy
            })
          }

          
          
          //更新成绩（m_password是输入的点标旗的密码）
          this.data.scoreOfTime.push(TIME);
          this.data.scoreOfFlag.push(flag);


  
          // 根据id创建results的一个table

          db.collection('results')
              .get().then(res=>{
                  db.collection('results')
                      .add({// 在results中，加入单条的打卡记录
                          data:{
                              id: this.data.actId,//pk 活动id
      
                              wxid:this.data.openid,//微信ID
      
                              routeNO:this.data.routeNO,// 路线号
      
                              point: flag,

                              time:TIME// 当前时间戳
                          }
                      })
              })


          break;

        }

      }



      //点标旗输入错误
      if(tip == 0){
        Toast.fail('打卡失败');
        }

    }
    
    
    this.setData({
      //初始化(清空)input
      initialValue:"",
      //初始化(清空)最终成绩
      finalResult:"",

    })



    // 每次打卡之后，数据库备份当前页面
    db.collection('testpage_backup')
    .where({
      actId: this.data.actId,//pk
      routeNO:this.data.routeNO,// 路线号 
      openid:this.data.openid,//微信ID
    })
    .get()
    .then(res=>{
      if(res.data.length == 0){// 即 collection中没有需要的元组
        // 创建空表
                    db.collection('testpage_backup')
                    .get().then(res=>{
                        db.collection('testpage_backup')
                            .add({
                                data:{
                                    actId: this.data.actId,//pk
                                    routeNO:this.data.routeNO,// 路线号 
                                    openid:this.data.openid,//微信ID

                                    active_step: this.data.active_step,
                                    currentPoint: this.data.currentPoint,
                                    currentArray: this.data.currentArray,
                                    steps: this.data.steps,
                                    scoreOfTime: this.data.scoreOfTime,
                                    scoreOfFlag: this.data.scoreOfFlag,
                                }
                            })
                            
                    })

                    
      }else{// 即 collection中有需要的元组
        
                //修改数据库的值
                db.collection('testpage_backup').doc(res.data[0]._id).update({
                  data: {
                    active_step: this.data.active_step,
                    currentPoint: this.data.currentPoint,
                    currentArray: this.data.currentArray,
                    steps: this.data.steps,
                    scoreOfTime: this.data.scoreOfTime,
                    scoreOfFlag: this.data.scoreOfFlag,
                  }
                })


      }
      
      






  })





    

  },




  // 计算时间差，并处理时间戳，最后规格化输出 d:h:m:s
  timedifference: function (faultDate, completeTime) {
    var stime = Date.parse(new Date(faultDate));//获得开始时间的毫秒数
    var etime = Date.parse(new Date(completeTime));//获得结束时间的毫秒数
    var usedTime = etime - stime; //两个时间戳相差的毫秒数
    var days = Math.floor(usedTime / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));//将剩余的毫秒数转化成小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));//将剩余的毫秒数转化成分钟
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000);//计算分钟数后剩余的毫秒数
    var seconds = Math.floor(leave3/1000);//将剩余的毫秒数转化成秒数

    var dayStr = days == 0 ? "" : days + "d:";
    var hoursStr = hours == 0 ? "" : hours + "h:";
    var minutesStr = minutes == 0 ? "" : minutes + "m:"
    var time = dayStr + hoursStr + minutesStr + seconds + "s";
    return time;
  },


  


  isValid: function () {//isValid判断最终成绩单是否有效，直接看打卡记录是否全部填满（结合steps）
    if ( (this.data.currentPoint + 1) == this.data.steps.length) {
      return true;
    }else{
      return false;
    }
  },





  //打印最终成绩（格式化输出字符串）：
  //  sumOfTime = scoreOfTime中第一个start和最后一个END的时间差 
  //  如果没有进行任何有效打卡，最终成绩单为"尚未进行打点！"
  //  如果没有START或END，显示"没打起点！"或"没打终点！"（PS：参赛者输入start和end之后，才能打印成绩！）
  //  最终成绩单显示成绩是否有效，且无论是否有效，都显示 sumOfTime
  printScorePaper: function (m_scoreOfFlag,m_scoreOfTime) {//"m_"表示成员变量

    var m_output="";  
    var m_sumOfTime="";

    if (m_scoreOfFlag.length == 0) {// 没有进行任何有效打卡，最终成绩单为空
      m_sumOfTime="尚未进行打点！";
      m_output="尚未进行打点！";
      
    }else{
      // 格式化输出
      var index_temp = 0;
      m_output += index_temp.toString()  + " " + m_scoreOfFlag[index_temp].title.toString()  + " " + m_scoreOfTime[index_temp].toString() + "\r\n";
      index_temp++;
      for ( ; index_temp < (m_scoreOfFlag.length) ; index_temp++) {
        m_output += index_temp.toString()  + " " + m_scoreOfFlag[index_temp].title.toString()  + " " + m_scoreOfTime[index_temp].toString() + " | " + this.timedifference(m_scoreOfTime[index_temp-1], m_scoreOfTime[index_temp]) + "\r\n";
      }
  
      m_output += this.isValid(m_scoreOfFlag,this.data.correctFlagArray) ? ( "您本次比赛的最终成绩有效，") : ("您本次比赛的最终成绩无效，");

      
      // 计算scoreOfTime中，第一个start和最后一个END的时间差 
      var index_START = 0;// 第一个start
      for ( ; index_START < m_scoreOfFlag.length; index_START++) {
        if (m_scoreOfFlag[index_START].title == 'START') {
          break;
        }
      }
      var index_END = -1;// 第一个使成绩有效的END
      for (let idx = 0 ; idx < m_scoreOfFlag.length; idx++) {
        if (m_scoreOfFlag[idx].title == 'THE END') {
          index_END = idx;
        }
      }
      
      if (index_START ==  m_scoreOfFlag.length) {//  如果没有START，显示"没打起点！"
        m_sumOfTime = "没打起点！";
        m_output += "没有成绩，因为没打起点！" + "\r\n" ;
      }else if (index_END ==  -1) {//  如果没有END，显示"没打终点！"
        m_sumOfTime = "没打终点！";
        m_output += "没有成绩，因为没打终点！" + "\r\n" ;
      }else{
        m_sumOfTime=this.timedifference(m_scoreOfTime[index_START], m_scoreOfTime[index_END]);
        m_output += "总时间为" + m_sumOfTime.toString() + "。" + "\r\n" ;
      }

    }

    
    this.setData({
      sumOfTime:m_sumOfTime,//最后输出的总时间
      isValid:this.isValid(m_scoreOfFlag,this.data.correctFlagArray) ,//最后输出的成绩单是否有效
    })

    console.log(this.data.sumOfTime + "   " + this.data.isValid);
    
    Toast.success('提交成功！');

    return m_output;


  },
  



  
  // 最终成绩上传数据库
  getFinalResult: function (e) {
    var output=this.printScorePaper(this.data.scoreOfFlag , this.data.scoreOfTime);

    // 最终成绩单（前端） 
    this.setData({
      finalResult:output,
    })


    // 根据id创建scorepapers的一个table（后端）
    var MTM_id = "";

    const db=wx.cloud.database();

    db.collection('scorepapersTable')
    .where({
      id: this.data.actId,//pk
      wxid:this.data.openid,//微信ID
      routeNO:this.data.routeNO,// 路线号
    })
    .get()
    .then(res=>{
      if(res.data.length == 0){// 即 collection中没有需要的元组
        // 创建空表
                    db.collection('scorepapersTable')
                    .get().then(res=>{
                        db.collection('scorepapersTable')
                            .add({
                                data:{
                                    id: this.data.actId,//pk

                                    wxid:this.data.openid,//微信ID

                                    routeNO:this.data.routeNO,// 路线号

                                    result: this.data.finalResult,

                                    isValid: this.data.isValid,// 最终成绩是否有效

                                    sumOfTime: this.data.sumOfTime,// 最终的总时间
                                }
                            })
                            
                    })

                    console.log("]]]]]]]]]]]]]]]]]]]]]]]]]" );
      }else{// 即 collection中有需要的元组
        // 更新表
                console.log("[[[[[[[[[[[[[[[[" );
                MTM_id = res.data[0]._id;
            
                //修改数据库的值
                db.collection('scorepapersTable').doc(res.data[0]._id).update({
                  data: {
                    result: this.data.finalResult,
                    isValid: this.data.isValid,// 最终成绩是否有效
                    sumOfTime: this.data.sumOfTime,// 最终的总时间
                  }
                })

                // // PS：放弃使用云函数，此段调用云函数代码有bug。
                // wx.cloud.callFunction({
                //   name: 'updateScorepaper', 
                //   data: {
                //     _id: MTM_id,
                //     tunnel_result: this.data.finalResult,
                //     tunnel_isValid: this.data.isValid,// 最终成绩是否有效
                //     tunnel_sumOfTime: this.data.sumOfTime,// 最终的总时间
                //   },
                //   success: res => {
                //     console.log("成功")
                //     console.log("1@@@@@@@@"+MTM_id)
                //     console.log("2@@@@@@@@"+this.data.finalResult)
                //     console.log("3@@@@@@@@"+this.data.isValid)
                //     console.log("4@@@@@@@@"+this.data.sumOfTime)
                //   }
                // })


      }
      
      






  })





  },


  


})
