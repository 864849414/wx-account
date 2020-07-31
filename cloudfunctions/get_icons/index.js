// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 获取数据库引用
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        // 查询数据库
        return await db.collection('icons').get();
    } catch (err) {
        
    }
}