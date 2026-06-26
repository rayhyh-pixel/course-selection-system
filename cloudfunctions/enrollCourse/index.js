const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { courseId } = event
    
    // 查询课程信息
    const courseResult = await db.collection('courses').doc(courseId).get()
    const course = courseResult.data
    
    if (!course) {
      return {
        code: -1,
        message: '课程不存在',
        data: null
      }
    }
    
    // 检查课程状态
    if (course.status === 'closed') {
      return {
        code: -1,
        message: '课程已关闭',
        data: null
      }
    }
    
    if (course.status === 'full') {
      return {
        code: -1,
        message: '课程已满员',
        data: null
      }
    }
    
    // 检查是否已选课
    const existingEnrollment = await db.collection('enrollments').where({
      _openid: openid,
      courseId: courseId
    }).get()
    
    if (existingEnrollment.data.length > 0) {
      return {
        code: -1,
        message: '您已申请过此课程',
        data: null
      }
    }
    
    // 创建选课记录
    const result = await db.collection('enrollments').add({
      data: {
        _openid: openid,
        courseId: courseId,
        courseTitle: course.title,
        teacher: course.teacher,
        status: 'pending',
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    
    return {
      code: 0,
      message: 'success',
      data: {
        enrollmentId: result._id
      }
    }
  } catch (err) {
    console.error('[enrollCourse] error:', err)
    return {
      code: -1,
      message: err.message || '选课失败',
      data: null
    }
  }
}