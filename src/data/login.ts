import { User } from '@/types';

export const mockLoginResult: { userInfo: User } = {
  userInfo: {
    _openid: 'mock_openid_123',
    nickname: '张同学',
    avatar: 'https://picsum.photos/id/64/200/200',
    role: 'student',
    createTime: new Date('2024-01-01'),
    updateTime: new Date('2024-01-01')
  }
};

// 管理员用户
export const mockAdminLoginResult: { userInfo: User } = {
  userInfo: {
    _openid: 'mock_openid_admin',
    nickname: '李老师',
    avatar: 'https://picsum.photos/id/91/200/200',
    role: 'admin',
    createTime: new Date('2024-01-01'),
    updateTime: new Date('2024-01-01')
  }
};