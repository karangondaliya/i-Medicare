import React, { useState, useEffect } from 'react'
import { Layout } from '../components/Layout';
import { Col, Form, message, Row, Input, Select, DatePicker, Upload, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';

const Profile = () => {
    const { user } = useSelector(state => state.user);
    const [users, setUsers] = useState(null);
    const [patient, setPatient] = useState(null);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const formData = new FormData();
            formData.append('username', values.username);
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('dob', values.dob ? moment(values.dob).format('YYYY-MM-DD') : '');
            formData.append('gender', values.gender);
            formData.append('address', values.address);
            formData.append('contact_number', values.contact_number);
            formData.append('blood_group', values.blood_group);

            if (values.last_reports?.fileList?.length) {
                formData.append('last_reports', values.last_reports.fileList[0].originFileObj);
            }

            formData.append('userId', users._id);

            const res = await axios.post('/api/v1/user/updateUserProfile', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/');
            } else {
                message.error(res.data.success);
            }
        } catch (err) {
            dispatch(hideLoading());
            message.error('Something Went Wrong');
        }
    };

    const getUserInfo = async () => {
        try {
            const res = await axios.post('/api/v1/user/getUserInfo', {
                userId: params.id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.data.success) {
                setUsers(res.data.user);
                setPatient(res.data.patient);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <Layout>
            <h1>Manage Profile</h1>
            {users && (
                <Form
                    layout='vertical'
                    onFinish={handleFinish}
                    className='m-3'
                    initialValues={{
                        ...users,
                        ...patient,
                        dob: patient?.date_of_birth ? moment(patient.date_of_birth) : null, // Check if patient exists
                    }}
                >
                    <Row gutter={20}>
                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Name" name="username" required rules={[{ required: true }]}>
                                <Input type="text" placeholder='Your Name' />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Email" name="email" required rules={[{ required: true }]}>
                                <Input type="email" placeholder='Your Email Address' />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Password" name="password" required rules={[{ required: true }]}>
                                <Input type="password" placeholder='Your Password' />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Date of Birth" name="dob">
                                <DatePicker style={{ width: '100%' }} placeholder={patient?.date_of_birth ? moment(patient.date_of_birth).format('YYYY-MM-DD') : 'Select Date'} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Gender" name="gender">
                                <Select>
                                    <Select.Option value="male">Male</Select.Option>
                                    <Select.Option value="female">Female</Select.Option>
                                    <Select.Option value="other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Address" name="address">
                                <Input.TextArea placeholder='Your Address' />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Contact Number" name="contact_number">
                                <Input type="text" placeholder='Your Contact Number' />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Blood Group" name="blood_group">
                                <Input type="text" placeholder='Your Blood Group' />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={24} lg={8}>
                            {(
                                <>
                                    <div>
                                        <p>Last Medical Report: <a href={`/uploads/${patient?.last_reports}`} target="_blank" rel="noopener noreferrer">View Report</a></p>
                                    </div>
                                    <Form.Item name="last_reports">
                                        <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    </Form.Item>
                                </>
                            )}
                        </Col>

                        <Col xs={24} md={24} lg={8}>
                            <button className='btn btn-primary form-btn' type="submit">Update</button>
                        </Col>
                    </Row>
                </Form>
            )}
        </Layout>
    );
};

export default Profile