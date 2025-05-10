// import React, { useState, useEffect } from 'react';
// import { Layout } from '../../components/Layout';
// import { Row, Col, Card, Spin, message } from 'antd';
// import axios from 'axios';
// import "../../styles/AllMedicalHistory.css";


// const AllMedicalHistory = () => {
//     const [loading, setLoading] = useState(false);
//     const [medicalHistory, setMedicalHistory] = useState([]);
//     const [totalAmount, setTotalAmount] = useState(0); // State for total amount


//     const fetchMedicalHistory = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get('/api/v1/admin/get-all-medical-history', {
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem('token'),
//                     'Cache-Control': 'no-cache',
//                     'Pragma': 'no-cache',
//                     'Expires': '0'
//                 }
//             });
//             if (res.data.success) {
//                 setMedicalHistory(res.data.records);


//                 // Calculate the total amount of all bills
//                 const total = res.data.records.reduce((sum, record) => sum + record.total_bill, 0);
//                 setTotalAmount(total); // Update the total amount state
//             } else {
//                 message.error('Failed to fetch medical history');
//             }
//         } catch (error) {
//             message.error('Error fetching medical history');
//         }
//         setLoading(false);
//     };


//     useEffect(() => {
//         fetchMedicalHistory();
//     }, []);


//     return (
//         <Layout>
//             <div className="header-container">
//                 <h1 className="text-center">Medical History</h1>
//                 <div className="total-amount">
//                     <strong>Total Amount of Bills: </strong>₹{totalAmount.toFixed(2)}
//                 </div>
//             </div>
//             {loading ? (
//                 <Spin size="large" className="d-flex justify-content-center" />
//             ) : (
//                 <Row gutter={16}>
//                     {medicalHistory.length > 0 ? (
//                         medicalHistory.map((record, index) => (
//                             <Col span={8} key={index}>
//                                 <Card
//                                     title={<strong>Patient: {record.patient_name}</strong>}
//                                     bordered={false}
//                                     className="medical-card"
//                                 >
//                                     <div className="record-details">
//                                         <p><strong>Email:</strong> {record.patient_email}</p>
//                                         <p><strong>Doctor:</strong> {record.doctor_name}</p>
//                                         <p><strong>Visit Type:</strong> {record.visit_type}</p>
//                                         <p><strong>Treatment:</strong> {record.treatment_description}</p>
//                                         <p><strong>Total Bill:</strong>  ₹{record.total_bill.toFixed(2)}</p>
//                                         <p><strong>Date:</strong> {new Date(record.createdAt).toLocaleString()}</p>
//                                     </div>
//                                 </Card>
//                             </Col>
//                         ))
//                     ) : (
//                         <Col span={24}>
//                             <p className="text-center">No medical records found.</p>
//                         </Col>
//                     )}
//                 </Row>
//             )}
//         </Layout>
//     );
// };


// export default AllMedicalHistory;



import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { List, Modal, Spin, message, Card, Tag, Statistic, Row, Col, Button } from 'antd';
import { MedicineBoxOutlined, UserOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import "../../styles/AllMedicalHistory.css";

const AllMedicalHistory = () => {
    const [loading, setLoading] = useState(false);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchMedicalHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/get-all-medical-history', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            if (res.data.success) {
                // Sort records by date (most recent first)
                const sortedRecords = res.data.records.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setMedicalHistory(sortedRecords);
                const total = sortedRecords.reduce((sum, record) => sum + record.total_bill, 0);
                setTotalAmount(total);
            } else {
                message.error('Failed to fetch medical history');
            }
        } catch (error) {
            message.error('Error fetching medical history');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMedicalHistory();
    }, []);

    const showRecordDetails = (record) => {
        setSelectedRecord(record);
        setModalVisible(true);
    };

    const getVisitTypeTag = (type) => {
        const colors = {
            'Regular': 'blue',
            'Emergency': 'red',
            'Follow-up': 'green',
            'Consultation': 'purple'
        };
        return <Tag color={colors[type] || 'default'}>{type}</Tag>;
    };

    return (
        <Layout>
            <div className="medical-history-container">
                <div className="header-container">
                    <h1>Medical History Records</h1>
                    <Card className="statistics-card">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic 
                                    title="Total Records" 
                                    value={medicalHistory.length}
                                    prefix={<MedicineBoxOutlined />} 
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Total Amount"
                                    value={totalAmount}
                                    precision={2}
                                    prefix="₹"
                                    suffix=""
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                        <p>Loading medical records...</p>
                    </div>
                ) : (
                    <List
                        className="medical-history-list"
                        itemLayout="horizontal"
                        dataSource={medicalHistory}
                        renderItem={record => (
                            <List.Item 
                                className="medical-history-item"
                                actions={[
                                    <Button 
                                        type="primary" 
                                        onClick={() => showRecordDetails(record)}
                                    >
                                        View Details
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<UserOutlined className="avatar-icon" />}
                                    title={
                                        <div className="record-title">
                                            <span>{record.patient_name}</span>
                                            {getVisitTypeTag(record.visit_type)}
                                        </div>
                                    }
                                    description={
                                        <div className="record-summary">
                                            <span><CalendarOutlined /> {new Date(record.createdAt).toLocaleDateString()}</span>
                                            <span><DollarOutlined /> ₹{record.total_bill.toFixed(2)}</span>
                                            <span>Dr. {record.doctor_name}</span>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}

                <Modal
                    title="Medical Record Details"
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                    width={700}
                >
                    {selectedRecord && (
                        <div className="record-details-modal">
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Card title="Patient Information" className="detail-card">
                                        <p><strong>Name:</strong> {selectedRecord.patient_name}</p>
                                        <p><strong>Email:</strong> {selectedRecord.patient_email}</p>
                                        <p><strong>Visit Type:</strong> {getVisitTypeTag(selectedRecord.visit_type)}</p>
                                    </Card>
                                </Col>
                                <Col span={24}>
                                    <Card title="Treatment Details" className="detail-card">
                                        <p><strong>Doctor:</strong> {selectedRecord.doctor_name}</p>
                                        <p><strong>Treatment Description:</strong></p>
                                        <div className="treatment-description">
                                            {selectedRecord.treatment_description}
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={24}>
                                    <Card title="Billing Information" className="detail-card">
                                        <p><strong>Total Bill:</strong> ₹{selectedRecord.total_bill.toFixed(2)}</p>
                                        <p><strong>Date:</strong> {new Date(selectedRecord.createdAt).toLocaleString()}</p>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal>
            </div>
        </Layout>
    );
};

export default AllMedicalHistory;