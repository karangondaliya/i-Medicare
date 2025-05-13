// import React, { useState } from 'react';
// import { Layout } from '../components/Layout'; // Ensure this component exists
// import { Typography, Row, Col, Modal, Button, Form, Input, Rate, message } from 'antd';
// import "../styles/AboutUs.css"; // Ensure the CSS file exists
// import axios from 'axios';


// const { Title, Paragraph } = Typography;
// const { TextArea } = Input;


// const AboutUs = () => {
//     // State for controlling modal visibility and rating
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [rating, setRating] = useState(0); // State for rating
//     const [form] = Form.useForm(); // Create a form instance


//     // Functions to show and hide the modal
//     const showModal = () => {
//         setIsModalVisible(true);
//     };


//     const handleCancel = () => {
//         setIsModalVisible(false);
//         setRating(0); // Reset rating on modal close
//         form.resetFields(); // Reset form fields
//     };


//     // Function to check if the email exists
//     const checkEmail = async (email) => {
//         try {
//             const response = await axios.post('/api/v1/doctor/check-email', { email }, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             return response.data.success;
//         } catch (error) {
//             message.error('checking email');
//             return false;
//         }
//     };


//     // Form submission logic
//     const onFinish = async (values) => {
//         const emailExists = await checkEmail(values.email); // Check if the email exists


//         if (emailExists) {
//             // If the email exists, submit the feedback
//             try {
//                 const response = await axios.post('/api/v1/admin/submit-feedback', {
//                     email: values.email,
//                     feedback: values.feedback,
//                     rating: rating,
//                 }, {
//                     headers: {
//                         Authorization: "Bearer " + localStorage.getItem('token'), // Include token for authorization
//                     },
//                 });


//                 if (response.data.success) {
//                     message.success(response.data.message); // Display success message
//                     setIsModalVisible(false); // Close the modal after submission
//                     setRating(0); // Reset rating after submission
//                     form.resetFields(); // Reset the form fields
//                 }
//             } catch (error) {
//                 message.error('Error submitting feedback');
//             }
//         } else {
//             // If the email does not exist, show an error message
//             message.error('The email provided does not exist in our records. Please check and try again.');
//         }
//     };


//     return (
//         <Layout>
//             <div className="about-us-container">
//                 {/* Feedback Button at the top right corner */}
//                 <Row justify="end">
//                     <Col>
//                         <Button
//                             type="primary"
//                             onClick={showModal}
//                             style={{ marginBottom: '20px', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} // Attractive color
//                         >
//                             Give Feedback
//                         </Button>
//                     </Col>
//                 </Row>


//                 <Row>
//                     <Col span={24}>
//                         <div className="text-center">
//                             <Title level={1}>About-us i-Medicare</Title>
//                         </div>
//                     </Col>
//                 </Row>
//                 <Row>
//                     <Col span={24}>
//                         <div className="about-us-content">
//                             <Paragraph>
//                                 i-Medicare is an advanced Hospital Management System designed to simplify healthcare operations and
//                                 enhance patient-doctor interactions. Our platform integrates appointment scheduling, medical record
//                                 management, and secure communication to streamline hospital workflows.
//                             </Paragraph>
//                             <Paragraph>
//                                 Built using modern technologies like React, Node.js, and MongoDB, i-Medicare ensures secure, role-based
//                                 access for administrators, doctors, patients, and staff, ensuring privacy and data security.
//                             </Paragraph>
//                         </div>
//                     </Col>
//                 </Row>
//                 <Row>
//                     <Col span={24}>
//                         <div className="about-us-content">
//                             <Title level={2}>Key Features</Title>
//                             <Paragraph>
//                                 <strong>Appointment Management:</strong> Patients can schedule, reschedule, and manage their appointments with ease.
//                             </Paragraph>
//                             <Paragraph>
//                                 <strong>Medical Records:</strong> Doctors and patients can access and update medical histories for better treatment tracking.
//                             </Paragraph>
//                             <Paragraph>
//                                 <strong>Organ Donation:</strong> A dedicated module that allows patients to register and track their organ donations.
//                             </Paragraph>
//                         </div>
//                     </Col>
//                 </Row>
//                 <Row>
//                     <Col span={24}>
//                         <div className="about-us-content">
//                             <Title level={2}>Future Plans</Title>
//                             <Paragraph>
//                                 i-Medicare is continuously evolving with upcoming features like real-time video consultations, automated billing integration with insurance, and advanced reporting tools.
//                             </Paragraph>
//                         </div>
//                     </Col>
//                 </Row>


//                 {/* Feedback Modal */}
//                 <Modal
//                     title="We value your feedback"
//                     open={isModalVisible} // Updated from visible to open
//                     onCancel={handleCancel}
//                     footer={null} // Removing default buttons
//                 >
//                     <Form
//                         form={form} // Associate the form instance
//                         layout="vertical"
//                         onFinish={onFinish}  // Form submission handler
//                     >
//                         <Form.Item
//                             label="Your Email"
//                             name="email"
//                             rules={[{ required: true, message: 'Please enter your email', type: 'email' }]} // Email validation
//                         >
//                             <Input placeholder="Enter your email" />
//                         </Form.Item>


//                         <Form.Item
//                             label="Your Feedback"
//                             name="feedback"
//                             rules={[{ required: true, message: 'Please provide your feedback' }]}
//                         >
//                             <TextArea rows={4} placeholder="Enter your feedback" />
//                         </Form.Item>


//                         <Form.Item label="Rating">
//                             <Rate
//                                 allowClear
//                                 onChange={setRating} // Update state with selected rating
//                                 value={rating} // Bind state value to Rate component
//                             />
//                         </Form.Item>


