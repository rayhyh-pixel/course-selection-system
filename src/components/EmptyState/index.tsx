import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyStateProps {
  text?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ text = '暂无数据' }) => {
  return (
    <View className={styles.container}>
      <Text className={styles.icon}>📭</Text>
      <Text className={styles.text}>{text}</Text>
    </View>
  );
};

export default EmptyState;