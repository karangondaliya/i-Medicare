import React, { useState } from 'react';
import { Layout } from '../components/Layout'; // Ensure this component exists
import { Typography, Row, Col, Modal, Button, Form, Input, Rate, message } from 'antd';
import "../styles/AboutUs.css"; // Ensure the CSS file exists
import axios from 'axios';


const { Title, Paragraph } = Typography;
const { TextArea } = Input;


const AboutUs = () => {
    // State for controlling modal visibility and rating
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState(0); // State for rating
    const [form] = Form.useForm(); // Create a form instance


    // Functions to show and hide the modal
    const showModal = () => {
        setIsModalVisible(true);
    };


    const handleCancel = () => {
        setIsModalVisible(false);
        setRating(0); // Reset rating on modal close
        form.resetFields(); // Reset form fields
    };


    // Function to check if the email exists
    const checkEmail = async (email) => {
        try {
            const response = await axios.post('/api/v1/doctor/check-email', { email }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            return response.data.success;
        } catch (error) {
            message.error('checking email');
            return false;
        }
    };


    // Form submission logic
    const onFinish = async (values) => {
        const emailExists = await checkEmail(values.email); // Check if the email exists


        if (emailExists) {
            // If the email exists, submit the feedback
            try {
                const response = await axios.post('/api/v1/admin/submit-feedback', {
                    email: values.email,
                    feedback: values.feedback,
                    rating: rating,
                }, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('token'), // Include token for authorization
                    },
                });


                if (response.data.success) {
                    message.success(response.data.message); // Display success message
                    setIsModalVisible(false); // Close the modal after submission
                    setRating(0); // Reset rating after submission
                    form.resetFields(); // Reset the form fields
                }
            } catch (error) {
                message.error('Error submitting feedback');
            }
        } else {
            // If the email does not exist, show an error message
            message.error('The email provided does not exist in our records. Please check and try again.');
        }
    };


    return (
        <Layout>
            <div className="about-us-container">
                {/* Feedback Button at the top right corner */}
                <Row justify="end">
                    <Col>
                        <Button
                            type="primary"
                            onClick={showModal}
                            style={{ marginBottom: '20px', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Attractive color
                        >
                            Give Feedback
                        </Button>
                    </Col>
                </Row>


                <Row>
                    <Col span={24}>
                        <div className="text-center">
                            <Title level={1}>About i-Medicare</Title>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className="about-us-content">
                            <Paragraph>
                                i-Medicare is an advanced Hospital Management System designed to simplify healthcare operations and
                                enhance patient-doctor interactions. Our platform integrates appointment scheduling, medical record
                                management, and secure communication to streamline hospital workflows.
                            </Paragraph>
                            <Paragraph>
                                Built using modern technologies like React, Node.js, and MongoDB, i-Medicare ensures secure, role-based
                                access for administrators, doctors, patients, and staff, ensuring privacy and data security.
                            </Paragraph>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className="about-us-content">
                            <Title level={2}>Key Features</Title>
                            <Paragraph>
                                <strong>Appointment Management:</strong> Patients can schedule, reschedule, and manage their appointments with ease.
                            </Paragraph>
                            <Paragraph>
                                <strong>Medical Records:</strong> Doctors and patients can access and update medical histories for better treatment tracking.
                            </Paragraph>
                            <Paragraph>
                                <strong>Organ Donation:</strong> A dedicated module that allows patients to register and track their organ donations.
                            </Paragraph>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className="about-us-content">
                            <Title level={2}>Future Plans</Title>
                            <Paragraph>
                                i-Medicare is continuously evolving with upcoming features like real-time video consultations, automated billing integration with insurance, and advanced reporting tools.
                            </Paragraph>
                        </div>
                    </Col>
                </Row>


                {/* Feedback Modal */}
                <Modal
                    title="We value your feedback"
                    open={isModalVisible} // Updated from visible to open
                    onCancel={handleCancel}
                    footer={null} // Removing default buttons
                >
                    <Form
                        form={form} // Associate the form instance
                        layout="vertical"
                        onFinish={onFinish}  // Form submission handler
                    >
                        <Form.Item
                            label="Your Email"
                            name="email"
                            rules={[{ required: true, message: 'Please enter your email', type: 'email' }]} // Email validation
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>


                        <Form.Item
                            label="Your Feedback"
                            name="feedback"
                            rules={[{ required: true, message: 'Please provide your feedback' }]}
                        >
                            <TextArea rows={4} placeholder="Enter your feedback" />
                        </Form.Item>


                        <Form.Item label="Rating">
                            <Rate
                                allowClear
                                onChange={setRating} // Update state with selected rating
                                value={rating} // Bind state value to Rate component
                            />
                        </Form.Item>


                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginRight: '10px', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
                                Submit
                            </Button>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Layout>
    );
};


export default AboutUs;
