import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUser } from '@/store/UserContext';

const AdminPage = () => {
  const { userInfo } = useUser();

  // 权限检查
  if (userInfo?.role !== 'admin') {
    return (
      <View className={styles.adminPage}>
        <Text className={styles.warningText}>您不是管理员，无法访问此页面</Text>
      </View>
    );
  }

  // 跳转到课程管理
  const handleCourseManage = () => {
    Taro.navigateTo({ url: '/pages/course-manage/index' });
  };

  // 跳转到审核管理（待开发）
  const handleReviewManage = () => {
    Taro.navigateTo({ url: '/pages/review-detail/index' });
  };

  // 跳转到数据统计（待开发）
  const handleStatistics = () => {
    Taro.navigateTo({ url: '/pages/statistics/index' });
  };

  return (
    <View className={styles.adminPage}>
      {/* 课程管理 */}
      <View className={styles.adminCard}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardIcon}>📚</Text>
          <Text className={styles.cardTitle}>课程管理</Text>
        </View>
        <Text className={styles.cardDesc}>
          创建、编辑、删除课程信息，设置课程容量和时间安排。
        </Text>
        <View className={styles.menuList}>
          <Button className={styles.menuItem} onClick={handleCourseManage}>
            进入课程管理
          </Button>
        </View>
      </View>

      {/* 审核管理 */}
      <View className={styles.adminCard}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardIcon}>✅</Text>
          <Text className={styles.cardTitle}>审核管理</Text>
        </View>
        <Text className={styles.cardDesc}>
          查看待审核的选课申请，批准或拒绝学生的选课请求。
        </Text>
        <View className={styles.menuList}>
          <Button className={styles.menuItem} onClick={handleReviewManage}>
            进入审核管理
          </Button>
        </View>
      </View>

      {/* 数据统计 */}
      <View className={styles.adminCard}>
        <View className={styles.cardHeader}>
          <Text className={styles.cardIcon}>📊</Text>
          <Text className={styles.cardTitle}>数据统计</Text>
        </View>
        <Text className={styles.cardDesc}>
          查看选课数据统计、报名情况分析、学生参与情况等。
        </Text>
        <View className={styles.menuList}>
          <Button className={styles.menuItem} onClick={handleStatistics}>
            查看统计数据
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AdminPage;