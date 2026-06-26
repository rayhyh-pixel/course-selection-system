import React, { useState, useEffect } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Student } from '@/types';
import { mockStudents } from '@/data/getStudents';

const StudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const customStudentsStr = Taro.getStorageSync('customStudents') || '[]';
      const customStudents: Student[] = JSON.parse(customStudentsStr);
      const allStudents = [...mockStudents, ...customStudents];
      setStudents(allStudents);
      setFilteredStudents(allStudents);
    } catch (err) {
      console.error('[StudentListPage] Load students failed:', err);
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    let result = students;
    
    if (searchKeyword) {
      result = result.filter(student =>
        student.name.includes(searchKeyword) ||
        student.phone.includes(searchKeyword) ||
        student.studentId?.includes(searchKeyword) ||
        student.class?.includes(searchKeyword)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(student => student.status === statusFilter);
    }
    
    setFilteredStudents(result);
  }, [students, searchKeyword, statusFilter]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View className={styles.studentListPage}>
        <Text className={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View className={styles.studentListPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          ←
        </Button>
        <Text className={styles.pageTitle}>学生列表</Text>
      </View>

      <View className={styles.filterBar}>
        <Input
          className={styles.searchInput}
          placeholder="搜索姓名/手机号/学号"
          value={searchKeyword}
          onInput={(e) => setSearchKeyword(e.detail.value)}
        />
      </View>

      <View className={styles.statusFilter}>
        {[
          { key: 'all', label: '全部' },
          { key: 'active', label: '活跃' },
          { key: 'inactive', label: '不活跃' }
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

      <View className={styles.studentList}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <View key={student._id} className={styles.studentItem}>
              <View className={styles.studentAvatar}>
                <Text className={styles.avatarText}>
                  {student.name.charAt(0)}
                </Text>
              </View>
              <View className={styles.studentInfo}>
                <View className={styles.studentHeader}>
                  <Text className={styles.studentName}>{student.name}</Text>
                  <Text className={classnames(styles.statusTag, student.status)}>
                    {student.status === 'active' ? '活跃' : '不活跃'}
                  </Text>
                </View>
                <Text className={styles.studentDetail}>📱 {formatPhone(student.phone)}</Text>
                <Text className={styles.studentDetail}>🆔 {student.studentId || '-'}</Text>
                <Text className={styles.studentDetail}>🏫 {student.class || '-'}</Text>
              </View>
              <View className={styles.studentStats}>
                <Text className={styles.statLabel}>选课数</Text>
                <Text className={styles.statValue}>{student.enrollCount}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text className={styles.emptyState}>暂无学生</Text>
        )}
      </View>

      <View className={styles.bottomSpace} />
    </View>
  );
};

export default StudentListPage;