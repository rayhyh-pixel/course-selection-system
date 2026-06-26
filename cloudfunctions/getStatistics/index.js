const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 获取课程总数
    const coursesCount = await db.collection('courses').count()
    
    // 获取学生总数（按 openid 分组）
    const usersCount = await db.collection('users').where({
      role: 'student'
    }).count()
    
    // 获取待审核选课数
    const pendingCount = await db.collection('enrollments').where({
      status: 'pending'
    }).count()
    
    // 获取已通过选课数
    const approvedCount = await db.collection('enrollments').where({
      status: 'approved'
    }).count()
    
    const statistics = {
      totalCourses: coursesCount.total,
      totalStudents: usersCount.total,
      pendingEnrollments: pendingCount.total,
      approvedEnrollments: approvedCount.total
    }
    
    return {
      code: 0,
      message: 'success',
      data: statistics
    }
  } catch (err) {
    console.error('[getStatistics] error:', err)
    return {
      code: -1,
      message: err.message || '获取统计数据失败',
      data: null
    }
  }
}