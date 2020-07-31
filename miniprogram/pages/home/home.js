// miniprogram/pages/home/home.js
import {utils} from '../../js/utils'
Page({
  /**
   * 页面的初始数据
   */
  data: {
      dateRange:{
        start:'',
        end:''
      },
      currentDate:'',
      bookingData:[],
      //当天收入支出
      currentDayBooking:{
          shouru:0,
          zhichu:0
      },
      //当月收入支出
      currentMonthBooking:{
          shouru:0,
          zhichu:0,
          jieyu:0
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
      // 控制日期 本月01 -当前
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      month= month>10? month: '0'+month;
      let day = date.getDate();
      day= day>10? day: '0'+day;

      this.data.dateRange.start = year+'-'+month+'-01';
      this.data.dateRange.end = year+'-'+month+'-'+day;
      this.setData({
         dateRange:this.data.dateRange,
         currentDate:month+'月' + day +'日'
      })
      
      this.getCurrentBookingData(this.data.dateRange.end);
      this.getMonthBookingData()
  },

  //选择日期
  selectDate:function(e){
      
      let date = e.detail.value.split('-');
      this.getCurrentBookingData(e.detail.value)
      this.setData({
          currentDate:date[1]+'月' +date[2]+'日'
      })

  },


  //获取当天记账数据
  getCurrentBookingData:function(date){
     wx.cloud.callFunction({
        name:'get_booking',
        data:{
            date
        },
        success:res=>{
            
            this.data.currentDayBooking= {
                shouru: 0,
                zhichu: 0
              }
            res.result.data.forEach(v=>{
                
                this.data.currentDayBooking[v.costType.type]+=Number(v.bookingInfo.money)
            })
            //当前收入支出 转化千分位 保留两位小数
            this.data.currentDayBooking.shouru = utils.thousandthPlace(this.data.currentDayBooking.shouru.toFixed(2))
            this.data.currentDayBooking.zhichu = utils.thousandthPlace(this.data.currentDayBooking.zhichu.toFixed(2))
            

            res.result.data.forEach(v=>{
                v.bookingInfo.money = utils.thousandthPlace(Number(v.bookingInfo.money).toFixed(2))
            })

            this.setData({
                bookingData : res.result.data,
                currentDayBooking: this.data.currentDayBooking
            })
            
        },
        fail:err=>{
          
        }
     })
  },

  //获取当月记账数据
  getMonthBookingData:function(){
      
      
      wx.cloud.callFunction({
          name:'get_month_booking',
          data:this.data.dateRange,
          success:res=>{
              
            this.data.currentMonthBooking={
                shouru:0,
                zhichu:0,
                jieyu:0
            }
            res.result.data.forEach(v=>{
                this.data.currentMonthBooking[v.costType.type]+= Number(v.bookingInfo.money)
            })
             this.data.currentMonthBooking.jieyu = utils.thousandthPlace((this.data.currentMonthBooking.shouru - this.data.currentMonthBooking.zhichu).toFixed(2))
             
             this.data.currentMonthBooking.shouru = utils.thousandthPlace((this.data.currentMonthBooking.shouru).toFixed(2))
             this.data.currentMonthBooking.zhichu = utils.thousandthPlace((this.data.currentMonthBooking.zhichu).toFixed(2))

            this.setData({
                currentMonthBooking:this.data.currentMonthBooking
            })
          
          }
      })
  }


})