// miniprogram/pages/mybooking/mybooking.js
Page({

        /**
         * 页面的初始数据
         */
        data: {
                bookingData:[

                ]
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                this.getAllBooking()
        },
        // 获取全部记账数据
        getAllBooking:function(){
                wx.showLoading({
                        title: '加载中...',
                      })
                wx.cloud.callFunction({
                        name:'get_allbooking',
                        success:res=>{
                                wx.hideLoading();
                                
                                res.result.data.sort((a,b)=>{
                                        wx.hideLoading();
                                        return new Date(b.bookingInfo.date).getTime() - new Date(a.bookingInfo.date).getTime()
                                })
                                
                                this.setData({
                                        bookingData:res.result.data
                                })
                        },
                        fail:err=>{
                                wx.hideLoading();
                        }
                })
        },
        // 根据id删除记账数据
        removeBooking:function(e){
                wx.showLoading({
                  title: '加载中...',
                })
                wx.cloud.callFunction({
                        name:'remove_booking_byid',
                        data:{
                                _id:e.currentTarget.dataset.id
                        },
                        success:res=>{
                                wx.hideLoading();
                                
                                this.data.bookingData.splice(e.currentTarget.dataset.index,1)
                                this.setData({
                                        bookingData: this.data.bookingData
                                })
                        },
                        fail:err=>{
                                wx.hideLoading();
                                
                        }
                })
        }


})