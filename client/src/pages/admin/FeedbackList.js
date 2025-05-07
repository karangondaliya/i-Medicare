import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout'; // Assuming Layout is your main layout component
import { Collapse, Spin, message } from 'antd';
import axios from 'axios';
import '../../styles/FeedbackList.css'; // Import your CSS for additional styles

const { Panel } = Collapse;

// StarRating component to render star ratings
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        stars.push(
            <span key={i} className={i < rating ? 'star filled' : 'star'}>
                ★
            </span>
        );
    }
    return <div className="star-rating">{stars}</div>;
};

const FeedbackList = () => {
    const [loading, setLoading] = useState(true);
    const [feedbackData, setFeedbackData] = useState([]);
    const [error, setError] = useState(null);


    // Function to fetch feedback data from the backend
    const fetchFeedback = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/feedback-list', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                },
            });


            if (res.data.success) {
                setFeedbackData(res.data.feedback); // Assuming the API returns the feedback array as feedback
            } else {
                message.error('Failed to fetch feedback data');
            }
        } catch (error) {
            setError(error);
            message.error('Error fetching feedback data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    // Handle error state
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Layout>
            <h1 className="text-center">Feedbacks</h1>
            {loading ? (
                <Spin size="large" className="d-flex justify-content-center" />
            ) : (
                <Collapse className="feedback-list-container" accordion>
                    {feedbackData.length > 0 ? (
                        feedbackData.map((feedback, index) => (
                            <Panel header={`Feedback from Email: ${feedback.email}`} key={index}>
                                <div className="record-details">
                                    <p><strong>Feedback:</strong> {feedback.feedback}</p>
                                    <p><strong>Rating:</strong> <StarRating rating={feedback.rating} /></p>
                                    <p><strong>Date Submitted:</strong> {new Date(feedback.createdAt).toLocaleString()}</p>
                                </div>
                            </Panel>
                        ))
                    ) : (
                        <Panel header="No feedback records found." key="no-feedback">
                            <p className="text-center">No feedback records available at the moment.</p>
                        </Panel>
                    )}
                </Collapse>
            )}
        </Layout>
    );
};

export default FeedbackList;