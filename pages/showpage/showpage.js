import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {cities} from '../../data/city'
// ????好像删了也行
// var status = true;

//city列表
var citys = {
  '未知': ['未知'],
  '北京市': ['市辖区'],
  '天津市': ['市辖区'],
  '河北省': ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市', '省直辖县级行政区划'],
  '山西省': ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市'],
  '内蒙古自治区': ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
  '辽宁省': ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市'],
  '吉林省': ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州'],
  '黑龙江省': ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区'],
  '上海市': ['市辖区'],
  '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
  '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
  '安徽省': ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市'],
  '福建省': ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
  '江西省': ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市'],
  '山东省': ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '莱芜市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'],
  '河南省': ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市', '省直辖县级行政区划'],
  '湖北省': ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州', '省直辖县级行政区划'],
  '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州'],
  '广东省': ['广州市', '韶关市', '深圳市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
  '广西壮族自治区': ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市'],
  '海南省': ['海口市', '三亚市', '三沙市', '儋州市', '省直辖县级行政区划'],
  '重庆市': ['市辖区', '县'],
  '四川省': ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
  '贵州省': ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
  '云南省': ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州'],
  '西藏自治区': ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲地区', '阿里地区'],
  '陕西省': ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市'],
  '甘肃省': ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州'],
  '青海省': ['西宁市', '海东市', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
  '宁夏回族自治区': ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'],
  '新疆维吾尔自治区': ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区', '自治区直辖县级行政区划'],
  '台湾省': ['台湾'],
  '香港特别行政区': ['香港'],
  '澳门特别行政区': ['澳门']
}


module.exports = citys;
// const app = getApp()
Page({
    data: {
      cities,
      id: 100,
      show: false,
      //活动时间
      date: '',
      //活动名称
      activityname: '',
      //主办方
      host: '',
      //活动密码
      activitykey: '',
      //用于活动地点弹窗，detailed是输入的内容
      region: [],
      detailed: "   请选择活动地点",
      customItem:["全部"],
      clas: 'ccc',
      //
      //显示地点popup
      areashow: false,
    
    columns: [
        {
          values: Object.keys(citys),
          className: 'column1',
        },
        {
            className: 'column2',
            defaultIndex: 0,
        },
        
      ],
      areadetail: '',
    // 下拉框的代码，留一手
      TypeOption: [ // 赛制下拉框
        { text: '赛制选择', value: 0 },
        { text: '个人赛', value: 1 },
        { text: '团队赛', value: 2 },
      ],
      TypeValue: 0, // 请选择活动赛制
      showgroup: false,
      groupMemberNum: 1,
      groupkey: '',
      wxid:'',//wxid,
      user_id:'',
      _idinUsers:'',
      achievements:[]
    },
    

    
    //用于将输入值赋值给data，onCheck时要用TAT
    onActivityNameChange(e){
        this.setData({activityname : e.detail});
    },
    onHostChange(e){
        this.setData({host : e.detail});
    },
    onActivityKeyChange(e){
        this.setData({activitykey : e.detail});
    },
    onDateChange(e){
        this.setData({date : e.detail});
    },
    onSetMemberNum(e){
        this.setData({groupMemberNum : e.detail});
    },
    onGroupKeyChange(e){
        this.setData({groupkey : e.detail});
    },
    onAreaChange(event){
        const { picker, value, index } = event.detail;
        picker.setColumnValues(1, citys[value[0]]);
    },

    


    //活动地点
    bindRegionChange: function (e) {
        this.setData({
          clas: ''
        }),　//下拉框所选择的值
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
          //拼的字符串传后台
          detailed: e.detail.value[0] + "-" + e.detail.value[1] + "-" + e.detail.value[2],
          //下拉框选中的值
          region: e.detail.value
        })
    },
    
    //显示时间
    onDisplay() {
      this.setData({ show: true });
    },
    onClose() {
      this.setData({ show: false });
    },

    //显示地点弹窗
    onAreaDisplay(){
        this.setData({areashow: true});
        console.log(this.data.areashow)
    },
    onpopclose(){
        this.setData({areashow: false});
    },
    onAreaCancel(){
        this.setData({areashow: false});
    },
   
    onAreaConfirm(event){
        this.setData({areadetail: ''})
        let res = event.detail.value;
        console.log(res)
        let tmparea=this.data.areadetail
        for(var i=0;i<res.length;i++){
            tmparea+=res[i];
            if(i!=res.length-1){
                tmparea+='-'
            }
        }
        this.setData({
            areadetail: tmparea,
            areashow: false,
        })
        console.log(this.data.areadetail)
    },

    //活动时间
    formatDate(date) {
      date = new Date(date);
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    //时间确认
    onConfirm(event) {
      this.setData({
        show: false,
        date: this.formatDate(event.detail),
      });
    },
    

    //赛制确认
    onTypeConfirm() {
      this.selectComponent('#item').toggle();
      
    },

    onFormatChange({detail}) { // 赛制选择
        this.setData({
          TypeValue: detail,
        }) 
        if(this.data.TypeValue == 2){
            this.setData({ showgroup: true });
        }else{
            this.setData({ showgroup: false });
        }
    },


   
    onLoad(){
        wx.cloud.callFunction({ 
            name:'login', 
            data:{ 
              message:'helloCloud', 
            } 
          }).then(res=>{ 
              this.setData({ 
                  wxid:res.result.openid 
              }) 
          }) 
    },

    // 填写完全部信息后提交则“发起成功”
    onCheck(){
        if(this.data.activityname=='')
            Toast.fail('活动名称为空');
        else if(this.data.host=='')
            Toast.fail('主办方为空');
        else if(this.data.activitykey=='')
            Toast.fail('活动密码为空');
        else if(this.data.activitykey.length!=4)
            Toast.fail('密码长度不足');
        else if(this.data.date=='')
            Toast.fail('活动时间为空');
        else if(this.data.areadetail=='')
            Toast.fail('活动地点为空');
        else if(this.data.TypeValue==0)
            Toast.fail('请选择赛制');
        else if(this.data.TypeValue==2&&this.data.groupMemberNum==1)
            Toast.fail('请添加小队人数');
        else if(this.data.TypeValue==2&&this.data.groupkey.length!=4)
            Toast.fail('密钥长度不足');
        else{
            Toast.success('发起成功');
            this.awakeAnAchievement();
            wx.cloud.callFunction({
                name: 'getCurId',
                success: res => {
                  console.log(res.result.id);
                  this.setData({
                      id: res.result.id
                  })
                  const db = wx.cloud.database();
                    if(this.data.TypeValue==2){
                        console.log(this.data.id)
                        db.collection('groups')
                            .add({
                                data:{
                                    id: this.data.id,
                                    groupid: 0, 
                                }
                            })
                    }
                    db.collection('activities')
                        .add({
                            data:{
                                name: this.data.activityname,
                                host: this.data.host,
                                area: this.data.areadetail,
                                time: this.data.date,
                                format: this.data.TypeValue,
                                state: 2,
                                password: this.data.activitykey,
                                id: this.data.id,
                                groupsize: this.data.groupMemberNum,
                                leaderkey: this.data.groupkey,
                            }
                        })
                        .then(res=>{
                            this.participateIn();
                            wx.navigateTo({
                            url: '/pages/mainPage/mainPage',//发起活动
                            })
                        })
                    
                        
                }
            })  
        }
    },
    participateIn(){
        const db=wx.cloud.database(); 
        db.collection("actors") 
        .where({ 
            wxid:this.data.wxid 
        }) 
        .get() 
        .then(res=>{ 
            this.setData({
                user_id:res.data[0]._id
            })
        })
        let a = []
        a.push({"id":this.data.id,"identity":1,"name":this.data.host,"wxid":this.data.wxid})
        let b=this.data.times
        b=b+1
        this.setData({
            user_activity_in_actors:a,
            times:b
        })
        console.log(this.data.user_activity_in_actors)
        wx.cloud.callFunction({
            name: 'participateIn',
            data: {
                user_id:this.data.user_id,
                actors_item:this.data.user_activity_in_actors,
                times:this.data.times
            },
            success:(res)=>{
                console.log("e")
            }
        })
    },
    awakeAnAchievement(){
        const db=wx.cloud.database();
        db.collection('users')
        .where({
            wxid: this.data.wxid
        })
        .get()
        .then(res=>{
            this.setData({
                _idinUsers:res.data[0]._id,
                achievements:res.data[0].achievements
            })
            let ach=this.data.achievements;
            if(ach[4]==1)
            return;
            ach[4]=1;
            this.setData({
                achievements:ach
            })
            wx.cloud.callFunction({
                name: 'UpdateAchievements',
                data: {
                    _id: this.data._idinUsers,
                    achievements:this.data.achievements
                },
            })
            .then(res=>{})
        })
    }
});