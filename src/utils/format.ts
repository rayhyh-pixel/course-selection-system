import dayjs from 'dayjs';

/**
 * 格式化日期时间
 */
export const formatDateTime = (datetime: string | Date, format = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(datetime).format(format);
};

/**
 * 格式化日期
 */
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

/**
 * 格式化时间
 */
export const formatTime = (time: string | Date, format = 'HH:mm'): string => {
  return dayjs(time).format(format);
};

/**
 * 计算剩余天数
 */
export const calculateRemainingDays = (endTime: string | Date): number => {
  const now = dayjs();
  const end = dayjs(endTime);
  return end.diff(now, 'day');
};

/**
 * 格式化容量显示
 */
export const formatCapacity = (enrolled: number, capacity: number): string => {
  return `${enrolled}/${capacity}`;
};

/**
 计算剩余容量
 */
export const calculateRemainingCapacity = (enrolled: number, capacity: number): number => {
  return capacity - enrolled;
};

/**
 * 格式化状态文字
 */
export const formatStatusText = (status: string): string => {
  const statusMap = {
    'open': '可选课',
    'closed': '已关闭',
    'full': '已满员',
    'pending': '待审核',
    'approved': '已通过',
    'rejected': '已拒绝',
    'cancelled': '已取消'
  };
  return statusMap[status] || status;
};