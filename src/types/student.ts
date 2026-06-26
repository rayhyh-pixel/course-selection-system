export interface Student {
  _id: string;
  phone: string;
  name: string;
  studentId?: string;
  class?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  enrollCount: number;
  createTime: Date;
  lastLoginTime?: Date;
}

export interface LoginForm {
  phone: string;
  code: string;
}

export interface RegisterForm {
  phone: string;
  code: string;
  name: string;
  studentId?: string;
  class?: string;
}