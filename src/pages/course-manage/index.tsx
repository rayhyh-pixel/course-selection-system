import React, { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, Button, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Course } from '@/types';
import { mockCourseDetails } from '@/data/getCourseDetail';

const CourseManagePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teacher: '',
    startTime: '',
    endTime: '',
    capacity: ''
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 加载课程列表（从 localStorage 和 mock 数据合并）
  const loadCourses = async () => {
    try {
      setLoading(true);
      
      // 获取 localStorage 中的自定义课程
      const customCoursesStr = Taro.getStorageSync('customCourses') || '[]';
      const customCourses: Course[] = JSON.parse(customCoursesStr);
      
      // 合并 mock 数据和自定义课程
      const mockList = Object.values(mockCourseDetails);
      const allCourses = [...mockList, ...customCourses];
      
      setCourses(allCourses);
    } catch (err) {
      console.error('[CourseManagePage] Load courses failed:', err);
      // 出错时使用默认 mock 数据
      setCourses(Object.values(mockCourseDetails));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartTimeChange = (e: any) => {
    handleInputChange('startTime', e.detail.value);
  };

  const handleEndTimeChange = (e: any) => {
    handleInputChange('endTime', e.detail.value);
  };

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

  // 保存课程到 localStorage
  const saveCourseToStorage = (course: Course) => {
    const customCoursesStr = Taro.getStorageSync('customCourses') || '[]';
    const customCourses: Course[] = JSON.parse(customCoursesStr);
    
    // 检查是否已存在（更新）
    const index = customCourses.findIndex(c => c._id === course._id);
    if (index >= 0) {
      customCourses[index] = course;
    } else {
      customCourses.push(course);
    }
    
    Taro.setStorageSync('customCourses', JSON.stringify(customCourses));
  };

  // 删除课程从 localStorage
  const deleteCourseFromStorage = (courseId: string) => {
    const customCoursesStr = Taro.getStorageSync('customCourses') || '[]';
    const customCourses: Course[] = JSON.parse(customCoursesStr);
    const filtered = customCourses.filter(c => c._id !== courseId);
    Taro.setStorageSync('customCourses', JSON.stringify(filtered));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    Taro.showModal({
      title: '确认保存',
      content: editingId ? '确定要更新此课程吗？' : '确定要创建新课程吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const now = new Date();
            const newCourse: Course = {
              _id: editingId || `course_${Date.now()}`,
              title: formData.title,
              description: formData.description,
              teacher: formData.teacher || '未知教师',
              teacherTitle: '',
              teacherIntro: '',
              capacity: parseInt(formData.capacity),
              enrolled: 0,
              startTime: formData.startTime,
              endTime: formData.endTime,
              status: 'open' as const,
              category: '',
              location: '',
              schedule: '',
              createTime: editingId ? now : now,
              updateTime: now
            };

            // 保存到 localStorage
            saveCourseToStorage(newCourse);

            Taro.showToast({ 
              title: editingId ? '课程更新成功' : '课程创建成功', 
              icon: 'success' 
            });

            setFormData({
              title: '',
              description: '',
              teacher: '',
              startTime: '',
              endTime: '',
              capacity: ''
            });
            setEditingId(null);
            loadCourses();
          } catch (err) {
            console.error('[CourseManagePage] Save failed:', err);
            Taro.showToast({ title: '保存失败', icon: 'none' });
          }
        }
      }
    });
  };

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
    Taro.pageScrollTo({ scrollTop: 0 });
  };

  const handleDelete = (courseId: string, courseTitle: string) => {
    // 检查是否是 mock 数据（不能删除）
    if (mockCourseDetails[courseId]) {
      Taro.showToast({ title: '示例课程不能删除', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '确认删除',
      content: `确定要删除课程"${courseTitle}"吗？此操作不可撤销。`,
      success: async (res) => {
        if (res.confirm) {
          try {
            deleteCourseFromStorage(courseId);
            Taro.showToast({ title: '课程删除成功', icon: 'success' });
            loadCourses();
          } catch (err) {
            console.error('[CourseManagePage] Delete failed:', err);
            Taro.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      }
    });
  };

  if (loading) {
    return (
      <View className={styles.courseManagePage}>
        <Text className={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.courseManagePage}>
      {/* 返回按钮和标题 */}
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          ←
        </Button>
        <Text className={styles.pageTitle}>
          {editingId ? '编辑课程' : '添加课程'}
        </Text>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formSectionTitle}>课程信息</Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>课程名称</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入课程名称"
            value={formData.title}
            onInput={(e) => handleInputChange('title', e.detail.value)}
          />
        </View>

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

        <View className={styles.formItem}>
          <Text className={styles.formLabelOptional}>授课教师</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入教师姓名"
            value={formData.teacher}
            onInput={(e) => handleInputChange('teacher', e.detail.value)}
          />
        </View>

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

      <View className={styles.divider} />

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
                <Text className={styles.courseItemInfoItem}>📅 {course.startTime.split(' ')[0] || course.startTime} ~ {course.endTime.split(' ')[0] || course.endTime}</Text>
                <Text className={styles.courseItemInfoItem}>👥 {course.enrolled}/{course.capacity}人</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text className={styles.emptyState}>暂无课程，点击上方添加</Text>
      )}

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