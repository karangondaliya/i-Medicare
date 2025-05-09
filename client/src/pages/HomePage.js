// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Layout } from '../components/Layout';
// import { Row, Col } from 'antd';
// import DoctorList from '../components/DoctorList';

// const HomePage = () => {

//     const [doctors, setDoctors] = useState([]);
//     //Login User Data
//     const getUserData = async () => {
//         try {
//             const res = await axios.get('/api/v1/user/getAllDoctors', {
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem('token'),
//                 }
//             })
//             if(res.data.success){
//                 setDoctors(res.data.data);
//             }
//         } catch (err) {
//             //console.log(err);
//         }
//     }

//     useEffect(() => {
//         getUserData();
//     }, []);
    
//     return (
//         <Layout>
//             <h2 className='text-center'>Home Page</h2>
//             <Row gutter={16}>
//                 {
//                     doctors && doctors.map(doctor => (
//                         <Col span={8} key={doctor._id} className='mt-2'>
//                             <DoctorList doctor={doctor}/> 
//                         </Col>
//                     ))
//                 }
//             </Row>
//         </Layout>
//     )
// }

// export default HomePage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { Card, Empty, Spin, Tooltip, Row, Col } from 'antd';
import DoctorList from '../components/DoctorList';
import { MedicineBoxOutlined, UserOutlined } from '@ant-design/icons';

const HomePage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const styles = {
        homeContainer: {
            padding: '10px',
            maxWidth: '1400px', // Further reduced
            margin: '0 auto',
            overflow: 'hidden',
        },
        welcomeSection: {
            textAlign: 'center',
            padding: '20px 15px',
            background: 'linear-gradient(135deg, #2a8cc5 0%, #1a5f88 100%)',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        },
        welcomeTitle: {
            fontSize: '1.8rem',
            margin: '8px 0',
            fontWeight: 600,
            color: 'white',
        },
        welcomeDescription: {
            fontSize: '1rem',
            opacity: 0.9,
            marginBottom: 0,
        },
        welcomeIcon: {
            fontSize: '2rem',
            marginBottom: '10px',
            color: 'white',
        },
        doctorsSection: {
            padding: '10px',
        },
        sectionTitle: {
            fontSize: '1.6rem',
            color: '#2a5989',
            marginBottom: '8px',
            textAlign: 'center',
        },
        sectionDescription: {
            textAlign: 'center',
            color: '#666',
            marginBottom: '20px',
            fontSize: '1rem',
        },
        doctorCard: {
            width: '100%',
            minWidth: '280px', // Further reduced
            maxWidth: '350px', // Further reduced
            height: '500px',
            borderRadius: '12px',
            border: '1px solid #eee',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
        doctorCardContent: {
            padding: '15px',
            height: '100%',
        },
        doctorAvatar: {
            background: '#f0f5ff',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '2.5rem',
            color: '#2a8cc5',
            boxShadow: '0 4px 12px rgba(42, 140, 197, 0.15)',
        },
        doctorDetailsContainer: {
            padding: '10px 5px',
        },
        doctorDetails: {
            transition: 'all 0.3s ease',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
        },
        cardTitle: {
            color: '#2a5989',
            fontSize: '1.3rem',
            marginBottom: '12px',
            fontWeight: '600',
            lineHeight: '1.2',
        },
        cardText: {
            color: '#666',
            marginBottom: '8px',
            fontSize: '1rem',
            lineHeight: '1.4',
        },
        cardButton: {
            background: '#2a8cc5',
            border: 'none',
            color: 'white',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '1rem',
            width: '100%',
            maxWidth: '180px',
            margin: '12px auto 0',
        },
        doctorInfo: {
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            padding: '10px',
            borderRadius: '8px',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 5px 15px rgba(42, 140, 197, 0.15)',
            }
        }
    };

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
            <div style={styles.homeContainer}>
                <div style={styles.welcomeSection}>
                    <MedicineBoxOutlined style={styles.welcomeIcon} />
                    <h1 style={styles.welcomeTitle}>Welcome to i-Medicare</h1>
                    <p style={styles.welcomeDescription}>
                        Find and connect with the best healthcare professionals
                    </p>
                </div>

                <div style={styles.doctorsSection}>
                    <h2 style={styles.sectionTitle}>Available Doctors</h2>
                    <p style={styles.sectionDescription}>
                        Browse through our list of qualified medical professionals
                    </p>

                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <Spin size="large" />
                            <p style={styles.loadingText}>Loading doctors...</p>
                        </div>
                    ) : doctors.length > 0 ? (
                        <Row gutter={[20, 30]} justify="center">
                            {doctors.map(doctor => (
                                <Col xs={24} sm={12} md={8} key={doctor._id}>
                                    <Card 
                                        style={styles.doctorCard}
                                        bodyStyle={{ padding: 0, height: '100%' }}
                                    >
                                        <div style={styles.doctorCardContent}>
                                            <div style={styles.doctorAvatar}>
                                                <UserOutlined />
                                            </div>
                                            <Tooltip title="Click for details" placement="top">
                                                <div className="doctor-details-hover" style={styles.doctorDetailsContainer}>
                                                    <DoctorList 
                                                        doctor={doctor} 
                                                        titleStyle={styles.cardTitle}
                                                        textStyle={styles.cardText}
                                                        buttonStyle={styles.cardButton}
                                                        containerStyle={styles.doctorInfo}
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
                            style={styles.noDoctors}
                        />
                    )}
                </div>
            </div>

            <style jsx>{`
                .doctor-details-hover {
                    transition: all 0.3s ease;
                }
                .doctor-details-hover:hover {
                    background-color: rgba(42, 140, 197, 0.05);
                    transform: translateY(-5px);
                }
                @media (max-width: 1400px) {
                    .ant-row {
                        margin: 0 -8px !important;
                    }
                    .ant-col {
                        padding: 0 8px !important;
                    }
                }
                @media (max-width: 768px) {
                    .ant-col {
                        padding: 0 4px !important;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default HomePage;