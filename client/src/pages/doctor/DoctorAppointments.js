// import React, {useState, useEffect} from 'react'
// import { Layout } from '../../components/Layout'
// import axios from 'axios'
// import moment from 'moment'
// import { message, Table } from 'antd'

// const DoctorAppointments = () => {

//     const [appointments, setAppointments] = useState([])

//     const getAppointments = async () => {
//         try{
//             const res = await axios.get('/api/v1/doctor/doctor-appointments', {
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

//     const handleStatus = async (record, status) => {
//         try{
//             //console.log(record);
//             const res = await axios.post('/api/v1/doctor/update-status', {
//                 appointmentId: record._id,
//                 status
//             },{
//                 headers:{
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 }
//             })
//             if(res.data.success){
//                 message.success(res.data.message)
//                 getAppointments()
//             }
//         }catch(err){
//             //console.log(err);
//             message.error('Something Went Wrong')
//         }
//     }

//     const columns = [
       
//         {
//             title: 'Name',
//             dataIndex: 'name',
//             render: (text, record) => (
//                 <span>
//                     {record.userInfo.username}
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
//         {
//             title: 'Actions',
//             dataIndex: 'actions',
//             render: (text, record) => (
//                 <div className='d-flex'>
//                     {record.status === "pending" && (
//                         <div className='d-flex'>
//                             <button className='btn btn-success ms-2' onClick={() => handleStatus(record, 'approved')}>Approved</button>
//                             <button className='btn btn-danger' onClick={() => handleStatus(record, 'reject')}>Reject</button>
//                         </div>
//                     )}
//                 </div>
//             )
//         }
//     ]
//   return (
//     <Layout>
//         <h1 className='text-center'>Appointments List</h1>
//         <Table columns={columns} dataSource={appointments} />
//     </Layout>
//   )
// }

// export default DoctorAppointments



import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import axios from 'axios';
import moment from 'moment';
import { 
    message, 
    Table, 
    Tag, 
    Space, 
    Button, 
    Card, 
    Tooltip, 
    Badge,
    Typography,
    Statistic,
    Row,
    Col
} from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    UserOutlined,
    PhoneOutlined,
    CalendarOutlined,
    FieldTimeOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAppointments = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/doctor/doctor-appointments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if(res.data.success) {
                const sortedAppointments = res.data.data.sort((a, b) => {
                    return moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`));
                });
                setAppointments(sortedAppointments);
            }
        } catch(error) {
            message.error('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAppointments();
        const interval = setInterval(getAppointments, 300000);
        return () => clearInterval(interval);
    }, []);

    const handleStatus = async (record, status) => {
        try {
            const res = await axios.post('/api/v1/doctor/update-status', 
                {
                    appointmentId: record._id,
                    status
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if(res.data.success) {
                message.success(`Appointment ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
                getAppointments();
            }
        } catch(error) {
            message.error('Failed to update appointment status');
        }
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { color: 'gold', text: 'Pending Review' },
            approved: { color: 'green', text: 'Approved' },
            reject: { color: 'red', text: 'Rejected' }
        };
        return (
            <Tag color={statusConfig[status]?.color}>
                {statusConfig[status]?.text || status.toUpperCase()}
            </Tag>
        );
    };

    const columns = [
        {
            title: 'Patient',
            dataIndex: 'userInfo',
            render: (userInfo) => (
                <Space>
                    <UserOutlined />
                    <span style={{ fontWeight: 500 }}>
                        {userInfo.username}
                    </span>
                </Space>
            )
        },
        {
            title: 'Contact',
            dataIndex: 'doctorInfo',
            render: (doctorInfo) => (
                <Space>
                    <PhoneOutlined />
                    <a href={`tel:${doctorInfo.contact_number}`}>
                        {doctorInfo.contact_number}
                    </a>
                </Space>
            )
        },
        {
            title: 'Schedule',
            dataIndex: 'date',
            render: (text, record) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <CalendarOutlined />
                        {moment(record.date).format('MMM DD, YYYY')}
                    </Space>
                    <Space>
                        <FieldTimeOutlined />
                        {moment(record.time, 'HH:mm').format('hh:mm A')}
                    </Space>
                </Space>
            ),
            sorter: (a, b) => moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`))
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => getStatusTag(status),
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Approved', value: 'approved' },
                { text: 'Rejected', value: 'reject' }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space>
                    {record.status === "pending" && (
                        <>
                            <Tooltip title="Approve Appointment">
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={() => handleStatus(record, 'approved')}
                                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                >
                                    Approve
                                </Button>
                            </Tooltip>
                            <Tooltip title="Reject Appointment">
                                <Button
                                    danger
                                    icon={<CloseOutlined />}
                                    onClick={() => handleStatus(record, 'reject')}
                                >
                                    Reject
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </Space>
            )
        }
    ];

    const getStatistics = () => {
        return {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'pending').length,
            approved: appointments.filter(a => a.status === 'approved').length,
            rejected: appointments.filter(a => a.status === 'reject').length
        };
    };

    const stats = getStatistics();

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <Card>
                    <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                        <Col>
                            <Title level={2} style={{ margin: 0 }}>Appointments Dashboard</Title>
                        </Col>
                        <Col>
                            <Button 
                                type="primary"
                                icon={<ReloadOutlined />}
                                onClick={getAppointments}
                            >
                                Refresh
                            </Button>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: '24px' }}>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Total Appointments"
                                    value={stats.total}
                                    prefix={<CalendarOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Pending Review"
                                    value={stats.pending}
                                    valueStyle={{ color: '#faad14' }}
                                    prefix={<ExclamationCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Approved"
                                    value={stats.approved}
                                    valueStyle={{ color: '#52c41a' }}
                                    prefix={<CheckOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Rejected"
                                    value={stats.rejected}
                                    valueStyle={{ color: '#ff4d4f' }}
                                    prefix={<CloseOutlined />}
                                />
                            </Card>
                        </Col>
                    </Row>

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
                </Card>
            </div>
        </Layout>
    );
};

export default DoctorAppointments;