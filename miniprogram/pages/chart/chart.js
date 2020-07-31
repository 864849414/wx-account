import {utils} from '../../js/utils'
var wxCharts = require('../../js/wxcharts');
Page({

  data: {
      //年月日查询
      dateType:{
        title:['年','月','日'],
        index:1
      },
      // 开始日期-结束日期
      date:{
        start:'',
        end:''
      },
      // 当前日期
      currentDate:'',

      // 切换收入支出
      titleData:[
        {title:'收入',total:0,type:'shouru',isActive:true},
        {title:'支出',total:0,type:'zhichu',isActive:false}
      ],
    //   有31天的月份
    day31:[1,3,5,7,8,10,12],

    typesData: {
      //收入统计分类 (餐饮, 出行 ....)
      shouru: [],

      //支出统计分类 (餐饮, 出行 ....)
      zhichu: []
    },
    // 当前收入支出
    currentType:'shouru'
  },

 
  onShow: function () {
      this.getOnlineDate()
  },

  //切换年月日
  toggleDateType : function(){
    let dateType = this.data.dateType
    dateType.index = dateType.index==dateType.title.length-1?0:dateType.index+1
    this.setData({
      dateType
    })
    this.getBookingDataByDate()
  },

  // 获取开始日期，项目上线时间
  getOnlineDate:function(){
      wx.cloud.callFunction({
          name:'get_date',
          success:res=>{
              
              this.data.date.start = res.result.data[0].onlineDate;
             
              let end = utils.formatDate(new Date(),'yyyy-MM-dd')
              this.data.date.end = end
              
              this.setData({
                date:this.data.date,
                currentDate:end
              })
              this.getBookingDataByDate()
          },
          fail:err=>{
              
          }
      })
  },

  // 选择日期
  selectDate(e){
      this.setData({
         currentDate: e.detail.value
      })
      this.getBookingDataByDate()
  },

  // 收入支出切换
  toggleTitle:function(e){
      if(e.currentTarget.dataset.active){
        return
      }
      for(let i = 0;i<this.data.titleData.length;i++){
          if(this.data.titleData[i].isActive){
              this.data.titleData[i].isActive=false;
              break;
          }
      }
      this.data.titleData[e.currentTarget.dataset.index].isActive=true
      this.setData({
          titleData : this.data.titleData,
          currentType:this.data.titleData[e.currentTarget.dataset.index].type
      })
      this.drawPie(this.data.typesData[this.data.currentType])
  },

  // 根据日期查询记账数据（年月日)
  getBookingDataByDate:function(){
      // 获取当前日期
      let current = utils.formatDate(new Date(), 'yyyy-MM-dd')
      let date = current.split('-');
      
      // 选择的日期
      let currentDate = this.data.currentDate.split('-')
      

      // 日期条件范围
      let dateCondition ={
          start:'',
          end:''
      }
      // 按日查询  条件 date = yyyy - MM -dd
      if(this.data.dateType.index ==2){
          dateCondition.start = this.data.currentDate
      }// 按月查询 条件 yyyy-MM-dd <= date <=yyyy-MM-dd
      else if( this.data.dateType.index == 1){
            dateCondition.start = currentDate[0] +'-'+currentDate[1]+'-01'
            // 同年
            if(date[0]==currentDate[0]){
                // 同月
                if(date[1]==currentDate[1]){
                    dateCondition.end =  current;
                }else{
                    // 不同月，天数不同： 28，29，30，31
                      if(currentDate[1]=='02'){
                        //   闰年 29天
                          if(currentDate[0] %400==0 || (currentDate[0]%4==0 &&currentDate[0]%100!=0) ){
                              dateCondition.end = currentDate[0]+'-'+currentDate[1]+'-29'
                          }else{  //平年28天
                            dateCondition.end = currentDate[0]+'-'+currentDate[1]+'-28'
                          }
                      }else{
                            //不是2月，判断是否有31号
                            if(this.data.day31.indexOf(currentDate[1])==-1){
                                dateCondition.end =currentDate[0]+'-'+currentDate[1]+'-30'
                            }else{
                                dateCondition.end =currentDate[0]+'-'+currentDate[1]+'-31'
                            }
                      }
                }
            }
      }//按年查询 
      else{
          dateCondition.start = currentDate[0]+'-01-01';
          //同年
        if(date[0]==currentDate[0]){
            dateCondition.end = current;
        }else{
            // 不同年
            dateCondition = currentDate[0]+'12-31'
        }
      }
      
      this.getBookingData(dateCondition)
  },

  // 根据日期获取数据
  getBookingData:function(date){
      wx.showLoading({
        title: '加载中...',
        mask: true
      })

      wx.cloud.callFunction({
          name:'get_booking_bydate',
          data:{
              start:date.start,
              end:date.end
          },
          success:res=>{
            wx.hideLoading()
              

              let bookingData = {
                  shouru:[],
                  zhichu:[]
              }
              res.result.data.forEach(v=>{
                bookingData[v.costType.type].push(v)
              })
              
              
              //年月日的总金额
              let totalMoney={
                shouru:0,
                zhichu:0
              }
              this.data.titleData.forEach(v=>{
                v.total =0;
                  bookingData[v.type].forEach(v1=>{
                      v.total += Number(v1.bookingInfo.money)
                      totalMoney[v.type] +=Number(v1.bookingInfo.money)
                  })
                  v.total = utils.thousandthPlace(v.total.toFixed(2))
              })
             

              let types ={};
              for(let k in bookingData){
                  types[k] = [ ];
                  let data = bookingData[k];
                  data.forEach(v=>{
                        if(types[k].indexOf(v.bookingType.type)==-1){
                            types[k].push(v.bookingType.type)
                        }
                  })
              }
              

              for(let k in types){
                  this.data.typesData[k]= [];
                  types[k].forEach(v=>{
                    // 随机生成rgb颜色
                    let rgb=[];
                    for(let i=0;i<3;i++){
                      let ramdom = Math.floor(Math.random()*256)
                      rgb.push(ramdom);
                    }
                    rgb = 'rgb('  + rgb.join(',')+')';

                      let o ={
                          [v]:[],
                          // 笔数
                          count:0,
                          // 类型金额
                          total:0,
                          // 类型标题
                          title:'',
                          // 类型图标路径
                          url:'',
                          // 百分比
                          percent:'',
                          //id集合
                          ids:[],

                          // 饼图数据
                          // 金额
                          data:0,
                          // 名字
                          name:'',
                          // 颜色
                         color:rgb,
                         //格式化饼图文本内容
                        format(value) {
                          return ' ' + this.name + ' ' + (value * 100).toFixed(3) + '% ';
                        },
                        
                      }
                      
                      let currentTypeData = bookingData[k];
                      currentTypeData.forEach(v1=>{
                          if(v==v1.bookingType.type){
                              o[v].push(v1);
                              o.count++;
                              o.total+=Number(v1.bookingInfo.money);
                              o.data+=Number(v1.bookingInfo.money);
                              o.ids.push(v1._id)
                              if(o[v].length==1){
                                  o.title = v1.bookingType.title;
                                  o.url = v1.bookingType.url;
                                  o.name = v1.bookingType.title
                              }
                          }
                      })
                      o.percent=(o.total/totalMoney[k]*100).toFixed(2) +'%'
                      o.ids = o.ids.join('-')
                      o.total = utils.thousandthPlace(o.total.toFixed(2))
                      this.data.typesData[k].push(o)
                      
                  })
              }
              this.setData({
                titleData:this.data.titleData,
                typesData:this.data.typesData
              })
              
              this.drawPie(this.data.typesData[this.data.currentType]);
          },
          fail:err=>{
            wx.hideLoading()
              
          }
      })
  },

  // 绘制饼图
  drawPie:function(data){
    if (data.length == 0) {
      return;
    }
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: data,
      width: 360,
      height: 300,
      dataLabel: true
  });
  },

  //查看详情
   goDetail(e){
     
     let params = e.currentTarget.dataset.ids;
     
      wx.navigateTo({
        url: '../detail/detail?ids='+params,
      })
   }
})