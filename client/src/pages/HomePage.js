import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { Card, Empty, Spin, Tooltip, Row, Col } from 'antd';
import DoctorList from '../components/DoctorList';
import { MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';
import "../styles/HomePage.css";


const HomePage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Login User Data
    const getUserData = async () => {
        try {
            const res = await axios.get('/api/v1/user/getAllDoctors', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                }
            });
            if (res.data.success) {
                setDoctors(res.data.data);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <Layout>
            <div className="home-container">
                <div className="welcome-section">
                    <MedicineBoxOutlined className="welcome-icon" />
                    <h1 className="welcome-title">Welcome to i-Medicare</h1>
                    <p className="welcome-description">
                        Find and connect with the best healthcare professionals
                    </p>
                </div>

                <div className="doctors-section">
                    <h2 className="section-title">Available Doctors</h2>
                    <p className="section-description">
                        Browse through our list of qualified medical professionals
                    </p>

                    {loading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                            <p className="loading-text">Loading doctors...</p>
                        </div>
                    ) : doctors.length > 0 ? (
                        <Row gutter={[20, 30]} justify="center">
                            {doctors.map(doctor => (
                                <Col xs={24} sm={12} md={8} key={doctor._id}>
                                    <Card 
                                        className="doctor-card"
                                        bodyStyle={{ padding: 0, height: '100%' }}
                                    >
                                        <div className="doctor-card-content">
                                            <div className="doctor-avatar">
                                                <UserOutlined />
                                            </div>
                                            <Tooltip title="Click for details" placement="top">
                                                <div className="doctor-details-hover doctor-details-container">
                                                    <DoctorList 
                                                        doctor={doctor}
                                                        titleStyle="card-title"
                                                        textStyle="card-text"
                                                        buttonStyle="card-button"
                                                        containerStyle="doctor-info"
                                                    />
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty
                            description="No doctors available at the moment"
                            className="no-doctors"
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;