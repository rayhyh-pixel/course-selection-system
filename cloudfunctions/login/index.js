const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    // 查询用户是否存在
    const userQuery = await db.collection('users').where({
      _openid: openid
    }).get()

    if (userQuery.data.length > 0) {
      // 用户已存在，更新最后登录时间
      const user = userQuery.data[0]
      await db.collection('users').doc(user._id).update({
        data: {
          updateTime: db.serverDate()
        }
      })
      return {
        code: 0,
        message: 'success',
        data: {
          userInfo: user
        }
      }
    } else {
      // 用户不存在，创建新用户
      const result = await db.collection('users').add({
        data: {
          _openid: openid,
          nickname: '新用户',
          avatar: '',
          role: 'student', // 默认学生角色
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })

      const newUser = {
        _id: result._id,
        _openid: openid,
        nickname: '新用户',
        avatar: '',
        role: 'student',
        createTime: new Date(),
        updateTime: new Date()
      }

      return {
        code: 0,
        message: 'success',
        data: {
          userInfo: newUser
        }
      }
    }
  } catch (err) {
    console.error('[login] error:', err)
    return {
      code: -1,
      message: err.message || '登录失败',
      data: null
    }
  }
}