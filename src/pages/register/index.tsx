import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { RegisterForm, Student } from '@/types';
import { mockStudents } from '@/data/getStudents';

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    phone: '',
    code: '',
    name: '',
    studentId: '',
    class: ''
  });
  const [countdown, setCountdown] = useState(0);
  const [isLoginMode, setIsLoginMode] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateCode = (code: string): boolean => {
    return code.length === 6;
  };

  const sendCode = () => {
    if (!formData.phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    if (!validatePhone(formData.phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (countdown > 0) return;

    Taro.showToast({ title: '验证码已发送', icon: 'success' });
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = () => {
    if (!formData.phone || !validatePhone(formData.phone)) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!formData.code || !validateCode(formData.code)) {
      Taro.showToast({ title: '请输入6位验证码', icon: 'none' });
      return;
    }

    if (isLoginMode) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const handleLogin = () => {
    const student = mockStudents.find(s => s.phone === formData.phone);
    if (!student) {
      Taro.showToast({ title: '该手机号未注册', icon: 'none' });
      return;
    }
    if (student.status === 'inactive') {
      Taro.showToast({ title: '账号已禁用', icon: 'none' });
      return;
    }

    Taro.setStorageSync('currentUser', JSON.stringify(student));
    Taro.setStorageSync('userRole', 'student');
    Taro.showToast({ title: '登录成功', icon: 'success' });
    
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/home/index' });
    }, 1000);
  };

  const handleRegister = () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!formData.studentId.trim()) {
      Taro.showToast({ title: '请输入学号', icon: 'none' });
      return;
    }
    if (!formData.class.trim()) {
      Taro.showToast({ title: '请输入班级', icon: 'none' });
      return;
    }

    const existingStudent = mockStudents.find(s => s.phone === formData.phone);
    if (existingStudent) {
      Taro.showToast({ title: '该手机号已注册', icon: 'none' });
      return;
    }

    const newStudent: Student = {
      _id: `student_${Date.now()}`,
      phone: formData.phone,
      name: formData.name,
      studentId: formData.studentId,
      class: formData.class,
      status: 'active',
      enrollCount: 0,
      createTime: new Date(),
      lastLoginTime: new Date()
    };

    const customStudentsStr = Taro.getStorageSync('customStudents') || '[]';
    const customStudents: Student[] = JSON.parse(customStudentsStr);
    customStudents.push(newStudent);
    Taro.setStorageSync('customStudents', JSON.stringify(customStudents));

    Taro.setStorageSync('currentUser', JSON.stringify(newStudent));
    Taro.setStorageSync('userRole', 'student');
    Taro.showToast({ title: '注册成功', icon: 'success' });

    setTimeout(() => {
      Taro.switchTab({ url: '/pages/home/index' });
    }, 1000);
  };

  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className={styles.registerPage}>
      <View className={styles.header}>
        <Button className={styles.backBtn} onClick={handleBack}>
          ←
        </Button>
        <Text className={styles.pageTitle}>{isLoginMode ? '登录' : '注册'}</Text>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>手机号</Text>
          <Input
            className={styles.formInput}
            type="number"
            placeholder="请输入手机号"
            value={formData.phone}
            onInput={(e) => handleInputChange('phone', e.detail.value)}
            maxLength={11}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>验证码</Text>
          <View className={styles.codeInputWrapper}>
            <Input
              className={classnames(styles.formInput, styles.codeInput)}
              type="number"
              placeholder="请输入验证码"
              value={formData.code}
              onInput={(e) => handleInputChange('code', e.detail.value)}
              maxLength={6}
            />
            <Button
              className={classnames(styles.sendCodeBtn, countdown > 0 && styles.disabled)}
              onClick={sendCode}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </Button>
          </View>
        </View>

        {!isLoginMode && (
          <>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>姓名</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入姓名"
                value={formData.name}
                onInput={(e) => handleInputChange('name', e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>学号</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入学号"
                value={formData.studentId}
                onInput={(e) => handleInputChange('studentId', e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>班级</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入班级"
                value={formData.class}
                onInput={(e) => handleInputChange('class', e.detail.value)}
              />
            </View>
          </>
        )}

        <Button
          className={styles.submitBtn}
          onClick={handleSubmit}
        >
          {isLoginMode ? '登录' : '注册'}
        </Button>

        <View className={styles.switchMode}>
          <Text className={styles.switchText}>
            {isLoginMode ? '还没有账号？' : '已有账号？'}
          </Text>
          <Button className={styles.switchBtn} onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? '立即注册' : '立即登录'}
          </Button>
        </View>
      </View>

      <View className={styles.tips}>
        <Text className={styles.tipText}>📌 请使用真实手机号注册</Text>
        <Text className={styles.tipText}>📌 注册后自动登录</Text>
      </View>
    </View>
  );
};

export default RegisterPage;