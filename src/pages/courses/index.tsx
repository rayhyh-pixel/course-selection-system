import React, { useState, useEffect } from 'react';
import { View, Input, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import CourseCard from '@/components/CourseCard';
import EmptyState from '@/components/EmptyState';
import { CourseListItem } from '@/types';
import { mockCourseDetails } from '@/data/getCourseDetail';

const CoursesPage = () => {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseListItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'full'>('all');

  // 加载课程列表（从 localStorage 和 mock 数据合并）
  const loadCourses = async () => {
    try {
      // 获取 localStorage 中的自定义课程
      const customCoursesStr = Taro.getStorageSync('customCourses') || '[]';
      const customCourses = JSON.parse(customCoursesStr);
      
      // 合并 mock 数据和自定义课程
      const mockList = Object.values(mockCourseDetails);
      const allCourses = [...mockList, ...customCourses];
      
      // 转换为 CourseListItem 格式
      const courseList = allCourses.map(course => ({
        _id: course._id,
        title: course.title,
        teacher: course.teacher,
        capacity: course.capacity,
        enrolled: course.enrolled,
        startTime: course.startTime,
        endTime: course.endTime,
        status: course.status
      }));
      
      setCourses(courseList);
      setFilteredCourses(courseList);
      
      // 微信环境：调用云函数
      // if (process.env.TARO_ENV === 'weapp') {
      //   const result = await Taro.cloud.callFunction({
      //     name: 'getCourses',
      //     data: {}
      //   });
      //   const data = result.result as any;
      //   if (data.code === 0) {
      //     setCourses(data.data.courses);
      //     setFilteredCourses(data.data.courses);
      //   }
      // }
    } catch (err) {
      console.error('[CoursesPage] Load courses failed:', err);
      // 出错时使用默认 mock 数据
      const mockList = Object.values(mockCourseDetails);
      const courseList = mockList.map(course => ({
        _id: course._id,
        title: course.title,
        teacher: course.teacher,
        capacity: course.capacity,
        enrolled: course.enrolled,
        startTime: course.startTime,
        endTime: course.endTime,
        status: course.status
      }));
      setCourses(courseList);
      setFilteredCourses(courseList);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  usePullDownRefresh(async () => {
    await loadCourses();
    Taro.stopPullDownRefresh();
  });

  useEffect(() => {
    let result = courses;
    
    if (searchKeyword) {
      result = result.filter(course =>
        course.title.includes(searchKeyword) ||
        course.teacher.includes(searchKeyword)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(course => course.status === statusFilter);
    }
    
    setFilteredCourses(result);
  }, [courses, searchKeyword, statusFilter]);

  return (
    <View className={styles.coursesPage}>
      <View className={styles.filterBar}>
        <Input
          className={styles.searchInput}
          placeholder="搜索课程或教师"
          value={searchKeyword}
          onInput={(e) => setSearchKeyword(e.detail.value)}
        />
      </View>

      <View className={styles.statusFilter}>
        {[
          { key: 'all', label: '全部' },
          { key: 'open', label: '可选课' },
          { key: 'full', label: '已满员' },
          { key: 'closed', label: '已关闭' }
        ].map(item => (
          <Button
            key={item.key}
            className={classnames(
              styles.filterBtn,
              statusFilter === item.key && styles.filterBtnActive
            )}
            onClick={() => setStatusFilter(item.key as any)}
          >
            {item.label}
          </Button>
        ))}
      </View>

      <View className={styles.courseList}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <EmptyState text="暂无课程" />
        )}
      </View>

      <View className={styles.bottomSpace} />
    </View>
  );
};

export default CoursesPage;