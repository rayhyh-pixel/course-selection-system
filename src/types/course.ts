export interface Course {
  _id: string;
  title: string;
  description: string;
  teacher: string;
  teacherTitle?: string;
  teacherIntro?: string;
  capacity: number;
  enrolled: number;
  startTime: string;
  endTime: string;
  status: 'open' | 'closed' | 'full';
  category?: string;
  location?: string;
  schedule?: string;
  createTime: Date;
  updateTime: Date;
}

export interface CourseListItem {
  _id: string;
  title: string;
  teacher: string;
  capacity: number;
  enrolled: number;
  startTime: string;
  endTime: string;
  status: 'open' | 'closed' | 'full';
}