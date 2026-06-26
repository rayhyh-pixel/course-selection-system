const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { status } = event
    
    // 构建查询条件
    let query = db.collection('enrollments').where({
      _openid: openid
    })
    
    if (status) {
      query = query.where({ status })
    }
    
    // 执行查询
    const result = await query
      .orderBy('createTime', 'desc')
      .get()
    
    return {
      code: 0,
      message: 'success',
      data: {
        enrollments: result.data
      }
    }
  } catch (err) {
    console.error('[getMyEnrollments] error:', err)
    return {
      code: -1,
      message: err.message || '获取选课记录失败',
      data: null
    }
  }
}