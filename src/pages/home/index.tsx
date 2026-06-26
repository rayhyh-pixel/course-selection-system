import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { useUser } from '@/store/UserContext';
import CourseCard from '@/components/CourseCard';
import { CourseListItem } from '@/types';
import { mockCourses } from '@/data/getCourses';
import { mockStatistics } from '@/data/getStatistics';

const HomePage = () => {
  const { userInfo } = useUser();
  const [hotCourses, setHotCourses] = useState<CourseListItem[]>([]);
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingEnrollments: 0,
    approvedEnrollments: 0
  });

  // 加载热门课程（取前5个）
  const loadHotCourses = async () => {
    try {
      // H5 环境：使用 mock 数据
      const courses = mockCourses.slice(0, 5);
      setHotCourses(courses);
      
      // 微信环境：调用云函数
      // if (process.env.TARO_ENV === 'weapp') {
      //   const result = await Taro.cloud.callFunction({
      //     name: 'getCourses',
      //     data: { limit: 5 }
      //   });
      //   const data = result.result as any;
      //   if (data.code === 0) {
      //     setHotCourses(data.data.courses);
      //   }
      // }
    } catch (err) {
      console.error('[HomePage] Load courses failed:', err);
    }
  };

  // 加载统计数据
  const loadStatistics = async () => {
    try {
      // H5 环境：使用 mock 数据
      setStatistics(mockStatistics);
      
      // 微信环境：调用云函数
      // if (process.env.TARO_ENV === 'weapp') {
      //   const result = await Taro.cloud.callFunction({
      //     name: 'getStatistics',
      //     data: {}
      //   });
      //   const data = result.result as any;
      //   if (data.code === 0) {
      //     setStatistics(data.data);
      //   }
      // }
    } catch (err) {
      console.error('[HomePage] Load statistics failed:', err);
    }
  };

  // 初始化
  useEffect(() => {
    loadHotCourses();
    loadStatistics();
  }, []);

  // 下拉刷新
  usePullDownRefresh(async () => {
    await Promise.all([loadHotCourses(), loadStatistics()]);
    Taro.stopPullDownRefresh();
  });

  // 快速入口点击
  const handleQuickAccess = (type: string) => {
    switch (type) {
      case 'courses':
        Taro.switchTab({ url: '/pages/courses/index' });
        break;
      case 'mine':
        Taro.switchTab({ url: '/pages/mine/index' });
        break;
      case 'admin':
        Taro.switchTab({ url: '/pages/admin/index' });
        break;
      default:
        break;
    }
  };

  return (
    <View className={styles.homePage}>
      {/* 用户信息栏 */}
      <View className={styles.userSection}>
        <View className={styles.userInfo}>
          <Image
            className={styles.avatar}
            src={userInfo?.avatar || 'https://picsum.photos/id/64/200/200'}
            mode="aspectFill"
          />
          <View className={styles.userText}>
            <Text className={styles.nickname}>{userInfo?.nickname || '请登录'}</Text>
            <View className={styles.roleTag}>
              <Text className={styles.roleText}>
                {userInfo?.role === 'admin' ? '管理员' : '学生'}
              </Text>
            </View>
          </View>
          {!userInfo?.nickname && (
            <View className={styles.loginBtn} onClick={() => Taro.navigateTo({ url: '/pages/register/index' })}>
              <Text className={styles.loginBtnText}>登录</Text>
            </View>
          )}
        </View>

        {/* 统计数据 */}
        <View className={styles.statsCard}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{statistics.totalCourses}</Text>
            <Text className={styles.statLabel}>总课程</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{statistics.totalStudents}</Text>
            <Text className={styles.statLabel}>参与学生</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{statistics.pendingEnrollments}</Text>
            <Text className={styles.statLabel}>待审核</Text>
          </View>
        </View>
      </View>

      {/* 快速入口 */}
      <View className={styles.quickAccessSection}>
        <Text className={styles.sectionTitle}>快速入口</Text>
        <ScrollView className={styles.quickAccessScroll} scrollX>
          <View
            className={styles.quickAccessItem}
            onClick={() => handleQuickAccess('courses')}
          >
            <Text className={styles.quickIcon}>📚</Text>
            <Text className={styles.quickLabel}>浏览课程</Text>
          </View>
          <View
            className={styles.quickAccessItem}
            onClick={() => handleQuickAccess('mine')}
          >
            <Text className={styles.quickIcon}>✅</Text>
            <Text className={styles.quickLabel}>我的选课</Text>
          </View>
          {userInfo?.role === 'admin' && (
            <View
              className={styles.quickAccessItem}
              onClick={() => handleQuickAccess('admin')}
            >
              <Text className={styles.quickIcon}>⚙️</Text>
              <Text className={styles.quickLabel}>管理中心</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* 热门课程 */}
      <View className={styles.hotCoursesSection}>
        <Text className={styles.sectionTitle}>热门课程</Text>
        <View className={styles.courseList}>
          {hotCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </View>
      </View>

      {/* 公告 */}
      <View className={styles.noticeSection}>
        <Text className={styles.sectionTitle}>系统公告</Text>
        <View className={styles.noticeCard}>
          <Text className={styles.noticeTitle}>选课系统开放通知</Text>
          <Text className={styles.noticeContent}>
            本学期选课系统已开放，请各位同学及时登录系统进行选课。选课截止时间为2024年6月30日。
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HomePage;