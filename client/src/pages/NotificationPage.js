// import React from 'react'
// import {Layout} from '../components/Layout';
// import { message, Tabs } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { hideLoading, showLoading } from '../redux/features/alertSlice';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// //only correct for doctor.
// const NotificationPage = () => {

//     const {user} = useSelector(state => state.user);
//     const dispatch = useDispatch();
//     const navigate =useNavigate();
//     console.log("User Data:", user);
//     console.log("Notifications:", user?.notification);
//     //handle read notification
//     const handleMarkAllRead = async () => {
//         try{
//             dispatch(showLoading);

//             console.log(user._id);
//             const res = await axios.post('/api/v1/user/get-all-notification', {userId: user._id}, {
                
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 }
//             })
//             dispatch(hideLoading);
//             if(res.data.message){
//                 message.success(res.data.message);
//                 window.location.reload();
//             }else{
//                 message.error(res.data.message)
//             }
//         }catch(err){
//             dispatch(hideLoading);
//             //console.log(err);
//             message.error('Something Went Wrong');
//         }
//     }

//     const handleDeleteAllRead = async () => {
//         try{
//             dispatch(showLoading);
//             const res = await axios.post('/api/v1/user/delete-all-notification', {userId: user._id}, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 }
//             })
//             dispatch(hideLoading);
//             if(res.data.message){
//                 message.success(res.data.message);
//                 window.location.reload();
//             }else{
//                 message.error(res.data.message)
//             }
//         }catch(err){
//             dispatch(hideLoading);
//             //console.log(err);
//             message.error('Something Went Wrong');
//         }
//     }
//   return (
//     <Layout>
//         <h4 className='p-3 text-center'>Notification Page</h4>
//         <Tabs>
//             <Tabs.TabPane tab="UnRead" key={0}>
//                 <div className='d-flex justify-content-end'>
//                     <h4 className='p-2 btn btn-primary' onClick={handleMarkAllRead}>Mark All Read</h4>
//                 </div>
//                 {
//                     user?.notification.map(notificationMsg => (
//                         <div className='card' style={{cursor: "pointer"}}>
//                             <div className='card-text' onClick={() => navigate(notificationMsg.onClickPath)}>
//                                 {notificationMsg.message}
//                             </div>
//                         </div>
//                     ))
//                 }
//             </Tabs.TabPane>
//             <Tabs.TabPane tab="Read" key={1}>
//                 <div className='d-flex justify-content-end'>
//                     <h4 className='p-2 btn btn-primary' onClick={handleDeleteAllRead}>Delete All Read</h4>
//                 </div>

//                 {
//                     user?.seenNotification.map(notificationMsg => (
//                         <div className='card' style={{cursor: "pointer"}}>
//                             <div className='card-text' onClick={() => navigate(notificationMsg.onClickPath)}>
//                                 {notificationMsg.message}
//                             </div>
//                         </div>
//                     ))
//                 }

//             </Tabs.TabPane>
//         </Tabs>
//     </Layout>
//   )
// }

// export default NotificationPage



import React from 'react';
import { Layout } from '../components/Layout';
import { message, Tabs, Card, Badge, Empty, Button, Space, Tooltip, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import { 
    BellOutlined, 
    CheckCircleOutlined, 
    DeleteOutlined, 
    NotificationOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    RightOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const NotificationPage = () => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMarkAllRead = async () => {
        try {
            dispatch(showLoading);
            const res = await axios.post('/api/v1/user/get-all-notification', 
                { userId: user._id }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading);
            if(res.data.message) {
                message.success(res.data.message);
                window.location.reload();
            } else {
                message.error(res.data.message)
            }
        } catch(err) {
            dispatch(hideLoading);
            message.error('Something Went Wrong');
        }
    };

    const handleDeleteAllRead = async () => {
        try {
            dispatch(showLoading);
            const res = await axios.post('/api/v1/user/delete-all-notification', 
                { userId: user._id }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            dispatch(hideLoading);
            if(res.data.message) {
                message.success(res.data.message);
                window.location.reload();
            } else {
                message.error(res.data.message)
            }
        } catch(err) {
            dispatch(hideLoading);
            message.error('Something Went Wrong');
        }
    };

    const renderNotification = (notification) => (
        <Card 
            key={notification._id}
            className="notification-card"
            hoverable
            style={{ marginBottom: '10px' }}
        >
            <Space align="start" style={{ width: '100%' }}>
                <NotificationOutlined style={{ fontSize: '20px', color: '#1890ff' }}/>
                <div style={{ flex: 1 }}>
                    <div onClick={() => navigate(notification.onClickPath)} style={{ cursor: 'pointer' }}>
                        <p style={{ margin: '0', fontWeight: 'bold' }}>{notification.message}</p>
                        <small style={{ color: '#888' }}>
                            <ClockCircleOutlined /> {moment(notification.time).fromNow()}
                        </small>
                    </div>
                </div>
                <RightOutlined style={{ color: '#888' }} />
            </Space>
        </Card>
    );

    const items = [
        {
            key: '1',
            label: (
                <span>
                    <Badge count={user?.notification?.length || 0}>
                        <span><BellOutlined /> Unread Notifications</span>
                    </Badge>
                </span>
            ),
            children: (
                <div>
                    {user?.notification?.length > 0 ? (
                        <>
                            <Space style={{ marginBottom: '16px' }}>
                                <Button 
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={handleMarkAllRead}
                                >
                                    Mark All as Read
                                </Button>
                            </Space>
                            {user.notification.map(renderNotification)}
                        </>
                    ) : (
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            description="No unread notifications"
                        />
                    )}
                </div>
            )
        },
        {
            key: '2',
            label: (
                <span>
                    <CheckCircleOutlined /> Read Notifications
                </span>
            ),
            children: (
                <div>
                    {user?.seenNotification?.length > 0 ? (
                        <>
                            <Space style={{ marginBottom: '16px' }}>
                                <Tooltip title="Remove all read notifications">
                                    <Button 
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={handleDeleteAllRead}
                                    >
                                        Clear All Read
                                    </Button>
                                </Tooltip>
                            </Space>
                            {user.seenNotification.map(renderNotification)}
                        </>
                    ) : (
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            description="No read notifications"
                        />
                    )}
                </div>
            )
        }
    ];

    return (
        <Layout>
            <Card 
                title={
                    <Space>
                        <NotificationOutlined style={{ fontSize: '24px' }} />
                        <span style={{ fontSize: '20px' }}>Notifications</span>
                    </Space>
                }
                style={{ margin: '20px' }}
            >
                {user?.notification?.length > 0 && (
                    <Alert 
                        message={`You have ${user.notification.length} unread notifications`}
                        type="info" 
                        showIcon 
                        style={{ marginBottom: '16px' }}
                    />
                )}
                <Tabs 
                    items={items}
                    defaultActiveKey="1"
                    animated
                    size="large"
                />
            </Card>
        </Layout>
    );
};

export default NotificationPage;