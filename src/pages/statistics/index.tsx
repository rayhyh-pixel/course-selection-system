import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const StatisticsPage = () => {
  return (
    <View className={styles.statisticsPage}>
      <Text className={styles.loadingText}>数据统计页开发中...</Text>
    </View>
  );
};

export default StatisticsPage;