import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Row, Col, Card, Spin, message } from 'antd';
import axios from 'axios';

const OrganDonationDetails = () => {
    const [loading, setLoading] = useState(false);
    const [donations, setDonations] = useState([]);

    // Function to fetch organ donation data from the backend
    const fetchOrganDonations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/get-organ-donations', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                },
            });
            if (res.data.success) {
                setDonations(res.data.donations);
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

    return (
        <Layout>
            <h1 className="text-center">Organ Donation Records</h1>
            {loading ? (
                <Spin size="large" className="d-flex justify-content-center" />
            ) : (
                <Row gutter={16}>
                    {donations.length > 0 ? (
                        donations.map((donation, index) => (
                            <Col span={8} key={index}>
                                <Card
                                    title={<strong>Donor: {donation.name}</strong>}
                                    bordered={false}
                                    className="donation-card"
                                >
                                    <div className="record-details">
                                        <p><strong>Email:</strong> {donation.email}</p>
                                        <p><strong>Mobile:</strong> {donation.mobile_number}</p>
                                        <p><strong>Organ:</strong> {donation.organ_type}</p>
                                        <p><strong>Date of Donation:</strong> {new Date(donation.date_of_donation).toLocaleDateString()}</p>
                                        <p><strong>Created At:</strong> {new Date(donation.createdAt).toLocaleString()}</p>
                                    </div>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <p className="text-center">No organ donation records found.</p>
                        </Col>
                    )}
                </Row>
            )}
        </Layout>
    );
};

export default OrganDonationDetails;
