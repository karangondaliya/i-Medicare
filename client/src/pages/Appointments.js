// import React, {useState, useEffect} from 'react'
// import { Layout } from '../components/Layout'
// import axios from 'axios'
// import moment from 'moment'
// import { Table } from 'antd'

// const Appointments = () => {

//     const [appointments, setAppointments] = useState([])

//     const getAppointments = async () => {
//         try{
//             const res = await axios.get('/api/v1/user/user-appointment', {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 }
//             })
//             if(res.data.success){
//                 setAppointments(res.data.data)
//             }
//         }catch(err){
//             //console.log(err);
//         }
//     }

//     useEffect(() => {
//         getAppointments();
//     }, [])

//     const columns = [
     
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             render: (text, record) => (
//                 <span>
//                     {record.doctorInfo.first_name} {record.doctorInfo.last_name}
//                 </span>
//             )
//         },
//         {
//             title: 'Phone',
//             dataIndex: 'contact_number',
//             render: (text, record) => (
//                 <span>
//                     {record.doctorInfo.contact_number}
//                 </span>
//             )
//         },
//         {
//             title: 'Date & Time',
//             dataIndex: 'date',
//             render: (text, record) => (
//                 <span>
//                     {moment(record.date).format('DD-MM-YYYY')} &nbsp;
//                     {moment(record.time).format('HH:mm')}
//                 </span>
//             )
//         },
//         {
//             title: 'Status',
//             dataIndex: 'status', 
//         },
        
//     ]
//   return (
//     <Layout>
//         <h1 className='text-center'>Appointments List</h1>
//         <Table columns={columns} dataSource={appointments} />
//     </Layout>
//   )
// }

// export default Appointments


import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import axios from 'axios';
import moment from 'moment';
import { Table, Tag, Space, message, Badge, Empty, Card, Tooltip } from 'antd';
import { 
    UserOutlined, 
    PhoneOutlined, 
    CalendarOutlined, 
    FieldTimeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MedicineBoxOutlined
} from '@ant-design/icons';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = localStorage.getItem('username') || 'User';

    const getAppointments = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/user/user-appointment', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                const sortedAppointments = res.data.data.sort((a, b) => {
                    const dateTimeA = moment.utc(`${a.date} ${a.time}`);
                    const dateTimeB = moment.utc(`${b.date} ${b.time}`);
                    return dateTimeA - dateTimeB;
                });
                setAppointments(sortedAppointments);
            }
        } catch (error) {
            message.error('Failed to fetch appointments');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAppointments();
        // Set up auto-refresh every 5 minutes
        const refreshInterval = setInterval(getAppointments, 300000);
        return () => clearInterval(refreshInterval);
    }, []);

    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { color: 'warning', icon: <ExclamationCircleOutlined />, text: 'Pending' },
            approved: { color: 'success', icon: <CheckCircleOutlined />, text: 'Confirmed' },
            rejected: { color: 'error', icon: <CloseCircleOutlined />, text: 'Cancelled' }
        };
        const config = statusConfig[status.toLowerCase()] || { color: 'default', icon: null, text: status };
        
        return (
            <Tooltip title={`Last updated: ${moment().format('YYYY-MM-DD HH:mm:ss')}`}>
                <Tag color={config.color} icon={config.icon}>
                    {config.text}
                </Tag>
            </Tooltip>
        );
    };

    const isUpcoming = (date, time) => {
        const appointmentDateTime = moment.utc(`${date} ${time}`);
        return appointmentDateTime.isAfter(moment.utc());
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return 'N/A';
        const phoneStr = phone.toString();
        const cleaned = phoneStr.replace(/\D/g, '');
        return cleaned.length === 10 
            ? `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
            : phoneStr;
    };

    const columns = [
        {
            title: 'Doctor',
            dataIndex: 'doctorInfo',
            render: (doctorInfo) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <UserOutlined />
                        <span style={{ fontWeight: 'bold' }}>
                            Dr. {doctorInfo.first_name} {doctorInfo.last_name}
                        </span>
                    </Space>
                    {doctorInfo.specialization && (
                        <Tag color="blue">{doctorInfo.specialization}</Tag>
                    )}
                </Space>
            )
        },
        {
            title: 'Contact',
            dataIndex: 'doctorInfo',
            render: (doctorInfo) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <PhoneOutlined />
                        <a href={`tel:${doctorInfo.contact_number}`}>
                            {formatPhoneNumber(doctorInfo.contact_number)}
                        </a>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Appointment Time',
            dataIndex: 'date',
            sorter: (a, b) => moment.utc(`${a.date} ${a.time}`) - moment.utc(`${b.date} ${b.time}`),
            render: (text, record) => {
                const dateTime = moment.utc(`${record.date} ${record.time}`);
                const localDateTime = dateTime.local();
                const isUpcomingAppointment = isUpcoming(record.date, record.time);
                
                return (
                    <Space direction="vertical" size="small">
                        <Space>
                            <CalendarOutlined />
                            <span>{localDateTime.format('MMM DD, YYYY')}</span>
                        </Space>
                        <Space>
                            <FieldTimeOutlined />
                            <span style={{ 
                                color: isUpcomingAppointment ? '#52c41a' : '#666'
                            }}>
                                {localDateTime.format('hh:mm A')}
                            </span>
                        </Space>
                        {isUpcomingAppointment && (
                            <Tag color="green">Upcoming</Tag>
                        )}
                    </Space>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Confirmed', value: 'approved' },
                { text: 'Cancelled', value: 'rejected' }
            ],
            onFilter: (value, record) => record.status.toLowerCase() === value,
            render: (status) => getStatusTag(status)
        }
    ];

    const getAppointmentsSummary = () => {
        const upcoming = appointments.filter(a => 
            isUpcoming(a.date, a.time) && a.status.toLowerCase() === 'approved'
        ).length;
        const pending = appointments.filter(a => 
            a.status.toLowerCase() === 'pending'
        ).length;
        const total = appointments.length;

        return { upcoming, pending, total };
    };

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <Card>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ margin: 0 }}>My Appointments</h2>
                            <Space>
                                <Tag icon={<CalendarOutlined />}>
                                    Current Time: {moment().format('YYYY-MM-DD HH:mm:ss')}
                                </Tag>
                            </Space>
                        </div>

                        <Space wrap>
                            <Badge count={getAppointmentsSummary().upcoming} showZero>
                                <Tag color="green" icon={<CalendarOutlined />}>Upcoming</Tag>
                            </Badge>
                            <Badge count={getAppointmentsSummary().pending} showZero>
                                <Tag color="warning" icon={<ExclamationCircleOutlined />}>Pending</Tag>
                            </Badge>
                            <Badge count={getAppointmentsSummary().total} showZero>
                                <Tag color="blue" icon={<MedicineBoxOutlined />}>Total</Tag>
                            </Badge>
                        </Space>
                    </div>

                    {appointments.length === 0 && !loading ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span>
                                    No appointments found. Schedule your first appointment now!
                                </span>
                            }
                        />
                    ) : (
                        <Table 
                            columns={columns}
                            dataSource={appointments}
                            rowKey="_id"
                            loading={loading}
                            pagination={{
                                defaultPageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} appointments`,
                                pageSizeOptions: ['10', '20', '50']
                            }}
                            bordered
                            scroll={{ x: true }}
                        />
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default Appointments;