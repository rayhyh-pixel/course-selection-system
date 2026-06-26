export interface Statistics {
  totalCourses: number;
  totalStudents: number;
  pendingEnrollments: number;
  approvedEnrollments: number;
}

export const mockStatistics: Statistics = {
  totalCourses: 10,
  totalStudents: 156,
  pendingEnrollments: 12,
  approvedEnrollments: 145
};