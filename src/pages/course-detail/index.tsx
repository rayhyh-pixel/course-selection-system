import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Course } from '@/types';
import { useUser } from '@/store/UserContext';
import { formatDateTime } from '@/utils/format';
import { mockCourseDetails } from '@/data/getCourseDetail';

const CourseDetailPage = () => {
  const { userInfo } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollStatus, setEnrollStatus] = useState<'none' | 'pending' | 'approved' | 'cancelled'>('none');
  const [isEnrolling, setIsEnrolling] = useState(false);

  // 获取课程ID（从URL参数）
  const getCourseId = () => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return (currentPage as any)?.options?.id || 'course_001';
  };

  // 加载课程详情
  const loadCourseDetail = async () => {
    try {
      setLoading(true);
      const courseId = getCourseId();
      
      // H5环境：使用mock数据
      const mockCourse = mockCourseDetails[courseId];
      if (mockCourse) {
        setCourse(mockCourse);
      } else {
        // 默认返回第一个课程
        const firstKey = Object.keys(mockCourseDetails)[0];
        setCourse(mockCourseDetails[firstKey]);
      }
      
      // 检查用户是否已选课（模拟）
      checkEnrollmentStatus(courseId);
      
      // 微信环境：调用云函数
      // if (process.env.TARO_ENV === 'weapp') {
      //   const result = await Taro.cloud.callFunction({
      //     name: 'getCourseDetail',
      //     data: { id: courseId }
      //   });
      //   const data = result.result as any;
      //   if (data.code === 0) {
      //     setCourse(data.data);
      //   }
      // }
    } catch (err) {
      console.error('[CourseDetailPage] Load course failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // 检查选课状态（模拟）
  const checkEnrollmentStatus = (courseId: string) => {
    // 根据课程ID模拟不同的选课状态
    const statusMap: Record<string, 'none' | 'pending' | 'approved' | 'cancelled'> = {
      'course_001': 'approved',
      'course_003': 'pending',
      'course_005': 'none',
      'course_002': 'none',
      'course_004': 'none',
      'course_006': 'none',
      'course_007': 'none',
      'course_008': 'none',
      'course_009': 'none',
      'course_010': 'none'
    };
    setEnrollStatus(statusMap[courseId] || 'none');
  };

  // 选课操作
  const handleEnroll = async () => {
    if (!course || isEnrolling) return;
    
    // 检查课程状态
    if (course.status === 'closed') {
      Taro.showToast({ title: '课程已关闭', icon: 'none' });
      return;
    }
    
    if (course.status === 'full') {
      Taro.showToast({ title: '课程已满员', icon: 'none' });
      return;
    }
    
    // 检查选课状态
    if (enrollStatus === 'pending') {
      Taro.showToast({ title: '您的申请正在审核中', icon: 'none' });
      return;
    }
    
    if (enrollStatus === 'approved') {
      Taro.showToast({ title: '您已成功选课', icon: 'none' });
      return;
    }
    
    // 确认选课
    Taro.showModal({
      title: '确认选课',
      content: `确定要选择"${course.title}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          setIsEnrolling(true);
          try {
            // H5环境：模拟选课成功
            Taro.showToast({ title: '选课申请已提交', icon: 'success' });
            setEnrollStatus('pending');
            
            // 微信环境：调用云函数
            // if (process.env.TARO_ENV === 'weapp') {
            //   const result = await Taro.cloud.callFunction({
            //     name: 'enrollCourse',
            //     data: { courseId: course._id }
            //   });
            //   const data = result.result as any;
            //   if (data.code === 0) {
            //     Taro.showToast({ title: '选课申请已提交', icon: 'success' });
            //     setEnrollStatus('pending');
            //   } else {
            //     Taro.showToast({ title: data.message, icon: 'none' });
            //   }
            // }
          } catch (err) {
            console.error('[CourseDetailPage] Enroll failed:', err);
            Taro.showToast({ title: '选课失败', icon: 'none' });
          } finally {
            setIsEnrolling(false);
          }
        }
      }
    });
  };

  // 获取按钮状态和文字
  const getButtonConfig = () => {
    if (!course) return { text: '加载中', className: styles.disabled };
    
    // 管理员角色
    if (userInfo?.role === 'admin') {
      return { text: '管理课程', className: styles.enrollBtn };
    }
    
    // 根据选课状态
    switch (enrollStatus) {
      case 'pending':
        return { text: '申请审核中', className: classnames(styles.enrollBtn, styles.pending) };
      case 'approved':
        return { text: '已成功选课', className: classnames(styles.enrollBtn, styles.approved) };
      case 'cancelled':
        return { text: '已取消', className: styles.disabled };
      default:
        if (course.status === 'closed') {
          return { text: '课程已关闭', className: styles.disabled };
        }
        if (course.status === 'full') {
          return { text: '课程已满员', className: classnames(styles.enrollBtn, styles.full) };
        }
        return { text: '立即选课', className: styles.enrollBtn };
    }
  };

  // 初始化
  useEffect(() => {
    loadCourseDetail();
  }, []);

  // 计算进度百分比
  const getProgressPercent = () => {
    if (!course) return 0;
    return Math.round((course.enrolled / course.capacity) * 100);
  };

  if (loading) {
    return (
      <View className={styles.loadingContainer}>
        <Text className={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View className={styles.loadingContainer}>
        <Text className={styles.loadingText}>课程不存在</Text>
      </View>
    );
  }

  const buttonConfig = getButtonConfig();

  return (
    <View className={styles.courseDetailPage}>
      {/* 顶部课程信息 */}
      <View className={styles.headerCard}>
        <Text className={styles.courseTitle}>{course.title}</Text>
        <View className={styles.headerInfo}>
          {course.category && (
            <View className={styles.categoryTag}>
              <Text className={styles.categoryText}>{course.category}</Text>
            </View>
          )}
          <View className={classnames(styles.statusTag, `status${course.status.charAt(0).toUpperCase() + course.status.slice(1)}`)}>
            <Text className={styles.statusText}>
              {course.status === 'open' ? '可选课' : course.status === 'closed' ? '已关闭' : '已满员'}
            </Text>
          </View>
        </View>
      </View>

      {/* 课程详情内容 */}
      <View className={styles.contentSection}>
        {/* 课程描述 */}
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>课程介绍</Text>
          <Text className={styles.descriptionText}>{course.description}</Text>
        </View>

        {/* 基本信息 */}
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>课程信息</Text>
          <View className={styles.infoList}>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>📅</Text>
              <Text className={styles.infoLabel}>上课时间：</Text>
              <Text className={styles.infoValue}>
                {formatDateTime(course.startTime, 'YYYY-MM-DD HH:mm')} - {formatDateTime(course.endTime, 'YYYY-MM-DD HH:mm')}
              </Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>📌</Text>
              <Text className={styles.infoLabel}>上课地点：</Text>
              <Text className={styles.infoValue}>{course.location || '待定'}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>📋</Text>
              <Text className={styles.infoLabel}>课程安排：</Text>
              <Text className={styles.infoValue}>{course.schedule || '待定'}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>👥</Text>
              <Text className={styles.infoLabel}>选课人数：</Text>
              <View className={styles.enrollStats}>
                <Text className={styles.enrollNumber}>{course.enrolled}</Text>
                <Text className={styles.enrollTotal}>/ {course.capacity}人</Text>
              </View>
            </View>
            {/* 进度条 */}
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>📊</Text>
              <Text className={styles.infoLabel}>名额进度：</Text>
              <View className={styles.enrollProgress}>
                <View className={styles.progressBar} style={{ width: `${getProgressPercent()}%` }} />
              </View>
              <Text className={styles.infoValue}>{getProgressPercent()}%</Text>
            </View>
          </View>
        </View>

        {/* 教师信息 */}
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>授课教师</Text>
          <View className={styles.teacherCard}>
            <Image
              className={styles.teacherAvatar}
              src={`https://picsum.photos/id/${90 + course._id.slice(-2)}%20/200/200`}
              mode="aspectFill"
            />
            <View className={styles.teacherInfo}>
              <Text className={styles.teacherName}>{course.teacher}</Text>
              <Text className={styles.teacherTitle}>{course.teacherTitle || '讲师'}</Text>
              <Text className={styles.teacherIntro}>{course.teacherIntro || '暂无简介'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 底部操作栏 */}
      <View className={styles.bottomBar}>
        <Button
          className={buttonConfig.className}
          onClick={handleEnroll}
          disabled={enrollStatus !== 'none' || course.status !== 'open'}
        >
          {buttonConfig.text}
        </Button>
      </View>
    </View>
  );
};

export default CourseDetailPage;