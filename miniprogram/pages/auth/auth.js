// miniprogram/pages/auth/auth.js
Page({

        /**
         * 页面的初始数据
         */
        data: {

        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {

        },

        getUserInfo:function(e){
                
                if(e.detail.userInfo){
                        wx.navigateBack({
                          delta: 1,
                        })
                }
        }


})