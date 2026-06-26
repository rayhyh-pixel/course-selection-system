import { Enrollment } from '@/types';

export const mockEnrollments: Enrollment[] = [
  {
    _id: 'enroll_001',
    _openid: 'user_001',
    courseId: 'course_001',
    courseTitle: 'Web前端开发实战',
    teacher: '张老师',
    status: 'pending',
    createTime: new Date('2024-01-15 09:30:00'),
    updateTime: new Date('2024-01-15 09:30:00')
  },
  {
    _id: 'enroll_002',
    _openid: 'user_002',
    courseId: 'course_003',
    courseTitle: '人工智能基础',
    teacher: '王老师',
    status: 'pending',
    createTime: new Date('2024-01-15 10:15:00'),
    updateTime: new Date('2024-01-15 10:15:00')
  },
  {
    _id: 'enroll_003',
    _openid: 'user_003',
    courseId: 'course_005',
    courseTitle: '数据库设计与优化',
    teacher: '孙老师',
    status: 'pending',
    createTime: new Date('2024-01-15 11:00:00'),
    updateTime: new Date('2024-01-15 11:00:00')
  },
  {
    _id: 'enroll_004',
    _openid: 'user_004',
    courseId: 'course_007',
    courseTitle: '云计算与分布式系统',
    teacher: '吴老师',
    status: 'pending',
    createTime: new Date('2024-01-15 14:20:00'),
    updateTime: new Date('2024-01-15 14:20:00')
  },
  {
    _id: 'enroll_005',
    _openid: 'user_005',
    courseId: 'course_001',
    courseTitle: 'Web前端开发实战',
    teacher: '张老师',
    status: 'approved',
    createTime: new Date('2024-01-14 08:30:00'),
    updateTime: new Date('2024-01-14 09:00:00')
  },
  {
    _id: 'enroll_006',
    _openid: 'user_006',
    courseId: 'course_002',
    courseTitle: 'Python数据分析',
    teacher: '李老师',
    status: 'approved',
    createTime: new Date('2024-01-14 10:00:00'),
    updateTime: new Date('2024-01-14 10:30:00')
  },
  {
    _id: 'enroll_007',
    _openid: 'user_007',
    courseId: 'course_008',
    courseTitle: '网络安全技术',
    teacher: '郑老师',
    status: 'rejected',
    createTime: new Date('2024-01-13 15:00:00'),
    updateTime: new Date('2024-01-13 16:00:00'),
    reason: '课程名额已满'
  },
  {
    _id: 'enroll_008',
    _openid: 'user_008',
    courseId: 'course_009',
    courseTitle: '机器学习算法',
    teacher: '陈老师',
    status: 'rejected',
    createTime: new Date('2024-01-12 09:00:00'),
    updateTime: new Date('2024-01-12 10:00:00'),
    reason: '课程已关闭报名'
  },
  {
    _id: 'enroll_009',
    _openid: 'user_009',
    courseId: 'course_004',
    courseTitle: '移动应用开发',
    teacher: '赵老师',
    status: 'approved',
    createTime: new Date('2024-01-11 11:00:00'),
    updateTime: new Date('2024-01-11 11:30:00')
  },
  {
    _id: 'enroll_010',
    _openid: 'user_010',
    courseId: 'course_006',
    courseTitle: '软件工程原理',
    teacher: '周老师',
    status: 'cancelled',
    createTime: new Date('2024-01-10 14:00:00'),
    updateTime: new Date('2024-01-11 09:00:00')
  }
];

export default function getEnrollments(data: { status?: string } = {}) {
  let result = [...mockEnrollments];
  if (data.status) {
    result = result.filter(e => e.status === data.status);
  }
  return { code: 0, message: 'success', data: result };
}