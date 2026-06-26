import React, { useState, useEffect } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockStatistics } from '@/data/getStatistics';
import { mockCourseDetails } from '@/data/getCourseDetail';
import { mockEnrollments } from '@/data/getEnrollments';

interface Statistics {
  totalCourses: number;
  totalStudents: number;
  pendingEnrollments: number;
  approvedEnrollments: number;
}

const StatisticsPage = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  // 计算统计数据
  const calculateStats = () => {
    const totalCourses = Object.keys(mockCourseDetails).length;
    const totalStudents = new Set(mockEnrollments.map(e => e._openid)).size;
    const pendingEnrollments = mockEnrollments.filter(e => e.status === 'pending').length;
    const approvedEnrollments = mockEnrollments.filter(e => e.status === 'approved').length;
    
    return {
      totalCourses,
      totalStudents,
      pendingEnrollments,
      approvedEnrollments
    };
  };

  // 获取课程报名排行
  const getCourseRanking = () => {
    const courseMap: Record<string, number> = {};
    mockEnrollments.forEach(enroll => {
      if (enroll.status === 'approved') {
        courseMap[enroll.courseId] = (courseMap[enroll.courseId] || 0) + 1;
      }
    });
    
    return Object.entries(courseMap)
      .map(([courseId, count]) => ({
        courseId,
        count,
        title: mockCourseDetails[courseId]?.title || '未知课程',
        teacher: mockCourseDetails[courseId]?.teacher || '未知教师'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // 获取每日报名趋势（模拟最近7天）
  const getDailyTrend = () => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const counts = [12, 8, 15, 20, 18, 5, 10];
    return days.map((day, index) => ({ day, count: counts[index] }));
  };

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
    } catch (err) {
      console.error('[StatisticsPage] Load data failed:', err);
      setStats(mockStatistics);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 返回按钮
  const handleBack = () => {
    Taro.navigateBack();
  };

  if (loading) {
    return (
      <View className={styles.statisticsPage}>
        <Text className={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View className={styles.statisticsPage}>
        <Text className={styles.emptyState}>暂无数据</Text>
      </View>
    );
  }

  const courseRanking = getCourseRanking();
  const dailyTrend = getDailyTrend();
  const approvalRate = stats.approvedEnrollments > 0 
    ? Math.round((stats.approvedEnrollments / (stats.approvedEnrollments + stats.pendingEnrollments)) * 100) 
    : 0;
  const avgEnrollments = stats.totalCourses > 0 
    ? Math.round(stats.approvedEnrollments / stats.totalCourses) 
    : 0;

  return (
    <View className={styles.statisticsPage}>
      {/* 返回按钮和标题 */}
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          ←
        </Button>
        <Text className={styles.pageTitle}>数据统计</Text>
      </View>

      {/* 统计概览 */}
      <View className={styles.statsOverview}>
        <Text className={styles.sectionTitle}>统计概览</Text>
        <View className={styles.statsGrid}>
          <View className={classnames(styles.statCard, styles.clickable)} onClick={() => Taro.navigateTo({ url: '/pages/course-manage/index' })}>
            <Text className={styles.statIcon}>📚</Text>
            <Text className={styles.statValue}>{stats.totalCourses}</Text>
            <Text className={styles.statLabel}>课程总数</Text>
            <Text className={styles.statArrow}>›</Text>
          </View>
          <View className={classnames(styles.statCard, styles.clickable)} onClick={() => Taro.navigateTo({ url: '/pages/student-list/index' })}>
            <Text className={styles.statIcon}>👥</Text>
            <Text className={styles.statValue}>{stats.totalStudents}</Text>
            <Text className={styles.statLabel}>学生总数</Text>
            <Text className={styles.statArrow}>›</Text>
          </View>
          <View className={classnames(styles.statCard, styles.clickable)} onClick={() => Taro.navigateTo({ url: '/pages/review-detail/index?status=pending' })}>
            <Text className={styles.statIcon}>⏳</Text>
            <Text className={styles.statValue}>{stats.pendingEnrollments}</Text>
            <Text className={styles.statLabel}>待审核</Text>
            <Text className={styles.statArrow}>›</Text>
          </View>
          <View className={classnames(styles.statCard, styles.clickable)} onClick={() => Taro.navigateTo({ url: '/pages/review-detail/index?status=approved' })}>
            <Text className={styles.statIcon}>✅</Text>
            <Text className={styles.statValue}>{stats.approvedEnrollments}</Text>
            <Text className={styles.statLabel}>已通过</Text>
            <Text className={styles.statArrow}>›</Text>
          </View>
        </View>
      </View>

      {/* 关键指标 */}
      <View className={styles.chartCard}>
        <Text className={styles.chartTitle}>关键指标</Text>
        <View className={styles.progressBarContainer}>
          <View className={styles.progressItem}>
            <View className={styles.progressHeader}>
              <Text className={styles.progressLabel}>审核通过率</Text>
              <Text className={styles.progressValue}>{approvalRate}%</Text>
            </View>
            <View className={styles.progressBar}>
              <View className={styles.progressFill} style={{ width: `${approvalRate}%` }} />
            </View>
          </View>
          <View className={styles.progressItem}>
            <View className={styles.progressHeader}>
              <Text className={styles.progressLabel}>平均选课人数</Text>
              <Text className={styles.progressValue}>{avgEnrollments}人/课</Text>
            </View>
            <View className={styles.progressBar}>
              <View className={styles.progressFill} style={{ width: `${Math.min(avgEnrollments * 5, 100)}%` }} />
            </View>
          </View>
        </View>
      </View>

      {/* 课程报名排行 */}
      <View className={styles.chartCard}>
        <Text className={styles.chartTitle}>课程报名排行</Text>
        <View className={styles.courseRanking}>
          {courseRanking.map((item, index) => (
            <View key={item.courseId} className={styles.rankItem}>
              <Text className={classnames(styles.rankNum, `rank${index + 1}`)}>
                {index + 1}
              </Text>
              <View className={styles.rankInfo}>
                <Text className={styles.rankTitle}>{item.title}</Text>
                <Text className={styles.rankTeacher}>{item.teacher}</Text>
              </View>
              <Text className={styles.rankCount}>{item.count}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 每日报名趋势 */}
      <View className={styles.chartCard}>
        <Text className={styles.chartTitle}>每日报名趋势</Text>
        <View className={styles.barChart}>
          {dailyTrend.map(item => {
            const maxCount = Math.max(...dailyTrend.map(d => d.count));
            const heightPercent = (item.count / maxCount) * 100;
            return (
              <View key={item.day} className={styles.barItem}>
                <View 
                  className={styles.bar} 
                  style={{ height: `${heightPercent}%` }} 
                />
                <Text className={styles.barLabel}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default StatisticsPage;