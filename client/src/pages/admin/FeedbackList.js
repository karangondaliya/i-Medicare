// import React, { useState, useEffect } from 'react';
// import { Layout } from '../../components/Layout'; // Assuming Layout is your main layout component
// import { Collapse, Spin, message } from 'antd';
// import axios from 'axios';
// import '../../styles/FeedbackList.css'; // Import your CSS for additional styles

// const { Panel } = Collapse;

// // StarRating component to render star ratings
// const StarRating = ({ rating }) => {
//     const stars = [];
//     for (let i = 0; i < 5; i++) {
//         stars.push(
//             <span key={i} className={i < rating ? 'star filled' : 'star'}>
//                 ★
//             </span>
//         );
//     }
//     return <div className="star-rating">{stars}</div>;
// };

// const FeedbackList = () => {
//     const [loading, setLoading] = useState(true);
//     const [feedbackData, setFeedbackData] = useState([]);
//     const [error, setError] = useState(null);


//     // Function to fetch feedback data from the backend
//     const fetchFeedback = async () => {
//         setLoading(true);
//         try {
//             const res = await axios.get('/api/v1/admin/feedback-list', {
//                 headers: {
//                     Authorization: "Bearer " + localStorage.getItem('token'),
//                 },
//             });


//             if (res.data.success) {
//                 setFeedbackData(res.data.feedback); // Assuming the API returns the feedback array as feedback
//             } else {
//                 message.error('Failed to fetch feedback data');
//             }
//         } catch (error) {
//             setError(error);
//             message.error('Error fetching feedback data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchFeedback();
//     }, []);

//     // Handle error state
//     if (error) {
//         return <div>Error: {error.message}</div>;
//     }

//     return (
//         <Layout>
//             <h1 className="text-center">Feedbacks</h1>
//             {loading ? (
//                 <Spin size="large" className="d-flex justify-content-center" />
//             ) : (
//                 <Collapse className="feedback-list-container" accordion>
//                     {feedbackData.length > 0 ? (
//                         feedbackData.map((feedback, index) => (
//                             <Panel header={`Feedback from Email: ${feedback.email}`} key={index}>
//                                 <div className="record-details">
//                                     <p><strong>Feedback:</strong> {feedback.feedback}</p>
//                                     <p><strong>Rating:</strong> <StarRating rating={feedback.rating} /></p>
//                                     <p><strong>Date Submitted:</strong> {new Date(feedback.createdAt).toLocaleString()}</p>
//                                 </div>
//                             </Panel>
//                         ))
//                     ) : (
//                         <Panel header="No feedback records found." key="no-feedback">
//                             <p className="text-center">No feedback records available at the moment.</p>
//                         </Panel>
//                     )}
//                 </Collapse>
//             )}
//         </Layout>
//     );
// };

// export default FeedbackList;


import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { 
    Collapse, 
    Spin, 
    message, 
    Card, 
    Tag, 
    Empty, 
    Statistic, 
    Row, 
    Col, 
    Tooltip,
    Badge,
    Space,
    Button,  // Added Button import
    Divider  // Added Divider import
} from 'antd';
import {
    StarFilled,
    StarOutlined,
    UserOutlined,
    CalendarOutlined,
    MessageOutlined,
    LikeOutlined,
    DislikeOutlined,
    InfoCircleOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Panel } = Collapse;

const StarRating = ({ rating }) => {
    return (
        <Space>
            {[...Array(5)].map((_, index) => (
                <StarFilled 
                    key={index}
                    style={{ 
                        color: index < rating ? '#fadb14' : '#f0f0f0',
                        fontSize: '16px'
                    }}
                />
            ))}
            <span style={{ marginLeft: '8px', color: '#666' }}>
                ({rating}/5)
            </span>
        </Space>
    );
};

