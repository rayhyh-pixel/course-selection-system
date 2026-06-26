import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import { useUser } from '@/store/UserContext';
import StatusTag from '@/components/StatusTag';
import EmptyState from '@/components/EmptyState';
import classnames from 'classnames';
import { Enrollment } from '@/types';
import { formatDateTime } from '@/utils/format';

const MinePage = () => {
  const { userInfo, switchRole } = useUser();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Mock 数据
  const mockEnrollments: Enrollment[] = [
    {
      _id: 'enroll_001',
      _openid: 'mock_openid_123',
      courseId: 'course_001',
      courseTitle: 'Web前端开发实战',
      teacher: '张老师',
      status: 'approved',
      createTime: new Date('2024-02-01'),
      updateTime: new Date('2024-02-02')
    },
    {
      _id: 'enroll_002',
      _openid: 'mock_openid_123',
      courseId: 'course_003',
      courseTitle: '人工智能基础',
      teacher: '王老师',
      status: 'pending',
      createTime: new Date('2024-03-01'),
      updateTime: new Date('2024-03-01')
    },
    {
      _id: 'enroll_003',
      _openid: 'mock_openid_123',
      courseId: 'course_005',
      courseTitle: '数据库设计与优化',
      teacher: '孙老师',
      status: 'rejected',
      createTime: new Date('2024-04-01'),
      updateTime: new Date('2024-04-02'),
      reason: '课程已满'
    }
  ];

  // 加载我的选课记录
  const loadMyEnrollments = async () => {
    try {
      // H5 环境：使用 mock 数据
      setEnrollments(mockEnrollments);
      
      // 计算统计
      const pending = mockEnrollments.filter(e => e.status === 'pending').length;
      const approved = mockEnrollments.filter(e => e.status === 'approved').length;
      const rejected = mockEnrollments.filter(e => e.status === 'rejected').length;
      setStats({ pending, approved, rejected });
      
      // 微信环境：调用云函数
      // if (process.env.TARO_ENV === 'weapp') {
      //   const result = await Taro.cloud.callFunction({
      //     name: 'getMyEnrollments',
      //     data: {}
      //   });
      //   const data = result.result as any;
      //   if (data.code === 0) {
      //     setEnrollments(data.data.enrollments);
      //   }
      // }
    } catch (err) {
      console.error('[MinePage] Load enrollments failed:', err);
    }
  };

  // 初始化
  useEffect(() => {
    loadMyEnrollments();
  }, []);

  // 下拉刷新
  usePullDownRefresh(async () => {
    await loadMyEnrollments();
    Taro.stopPullDownRefresh();
  });

  // 点击课程卡片
  const handleEnrollmentClick = (enrollment: Enrollment) => {
    Taro.navigateTo({
      url: `/pages/course-detail/index?id=${enrollment.courseId}`
    });
  };

  return (
    <View className={styles.minePage}>
      {/* 用户信息 */}
      <View className={styles.userCard}>
        <Image
          className={styles.avatar}
          src={userInfo?.avatar || 'https://picsum.photos/id/64/200/200'}
          mode="aspectFill"
        />
        <View className={styles.userInfo}>
          <Text className={styles.nickname}>{userInfo?.nickname || '同学'}</Text>
          <Text className={styles.roleText}>
            {userInfo?.role === 'admin' ? '管理员' : '学生'}
          </Text>
        </View>
        {/* 角色切换按钮（预览用） */}
        <Button
          className={classnames(styles.switchRoleBtn, userInfo?.role === 'admin' && styles.adminMode)}
          onClick={() => {
            switchRole(userInfo?.role === 'admin' ? 'student' : 'admin');
            Taro.showToast({
              title: userInfo?.role === 'admin' ? '已切换为学生' : '已切换为管理员',
              icon: 'success'
            });
          }}
        >
          {userInfo?.role === 'admin' ? '切换学生' : '切换管理员'}
        </Button>
      </View>

      {/* 选课统计 */}
      <View className={styles.statsSection}>
        <Text className={styles.sectionTitle}>选课统计</Text>
        <View className={styles.statsGrid}>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{stats.pending}</Text>
            <Text className={styles.statLabel}>待审核</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{stats.approved}</Text>
            <Text className={styles.statLabel}>已通过</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{stats.rejected}</Text>
            <Text className={styles.statLabel}>已拒绝</Text>
          </View>
        </View>
      </View>

      {/* 我的选课列表 */}
      <Text className={styles.sectionTitle}>选课记录</Text>
      {enrollments.length > 0 ? (
        <View className={styles.enrollmentList}>
          {enrollments.map(enrollment => (
            <View
              key={enrollment._id}
              className={styles.enrollmentCard}
              onClick={() => handleEnrollmentClick(enrollment)}
            >
              <View className={styles.cardHeader}>
                <Text className={styles.courseTitle}>{enrollment.courseTitle}</Text>
                <StatusTag status={enrollment.status} />
              </View>
              <View className={styles.cardBody}>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>教师：</Text>
                  <Text className={styles.infoValue}>{enrollment.teacher}</Text>
                </View>
                <View className={styles.infoRow}>
                  <Text className={styles.infoLabel}>申请时间：</Text>
                  <Text className={styles.infoValue}>
                    {formatDateTime(enrollment.createTime, 'YYYY-MM-DD')}
                  </Text>
                </View>
                {enrollment.status === 'rejected' && enrollment.reason && (
                  <View className={styles.infoRow}>
                    <Text className={styles.infoLabel}>拒绝原因：</Text>
                    <Text className={styles.infoValue}>{enrollment.reason}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <EmptyState text="暂无选课记录" />
      )}
    </View>
  );
};

export default MinePage;