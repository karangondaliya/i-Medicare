import React from 'react';
import { Form, Input, Button, message, Radio } from 'antd';
import "../styles/RegisterStyles.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { 
    UserOutlined, 
    LockOutlined, 
    MailOutlined, 
    MedicineBoxOutlined, 
    SafetyCertificateOutlined,
    PhoneOutlined,
    IdcardOutlined
} from '@ant-design/icons';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/register', values);
            dispatch(hideLoading());
            if (res.data.success) {
                message.success('Register Successfully!')
                navigate('/login')
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            message.error('Something went wrong');
        }
    }
    
    return (
        <div className="form-container">
            <Form layout="vertical" onFinish={onFinishHandler} className='register-form'>
                <div className="hospital-logo-container">
                    <MedicineBoxOutlined style={{ fontSize: '40px', color: '#2a8cc5', display: 'block', margin: '0 auto' }} />
                </div>
                
                <h2 className="form-title">Create Your Account</h2>
                <p className="form-subtitle">Hospital Management System Registration</p>
                
                <div className="user-type-selector">
                    <Form.Item name="userType" initialValue="patient">
                        <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                            <Radio.Button value="patient">Patient</Radio.Button>
                            <Radio.Button value="doctor">Doctor</Radio.Button>
                            <Radio.Button value="staff">Staff</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </div>
                
                <Form.Item 
                    label="Full Name" 
                    name="username"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input 
                        prefix={<UserOutlined style={{ color: '#2a8cc5' }} />} 
                        placeholder="Enter your full name"
                        size="large"
                    />
                </Form.Item>
                
                <Form.Item 
                    label="Email" 
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input 
                        prefix={<MailOutlined style={{ color: '#2a8cc5' }} />} 
                        placeholder="Enter your email"
                        size="large"
                    />
                </Form.Item>
                
                <Form.Item 
                    label="Phone Number" 
                    name="phone"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <Input 
                        prefix={<PhoneOutlined style={{ color: '#2a8cc5' }} />} 
                        placeholder="Enter your phone number"
                        size="large"
                    />
                </Form.Item>
                
                <Form.Item 
                    label="Password" 
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                >
                    <Input.Password 
                        prefix={<LockOutlined style={{ color: '#2a8cc5' }} />} 
                        placeholder="Create a password"
                        size="large"
                    />
                </Form.Item>
                
                <div className="register-buttons">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        className="register-btn"
                        block
                    >
                        Create Account
                    </Button>
                </div>
                
                <div className="login-link">
                    Already have an account? <Link to="/login">Login now</Link>
                </div>
                
                <div className="secure-note">
                    <SafetyCertificateOutlined /> Secure Hospital Management System
                </div>
                
                <div className="form-footer">
                    © {new Date().getFullYear()} Hospital Management System. All rights reserved.
                </div>
            </Form>
        </div>
    );
};

export default Register