import { Student } from '@/types';

export const mockStudents: Student[] = [
  {
    _id: 'student_001',
    phone: '13800138001',
    name: '张三',
    studentId: '2024001',
    class: '计算机2401班',
    status: 'active',
    enrollCount: 3,
    createTime: new Date('2024-09-01'),
    lastLoginTime: new Date('2026-06-26')
  },
  {
    _id: 'student_002',
    phone: '13800138002',
    name: '李四',
    studentId: '2024002',
    class: '计算机2401班',
    status: 'active',
    enrollCount: 2,
    createTime: new Date('2024-09-01'),
    lastLoginTime: new Date('2026-06-25')
  },
  {
    _id: 'student_003',
    phone: '13800138003',
    name: '王五',
    studentId: '2024003',
    class: '计算机2402班',
    status: 'active',
    enrollCount: 4,
    createTime: new Date('2024-09-02'),
    lastLoginTime: new Date('2026-06-26')
  },
  {
    _id: 'student_004',
    phone: '13800138004',
    name: '赵六',
    studentId: '2024004',
    class: '计算机2402班',
    status: 'active',
    enrollCount: 1,
    createTime: new Date('2024-09-02'),
    lastLoginTime: new Date('2026-06-24')
  },
  {
    _id: 'student_005',
    phone: '13800138005',
    name: '钱七',
    studentId: '2024005',
    class: '软件工程2401班',
    status: 'active',
    enrollCount: 2,
    createTime: new Date('2024-09-03'),
    lastLoginTime: new Date('2026-06-26')
  },
  {
    _id: 'student_006',
    phone: '13800138006',
    name: '孙八',
    studentId: '2024006',
    class: '软件工程2401班',
    status: 'active',
    enrollCount: 3,
    createTime: new Date('2024-09-03'),
    lastLoginTime: new Date('2026-06-23')
  },
  {
    _id: 'student_007',
    phone: '13800138007',
    name: '周九',
    studentId: '2024007',
    class: '人工智能2401班',
    status: 'active',
    enrollCount: 2,
    createTime: new Date('2024-09-04'),
    lastLoginTime: new Date('2026-06-25')
  },
  {
    _id: 'student_008',
    phone: '13800138008',
    name: '吴十',
    studentId: '2024008',
    class: '人工智能2401班',
    status: 'inactive',
    enrollCount: 0,
    createTime: new Date('2024-09-04'),
    lastLoginTime: new Date('2026-01-15')
  },
  {
    _id: 'student_009',
    phone: '13800138009',
    name: '郑十一',
    studentId: '2024009',
    class: '计算机2401班',
    status: 'active',
    enrollCount: 1,
    createTime: new Date('2024-09-05'),
    lastLoginTime: new Date('2026-06-26')
  },
  {
    _id: 'student_010',
    phone: '13800138010',
    name: '王小明',
    studentId: '2024010',
    class: '软件工程2402班',
    status: 'active',
    enrollCount: 4,
    createTime: new Date('2024-09-05'),
    lastLoginTime: new Date('2026-06-26')
  }
];