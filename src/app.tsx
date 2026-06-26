import React, { useEffect } from 'react';
import Taro, { useDidShow, useDidHide } from '@tarojs/taro';
import { UserProvider } from '@/store/UserContext';
// 全局样式
import './app.scss';

function App(props) {
  // 初始化云开发
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: '', // 部署时会通过MCP获取真实环境ID并修改
        traceUser: true
      });
    }
  }, []);

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  return (
    <UserProvider>
      {props.children}
    </UserProvider>
  );
}

export default App;