//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" style={{ marginRight: '10px', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
//                                 Submit
//                             </Button>
//                             <Button onClick={handleCancel}>
//                                 Cancel
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 </Modal>
//             </div>
//         </Layout>
//     );
// };


// export default AboutUs;

import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { 
    Typography, 
    Row, 
    Col, 
    Modal, 
    Button, 
    Form, 
    Input, 
    Rate, 
    message, 
    Card, 
    Statistic, 
    Timeline,
    Divider 
} from 'antd';
import {
    UserOutlined,
    HeartOutlined,
    SafetyCertificateOutlined,
    ClockCircleOutlined,
    MessageOutlined,
    StarOutlined,
    TeamOutlined,
    MedicineBoxOutlined,
    RocketOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const AboutUs = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [form] = Form.useForm();

    const showModal = () => setIsModalVisible(true);
    
    const handleCancel = () => {
        setIsModalVisible(false);
        setRating(0);
        form.resetFields();
    };

    const checkEmail = async (email) => {
        try {
            const response = await axios.post('/api/v1/doctor/check-email', 
                { email }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            return response.data.success;
        } catch (error) {
            message.error('Error checking email');
            return false;
        }
    };

    const onFinish = async (values) => {
        try {
            const emailExists = await checkEmail(values.email);
            if (!emailExists) {
                message.error('Email not found in our records');
                return;
            }

            const response = await axios.post('/api/v1/admin/submit-feedback', 
                {
                    email: values.email,
                    feedback: values.feedback,
                    rating: rating,
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.success) {
                message.success('Thank you for your valuable feedback!');
                handleCancel();
            }
        } catch (error) {
            message.error('Failed to submit feedback');
        }
    };

    const statistics = [
        { title: 'Patients Served', value: '10,000+', icon: <TeamOutlined /> },
        { title: 'Expert Doctors', value: '50+', icon: <UserOutlined /> },
        { title: 'Success Rate', value: '99%', icon: <SafetyCertificateOutlined /> },
        { title: 'Years of Service', value: '5+', icon: <ClockCircleOutlined /> }
    ];

    const features = [
        {
            title: 'Appointment Management',
            description: 'Smart scheduling system with reminders and flexible booking options',
            icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
        },
        {
            title: 'Medical Records',
            description: 'Secure digital storage of patient histories and treatment plans',
            icon: <MedicineBoxOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
        },
        {
            title: 'Organ Donation',
            description: 'Streamlined process for organ donation registration and tracking',
            icon: <HeartOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
        }
    ];

    return (
        <Layout>
            <div style={{ padding: '24px' }}>
                {/* Header Section */}
                <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                    <Col>
                        <Title level={1} style={{ margin: 0, color: '#1890ff' }}>
                            Welcome to i-Medicare
                        </Title>
                    </Col>
                    <Col>
                        <Button 
                            type="primary"
                            icon={<MessageOutlined />}
                            onClick={showModal}
                            size="large"
                            style={{ 
                                background: 'linear-gradient(to right, #1890ff, #52c41a)',
                                border: 'none'
                            }}
                        >
                            Share Your Feedback
                        </Button>
                    </Col>
                </Row>

                {/* Mission Statement */}
                <Card 
                    style={{ 
                        marginBottom: '24px',
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                    }}
                >
                    <Paragraph style={{ fontSize: '18px', textAlign: 'center' }}>
                        "Revolutionizing healthcare through technology, making quality medical services 
                        accessible to all while ensuring patient comfort and care excellence."
                    </Paragraph>
                </Card>

                {/* Statistics Section */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    {statistics.map((stat, index) => (
                        <Col xs={12} sm={12} md={6} key={index}>
                            <Card>
                                <Statistic
                                    title={stat.title}
                                    value={stat.value}
                                    prefix={stat.icon}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Core Features */}
                <Title level={2}>
                    <SafetyCertificateOutlined /> Our Core Features
                </Title>
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    {features.map((feature, index) => (
                        <Col xs={24} sm={24} md={8} key={index}>
                            <Card 
                                hoverable
                                style={{ height: '100%' }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    {feature.icon}
                                    <Title level={3}>{feature.title}</Title>
                                    <Paragraph>{feature.description}</Paragraph>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Timeline Section */}
                <Title level={2}>
                    <RocketOutlined /> Our Journey
                </Title>
                <Card style={{ marginBottom: '24px' }}>
                    <Timeline mode="alternate">
                        <Timeline.Item color="green">Founded in 2020</Timeline.Item>
                        <Timeline.Item color="blue">Served 5000+ patients by 2021</Timeline.Item>
                        <Timeline.Item color="red">Launched Organ Donation Module in 2022</Timeline.Item>
                        <Timeline.Item color="purple">Expanded to 50+ Expert Doctors in 2023</Timeline.Item>
                        <Timeline.Item color="gold">Implementing AI-powered diagnostics in 2024</Timeline.Item>
                    </Timeline>
                </Card>

                {/* Feedback Modal */}
                <Modal
                    title={<div style={{ textAlign: 'center' }}>Share Your Experience</div>}
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={500}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Email Address"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Your email" />
                        </Form.Item>

                        <Form.Item
                            label="Your Feedback"
                            name="feedback"
                            rules={[{ required: true, message: 'Please share your thoughts' }]}
                        >
                            <TextArea 
                                rows={4} 
                                placeholder="Tell us about your experience..."
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>

                        <Form.Item label="Rate Your Experience">
                            <Rate
                                character={<StarOutlined />}
                                allowHalf
                                allowClear
                                onChange={setRating}
                                value={rating}
                                style={{ color: '#1890ff' }}
                            />
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'right' }}>
                            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                                icon={<MessageOutlined />}
                            >
                                Submit Feedback
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Layout>
    );
};

export default AboutUs;