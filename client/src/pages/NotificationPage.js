import React from 'react'
import {Layout} from '../components/Layout';
import { message, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {

    const {user} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate =useNavigate();
    //console.log(user);
    //handle read notification
    const handleMarkAllRead = async () => {
        try{
            dispatch(showLoading);
            const res = await axios.post('/api/v1/user/get-all-notification', {userId: user._id}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading);
            if(res.data.message){
                message.success(res.data.message);
                window.location.reload();
            }else{
                message.error(res.data.message)
            }
        }catch(err){
            dispatch(hideLoading);
            //console.log(err);
            message.error('Something Went Wrong');
        }
    }

    const handleDeleteAllRead = async () => {
        try{
            dispatch(showLoading);
            const res = await axios.post('/api/v1/user/delete-all-notification', {userId: user._id}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading);
            if(res.data.message){
                message.success(res.data.message);
                window.location.reload();
            }else{
                message.error(res.data.message)
            }
        }catch(err){
            dispatch(hideLoading);
            //console.log(err);
            message.error('Something Went Wrong');
        }
    }
  return (
    <Layout>
        <h4 className='p-3 text-center'>NotificationPage</h4>
        <Tabs>
            <Tabs.TabPane tab="UnRead" key={0}>
                <div className='d-flex justify-content-end'>
                    <h4 className='p-2' onClick={handleMarkAllRead}>Mark All Read</h4>
                </div>
                {
                    user?.notification.map(notificationMsg => (
                        <div className='card' style={{cursor: "pointer"}}>
                            <div className='card-text' onClick={() => navigate('notificationMsg.onClickPath')}>
                                {notificationMsg.messgae}
                            </div>
                        </div>
                    ))
                }
            </Tabs.TabPane>
            <Tabs.TabPane tab="Read" key={1}>
                <div className='d-flex justify-content-end'>
                    <h4 className='p-2' onClick={handleDeleteAllRead}>Delete All Read</h4>
                </div>

                {
                    user?.seenNotification.map(notificationMsg => (
                        <div className='card' style={{cursor: "pointer"}}>
                            <div className='card-text' onClick={() => navigate('notificationMsg.onClickPath')}>
                                {notificationMsg.messgae}
                            </div>
                        </div>
                    ))
                }

            </Tabs.TabPane>
        </Tabs>
    </Layout>
  )
}

export default NotificationPage