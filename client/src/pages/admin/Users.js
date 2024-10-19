import React, {useState, useEffect} from 'react'
import {Layout} from '../../components/Layout'
import axios from 'axios'
import { Table } from 'antd'

const Users = () => {
  const [users, setUsers] = useState([])

  const getUsers = async () => {
    try{
      const res = await axios.get('/api/v1/admin/getAllUsers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        setUsers(res.data.data)
      }
    }catch(e){
      //console.log(e)
    }
  }

  useEffect(() => {
    getUsers()
  },[])

  //antD table col
  const columns = [
    {title: 'Name',
    dataIndex: 'username',},
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Doctor',
      dataIndex: 'isDoctor',
      render: (text, record) => (
        <span>{record.isDoctor? 'Yes' : 'No'}</span>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
          <div>
            <button className='btn btn-danger'>Block</button>
          </div>
      ),
    }
  ]

  return (
    <Layout>
        <h1 className='text-center m-2'>Users List</h1>
        <Table columns={columns} dataSource={users}/>
    </Layout>
  )
}

export default Users