import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, Button, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Course } from '@/types';
import { mockCourseDetails } from '@/data/getCourseDetail';

const CourseManagePage = () => {
  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teacher: '',
    startTime: '',
    endTime: '',
    capacity: ''
  });

  // 课程列表
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 加载课程列表
  const loadCourses = async () => {
    try {
      setLoading(true);
      // H5环境：使用mock数据
      const courseList = Object.values(mockCourseDetails);
      setCourses(courseList);
      
      // 微信环境：调用云函数
      // if (process.env.TARO_ENV === 'weapp') {
      //   const result = await Taro.cloud.callFunction({
      //     name: 'getCourses',
      //     data: {}
      //   });
      //   const data = result.result as any;
      //   if (data.code === 0) {
      //     setCourses(data.data.courses);
      //   }
      // }
    } catch (err) {
      console.error('[CourseManagePage] Load courses failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始化
  useEffect(() => {
    loadCourses();
  }, []);

  // 更新表单字段
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 选择开始时间
  const handleStartTimeChange = (e: any) => {
    const value = e.detail.value;
    handleInputChange('startTime', value);
  };

  // 选择结束时间
  const handleEndTimeChange = (e: any) => {
    const value = e.detail.value;
    handleInputChange('endTime', value);
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请输入课程名称', icon: 'none' });
      return false;
    }
    if (!formData.description.trim()) {
      Taro.showToast({ title: '请输入课程介绍', icon: 'none' });
      return false;
    }
    if (!formData.startTime) {
      Taro.showToast({ title: '请选择开课时间', icon: 'none' });
      return false;
    }
    if (!formData.endTime) {
      Taro.showToast({ title: '请选择结束时间', icon: 'none' });
      return false;
    }
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      Taro.showToast({ title: '请输入有效的上课人数', icon: 'none' });
      return false;
    }
    if (formData.startTime > formData.endTime) {
      Taro.showToast({ title: '结束时间不能早于开始时间', icon: 'none' });
      return false;
    }
    return true;
  };

  // 保存课程
  const handleSave = async () => {
    if (!validateForm()) return;

    // 确认保存
    Taro.showModal({
      title: '确认保存',
      content: editingId ? '确定要更新此课程吗？' : '确定要创建新课程吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            if (editingId) {
              // 更新课程
              // H5环境：模拟更新
              Taro.showToast({ title: '课程更新成功', icon: 'success' });
              
              // 微信环境：调用云函数
              // const result = await Taro.cloud.callFunction({
              //   name: 'updateCourse',
              //   data: {
              //     courseId: editingId,
              //     ...formData,
              //     capacity: parseInt(formData.capacity)
              //   }
              // });
            } else {
              // 创建课程
              // H5环境：模拟创建
              Taro.showToast({ title: '课程创建成功', icon: 'success' });
              
              // 微信环境：调用云函数
              // const result = await Taro.cloud.callFunction({
              //   name: 'createCourse',
              //   data: {
              //     ...formData,
              //     capacity: parseInt(formData.capacity)
              //   }
              // });
            }
            
            // 重置表单
            setFormData({
              title: '',
              description: '',
              teacher: '',
              startTime: '',
              endTime: '',
              capacity: ''
            });
            setEditingId(null);
            
            // 重新加载课程列表
            loadCourses();
          } catch (err) {
            console.error('[CourseManagePage] Save failed:', err);
            Taro.showToast({ title: '保存失败', icon: 'none' });
          }
        }
      }
    });
  };

  // 编辑课程
  const handleEdit = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description,
      teacher: course.teacher,
      startTime: course.startTime,
      endTime: course.endTime,
      capacity: String(course.capacity)
    });
    setEditingId(course._id);
    // 滚动到顶部
    Taro.pageScrollTo({ scrollTop: 0 });
  };

  // 删除课程
  const handleDelete = (courseId: string, courseTitle: string) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除课程"${courseTitle}"吗？此操作不可撤销。`,
      success: async (res) => {
        if (res.confirm) {
          try {
            // H5环境：模拟删除
            Taro.showToast({ title: '课程删除成功', icon: 'success' });
            
            // 微信环境：调用云函数
            // const result = await Taro.cloud.callFunction({
            //   name: 'deleteCourse',
            //   data: { courseId }
            // });
            
            // 重新加载课程列表
            loadCourses();
          } catch (err) {
            console.error('[CourseManagePage] Delete failed:', err);
            Taro.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  };

  // 生成时间数组（用于picker）
  const generateDateArray = () => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // 生成时间数组（小时和分钟）
  const generateTimeArray = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return times;
  };

  if (loading) {
    return (
      <View className={styles.courseManagePage}>
        <Text className={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View className={styles.courseManagePage}>
      {/* 页面标题 */}
      <Text className={styles.pageTitle}>
        {editingId ? '编辑课程' : '添加课程'}
      </Text>

      {/* 表单卡片 */}
      <View className={styles.formCard}>
        <Text className={styles.formSectionTitle}>课程信息</Text>

        {/* 课程名称 */}
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>课程名称</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入课程名称"
            value={formData.title}
            onInput={(e) => handleInputChange('title', e.detail.value)}
          />
        </View>

        {/* 课程介绍 */}
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>课程介绍</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请输入课程介绍，包括课程内容、教学目标等"
            value={formData.description}
            onInput={(e) => handleInputChange('description', e.detail.value)}
            maxLength={500}
          />
          <Text className={styles.hintText}>最多输入500字</Text>
        </View>

        {/* 授课教师 */}
        <View className={styles.formItem}>
          <Text className={styles.formLabelOptional}>授课教师</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入教师姓名"
            value={formData.teacher}
            onInput={(e) => handleInputChange('teacher', e.detail.value)}
          />
        </View>

        {/* 开课时间 */}
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>开课时间</Text>
          <Picker
            mode="date"
            value={formData.startTime}
            onChange={handleStartTimeChange}
          >
            <View className={styles.timePicker}>
              <Text className={styles.formInput}>
                {formData.startTime || '请选择开课日期'}
              </Text>
            </View>
          </Picker>
        </View>

        {/* 结束时间 */}
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>结束时间</Text>
          <Picker
            mode="date"
            value={formData.endTime}
            onChange={handleEndTimeChange}
          >
            <View className={styles.timePicker}>
              <Text className={styles.formInput}>
                {formData.endTime || '请选择结束日期'}
              </Text>
            </View>
          </Picker>
        </View>

        {/* 上课人数 */}
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>上课人数</Text>
          <Input
            className={styles.numberInput}
            type="number"
            placeholder="请输入课程容量"
            value={formData.capacity}
            onInput={(e) => handleInputChange('capacity', e.detail.value)}
          />
          <Text className={styles.hintText}>设置课程最大容纳人数</Text>
        </View>
      </View>

      {/* 分隔线 */}
      <View className={styles.divider} />

      {/* 课程列表 */}
      <Text className={styles.listTitle}>课程列表</Text>
      {courses.length > 0 ? (
        <View>
          {courses.map(course => (
            <View key={course._id} className={styles.courseItem}>
              <View className={styles.courseItemHeader}>
                <Text className={styles.courseItemTitle}>{course.title}</Text>
                <View className={styles.courseItemActions}>
                  <Button
                    className={styles.actionBtn}
                    onClick={() => handleEdit(course)}
                  >
                    编辑
                  </Button>
                  <Button
                    className={classnames(styles.actionBtn, styles.delete)}
                    onClick={() => handleDelete(course._id, course.title)}
                  >
                    删除
                  </Button>
                </View>
              </View>
              <View className={styles.courseItemInfo}>
                <Text className={styles.courseItemInfoItem}>👨‍🏫 {course.teacher}</Text>
                <Text className={styles.courseItemInfoItem}>📅 {course.startTime.split(' ')[0]} ~ {course.endTime.split(' ')[0]}</Text>
                <Text className={styles.courseItemInfoItem}>👥 {course.enrolled}/{course.capacity}人</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text className={styles.emptyState}>暂无课程，点击上方添加</Text>
      )}

      {/* 底部保存按钮 */}
      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.saveBtn, (!formData.title || !formData.description) && styles.disabled)}
          onClick={handleSave}
          disabled={!formData.title || !formData.description}
        >
          {editingId ? '更新课程' : '保存课程'}
        </Button>
      </View>
    </View>
  );
};

export default CourseManagePage;