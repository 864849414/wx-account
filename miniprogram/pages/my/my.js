
Page({

  data: {
		userInfo:{
			nickName:'未登录',
			userImg:''
		},
		listData:[
			{title:'我的记账',url:'../mybooking/mybooking'},
			{title:'疫情情况',url:'../epidemic/epidemic'},
		]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		wx.getUserInfo({
		   success:res=>{
			   
			    this.data.userInfo.nickName=res.userInfo.nickName
			    this.data.userInfo.userImg=res.userInfo.avatarUrl
			   this.setData({
				 userInfo: this.data.userInfo
			   })
		   },
		   fail:err=>{
			   
		   }
		})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
	
  },
//   跳转页面
  goPage:function(e){
	  
	  wx.navigateTo({
	    url: e.currentTarget.dataset.url
	  })
  }

})