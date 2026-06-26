import React, { useState, useEffect } from 'react';
import { View, Text, Button, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Enrollment } from '@/types';
import { mockEnrollments } from '@/data/getEnrollments';

type TabType = 'all' | 'pending' | 'approved' | 'rejected';

const ReviewDetailPage = () => {
  // 当前标签
  const [activeTab, setActiveTab] = useState<TabType>('all');
  // 申请列表
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 拒绝弹窗
  const [showRejectModal, setShowRejectModal] = useState(false);
  // 当前要拒绝的申请ID
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  // 拒绝原因
  const [rejectReason, setRejectReason] = useState('');

  // 加载申请列表
  const loadEnrollments = async () => {
    try {
      setLoading(true);
      // H5环境：使用mock数据
      setEnrollments(mockEnrollments);
      
      // 微信环境：调用云函数
      // if (process.env.TARO_ENV === 'weapp') {
      //   const result = await Taro.cloud.callFunction({
      //     name: 'getEnrollments',
      //     data: {}
      //   });
      //   const data = result.result as any;
      //   if (data.code === 0) {
      //     setEnrollments(data.data);
      //   }
      // }
    } catch (err) {
      console.error('[ReviewDetailPage] Load enrollments failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始化
  useEffect(() => {
    loadEnrollments();
  }, []);

  // 统计数据
  const getStats = () => {
    const pending = enrollments.filter(e => e.status === 'pending').length;
    const approved = enrollments.filter(e => e.status === 'approved').length;
    const rejected = enrollments.filter(e => e.status === 'rejected').length;
    return { pending, approved, rejected };
  };

  // 过滤列表
  const filteredEnrollments = () => {
    switch (activeTab) {
      case 'pending':
        return enrollments.filter(e => e.status === 'pending');
      case 'approved':
        return enrollments.filter(e => e.status === 'approved');
      case 'rejected':
        return enrollments.filter(e => e.status === 'rejected');
      default:
        return enrollments;
    }
  };

  // 获取状态标签配置
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '待审核', className: 'statusPending' };
      case 'approved':
        return { text: '已通过', className: 'statusApproved' };
      case 'rejected':
        return { text: '已拒绝', className: 'statusRejected' };
      case 'cancelled':
        return { text: '已取消', className: 'statusCancelled' };
      default:
        return { text: status, className: '' };
    }
  };

  // 审核通过
  const handleApprove = (enrollId: string) => {
    Taro.showModal({
      title: '确认通过',
      content: '确定要通过此选课申请吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // H5环境：模拟审核通过
            Taro.showToast({ title: '审核通过', icon: 'success' });
            
            // 更新本地状态
            setEnrollments(prev => 
              prev.map(e => 
                e._id === enrollId 
                  ? { ...e, status: 'approved' as const, updateTime: new Date() }
                  : e
              )
            );
            
            // 微信环境：调用云函数
            // const result = await Taro.cloud.callFunction({
            //   name: 'reviewEnrollment',
            //   data: { enrollId, action: 'approve' }
            // });
          } catch (err) {
            console.error('[ReviewDetailPage] Approve failed:', err);
            Taro.showToast({ title: '操作失败', icon: 'none' });
          }
        }
      }
    });
  };

  // 打开拒绝弹窗
  const openRejectModal = (enrollId: string) => {
    setRejectingId(enrollId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // 关闭拒绝弹窗
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectingId(null);
    setRejectReason('');
  };

  // 确认拒绝
  const handleReject = () => {
    if (!rejectReason.trim()) {
      Taro.showToast({ title: '请输入拒绝原因', icon: 'none' });
      return;
    }

    if (!rejectingId) return;

    Taro.showModal({
      title: '确认拒绝',
      content: `确定要拒绝此申请吗？\n原因：${rejectReason}`,
      success: async (res) => {
        if (res.confirm) {
          try {
            // H5环境：模拟拒绝
            Taro.showToast({ title: '已拒绝', icon: 'success' });
            
            // 更新本地状态
            setEnrollments(prev => 
              prev.map(e => 
                e._id === rejectingId 
                  ? { ...e, status: 'rejected' as const, reason: rejectReason, updateTime: new Date() }
                  : e
              )
            );
            
            closeRejectModal();
            
            // 微信环境：调用云函数
            // const result = await Taro.cloud.callFunction({
            //   name: 'reviewEnrollment',
            //   data: { enrollId: rejectingId, action: 'reject', reason: rejectReason }
            // });
          } catch (err) {
            console.error('[ReviewDetailPage] Reject failed:', err);
            Taro.showToast({ title: '操作失败', icon: 'none' });
          }
        }
      }
    });
  };

  // 格式化日期
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // 标签页配置
  const tabs: { key: TabType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待审核' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已拒绝' }
  ];

  const stats = getStats();
  const list = filteredEnrollments();

  if (loading) {
    return (
      <View className={styles.reviewDetailPage}>
        <Text className={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View className={styles.reviewDetailPage}>
      {/* 页面标题 */}
      <Text className={styles.pageTitle}>审核管理</Text>

      {/* 统计卡片 */}
      <View className={styles.statsCard}>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{stats.pending}</Text>
          <Text className={styles.statLabel}>待审核</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{stats.approved}</Text>
          <Text className={styles.statLabel}>已通过</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{stats.rejected}</Text>
          <Text className={styles.statLabel}>已拒绝</Text>
        </View>
      </View>

      {/* 标签页 */}
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <Button
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </View>

      {/* 申请列表 */}
      <View className={styles.enrollList}>
        {list.length > 0 ? (
          list.map(enroll => {
            const statusConfig = getStatusConfig(enroll.status);
            return (
              <View key={enroll._id} className={styles.enrollItem}>
                <View className={styles.enrollItemHeader}>
                  <Text className={styles.enrollCourseTitle}>{enroll.courseTitle}</Text>
                  <Text className={classnames(styles.statusTag, statusConfig.className)}>
                    {statusConfig.text}
                  </Text>
                </View>
                
                <View className={styles.enrollInfo}>
                  <Text className={styles.enrollInfoItem}>
                    <Text className={styles.enrollInfoIcon}>👨‍🏫</Text>
                    {enroll.teacher}
                  </Text>
                  <Text className={styles.enrollInfoItem}>
                    <Text className={styles.enrollInfoIcon}>📅</Text>
                    {formatDate(enroll.createTime)}
                  </Text>
                  {enroll.reason && (
                    <Text className={styles.enrollInfoItem}>
                      <Text className={styles.enrollInfoIcon}>💬</Text>
                      原因：{enroll.reason}
                    </Text>
                  )}
                </View>

                {/* 操作按钮（仅待审核状态显示） */}
                {enroll.status === 'pending' && (
                  <View className={styles.enrollActions}>
                    <Button
                      className={classnames(styles.actionBtn, styles.reject)}
                      onClick={() => openRejectModal(enroll._id)}
                    >
                      拒绝
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.approve)}
                      onClick={() => handleApprove(enroll._id)}
                    >
                      通过
                    </Button>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无申请记录</Text>
          </View>
        )}
      </View>

      {/* 拒绝原因弹窗 */}
      {showRejectModal && (
        <View className={styles.rejectModal}>
          <View className={styles.modalContent}>
            <Text className={styles.modalTitle}>拒绝申请</Text>
            <Textarea
              className={styles.modalTextarea}
              placeholder="请输入拒绝原因（必填）"
              value={rejectReason}
              onInput={(e) => setRejectReason(e.detail.value)}
              maxLength={200}
            />
            <View className={styles.modalActions}>
              <Button className={classnames(styles.modalBtn, styles.cancel)} onClick={closeRejectModal}>
                取消
              </Button>
              <Button className={classnames(styles.modalBtn, styles.confirm)} onClick={handleReject}>
                确认拒绝
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ReviewDetailPage;