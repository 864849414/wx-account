// miniprogram/pages/detail/detail.js
Page({

        /**
         * 页面的初始数据
         */
        data: {
                bookingData:[]
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                let ids = options.ids
                
                this.getBookingDataById(ids)
        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

        },
        getBookingDataById(ids){
                wx,wx.showLoading({
                  title: '加载中...',
                  mask: true,
                })
                wx.cloud.callFunction({
                        name:'get_booking_byid',
                        data:{
                                ids
                        },
                        success:res=>{
                                wx.hideLoading();
                                
                                this.setData({
                                        bookingData:res.result.data
                                })
                                
                        },
                        fail:err=>{
                                wx.hideLoading();
                                
                        }
                })
        }
})