import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { User, UserContextType } from '@/types';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 登录
  const login = async () => {
    try {
      if (process.env.TARO_ENV === 'weapp') {
        // 微信环境：调用云函数
        const result = await Taro.cloud.callFunction({
          name: 'login',
          data: {}
        });
        const data = result.result as any;
        if (data.code === 0) {
          setUserInfo(data.data.userInfo);
          setIsLoggedIn(true);
          // 保存到本地
          Taro.setStorageSync('userInfo', data.data.userInfo);
        }
      } else {
        // H5 环境：使用 mock 数据（学生）
        const mockData = require('@/data/login').mockLoginResult;
        setUserInfo(mockData.userInfo);
        setIsLoggedIn(true);
        Taro.setStorageSync('userInfo', mockData.userInfo);
      }
    } catch (err) {
      console.error('[UserContext] Login failed:', err);
      // 使用 mock 数据
      const mockData = require('@/data/login').mockLoginResult;
      setUserInfo(mockData.userInfo);
      setIsLoggedIn(true);
      Taro.setStorageSync('userInfo', mockData.userInfo);
    }
  };

  // 登出
  const logout = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
    Taro.removeStorageSync('userInfo');
  };

  // 更新用户信息
  const updateUserInfo = (info: Partial<User>) => {
    if (userInfo) {
      const newInfo = { ...userInfo, ...info };
      setUserInfo(newInfo);
      Taro.setStorageSync('userInfo', newInfo);
    }
  };

  // 切换角色（预览用）
  const switchRole = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      // 切换到管理员
      const adminData = require('@/data/login').mockAdminLoginResult;
      setUserInfo(adminData.userInfo);
      setIsLoggedIn(true);
      Taro.setStorageSync('userInfo', adminData.userInfo);
    } else {
      // 切换到学生
      const studentData = require('@/data/login').mockLoginResult;
      setUserInfo(studentData.userInfo);
      setIsLoggedIn(true);
      Taro.setStorageSync('userInfo', studentData.userInfo);
    }
  };

  // 初始化：从本地存储恢复用户信息
  useEffect(() => {
    const cachedUser = Taro.getStorageSync('userInfo');
    if (cachedUser) {
      setUserInfo(cachedUser);
      setIsLoggedIn(true);
    } else {
      // 自动登录
      login();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        isLoggedIn,
        login,
        logout,
        updateUserInfo,
        switchRole
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};