import React from 'react';
import { Form, Input, Button, message } from 'antd';
import "../styles/LoginStyles.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { UserOutlined, LockOutlined, MedicineBoxOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //Form Handler
    const onFinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/login', values);
            window.location.reload();
            dispatch(hideLoading());
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                message.success('Login Successfully', 5);
                navigate('/');
            } else {
                message.error(res.data.message, 5)
            }
        } catch (error) {
            dispatch(hideLoading());
            message.error('Something Went Wrong', 5);
        }
    }

    return (
        <div className="form-container">
            <Form layout="vertical" onFinish={onFinishHandler} className='login-form'>
                <div className="hospital-logo-container">
                    <MedicineBoxOutlined style={{ fontSize: '40px', color: '#2a8cc5', display: 'block', margin: '0 auto' }} />
                </div>
                
                <h2 className="form-title">Hospital Management System</h2>
                <p className="form-subtitle">Please login to access the system</p>
                
                <Form.Item 
                    label="Email" 
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input 
                        prefix={<UserOutlined style={{ color: '#2a8cc5' }} />} 
                        placeholder="Enter your email" 
                        size="large"
                    />
                </Form.Item>
                
                <Form.Item 
                    label="Password" 
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: '#2a8cc5' }} />} 
                        placeholder="Enter your password"
                        size="large"
                    />
                </Form.Item>
                
                <div className="login-buttons">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        className="login-btn"
                        block
                    >
                        Login to System
                    </Button>
                </div>
                
                <div className="register-link">
                    Need an account? <Link to="/register">Register here</Link>
                </div>
                
                <div className="secure-note">
                    <SafetyCertificateOutlined /> Secure Hospital Management System
                </div>
                
                <div className="form-footer">
                    © {new Date().getFullYear()} Hospital Management System. All rights reserved.
                </div>
            </Form>
        </div>
    )
}

export default Login