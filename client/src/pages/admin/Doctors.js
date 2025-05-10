// import React, {useState, useEffect} from 'react'
// import {Layout} from '../../components/Layout'
// import axios from 'axios'
// import { message, Table } from 'antd'

// const Doctors = () => {

//   const [doctors, setDoctors] = useState([]);

//   const getDoctors = async () => {
//     try{
//       const res = await axios.get('/api/v1/admin/getAllDoctors', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if(res.data.success){
//         setDoctors(res.data.data)
//       }
//     }catch(e){
//       //console.log(e)
//     }
//   }

//   const handleAccountStatus = async (record, status) => {
//     try {
//         const res = await axios.post('/api/v1/admin/changeAccountStatus', {
//             doctorId: record._id,
//             userId: record.userId,
//             status: status
//         }, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         });


//         if (res.data.success) {
//             message.success(res.data.message);
//             window.location.reload();
//         } else {
//             message.error(res.data.message);
//         }
//     } catch (err) {
//         message.error('Something Went Wrong');
//     }
// }

//   useEffect(() => {
//     getDoctors()
//   }, [])

//   const columns = [
//     {
//         title: 'Name',
//         dataIndex: 'name',
//         render: (text, record) => (
//             <span>{record.first_name} {record.last_name}</span>
//         )
//     },
//     {
//         title: 'Status',
//         dataIndex: 'status',
//         render: (text) => <span>{text}</span>
//     },
//     {
//         title: 'Phone',
//         dataIndex: 'contact_number',
//     },
//     {
//         title: 'Actions',
//         dataIndex: 'actions',
//         render: (text, record) => (
//             <div>
//                 {record.status === 'pending' ? (
//                     <>
//                         <button className='btn btn-success' onClick={() => handleAccountStatus(record, "approved")}>Approve</button>
//                         <button className='btn btn-danger' onClick={() => handleAccountStatus(record, "rejected")}>Reject</button>
//                     </>
//                 ) : (
//                     <button className='btn btn-success' onClick={() => handleAccountStatus(record, "pending")}>Make Change</button>
//                 )}
//             </div>
//         ),
//     }
// ]

//   return (
//     <Layout>
//         <h1>Doctors List</h1>
//         <Table columns={columns} dataSource={doctors}/>
//     </Layout>
//   )
// }

// export default Doctors  


