import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import axios from 'axios';
import { Table, message } from 'antd';


const Users = () => {
    const [users, setUsers] = useState([]);


    const getUsers = async () => {
        try {
            const res = await axios.get('/api/v1/admin/getAllUsers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (e) {
            console.error(e); // Log the error for debugging
            message.error('Failed to fetch users'); // Optional: show error message
        }
    };


    const handleAccountStatusChange = async (recordId, currentStatus, recordEmail) => {
      try {
          const newStatus = currentStatus ? 'blocked' : 'active'; // Toggle status based on current status
         
          // Log the parameters for debugging purposes
          console.log({
              userId: recordId,
              email: recordEmail,
              status: newStatus
          });
 
          const response = await axios.post('/api/v1/admin/changeUserAccountStatus', {
              userId: recordId, // Pass the userId of the user being acted upon
              email: recordEmail, // Pass the email of the user being acted upon
              status: newStatus,
          }, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}` // Admin's token
              }
          });
 
          if (response.data.success) {
              message.success(`User ${recordEmail} has been ${newStatus}`); // Show success message
              getUsers(); // Refresh the user list
          } else {
              message.error('Failed to change account status');
          }
      } catch (error) {
          console.error(error); // Log the error
          message.error('An error occurred while updating the account status'); // Show user-friendly error
      }
  };
 


    useEffect(() => {
        getUsers(); // Fetch users on component mount
    }, []);


    // Ant Design table columns
    const columns = [
        { title: 'Name', dataIndex: 'username' },
        { title: 'Email', dataIndex: 'email' },
        {
            title: 'Doctor',
            dataIndex: 'isDoctor',
            render: (text, record) => (
                <span>{record.isDoctor ? 'Yes' : 'No'}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            render: (text, record) => (
                <span>{record.is_active ? 'Active' : 'Blocked'}</span>
            )
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div>
                    {record.is_active ? (
                        <button className='btn btn-danger' onClick={() => handleAccountStatusChange(record._id, true, record.email)}>Block</button>
                    ) : (
                        <button className='btn btn-success' onClick={() => handleAccountStatusChange(record._id, false, record.email)}>Activate</button>
                    )}
                </div>
            ),
        }
    ];


    return (
        <Layout>
            <h1 className='text-center m-2'>Users List</h1>
            <Table columns={columns} dataSource={users} rowKey="_id" />
        </Layout>
    );
};


export default Users;