const FeedbackList = () => {
    const [loading, setLoading] = useState(true);
    const [feedbackData, setFeedbackData] = useState([]);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        averageRating: 0,
        positive: 0,
        negative: 0
    });

    const calculateStats = (feedback) => {
        const total = feedback.length;
        const averageRating = feedback.reduce((acc, curr) => acc + curr.rating, 0) / total || 0;
        const positive = feedback.filter(f => f.rating >= 4).length;
        const negative = feedback.filter(f => f.rating <= 2).length;

        setStats({
            total,
            averageRating: parseFloat(averageRating.toFixed(1)),
            positive,
            negative
        });
    };

    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/feedback-list', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (res.data.success) {
                const sortedFeedback = res.data.feedback.sort((a, b) => 
                    moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
                );
                setFeedbackData(sortedFeedback);
                calculateStats(sortedFeedback);
            }
        } catch (error) {
            setError(error);
            message.error('Failed to fetch feedback data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
        // Auto refresh every 5 minutes
        const interval = setInterval(fetchFeedback, 300000);
        return () => clearInterval(interval);
    }, []);

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'green';
        if (rating >= 3) return 'blue';
        if (rating >= 2) return 'orange';
        return 'red';
    };

    const getRatingText = (rating) => {
        if (rating >= 4) return 'Excellent';
        if (rating >= 3) return 'Good';
        if (rating >= 2) return 'Fair';
        return 'Poor';
    };

    const renderFeedbackHeader = (feedback) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
                <UserOutlined />
                <span>{feedback.email}</span>
                <Tag color={getRatingColor(feedback.rating)}>
                    {getRatingText(feedback.rating)} ({feedback.rating} Stars)
                </Tag>
            </Space>
            <Space>
                <Tooltip title={moment(feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                    <Tag icon={<CalendarOutlined />}>
                        {moment(feedback.createdAt).fromNow()}
                    </Tag>
                </Tooltip>
            </Space>
        </div>
    );

    if (error) {
        return (
            <Layout>
                <div style={{ padding: '24px' }}>
                    <Card className="error-card">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Space direction="vertical" align="center">
                                    <span>Error loading feedback data</span>
                                    <Button 
                                        type="primary" 
                                        icon={<ReloadOutlined />}
                                        onClick={fetchFeedback}
                                    >
                                        Try Again
                                    </Button>
                                </Space>
                            }
                        />
                    </Card>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div style={{ padding: '24px' }}>
                <Card>
                    <div style={{ marginBottom: '20px' }}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <h2 style={{ margin: 0 }}>Feedback Management</h2>
                            </Col>
                            <Col>
                                <Button 
                                    type="primary" 
                                    icon={<ReloadOutlined />} 
                                    onClick={fetchFeedback}
                                >
                                    Refresh
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                        <Col xs={12} sm={12} md={6}>
                            <Card className="statistic-card">
                                <Statistic 
                                    title="Total Feedback"
                                    value={stats.total}
                                    prefix={<MessageOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6}>
                            <Card className="statistic-card">
                                <Statistic 
                                    title="Average Rating"
                                    value={stats.averageRating}
                                    precision={1}
                                    prefix={<StarFilled style={{ color: '#fadb14' }} />}
                                    suffix="/5"
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6}>
                            <Card className="statistic-card">
                                <Statistic 
                                    title="Positive Feedback"
                                    value={stats.positive}
                                    prefix={<LikeOutlined style={{ color: '#52c41a' }} />}
                                    suffix={`(${Math.round((stats.positive / stats.total) * 100) || 0}%)`}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6}>
                            <Card className="statistic-card">
                                <Statistic 
                                    title="Negative Feedback"
                                    value={stats.negative}
                                    prefix={<DislikeOutlined style={{ color: '#ff4d4f' }} />}
                                    suffix={`(${Math.round((stats.negative / stats.total) * 100) || 0}%)`}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <Spin size="large" tip="Loading feedback data..." />
                        </div>
                    ) : feedbackData.length > 0 ? (
                        <Collapse className="feedback-list">
                            {feedbackData.map((feedback, index) => (
                                <Panel 
                                    key={index}
                                    header={renderFeedbackHeader(feedback)}
                                    className={`feedback-panel rating-${getRatingColor(feedback.rating)}`}
                                >
                                    <div className="feedback-content">
                                        <div className="feedback-rating">
                                            <StarRating rating={feedback.rating} />
                                        </div>
                                        <div className="feedback-message">
                                            <p>{feedback.feedback}</p>
                                        </div>
                                        <Divider style={{ margin: '12px 0' }} />
                                        <div className="feedback-metadata">
                                            <Space>
                                                <CalendarOutlined />
                                                <span>
                                                    Submitted on {moment(feedback.createdAt).format('MMMM Do YYYY, h:mm a')}
                                                </span>
                                            </Space>
                                        </div>
                                    </div>
                                </Panel>
                            ))}
                        </Collapse>
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span>No feedback records available at the moment</span>
                            }
                        />
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default FeedbackList;