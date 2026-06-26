import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { CourseListItem } from '@/types';
import { formatDateTime, formatCapacity } from '@/utils/format';

interface CourseCardProps {
  course: CourseListItem;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 默认跳转到课程详情页
      Taro.navigateTo({
        url: `/pages/course-detail/index?id=${course._id}`
      });
    }
  };

  const getStatusClass = () => {
    switch (course.status) {
      case 'open':
        return styles.statusOpen;
      case 'closed':
        return styles.statusClosed;
      case 'full':
        return styles.statusFull;
      default:
        return '';
    }
  };

  return (
    <View className={styles.cardContainer} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <Text className={styles.courseTitle}>{course.title}</Text>
        <View className={classnames(styles.statusTag, getStatusClass())}>
          <Text className={styles.statusText}>
            {course.status === 'open' ? '可选课' : course.status === 'closed' ? '已关闭' : '已满员'}
          </Text>
        </View>
      </View>
      
      <View className={styles.cardBody}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>授课教师：</Text>
          <Text className={styles.infoValue}>{course.teacher}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>上课时间：</Text>
          <Text className={styles.infoValue}>
            {formatDateTime(course.startTime, 'YYYY-MM-DD HH:mm')} - {formatDateTime(course.endTime, 'HH:mm')}
          </Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>选课人数：</Text>
          <Text className={styles.infoValue}>{formatCapacity(course.enrolled, course.capacity)}</Text>
          {course.enrolled < course.capacity && (
            <Text className={styles.remainText}>（剩余 {course.capacity - course.enrolled} 人）</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default CourseCard;