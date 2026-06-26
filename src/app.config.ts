export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/courses/index',
    'pages/mine/index',
    'pages/admin/index',
    'pages/course-detail/index',
    'pages/course-manage/index',
    'pages/review-detail/index',
    'pages/statistics/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4A90E2',
    navigationBarTitleText: '选课报名系统',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#4A90E2',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/courses/index',
        text: '课程'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      },
      {
        pagePath: 'pages/admin/index',
        text: '管理'
      }
    ]
  }
})
