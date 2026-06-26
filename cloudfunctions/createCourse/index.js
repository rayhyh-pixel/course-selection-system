const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    
    // 检查是否为管理员
    const userResult = await db.collection('users').where({
      _openid: openid
    }).get()
    
    const user = userResult.data[0]
    if (!user || user.role !== 'admin') {
      return {
        code: -1,
        message: '无权限创建课程',
        data: null
      }
    }
    
    const { title, description, teacher, capacity, startTime, endTime } = event
    
    // 创建课程
    const result = await db.collection('courses').add({
      data: {
        title,
        description,
        teacher,
        capacity,
        enrolled: 0,
        startTime,
        endTime,
        status: 'open',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: 'success',
      data: {
        courseId: result._id
      }
    }
  } catch (err) {
    console.error('[createCourse] error:', err)
    return {
      code: -1,
      message: err.message || '创建课程失败',
      data: null
    }
  }
}