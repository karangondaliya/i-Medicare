// import React, { useState, useEffect } from 'react';
// import { Layout } from '../../components/Layout';
// import axios from 'axios';
// import { Table, message } from 'antd';


// const Users = () => {
//     const [users, setUsers] = useState([]);


//     const getUsers = async () => {
//         try {
//             const res = await axios.get('/api/v1/admin/getAllUsers', {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             if (res.data.success) {
//                 setUsers(res.data.data);
//             }
//         } catch (e) {
//             console.error(e); // Log the error for debugging
//             message.error('Failed to fetch users'); // Optional: show error message
//         }
//     };


//     const handleAccountStatusChange = async (recordId, currentStatus, recordEmail) => {
//       try {
//           const newStatus = currentStatus ? 'blocked' : 'active'; // Toggle status based on current status
         
//           // Log the parameters for debugging purposes
//           console.log({
//               userId: recordId,
//               email: recordEmail,
//               status: newStatus
//           });
 
//           const response = await axios.post('/api/v1/admin/changeUserAccountStatus', {
//               userId: recordId, // Pass the userId of the user being acted upon
//               email: recordEmail, // Pass the email of the user being acted upon
//               status: newStatus,
//           }, {
//               headers: {
//                   Authorization: `Bearer ${localStorage.getItem('token')}` // Admin's token
//               }
//           });
 
//           if (response.data.success) {
//               message.success(`User ${recordEmail} has been ${newStatus}`); // Show success message
//               getUsers(); // Refresh the user list
//           } else {
//               message.error('Failed to change account status');
//           }
//       } catch (error) {
//           console.error(error); // Log the error
//           message.error('An error occurred while updating the account status'); // Show user-friendly error
//       }
//   };
 


//     useEffect(() => {
//         getUsers(); // Fetch users on component mount
//     }, []);


//     // Ant Design table columns
//     const columns = [
//         { title: 'Name', dataIndex: 'username' },
//         { title: 'Email', dataIndex: 'email' },
//         {
//             title: 'Doctor',
//             dataIndex: 'isDoctor',
//             render: (text, record) => (
//                 <span>{record.isDoctor ? 'Yes' : 'No'}</span>
//             )
//         },
//         {
//             title: 'Status',
//             dataIndex: 'is_active',
//             render: (text, record) => (
//                 <span>{record.is_active ? 'Active' : 'Blocked'}</span>
//             )
//         },
//         {
//             title: 'Actions',
//             dataIndex: 'actions',
//             render: (text, record) => (
//                 <div>
//                     {record.is_active ? (
//                         <button className='btn btn-danger' onClick={() => handleAccountStatusChange(record._id, true, record.email)}>Block</button>
//                     ) : (
//                         <button className='btn btn-success' onClick={() => handleAccountStatusChange(record._id, false, record.email)}>Activate</button>
//                     )}
//                 </div>
//             ),
//         }
//     ];


//     return (
//         <Layout>
//             <h1 className='text-center m-2'>Users List</h1>
//             <Table columns={columns} dataSource={users} rowKey="_id" />
//         </Layout>
//     );
// };


// export default Users; 



import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import axios from 'axios';
import { Table, message, Button, Spin, Tag, Space, Tooltip, Modal } from 'antd';
import { UserOutlined, LockOutlined, UnlockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeUserId, setActiveUserId] = useState(null);

    const getUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/getAllUsers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                // Sort users: doctors first, then active users, then blocked users
                const sortedUsers = res.data.data.sort((a, b) => {
                    if (a.isDoctor !== b.isDoctor) return b.isDoctor - a.isDoctor;
                    if (a.is_active !== b.is_active) return b.is_active - a.is_active;
                    return a.username.localeCompare(b.username);
                });
                setUsers(sortedUsers);
            }
        } catch (error) {
            message.error('Failed to fetch users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const showStatusChangeConfirm = (record, currentStatus) => {
        const newStatus = currentStatus ? 'block' : 'activate';
        confirm({
            title: `Are you sure you want to ${newStatus} this user?`,
            icon: <ExclamationCircleOutlined />,
            content: `This will ${newStatus} access for ${record.email}`,
            okText: 'Yes',
            okType: currentStatus ? 'danger' : 'primary',
            cancelText: 'No',
            onOk() {
                handleAccountStatusChange(record._id, currentStatus, record.email);
            },
        });
    };

    const handleAccountStatusChange = async (recordId, currentStatus, recordEmail) => {
        try {
            setActionLoading(true);
            setActiveUserId(recordId);
            const newStatus = currentStatus ? 'blocked' : 'active';

            const response = await axios.post('/api/v1/admin/changeUserAccountStatus', 
                {
                    userId: recordId,
                    email: recordEmail,
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                message.success(`User ${recordEmail} has been ${newStatus}`);
                getUsers();
            } else {
                message.error('Failed to change account status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('An error occurred while updating the account status');
        } finally {
            setActionLoading(false);
            setActiveUserId(null);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (text, record) => (
                <Space>
                    <UserOutlined />
                    <span>{text}</span>
                    {record.isDoctor && (
                        <Tooltip title="Doctor">
                            <Tag color="blue">Doctor</Tag>
                        </Tooltip>
                    )}
                </Space>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            render: (email) => (
                <a href={`mailto:${email}`}>{email}</a>
            )
        },
        {
            title: 'Role',
            dataIndex: 'isDoctor',
            filters: [
                { text: 'Doctor', value: true },
                { text: 'Patient', value: false }
            ],
            onFilter: (value, record) => record.isDoctor === value,
            render: (isDoctor) => (
                <Tag color={isDoctor ? 'blue' : 'green'}>
                    {isDoctor ? 'Doctor' : 'Patient'}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            filters: [
                { text: 'Active', value: true },
                { text: 'Blocked', value: false }
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (isActive) => (
                <Tag color={isActive ? 'success' : 'error'}>
                    {isActive ? 'Active' : 'Blocked'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type={record.is_active ? 'danger' : 'primary'}
                        icon={record.is_active ? <LockOutlined /> : <UnlockOutlined />}
                        loading={actionLoading && activeUserId === record._id}
                        onClick={() => showStatusChangeConfirm(record, record.is_active)}
                    >
                        {record.is_active ? 'Block' : 'Activate'}
                    </Button>
                </Space>
            ),
        }
    ];

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <h1 className='text-center m-2'>Users Management</h1>
                <Table 
                    columns={columns} 
                    dataSource={users} 
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} users`,
                        pageSizeOptions: ['10', '20', '50']
                    }}
                    bordered
                    scroll={{ x: true }}
                />
            </div>
        </Layout>
    );
};

export default Users;