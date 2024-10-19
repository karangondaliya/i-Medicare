import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Col, Form, Input, Row, DatePicker, Select, message } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const OrganDonation = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const data = {
        ...values,
        date_of_donation: values.date_of_donation ? moment(values.date_of_donation).format('YYYY-MM-DD') : '',
      };
      
      const res = await axios.post('/api/v1/user/registerOrganDonation', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      if (res.data.success) {
        message.success('Organ donation details submitted successfully');
        form.resetFields(); // Reset form fields after successful submission
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      message.error('Submission failed');
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Organ Donation Form</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3" form={form}>
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Name" name="name" required rules={[{ required: true }]}>
              <Input placeholder="Your Name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Email" name="email" required rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="Your Email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Mobile Number"
              name="mobile_number"
              required
              rules={[
                { required: true, message: 'Mobile Number is required' },
                {
                  pattern: /^\d{10}$/, // Updated regex to match exactly 10 digits
                  message: 'Mobile number must be exactly 10 digits',
                },
              ]}
            >
              <Input placeholder="Mobile Number (10 digits)" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Organ Type" name="organ_type" required rules={[{ required: true }]}>
              <Select placeholder="Select Organ Type">
                <Option value="Heart">Heart</Option>
                <Option value="Kidney">Kidney</Option>
                <Option value="Liver">Liver</Option>
                <Option value="Lungs">Lungs</Option>
                <Option value="Pancreas">Pancreas</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item label="Date of Donation" name="date_of_donation" required rules={[{ required: true }]}>
              <DatePicker placeholder="Select Date of Donation" />
            </Form.Item>
          </Col>
        </Row>
        <Col xs={24} md={24} lg={8}>
          <button className="btn btn-primary form-btn" type="submit">Submit</button>
        </Col>
      </Form>
    </Layout>
  );
};

export default OrganDonation;
