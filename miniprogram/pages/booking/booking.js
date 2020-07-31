const { utils } = require("../../js/utils");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconsData:[],
    tagData: [
      {
        title: '收入',
        type: 'shouru',
        isActive: true
      },
      {
        title: '支出',
        type: 'zhichu',
        isActive: false
      },
      
    ],
    accountType:[
      {
          title:'现金',
          isActive:true
      },
      {
          title:'支付宝',
          isActive:false
      },
      {
          title:'微信',
          isActive:false
      },
      {
          title:'信用卡',
          isActive:false
      },
      {
          title:'存蓄卡',
          isActive:false
      },
    ],
    bookingInfo:{
       date:"请输入日期",
       money:'',
       comment:''
    },
    date:{
      start:'',
      end:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getIconsData()
      this.setDataRange()
  },

  //  设置日期范围
    setDataRange(){
        let date = this.data.date;
        date.start = '2019-01-01'
        date.end = utils.formatDate(new Date(),'yyyy-MM-dd')
        this.setData({
            date
        })
    },
  //切换标签
  toggleTag: function(e) {
    //事件对象
    
    //如果当前已经激活,则拦截
    if (e.currentTarget.dataset.active) {
      return;
    }

    //去除之前激活的标签
    let data = this.data[e.currentTarget.dataset.key]
    
    for (let i = 0; i < data.length; i++) {
      if (data[i].isActive) {
        data[i].isActive = false;
        break;
      }
    }

    //激活当前点击的标签
    data[e.currentTarget.dataset.index].isActive = true;

    //设置页面响应数据
    this.setData({
      [e.currentTarget.dataset.key]: data
    })
  },

    //获取图标数据
    getIconsData: function () {
      //调用云函数【get_icons】
      wx.cloud.callFunction({
        //云函数名称
        name: 'get_icons',
        
        //成功执行的回调函数
        success: res => {
          
          res.result.data.forEach(v=>{
            v.isActive=false;
          })
          this.setData({
            iconsData: res.result.data
          })
        },
  
        fail: err => {
          
        }
      })
    },

    //选择日期, 输入金额, 输入备注
    inputBookingInfo:function(e){
        
        let data = this.data.bookingInfo
        data[e.currentTarget.dataset.key] = e.detail.value;
        
        this.setData({
          bookingInfo : data
        })
    },

    // 保存
    save:function(){
      wx.getSetting({
        success:res=>{
         if(!res.authSetting['scope.userInfo']){
            wx.showModal({
               title:'请授权',
               content:'需要用户授权才能登录',
               success (res) {
                if (res.confirm) {
                    wx.navigateTo({
                      url: '../auth/auth',
                    })
                } 
              }
            })
            return;
         }

        }
      })
        let bookingData={}

        // 收入支出
          for(let i =0;i<this.data.tagData.length;i++){
                if(this.data.tagData[i].isActive){
                    bookingData.costType = {
                        title:this.data.tagData[i].title,
                        type:this.data.tagData[i].type

                    }
                    break;
                }
          }

          //类型选择
          for(let i = 0;i<this.data.iconsData.length;i++){
            if(this.data.iconsData[i].isActive){
                bookingData.bookingType={
                   title:this.data.iconsData[i].title,
                   url:this.data.iconsData[i].url,
                   type:this.data.iconsData[i].type
                };
                break
            }
          }
          if(!bookingData.bookingType){
            wx.showToast({
              title: '请选择记账类型',
              icon:'none'
            })
            return
          }

          //账号选择
          for(let i = 0;i<this.data.accountType.length;i++){
              if(this.data.accountType[i].isActive){
                bookingData.accountType = {
                    title: this.data.accountType[i].title,
                }
              }
          }

          //日期 金额 是否为空
          if(this.data.bookingInfo.date=='请输入日期'){
              wx.showToast({
                title: '请填写日期',
                icon:'none'
              })
              return;
          }

          if(!this.data.bookingInfo.money){
              wx.showToast({
                title: '请填写金额',
                icon:'none'
              })
              return;
          }   
          
          bookingData.bookingInfo= Object.assign({}, this.data.bookingInfo)
          
          //写入数据
          this.addBooking(bookingData);
    },

    //写进记账数据
    addBooking:function(e){
      wx.showLoading({
        title: '加载中...',
      })
        wx.cloud.callFunction({
            name:'add_booking',
            data:e,
            success:res=>{
                wx.hideLoading()
                
            },
            fail: err=>{
              wx.hideLoading()
              
            }
        })
    }

})