import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import axios from 'axios';
import { Table, message, Button, Space, Tag, Modal, Tooltip, Badge } from 'antd';
import { 
    UserOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    SyncOutlined,
    PhoneOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined,
    MailOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { confirm } = Modal;

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeDoctorId, setActiveDoctorId] = useState(null);

    const getDoctors = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/getAllDoctors', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                const sortedDoctors = res.data.data.sort((a, b) => {
                    const statusOrder = { pending: 0, approved: 1, rejected: 2 };
                    return statusOrder[a.status] - statusOrder[b.status] || 
                           moment.utc(b.createdAt).diff(moment.utc(a.createdAt));
                });
                setDoctors(sortedDoctors);
            }
        } catch (error) {
            message.error('Failed to fetch doctors list');
        } finally {
            setLoading(false);
        }
    };

    const showStatusChangeConfirm = (record, newStatus) => {
        const statusActions = {
            approved: 'approve',
            rejected: 'reject',
            pending: 'reset to pending'
        };

        confirm({
            title: `Confirm Status Change`,
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Are you sure you want to {statusActions[newStatus]} this doctor?</p>
                    <p>Name: Dr. {record.first_name} {record.last_name}</p>
                    <p>Current Status: {record.status.toUpperCase()}</p>
                    <p>New Status: {newStatus.toUpperCase()}</p>
                    <p>Action by: {localStorage.getItem('username') || 'Administrator'}</p>
                    <p>Time: {moment.utc().format('YYYY-MM-DD HH:mm:ss')} UTC</p>
                </div>
            ),
            okText: 'Yes',
            okType: newStatus === 'rejected' ? 'danger' : 'primary',
            cancelText: 'No',
            onOk() {
                handleAccountStatus(record, newStatus);
            },
        });
    };

    const handleAccountStatus = async (record, status) => {
        setActionLoading(true);
        setActiveDoctorId(record._id);
        try {
            const res = await axios.post('/api/v1/admin/changeAccountStatus', 
                {
                    doctorId: record._id,
                    userId: record.userId,
                    status: status,
                    updatedBy: localStorage.getItem('username'),
                    updatedAt: moment.utc().format()
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (res.data.success) {
                message.success(`Doctor status successfully updated to ${status}`);
                getDoctors();
            } else {
                message.error(res.data.message || 'Status update failed');
            }
        } catch (err) {
            message.error('Failed to update doctor status');
        } finally {
            setActionLoading(false);
            setActiveDoctorId(null);
        }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { color: 'warning', icon: <ExclamationCircleOutlined />, text: 'Pending Review' },
            approved: { color: 'success', icon: <CheckCircleOutlined />, text: 'Approved' },
            rejected: { color: 'error', icon: <CloseCircleOutlined />, text: 'Rejected' }
        };
        const config = statusConfig[status] || { color: 'default', icon: null, text: status };
        
        return (
            <Tag color={config.color} icon={config.icon}>
                {config.text}
            </Tag>
        );
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
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <UserOutlined />
                        <span style={{ fontWeight: 'bold' }}>
                            Dr. {record.first_name} {record.last_name}
                        </span>
                    </Space>
                    {record.specialization && (
                        <Tag color="blue">{record.specialization}</Tag>
                    )}
                </Space>
            )
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Space>
                        <PhoneOutlined />
                        {record.contact_number ? (
                            <a href={`tel:${record.contact_number}`}>
                                {formatPhoneNumber(record.contact_number)}
                            </a>
                        ) : (
                            <span>N/A</span>
                        )}
                    </Space>
                    {record.email && (
                        <Space>
                            <MailOutlined />
                            <a href={`mailto:${record.email}`}>{record.email}</a>
                        </Space>
                    )}
                </Space>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Pending Review', value: 'pending' },
                { text: 'Approved', value: 'approved' },
                { text: 'Rejected', value: 'rejected' }
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => getStatusTag(status)
        },
        {
            title: 'Registration Date',
            dataIndex: 'createdAt',
            sorter: (a, b) => moment.utc(a.createdAt).unix() - moment.utc(b.createdAt).unix(),
            render: (date) => (
                <Tooltip title={moment.utc(date).format('YYYY-MM-DD HH:mm:ss UTC')}>
                    <Space>
                        <CalendarOutlined />
                        {moment.utc(date).format('MMM DD, YYYY')}
                    </Space>
                </Tooltip>
            )
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            width: 200,
            render: (_, record) => (
                <Space>
                    {record.status === 'pending' ? (
                        <>
                            <Button
                                type="primary"
                                icon={<CheckCircleOutlined />}
                                onClick={() => showStatusChangeConfirm(record, "approved")}
                                loading={actionLoading && activeDoctorId === record._id}
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => showStatusChangeConfirm(record, "rejected")}
                                loading={actionLoading && activeDoctorId === record._id}
                            >
                                Reject
                            </Button>
                        </>
                    ) : (
                        <Button
                            icon={<SyncOutlined />}
                            onClick={() => showStatusChangeConfirm(record, "pending")}
                            loading={actionLoading && activeDoctorId === record._id}
                        >
                            Reset
                        </Button>
                    )}
                </Space>
            ),
        }
    ];

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ margin: 0 }}>Doctors Management</h1>
                    <Space>
                        <Badge count={doctors.filter(d => d.status === 'pending').length} showZero>
                            <Tag color="warning" icon={<ExclamationCircleOutlined />}>Pending</Tag>
                        </Badge>
                        <Badge count={doctors.filter(d => d.status === 'approved').length} showZero>
                            <Tag color="success" icon={<CheckCircleOutlined />}>Approved</Tag>
                        </Badge>
                        <Badge count={doctors.filter(d => d.status === 'rejected').length} showZero>
                            <Tag color="error" icon={<CloseCircleOutlined />}>Rejected</Tag>
                        </Badge>
                    </Space>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={doctors}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} doctors`,
                        pageSizeOptions: ['10', '20', '50']
                    }}
                    bordered
                    scroll={{ x: true }}
                />
            </div>
        </Layout>
    );
};

export default Doctors;