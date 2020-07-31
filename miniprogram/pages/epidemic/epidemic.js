// miniprogram/pages/epidemic/epidemic.js
Page({

        /**
         * 页面的初始数据
         */
        data: {
                epidemicData:{
                        // 现存确诊人数
                        currentConfirmedCount:[
                                {title:'现存确诊人数',count:0}
                        ],
                        // 现存疑似人数
                        suspectedCount:[
                                {title:'现存疑似人数',count:0}
                        ],
                        // 累计确诊人数
                        confirmedCount:[
                                {title:'累计确诊人数',count:0}
                        ],
                        // 累计治愈人数
                        curedCount:[
                                {title:'累计治愈人数',count:0}
                        ],
                        // 累计死亡人数
                        deadCount:[
                                {title:'累计治愈人数',count:0}
                        ],
                        // 相比昨天现存确诊人数
                        currentConfirmedIncr:[
                                {title:'相比昨天现存确诊人数',count:0}
                        ],
                        curedIncr:[
                                {title:'相比昨天新增治愈人数',count:0}
                        ],
                        deadIncr:[
                                {title:'相比昨天新增死亡人数',count:0}
                        ],
                }
               
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                this.getEpidemicData()
        },

        // 获取疫情数据
        getEpidemicData:function(){
                wx.request({
                  url: 'https://api.tianapi.com/txapi/ncov/index',
                  method:'GET',
                  data:{
                          key:'c638e1ee7f4f7dd3c85f2dc7c5f11078'
                  },
                  success:res=>{
                          
                       
                         

                          for(let k in  this.data.epidemicData){
                                this.data.epidemicData[k][0].count = res.data.newslist[0].desc[k]
                          }
                          
                          this.setData({
                                epidemicData:this.data.epidemicData
                          })
                  },
                  fail:err=>{
                          
                  }
                })
        }
})