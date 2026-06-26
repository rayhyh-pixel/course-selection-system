export interface Enrollment {
  _id: string;
  _openid: string;
  courseId: string;
  courseTitle: string;
  teacher: string;
  studentName: string;
  studentPhone: string;
  studentId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createTime: Date;
  updateTime: Date;
  reason?: string;
}

export interface EnrollmentWithCourse extends Enrollment {
  course: {
    title: string;
    teacher: string;
    startTime: string;
    endTime: string;
  };
}