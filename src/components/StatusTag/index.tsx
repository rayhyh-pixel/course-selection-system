import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatusTagProps {
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'open' | 'closed' | 'full';
  text?: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status, text }) => {
  const getStatusText = () => {
    if (text) return text;
    const statusMap = {
      'pending': '待审核',
      'approved': '已通过',
      'rejected': '已拒绝',
      'cancelled': '已取消',
      'open': '可选课',
      'closed': '已关闭',
      'full': '已满员'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = () => {
    switch (status) {
      case 'pending':
        return styles.pending;
      case 'approved':
        return styles.approved;
      case 'rejected':
        return styles.rejected;
      case 'cancelled':
        return styles.cancelled;
      case 'open':
        return styles.open;
      case 'closed':
        return styles.closed;
      case 'full':
        return styles.full;
      default:
        return '';
    }
  };

  return (
    <View className={classnames(styles.tag, getStatusClass())}>
      <Text className={styles.text}>{getStatusText()}</Text>
    </View>
  );
};

export default StatusTag;