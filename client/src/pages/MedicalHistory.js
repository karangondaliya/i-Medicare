import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Row, Col, Card, Spin, message } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'; // Assuming you use Redux for authentication
import "../styles/AllMedicalHistory.css";

const MedicalHistory = () => {
    const [loading, setLoading] = useState(false);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const { user } = useSelector(state => state.user); // Fetch the logged-in user from Redux

    const fetchUserMedicalHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/v1/user/get-user-medical-history', {
                email: user.email // Send the logged-in user's email
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });

            if (res.data.success) {
                setMedicalHistory(res.data.records);
            } else {
                message.error(res.data.message); // Handle no records found
            }
        } catch (error) {
            message.error('Error fetching medical history');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserMedicalHistory(); // Call the new fetch function
    }, []);

    

    return (
        <Layout>
            <h1 className="text-center">Medical History</h1>
            {loading ? (
                <Spin size="large" className="d-flex justify-content-center" />
            ) : (
                <Row gutter={16}>
                    {medicalHistory.length > 0 ? (
                        medicalHistory.map((record, index) => (
                            <Col span={8} key={index}>
                                <Card 
                                    title={<strong>Patient: {record.patient_name}</strong>}
                                    bordered={false}
                                    className="medical-card"
                                >
                                    <div className="record-details">
                                        <p><strong>Email:</strong> {record.patient_email}</p>
                                        <p><strong>Doctor:</strong> {record.doctor_name}</p>
                                        <p><strong>Visit Type:</strong> {record.visit_type}</p>
                                        <p><strong>Treatment:</strong> {record.treatment_description}</p>
                                        <p><strong>Total Bill:</strong>  ₹{record.total_bill.toFixed(2)}</p>
                                        <p><strong>Date:</strong> {new Date(record.createdAt).toLocaleString()}</p>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <p className="text-center">No medical records found.</p>
                        </Col>
                    )}
                </Row>
            )}
        </Layout>
    );
};

export default MedicalHistory;
