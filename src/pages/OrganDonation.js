import React from 'react';
import { Layout } from '../components/Layout';
import { Col, Form, Input, Row, DatePicker, Select } from 'antd';

const { Option } = Select;

const OrgansDonation = () => {

    // Handle form submission
    const handleFinish = (values) => {
        console.log(values);
    };

    return (
        <Layout>
            <h1 className="text-center">Organ Donation Form</h1>
            <Form layout="vertical" onFinish={handleFinish} className='m-3'>
                <h4>Donor Details:</h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Donor ID" name="donor_id" required rules={[{ required: true }]}>
                            <Input type="text" placeholder="Donor's Patient ID" />
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
                <h4>Recipient Details (Optional):</h4>
                <Row gutter={20}>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Recipient ID" name="recipient_id" rules={[{ required: false }]}>
                            <Input type="text" placeholder="Recipient's Patient ID" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Status" name="status" required rules={[{ required: true }]}>
                            <Select placeholder="Select Status">
                                <Option value="Pending">Pending</Option>
                                <Option value="Donated">Donated</Option>
                                <Option value="Matched">Matched</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}>
                        <Form.Item label="Additional Notes" name="notes">
                            <Input.TextArea placeholder="Any additional notes" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={24} lg={8}></Col>
                    <Col xs={24} md={24} lg={8}>
                        <button className='btn btn-primary form-btn' type="submit">Submit</button>
                    </Col>
                </Row>
            </Form>
        </Layout>
    );
};

export default OrgansDonation;
