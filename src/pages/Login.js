import React from 'react';
import { Form, Input, message } from 'antd';
import "../styles/LoginStyles.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';

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
            //console.log(error);
            message.error('Something Went Wrong', 5);
        }
    }

    return (
        <div className="form-container">
            <Form layout="vertical" onFinish={onFinishHandler} className='login-form'>
                <h3 className="center text-center">Login</h3>
                <Form.Item label="Email" name="email">
                    <Input type="email" required />
                </Form.Item>
                {/* <Form.Item label="Password" name="password">
                    <Input type="password" required />
                </Form.Item> */}
                <Form.Item label="Password" name="password">
                        <Input.Password required />
                    </Form.Item>
                <Link to="/register" className='ms-2'>Not a User ? Register Here</Link> &nbsp;&nbsp;
                <button className='btn btn-primary' type="submit">Login</button>
            </Form>
        </div>
    )
}

export default Login