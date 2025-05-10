// import React, { useState, useEffect } from 'react';
// import { Layout } from '../../components/Layout';
// import { Row, Col, Card, Spin, message } from 'antd';
// import axios from 'axios';

// const OrganDonationDetails = () => {
//     const [loading, setLoading] = useState(false);
//     const [donations, setDonations] = useState([]);

//     // Function to fetch organ donation data from the backend
//     const fetchOrganDonations = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get('/api/v1/admin/get-organ-donations', {
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem('token'),
//                 },
//             });
//             if (res.data.success) {
//                 setDonations(res.data.donations);
//             } else {
//                 message.error('Failed to fetch organ donation records');
//             }
//         } catch (error) {
//             message.error('Error fetching organ donation records');
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchOrganDonations();
//     }, []);

//     return (
//         <Layout>
//             <h1 className="text-center">Organ Donation Records</h1>
//             {loading ? (
//                 <Spin size="large" className="d-flex justify-content-center" />
//             ) : (
//                 <Row gutter={16}>
//                     {donations.length > 0 ? (
//                         donations.map((donation, index) => (
//                             <Col span={8} key={index}>
//                                 <Card
//                                     title={<strong>Donor: {donation.name}</strong>}
//                                     bordered={false}
//                                     className="donation-card"
//                                 >
//                                     <div className="record-details">
//                                         <p><strong>Email:</strong> {donation.email}</p>
//                                         <p><strong>Mobile:</strong> {donation.mobile_number}</p>
//                                         <p><strong>Organ:</strong> {donation.organ_type}</p>
//                                         <p><strong>Date of Donation:</strong> {new Date(donation.date_of_donation).toLocaleDateString()}</p>
//                                         <p><strong>Created At:</strong> {new Date(donation.createdAt).toLocaleString()}</p>
//                                     </div>
//                                 </Card>
//                             </Col>
//                         ))
//                     ) : (
//                         <Col span={24}>
//                             <p className="text-center">No organ donation records found.</p>
//                         </Col>
//                     )}
//                 </Row>
//             )}
//         </Layout>
//     );
// };

// export default OrganDonationDetails; 



import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { List, Modal, Spin, message, Card, Tag, Statistic, Row, Col, Button } from 'antd';
import { HeartOutlined, UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const OrganDonationDetails = () => {
    const [loading, setLoading] = useState(false);
    const [donations, setDonations] = useState([]);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchOrganDonations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/get-organ-donations', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                },
            });
            if (res.data.success) {
                // Sort donations by date (most recent first)
                const sortedDonations = res.data.donations.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setDonations(sortedDonations);
            } else {
                message.error('Failed to fetch organ donation records');
            }
        } catch (error) {
            message.error('Error fetching organ donation records');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrganDonations();
    }, []);

    const showDonationDetails = (donation) => {
        setSelectedDonation(donation);
        setModalVisible(true);
    };

    const getOrganTypeTag = (type) => {
        const colors = {
            'Heart': 'red',
            'Kidney': 'blue',
            'Liver': 'orange',
            'Lungs': 'cyan',
            'Pancreas': 'purple',
            'Eyes': 'green'
        };
        return <Tag color={colors[type] || 'default'}>{type}</Tag>;
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return 'N/A';
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    };

    return (
        <Layout>
            <div className="donation-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="header-container" style={{ marginBottom: '24px' }}>
                    <h1 style={{ textAlign: 'center', color: '#1a5f88', marginBottom: '24px' }}>
                        Organ Donation Records
                    </h1>
                    <Card style={{ background: '#f8faff', borderRadius: '8px', marginBottom: '24px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Statistic 
                                    title="Total Donations" 
                                    value={donations.length}
                                    prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />} 
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Latest Donation"
                                    value={donations[0] ? moment(donations[0].date_of_donation).format('MMM DD, YYYY') : 'N/A'}
                                    prefix={<CalendarOutlined />}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '48px' }}>
                        <Spin size="large" />
                        <p>Loading donation records...</p>
                    </div>
                ) : (
                    <List
                        className="donation-list"
                        itemLayout="horizontal"
                        dataSource={donations}
                        renderItem={donation => (
                            <List.Item 
                                style={{
                                    padding: '16px',
                                    margin: '8px 0',
                                    background: 'white',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                                actions={[
                                    <Button 
                                        type="primary" 
                                        onClick={() => showDonationDetails(donation)}
                                        icon={<HeartOutlined />}
                                    >
                                        View Details
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<UserOutlined style={{ fontSize: '24px', background: '#f0f5ff', padding: '8px', borderRadius: '50%' }} />}
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span>{donation.name}</span>
                                            {getOrganTypeTag(donation.organ_type)}
                                        </div>
                                    }
                                    description={
                                        <div style={{ display: 'flex', gap: '24px', color: '#666' }}>
                                            <span>
                                                <CalendarOutlined /> {moment(donation.date_of_donation).format('MMM DD, YYYY')}
                                            </span>
                                            <span>
                                                <PhoneOutlined /> {formatPhoneNumber(donation.mobile_number)}
                                            </span>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}

                <Modal
                    title={<div style={{ color: '#1a5f88' }}><HeartOutlined /> Donation Details</div>}
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                    width={600}
                >
                    {selectedDonation && (
                        <div className="donation-details">
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Card title="Donor Information" style={{ marginBottom: '16px' }}>
                                        <p><UserOutlined /> <strong>Name:</strong> {selectedDonation.name}</p>
                                        <p><MailOutlined /> <strong>Email:</strong> {selectedDonation.email}</p>
                                        <p><PhoneOutlined /> <strong>Mobile:</strong> {formatPhoneNumber(selectedDonation.mobile_number)}</p>
                                    </Card>
                                </Col>
                                <Col span={24}>
                                    <Card title="Donation Details">
                                        <p>
                                            <strong>Organ Type:</strong> {getOrganTypeTag(selectedDonation.organ_type)}
                                        </p>
                                        <p>
                                            <strong>Date of Donation:</strong> {moment(selectedDonation.date_of_donation).format('MMMM DD, YYYY')}
                                        </p>
                                        <p>
                                            <strong>Record Created:</strong> {moment(selectedDonation.createdAt).format('MMMM DD, YYYY, hh:mm A')}
                                        </p>
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

export default OrganDonationDetails;
