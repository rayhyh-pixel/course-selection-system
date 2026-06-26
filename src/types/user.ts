export interface User {
  _id?: string;
  _openid: string;
  nickname: string;
  avatar: string;
  role: 'student' | 'admin';
  createTime: Date;
  updateTime: Date;
}

export interface UserContextType {
  userInfo: User | null;
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => void;
  updateUserInfo: (info: Partial<User>) => void;
}