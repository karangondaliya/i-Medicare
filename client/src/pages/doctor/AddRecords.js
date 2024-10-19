import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { Form, Input, message, Row, Col, Select, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import axios from 'axios';

const { Option } = Select;

const AddRecords = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // Handle form submission
    const handleFinish = async (values) => {
        try {
            setLoading(true);
            dispatch(showLoading());

            // Step 1: Check if email exists in the database
            const emailCheckResponse = await axios.post('/api/v1/doctor/check-email', { email: values.patient_email }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (emailCheckResponse.data.success) {
                // Email exists, proceed with form submission

                // Ensure total_bill is a number
                const modifiedValues = {
                    ...values,
                    total_bill: Number(values.total_bill),
                };

                console.log("Modified Form Values:", modifiedValues); // Log modified values

                const res = await axios.post('/api/v1/doctor/add-record', modifiedValues, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (res.data.success) {
                    message.success(res.data.message);
                    // Optionally, reset form fields here
                } else {
                    message.error(res.data.message || 'Failed to add record');
                }
            } else {
                // Step 2: If email not found, show an error message
                message.error(emailCheckResponse.data.message || 'Email not found');
            }

            dispatch(hideLoading());
            setLoading(false);
        } catch (err) {
            dispatch(hideLoading());
            setLoading(false);
            message.error(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Layout>
            <h1>Add Medical Record</h1>
            <Form layout="vertical" onFinish={handleFinish} className='m-3'>
                <h4>Patient Details:</h4>
                <Row gutter={20}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Patient Name" name="patient_name" rules={[{ required: true, message: 'Please enter patient name!' }]}>
                            <Input placeholder='Enter Patient Name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Patient Email" name="patient_email" rules={[{ required: true, message: 'Please enter patient email!' }]}>
                            <Input type="email" placeholder='Enter Patient Email' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Doctor Name" name="doctor_name" rules={[{ required: true, message: 'Please enter doctor name!' }]}>
                            <Input placeholder='Enter Doctor Name' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Visit Type" name="visit_type" rules={[{ required: true, message: 'Please select visit type!' }]}>
                            <Select placeholder="Select Visit Type">
                                <Option value="Outpatient">Outpatient</Option>
                                <Option value="Inpatient">Inpatient</Option>
                                <Option value="Emergency">Emergency</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item label="Treatment Description" name="treatment_description" rules={[{ required: true, message: 'Please enter treatment description!' }]}>
                            <Input.TextArea placeholder='Enter Treatment Description' rows={4} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Total Bill" name="total_bill" rules={[{ required: true, message: 'Please enter total bill!' }]}>
                            <Input type="number" placeholder='Enter Total Bill' />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Button type="primary" htmlType="submit" loading={loading} className='form-btn'>
                            Add Record
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Layout>
    );
};

export default AddRecords;
