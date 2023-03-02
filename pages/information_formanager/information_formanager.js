// pages/information_formanager/information_formanager.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import QR from '../../miniprogram_npm/wxmp-qrcode/index';
import drawQrcode from '../../miniprogram_npm/weapp.qrcode.esm.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",// 用户的wxid
    actId: 0,
    // （以下六行从数据库调）
    actName: "正在加载活动名称，请稍等......",
    actHost: "正在加载主办方，请稍等......",
    actTime: "正在加载活动时间，请稍等......",
    actArea: "正在加载活动地点，请稍等......",
    actSystem: "正在加载活动名称，请稍等......",
    actState: 0,
    methodOption: [ // 打卡方式下拉框
      { text: '打卡方式', value: 0 },
      { text: '输入密码', value: 1 },
      { text: '扫描二维码', value: 2 },
    ],
    GPSOption: [ // GPS下拉框
      { text: '是否使用GPS', value: 0 },
      { text: '使用GPS', value: 1 },
      { text: '不使用GPS', value: 2 },
    ],
    methodValue: 0, // 打卡方式 （存入数据库）
    GPSValue: 1, // 是否使用gps （存入数据库）
    pointNum: 6, // 打卡点个数 (存入数据库)
    pointNum_input: 3,// 输入的打卡点个数 (没有算上    CLEAR    START    THE END)
    routeNum: 1, // 比赛线路的个数 (存入数据库)
    showeviewKey: false,
    showviewQrcode: false,
    active: ['1'], // 密码列表显示
    active1: ['1'], // 二维码列表显示
    showQr: false, // 二维码显示
    keys: "", // 密码序列
    finalKeys: "", // 密码序列或二维码原始string
    order: "", // 一条输入的正确的打卡顺序(string)
    orderArray: [], // 一条正确的打卡顺序数组（最终“不”存入数据库）
    manager_routeArrayNeedFillin:[true,false,false,false,false],// xwz 标记，自定需要记录的路线
    manager_route_origin: ["线路1","线路2","线路3","线路4","线路5"],
    manager_route1: ["START","","THE END"],
    manager_route2: ["START","","THE END"],
    manager_route3: ["START","","THE END"],
    manager_route4: ["START","","THE END"],
    manager_route5: ["START","","THE END"],// xwz  拟定最多需要5条不同的路线（这5条散装路线不写入数据库）
    manager_routeArray: [ ["START","","THE END"], ["START","","THE END"], ["START","","THE END"], ["START","","THE END"], ["START","","THE END"] ],// xwz 所有正确的打卡顺序的二维（最终存入数据库）
    points: [], // 打卡点（belike[{A:xMjy12}]最终存入数据库）
    QRcanvasArray:[],//canvases

    // 2022.4.19 xwz
    manager_steps: [
      {
        text: '步骤一',
        desc: '比赛规格',
      },
      {
        text: '步骤二',
        desc: '打卡点设置',
      },
      {
        text: '步骤三',
        desc: '路线设置',
      },
    ],

    manager_active: 0 , // steps	当前步骤

    manager_button1: '上一步',// 上一步
    manager_button2: '下一步',// 下一步 或 提交
    qrcode_src:[],//canvas暂存地址


    isDisabled_ManagerButton1:true
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(o) {
    let actId_tmp = JSON.parse(o.ID)// 获取 活动id
    this.setData({
      actId:actId_tmp,
    })
    console.log("1 |||||||||||||||||||||||||"+this.data.actId);
    console.log("2 |||||||||||||||||||||||||"+this.data.routeNO);


    // 因为涉及到异步，所以使用then()层层嵌套。先获取wxid，再获取activities，最后获取页面备份
    // 读取用户的wxid
    wx.cloud.callFunction({
      name:'login',
    }).then(res=>{
      this.setData({
          openid:res.result.openid
      })
    }).then(res=>{
            const db=wx.cloud.database();
        
            // activities中，有“基本信息”
            db.collection('activities')
            .where({
              id: this.data.actId
            })
            .get()
            .then(res=>{

            var actSystem_tmp = ""
            if (res.data[0].format == 1) {
              actSystem_tmp = "个人赛"
            }else if (res.data[0].format == 2) {
              actSystem_tmp = "团队赛"
            }

            this.setData({
              act_id: res.data[0]._id,
              actName: res.data[0].name,
              actHost: res.data[0].host,
              actTime: res.data[0].time,
              actArea: res.data[0].area,
              actState: res.data[0].state,
              actSystem: actSystem_tmp
            })
    }).then(res=>{
      // 从 information_formanager_backup 中，获取 information_formanager 之前的状态
      db.collection('information_formanager_backup')
      .where({
        actId: this.data.actId,//pk
      })
      .get()
      .then(res=>{
        if(res.data.length == 0){// 即 collection中没有需要的元组
          // 创建空表，data区为默认值
                      db.collection('information_formanager_backup')
                      .get().then(res=>{
                          db.collection('information_formanager_backup')
                              .add({
                                  data:{
                                      actId: this.data.actId,//pk


    methodValue: this.data.methodValue, // 打卡方式 （存入数据库）
    GPSValue: this.data.GPSValue, // 是否使用gps （存入数据库）
    pointNum: this.data.pointNum, // 打卡点个数 (存入数据库)
    pointNum_input: this.data.pointNum,// 输入的打卡点个数 (没有算上    CLEAR    START    THE END)
    routeNum: this.data.routeNum, // 比赛线路的个数 (存入数据库)
    showeviewKey: this.data.showeviewKey,
    showviewQrcode: this.data.showviewQrcode,
    keys: this.data.keys, // 密码序列
    finalKeys: this.data.finalKeys, // 密码序列或二维码原始string
    order: this.data.order, // 一条输入的正确的打卡顺序(string)
    orderArray: this.data.orderArray, // 一条正确的打卡顺序数组（最终“不”存入数据库）
    manager_routeArrayNeedFillin: this.data.manager_routeArrayNeedFillin,// xwz 标记，自定需要记录的路线
    manager_route1: this.data.manager_route1,
    manager_route2: this.data.manager_route2,
    manager_route3: this.data.manager_route3,
    manager_route4: this.data.manager_route4,
    manager_route5: this.data.manager_route5,// xwz  拟定最多需要5条不同的路线（这5条散装路线不写入数据库）
    manager_routeArray: this.data.manager_routeArray,// xwz 所有正确的打卡顺序的二维（最终存入数据库）
    points: this.data.points,// 打卡点（belike[{A:xMjy12}]最终存入数据库）
    QRcanvasArray: this.data.QRcanvasArray,//canvases

    manager_active: this.data.manager_active,// steps	当前步骤

    manager_button1: this.data.manager_button1,// 上一步
    manager_button2: this.data.manager_button2,// 下一步 或 提交
    qrcode_src: this.data.qrcode_src,//canvas暂存地址

    isDisabled_ManagerButton1: this.data.isDisabled_ManagerButton1,


                                      
                                  }
                              })
                              
                      })
  
                      
        }else{// 即 collection中有需要的元组
          
                  this.setData({
                    methodValue: res.data[0].methodValue, // 打卡方式 （存入数据库）
                    GPSValue: res.data[0].GPSValue, // 是否使用gps （存入数据库）
                    pointNum: res.data[0].pointNum, // 打卡点个数 (存入数据库)
                    pointNum_input: res.data[0].pointNum_input,// 输入的打卡点个数 (没有算上    CLEAR    START    THE END)
                    routeNum: res.data[0].routeNum, // 比赛线路的个数 (存入数据库)
                    showeviewKey: res.data[0].showeviewKey,
                    showviewQrcode: res.data[0].showviewQrcode,
                    keys: res.data[0].keys, // 密码序列
                    finalKeys: res.data[0].finalKeys, // 密码序列或二维码原始string
                    order: res.data[0].order, // 一条输入的正确的打卡顺序(string)
                    orderArray: res.data[0].orderArray, // 一条正确的打卡顺序数组（最终“不”存入数据库）
                    manager_routeArrayNeedFillin: res.data[0].manager_routeArrayNeedFillin,// xwz 标记，自定需要记录的路线
                    manager_route1: res.data[0].manager_route1,
                    manager_route2: res.data[0].manager_route2,
                    manager_route3: res.data[0].manager_route3,
                    manager_route4: res.data[0].manager_route4,
                    manager_route5: res.data[0].manager_route5,// xwz  拟定最多需要5条不同的路线（这5条散装路线不写入数据库）
                    manager_routeArray: res.data[0].manager_routeArray,// xwz 所有正确的打卡顺序的二维（最终存入数据库）
                    points: res.data[0].points,// 打卡点（belike[{A:xMjy12}]最终存入数据库）
                    QRcanvasArray: res.data[0].QRcanvasArray,//canvases
                
                    manager_active: res.data[0].manager_active,// steps	当前步骤
                
                    manager_button1: res.data[0].manager_button1,// 上一步
                    manager_button2: res.data[0].manager_button2,// 下一步 或 提交
                    qrcode_src: res.data[0].qrcode_src,//canvas暂存地址

                    isDisabled_ManagerButton1: res.data[0].isDisabled_ManagerButton1,
                  })


  
  
        }
        
        
  
        
  
    })
    .then(res=>{

    // 恢复显示的“比赛路线”
    let tmp_manager_route_origin = [];
    
    let tmp_manager_route1 = "";
    for (let index = 1 ; index < this.data.manager_route1.length - 1 ; index++) {// 掐头去尾 ["START","","THE END"]
      tmp_manager_route1 += this.data.manager_route1[index];
      if (index != this.data.manager_route1.length - 2) { tmp_manager_route1 +=  ","; }
    }

    let tmp_manager_route2 = "";
    for (let index = 1 ; index < this.data.manager_route2.length - 1 ; index++) {// 掐头去尾 ["START","","THE END"]
      tmp_manager_route2 += this.data.manager_route2[index];
      if (index != this.data.manager_route2.length - 2) { tmp_manager_route2 +=  ","; }
    }

    let tmp_manager_route3 = "";
    for (let index = 1 ; index < this.data.manager_route3.length - 1 ; index++) {// 掐头去尾 ["START","","THE END"]
      tmp_manager_route3 += this.data.manager_route3[index];
      if (index != this.data.manager_route3.length - 2) { tmp_manager_route3 +=  ","; }
    }

    let tmp_manager_route4 = "";
    for (let index = 1 ; index < this.data.manager_route4.length - 1 ; index++) {// 掐头去尾 ["START","","THE END"]
      tmp_manager_route4 += this.data.manager_route4[index];
      if (index != this.data.manager_route4.length - 2) { tmp_manager_route4 +=  ","; }
    }

    let tmp_manager_route5 = "";
    for (let index = 1 ; index < this.data.manager_route5.length - 1 ; index++) {// 掐头去尾 ["START","","THE END"]
      tmp_manager_route5 += this.data.manager_route5[index];
      if (index != this.data.manager_route5.length - 2) { tmp_manager_route5 +=  ","; }
    }
    
    tmp_manager_route_origin.push(tmp_manager_route1);
    tmp_manager_route_origin.push(tmp_manager_route2);
    tmp_manager_route_origin.push(tmp_manager_route3);
    tmp_manager_route_origin.push(tmp_manager_route4);
    tmp_manager_route_origin.push(tmp_manager_route5);

    this.setData({
      manager_route_origin: tmp_manager_route_origin,
    })

    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ this.data.actState "+this.data.actState);
    
    })





      })

  
  
      



    })
    


    
  },
  


  onMethodChange({detail}) { // 打卡方式
    this.setData({
      methodValue: detail,
    })
    // 控制密码显示
    if(this.data.methodValue == 1){
      this.setData({
        showeviewKey: true,
        showviewQrcode: false
      })
    }else if(this.data.methodValue == 2){
      this.setData({
        showeviewKey: false,
        showviewQrcode: true
      })
    }else{
      this.setData({
        showeviewKey: false,
        showviewQrcode: false
      })
    }
    // console.log(this.data.methodValue);
  },

  onGPSChange({detail}) { // 是否使用GPS
    this.setData({
      GPSValue: detail,
    })

    // console.log(this.data.GPSValue);
  },

  onStepperChange_Point(event) { // 打卡个数
    this.setData({
      pointNum: event.detail + 3,
      pointNum_input: event.detail,
    })
    console.log(this.data.pointNum);
  },

  onStepperChange_Route(event) { // 路线个数
    var temp_routeArrayIsValid = [];// xwz 标记，自定需要记录的路线
    for (let idx = 0; idx < this.data.manager_routeArrayNeedFillin.length; idx++) {
      if (idx < event.detail) {
        temp_routeArrayIsValid.push(true);
      }else{
        temp_routeArrayIsValid.push(false);
      }
    }

    this.setData({
      routeNum: event.detail,
      manager_routeArrayNeedFillin:temp_routeArrayIsValid,
    })
    console.log(this.data.routeNum);
  },

  onChangeKey(event) {    //密码折叠页显示
    this.setData({
      active: event.detail,
    });
  },

    onChangeKey1(event) {    //密码折叠页显示
      this.setData({
        active1: event.detail,
      });
    },


    createPoints: function () {// 无参函数，调用之后，生成 初始化的默认PointArray
      console.log("调用 createPoints_key");

      var orderArray_tmp = this.data.orderArray;
      console.log("test   "+this.data.orderArray);
      console.log("test   "+orderArray_tmp);
      // 打卡点名称不能为空
      for(var i = 0 ; i < orderArray_tmp.length ; i++){
        if(orderArray_tmp[i] == ""){
          Toast.fail('打卡点名称不能为空！');
          return false;
        }
      }
      // 打卡点名称不能重复
      for(var i = 0 ; i < orderArray_tmp.length - 2 ; i++){
        for(var j = i+1 ; j < orderArray_tmp.length - 1 ; j++){
          if(orderArray_tmp[i] == orderArray_tmp[j]){
            Toast.fail('打卡点名称不能重复！');
            return false;
          }
        }
      }
      // 对比打卡点个数 == 打卡点名称个数 ？
      if(orderArray_tmp.length != this.data.pointNum){
        Toast.fail('输入的打卡个数有误！');
        return false;
      }

      // 生成所有打卡点的密码（字母+数字 的 一个string）
      this.getDefaultPassword();

      console.log(this.data.keys);

      // 生成 初始化的默认PointArray
      this.handlePoints();

    },

    drawQR(event){// 画出PointArray的密码的二维码
      console.log("画出PointArray的密码的二维码");

    },

  // 生成所有打卡点的密码（字母+数字 的 一个string）
  getDefaultPassword: function(){
      // 如果backup没有密码（即没有设置过密码），生成随机密码，否则读取已设置的密码
      if (this.data.keys=="") {
        var pasArr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
  
        var password = '';
        var pasArrLen = pasArr.length;
        for(var j=0; j<this.data.pointNum; j++){
          for (var i=0; i<6; i++){
            var x = Math.floor(Math.random()*pasArrLen);
            password += pasArr[x];
          }
          password += "\r\n";
        }

        this.setData({
          keys: password
        })

      }
      

  },
  


  routeRead1:function(e){// 比赛路线1（改变 index 1~5 ctrl+C/V）
    var routeArray = e.detail.split(",");
    routeArray.unshift("START");
    routeArray.push("THE END");

    this.setData({
      manager_route1:routeArray,
    })
    console.log(this.data.manager_route1);
  },

  routeRead2:function(e){// 比赛路线2
    var routeArray = e.detail.split(",");
    routeArray.unshift("START");
    routeArray.push("THE END");

    this.setData({
      manager_route2:routeArray,
    })
    console.log(this.data.manager_route2);
  },

  routeRead3:function(e){// 比赛路线3
    var routeArray = e.detail.split(",");
    routeArray.unshift("START");
    routeArray.push("THE END");

    this.setData({
      manager_route3:routeArray,
    })
    console.log(this.data.manager_route3);
  },

  routeRead4:function(e){// 比赛路线4
    var routeArray = e.detail.split(",");
    routeArray.unshift("START");
    routeArray.push("THE END");

    this.setData({
      manager_route4:routeArray,
    })
    console.log(this.data.manager_route4);
  },

  routeRead5:function(e){// 比赛路线5
    var routeArray = e.detail.split(",");
    routeArray.unshift("START");
    routeArray.push("THE END");

    this.setData({
      manager_route5:routeArray,
    })
    console.log(this.data.manager_route5);
  },

  fieldIn:function(e){
    var pointsArray = e.detail.split(",");
    pointsArray.unshift("START");
    pointsArray.unshift("CLEAR");
    pointsArray.push("THE END");
    this.setData({
      orderArray: pointsArray,
      order: e.detail,
    })

    console.log(this.data.orderArray);
  },

  handlePoints() {// 在已经输入打卡点title、生成随机password的前提下，生成初始化的默认PointArray
    
    var order_input = -1;//打点顺序（地图实际顺序）（目前无用）
    var passwordArray_input = this.data.keys.split("\r\n");
    var titleArray_input = this.data.orderArray; //名称（趣味定向中，可作为活动名称）
    console.log(this.data.orderArray);
    var weight_input = 1;//权重
    var active_input = true;//是否被激活（有些隐藏点，部分参赛者没有权限）
    var flag_input = {};
    // var flag_input = {order: -1, password:'54188', title: 'CLEAR', weight: weight_input, active: active_input};
    var varPoints = [];
    for(var i=0; i<titleArray_input.length; i++){
      flag_input = {order: order_input, password:passwordArray_input[i] , title: titleArray_input[i], weight: weight_input, active: active_input};
      varPoints.push(flag_input);
      order_input ++;
    }
    this.setData({     
      points: varPoints
    })

    console.log(this.data.points);
  }, 

  onFinishButton(e) { // 点击完成
    // this.data.GPSValue == 0 || 
    if(this.data.methodValue == 0 || this.data.keys == "" || this.data.pointNum != this.data.points.length){
      Toast.fail('打卡设置有误');
    }else{
      Toast.success('提交成功');

      this.setData({
        finalKeys: this.data.keys
      })
    }

    console.log(this.data.points);
  },

  onManagerButton1(e){
    var temp_manager_active = this.data.manager_active;
    var temp_manager_button2 = this.data.manager_button2;
    var temp_isDisabled_ManagerButton1 = this.data.isDisabled_ManagerButton1;
    

    if (temp_manager_active == this.data.manager_steps.length - 1) {
      temp_manager_button2 = "下一步";
    }

    if (temp_manager_active > 0) {
      temp_manager_active -= 1;
    }

    if (temp_manager_active == 0) {
      temp_isDisabled_ManagerButton1 = true;
    }

    this.setData({
      manager_active: temp_manager_active,
      manager_button2 : temp_manager_button2,
      isDisabled_ManagerButton1: temp_isDisabled_ManagerButton1
    })
  },
  
  onManagerButton2(e){
    var temp_manager_active = this.data.manager_active;
    var temp_manager_button2 = this.data.manager_button2;

    if (temp_manager_active == 0) {// 第一步骤 =》 第二步骤
      
      this.createPoints();

      if(this.createPoints()==false){
        // Toast.fail( );已在createPoints中显示
      }else if (this.data.methodValue == 0) {
        Toast.fail('请选择打卡方式！');
      }
      // else if(this.data.GPSValue == 0 ) {
      //   Toast.fail('请选择是否使用GPS！');
      // }
      else{
        temp_manager_active += 1;
      }

      this.setData({
        isDisabled_ManagerButton1:false
      })

    }else if(temp_manager_active == this.data.manager_steps.length - 2) {// 第二步骤 =》 最后步骤

      if(this.allPoints_isValid()){
        temp_manager_active += 1;
        temp_manager_button2 = "完成";
      }

    }else{// "完成" 提交      最后步骤 =》数据库
      // 将所有的路线聚集到 manager_routeArray
      this.data.manager_routeArray = [];// 先清空manager_routeArray
      this.data.manager_routeArray.push(this.data.manager_route1);
      this.data.manager_routeArray.push(this.data.manager_route2);
      this.data.manager_routeArray.push(this.data.manager_route3);
      this.data.manager_routeArray.push(this.data.manager_route4);
      this.data.manager_routeArray.push(this.data.manager_route5);

      
      // TODO：没有判断是否存在“有路线含有不合规的打卡点”的情况 ———— haveInvalidRoute ||
      // this.data.GPSValue == 0 || 

      if( this.data.methodValue == 0 || this.data.keys == "" || this.data.pointNum != this.data.points.length){
        Toast.fail('打卡设置有误');
        console.log('打卡设置有误');
        console.log(this.data.GPSValue == 0 );
        console.log(this.data.methodValue == 0);
        console.log(this.data.keys == "");
        console.log(this.data.pointNum != this.data.points.length);

      }else if(this.haveEmptyRoute()){
        Toast.fail('路线未填写');
        console.log('路线未填写');

      }
      // else if(this.haveInvalidRoute()){
      //   Toast.fail('路线含不合规的打卡点');
      //   console.log('路线含不合规的打卡点');

      // }
      else{
        console.log(this.data.manager_routeArray);

        Toast.success('提交成功');
        console.log('提交成功');

        this.setData({
          finalKeys: this.data.keys
        })


        const db = wx.cloud.database();

        // 根据id创建details的一个table
    db.collection('details')
    .where({
      id: this.data.actId,//pk
    })
    .get()
    .then(res=>{
      if(res.data.length == 0){// 即 collection中没有需要的元组
        // 创建空表
                    db.collection('details')
                    .get().then(res=>{
                        db.collection('details')
                            .add({
                                data:{
                                  id: this.data.actId,//pk      
                                  GPSOrNot: this.data.GPSValue,//1使用，2不使用      
                                  method: this.data.methodValue,//1输入密码（生成乱序密码），2扫描二维码，3趣味答题（自己设置密码）                                
                                  weightOrNot: 2//1积分，2不积分
                                }
                            })
                            
                    })

                    console.log("]]]]]]]]]]]]]]]]]]]]]]]]]" );
      }else{// 即 collection中有需要的元组
        // 更新表
                console.log("[[[[[[[[[[[[[[[[" );
            
                //修改数据库的值
                db.collection('details').doc(res.data[0]._id).update({
                  data: {      
                    GPSOrNot: this.data.GPSValue,//1使用，2不使用
                    method: this.data.methodValue,//1输入密码（生成乱序密码），2扫描二维码，3趣味答题（自己设置密码）                  
                    weightOrNot: 2//1积分，2不积分
                  }
                })
                

      }
      

  })


            
        // 根据id创建pointsTable的一个table ( points & routes)
    db.collection('pointsTable')
    .where({
      id: this.data.actId,//pk
    })
    .get()
    .then(res=>{
      if(res.data.length == 0){// 即 collection中没有需要的元组
        // 创建空表
                    db.collection('pointsTable')
                    .get().then(res=>{
                        db.collection('pointsTable')
                            .add({
                                data:{
                                  id: this.data.actId,//pk
                                  pointsNum: this.data.pointNum ,
                                  points: this.data.points,
                                  routesNum: this.data.routeNum , // 比赛线路的个数 (存入数据库)
                                  routes: this.data.manager_routeArray 
                                }
                            })
                            
                    })

                    
      }else{// 即 collection中有需要的元组
        // 更新表
                console.log(":::::::::::::::::::::::"+res.data[0]._id );
            
                //修改数据库的值
                db.collection('pointsTable').doc(res.data[0]._id).update({
                  data: {
                    pointsNum: this.data.pointNum ,
                    points: this.data.points,
                    routesNum: this.data.routeNum , // 比赛线路的个数 (存入数据库)
                    routes: this.data.manager_routeArray 
                  }
                })
                


      }




  })
  

  console.log("~~~~~~~~~~~~~~~~~~~~~~ this.data.points[0].password"+this.data.points[0].password);
  console.log("~~~~~~~~~~~~~~~~~~~~~~ this.data.keys"+this.data.keys);
        
  // 每次完成提交之后，数据库备份当前页面
db.collection('information_formanager_backup')
.where({
actId: this.data.actId,//pk
})
.get()
.then(res=>{
if(res.data.length == 0){// 即 collection中没有需要的元组
// 创建空表，data区为默认值
            db.collection('information_formanager_backup')
            .get().then(res=>{
                db.collection('information_formanager_backup')
                    .add({
                        data:{
                            actId: this.data.actId,//pk


methodValue: this.data.methodValue, // 打卡方式 （存入数据库）
GPSValue: this.data.GPSValue, // 是否使用gps （存入数据库）
pointNum: this.data.pointNum, // 打卡点个数 (存入数据库)
pointNum_input: this.data.pointNum_input,// 输入的打卡点个数 (没有算上    CLEAR    START    THE END)
routeNum: this.data.routeNum, // 比赛线路的个数 (存入数据库)
showeviewKey: this.data.showeviewKey,
showviewQrcode: this.data.showviewQrcode,
keys: this.data.keys, // 密码序列
finalKeys: this.data.finalKeys, // 密码序列或二维码原始string
order: this.data.order, // 一条输入的正确的打卡顺序(string)
orderArray: this.data.orderArray, // 一条正确的打卡顺序数组（最终“不”存入数据库）
manager_routeArrayNeedFillin: this.data.manager_routeArrayNeedFillin,// xwz 标记，自定需要记录的路线
manager_route1: this.data.manager_route1,
manager_route2: this.data.manager_route2,
manager_route3: this.data.manager_route3,
manager_route4: this.data.manager_route4,
manager_route5: this.data.manager_route5,// xwz  拟定最多需要5条不同的路线（这5条散装路线不写入数据库）
manager_routeArray: this.data.manager_routeArray,// xwz 所有正确的打卡顺序的二维（最终存入数据库）
points: this.data.points,// 打卡点（belike[{A:xMjy12}]最终存入数据库）
QRcanvasArray: this.data.QRcanvasArray,//canvases

manager_active: this.data.manager_active,// steps	当前步骤

manager_button1: this.data.manager_button1,// 上一步
manager_button2: this.data.manager_button2,// 下一步 或 提交
qrcode_src: this.data.qrcode_src,//canvas暂存地址

isDisabled_ManagerButton1: this.data.isDisabled_ManagerButton1,
                            
                        }
                    })
                    
            })

            
}else{// 即 collection中有需要的元组

                //修改数据库的值
                db.collection('information_formanager_backup').doc(res.data[0]._id).update({
                  data: {

                    methodValue: this.data.methodValue, // 打卡方式 （存入数据库）
                    GPSValue: this.data.GPSValue, // 是否使用gps （存入数据库）
                    pointNum: this.data.pointNum, // 打卡点个数 (存入数据库)
                    pointNum_input: this.data.pointNum_input,// 输入的打卡点个数 (没有算上    CLEAR    START    THE END)
                    routeNum: this.data.routeNum, // 比赛线路的个数 (存入数据库)
                    showeviewKey: this.data.showeviewKey,
                    showviewQrcode: this.data.showviewQrcode,
                    keys: this.data.keys, // 密码序列
                    finalKeys: this.data.finalKeys, // 密码序列或二维码原始string
                    order: this.data.order, // 一条输入的正确的打卡顺序(string)
                    orderArray: this.data.orderArray, // 一条正确的打卡顺序数组（最终“不”存入数据库）
                    manager_routeArrayNeedFillin: this.data.manager_routeArrayNeedFillin,// xwz 标记，自定需要记录的路线
                    manager_route1: this.data.manager_route1,
                    manager_route2: this.data.manager_route2,
                    manager_route3: this.data.manager_route3,
                    manager_route4: this.data.manager_route4,
                    manager_route5: this.data.manager_route5,// xwz  拟定最多需要5条不同的路线（这5条散装路线不写入数据库）
                    manager_routeArray: this.data.manager_routeArray,// xwz 所有正确的打卡顺序的二维（最终存入数据库）
                    points: this.data.points,// 打卡点（belike[{A:xMjy12}]最终存入数据库）
                    QRcanvasArray: this.data.QRcanvasArray,//canvases
                    
                    manager_active: this.data.manager_active,// steps	当前步骤
                    
                    manager_button1: this.data.manager_button1,// 上一步
                    manager_button2: this.data.manager_button2,// 下一步 或 提交
                    qrcode_src: this.data.qrcode_src,//canvas暂存地址

                    isDisabled_ManagerButton1: this.data.isDisabled_ManagerButton1,
                  }
                })

}


})



            wx.navigateTo({
                url: '/pages/mainPage/mainPage',//活动信息
                success:(res)=>{
                  // nothing     
                }
            })




        
      }
  
      console.log(this.data.points);
  
    }

    this.setData({
      manager_active : temp_manager_active,
      manager_button2 : temp_manager_button2
    })
  },
  
  
  allPoints_isValid: function () {// 判断所有打卡点是否都有效

    var allPoints_isValid = true;

    // 判断是否密码相同的点
    for (let tmp_i = 0; tmp_i < this.data.points.length-1; tmp_i++) {
      for (let tmp_j = tmp_i+1 ; tmp_j < this.data.points.length; tmp_j++) {
        if(this.data.points[tmp_i].password == this.data.points[tmp_j].password){
          Toast.fail('存在密码相同的点！');
          allPoints_isValid = false;
          break;
        }

      }

    }
    
    // 判断是否密码为空的点
    for (let tmp_i = 0; tmp_i < this.data.points.length; tmp_i++) {
      if(this.data.points[tmp_i].password == ""){
        Toast.fail('存在密码为空的点！');
        allPoints_isValid = false;
        break;
      }

    }


    return allPoints_isValid;


  },

  

  drawQR1(event){// 画出PointArray的密码的二维码
    console.log("drawQR1");


    if( this.allPoints_isValid() ){// 如果所有打卡点有效，打印二维码

      for (let index = 0; index < this.data.points.length; index++) {
          drawQrcode({
              width: 200, // 必须，二维码宽度，与canvas的width保持一致
              height: 200, // 必须，二维码高度，与canvas的height保持一致
              canvasId: this.data.points[index].title, //  ***需要实施改动：画布的id***
              background:'#ffffff', //	非必须，二维码背景颜色，默认值白色
              foreground: '#000000', // 非必须，二维码前景色，默认值黑色 	'#000000'
              // ctx: wx.createCanvasContext('myQrcodes'), // 非必须，绘图上下文，可通过 wx.createCanvasContext('canvasId') 获取，v1.0.0+版本支持
              text: this.data.points[index].password,  // 必须，二维码内容  ***需要实施改动：二维码表示的password***
              // v1.0.0+版本支持在二维码上绘制图片
              image: {
                  // imageResource: '../../images/icon.png', // 指定二维码小图标
                  dx: 70,
                  dy: 70,
                  dWidth: 60,
                  dHeight: 60
              },
              callback: (e) => {
                  // 使用 setTimeout, 避免部分安卓机转出来的二维码图片不完整
                  setTimeout(() => {
                      wx.canvasToTempFilePath({
                          canvasId: this.data.points[index].title,
                          x: 0,
                          y: 0,
                          width: 200,
                          height: 200,
                          success: (e) => {
                              let temp = this.data.qrcode_src;
                              temp.push({"id":this.data.points[index].title,"src":e.tempFilePath,"content":this.data.points[index].password});
                              this.setData({
                                  qrcode_src : temp
                              })
                              
                          }
                      })
                  }, 0);
              }
          })
      }
        
      this.setData({
        showQr:true
      })
      console.log(this.data.qrcode_src)
    
    

      

    }else{// 如果存在打卡点无效，二维码画布折叠


      this.setData({
        showQr:false
      })


    }


  
  },


  saveQRcode(e){
    let thisImage=e.currentTarget.dataset.buttommsg;
    console.log(thisImage)
    for(let i=0;i<this.data.qrcode_src.length;i++){
        if(this.data.qrcode_src[i].id==thisImage){
            console.log(thisImage)
            wx.saveImageToPhotosAlbum({
                filePath:this.data.qrcode_src[i].src,
                success(res) { 
                    Toast.success("保存成功！")
                }
            })
            break;
        }
    }
  },




  haveEmptyRoute: function () {// 判断是否存在“有需要填写的路线没有填写”的情况
    var m_haveEmptyRoute = false;

    for (let index = 0; index < this.data.routeNum; index++) {
      console.log(index + " " + this.data.manager_routeArray[index][1].length);
      if (this.data.manager_routeArray[index][1].length == 0) {
        // this.data.manager_routeArray[1] == "" 表示 START之后为空点
        m_haveEmptyRoute = true;
      }
      
    } 
    console.log(m_haveEmptyRoute);

    return m_haveEmptyRoute;

  },
  
  // haveInvalidRoute: function () {// 判断是否存在“有路线含有不合规的打卡点”的情况
  //   var m_haveInvalidRoute = false;

  //   for (let index = 0; index < this.data.routeNum; index++) {
  //     var m_haveInvalidPoint = true;

  //     for (let index1 = 0; index1 < this.data.manager_routeArray[index].length; index1++) {
  //       for (let index2 = 0; index2 < this.data.points.length; index2++) {
  //         if (this.data.manager_routeArray[index][index1] == this.data.points[index2].title) {
  //           m_haveInvalidPoint = false;
  //           console.log("haveInvalidRoute : " + this.data.manager_routeArray[index][index1] + this.data.points[index2].title);
  //         }

  //         if ( (index2 == this.data.points.length - 1) ||  (m_haveInvalidPoint)) {
  //           m_haveInvalidRoute = true;
  //         }
  //       }
  //     }

      
  //   } 
  //   console.log(m_haveInvalidRoute);

  //   return m_haveInvalidRoute;

  // },

  updatePoints: function (e) {
    console.log(e);
    console.log(e.target.id);
    console.log(e.detail);
    var event_id = e.target.id.split("->");
    var event_index = parseInt(event_id[0]);
    var event_element = event_id[1];
    var varPoints = this.data.points;
    if(event_element == "password"){
      varPoints[event_index].password = e.detail;
    }else{
      console.log("e.target.id 解析出现问题");
    }

    var tmp_keys = "";
    for (let i = 0; i < varPoints.length; i++) {
      tmp_keys += varPoints[i].password + "\r\n";
    }

    this.setData({     
      points: varPoints,
      keys:tmp_keys,
      finalKeys:tmp_keys,
    })
    console.log(this.data.points);
  },

})