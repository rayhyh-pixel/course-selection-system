const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { status, teacher, limit = 100 } = event
    
    // 构建查询条件
    let query = db.collection('courses')
    
    if (status) {
      query = query.where({ status })
    }
    
    if (teacher) {
      query = query.where({ teacher })
    }
    
    // 执行查询
    const result = await query
      .orderBy('createTime', 'desc')
      .limit(limit)
      .get()
    
    return {
      code: 0,
      message: 'success',
      data: {
        courses: result.data
      }
    }
  } catch (err) {
    console.error('[getCourses] error:', err)
    return {
      code: -1,
      message: err.message || '获取课程列表失败',
      data: null
    }
  }
}