// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db= cloud.database()
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
        
        try {
                let date = ' ';
                //日期
                if(event.end){
                        date = _.gte(event.start).and(_.lte(event.end))
                }else{
                        date = event.start;
                }

                // 条件
                let condition ={
                        bookingInfo:{
                                date
                        },
                        userInfo:event.userInfo
                };

                return await db.collection('booking').where(condition).get()
                      
        } catch (err) {
                
        }
}