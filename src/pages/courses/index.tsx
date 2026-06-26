import React, { useState, useEffect } from 'react';
import { View, Input, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import CourseCard from '@/components/CourseCard';
import EmptyState from '@/components/EmptyState';
import { CourseListItem } from '@/types';
import { mockCourses } from '@/data/getCourses';

const CoursesPage = () => {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseListItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'full'>('all');

  // 加载课程列表
  const loadCourses = async () => {
    try {
      // H5 环境：使用 mock 数据
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      
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
    }
  };

  // 初始化
  useEffect(() => {
    loadCourses();
  }, []);

  // 下拉刷新
  usePullDownRefresh(async () => {
    await loadCourses();
    Taro.stopPullDownRefresh();
  });

  // 搜索和筛选
  useEffect(() => {
    let result = courses;
    
    // 关键词搜索
    if (searchKeyword) {
      result = result.filter(course =>
        course.title.includes(searchKeyword) ||
        course.teacher.includes(searchKeyword)
      );
    }
    
    // 状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(course => course.status === statusFilter);
    }
    
    setFilteredCourses(result);
  }, [courses, searchKeyword, statusFilter]);

  return (
    <View className={styles.coursesPage}>
      {/* 筛选栏 */}
      <View className={styles.filterBar}>
        <Input
          className={styles.searchInput}
          placeholder="搜索课程或教师"
          value={searchKeyword}
          onInput={(e) => setSearchKeyword(e.detail.value)}
        />
        <View className={styles.statusFilter}>
          <Button
            className={classnames(styles.filterButton, statusFilter === 'all' && styles.active)}
            onClick={() => setStatusFilter('all')}
          >
            全部
          </Button>
          <Button
            className={classnames(styles.filterButton, statusFilter === 'open' && styles.active)}
            onClick={() => setStatusFilter('open')}
          >
            可选
          </Button>
        </View>
      </View>

      {/* 课程列表 */}
      {filteredCourses.length > 0 ? (
        <View className={styles.courseList}>
          {filteredCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </View>
      ) : (
        <EmptyState text="没有找到符合条件的课程" />
      )}
    </View>
  );
};

export default CoursesPage;