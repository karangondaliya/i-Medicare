import React, {useState, useEffect} from 'react'
import {Layout} from '../../components/Layout'
import axios from 'axios'
import { message, Table } from 'antd'


const Doctors = () => {

  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try{
      const res = await axios.get('/api/v1/admin/getAllDoctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        setDoctors(res.data.data)
      }
    }catch(e){
      //console.log(e)
    }
  }

  const handleAccountStatus = async (record, status) => {
    //console.log(record);
    try{
      const res = await axios.post('/api/v1/admin/changeAccountStatus', {
        doctorId: record._id,
        userId: record.userId,
        status: status
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if(res.data.success){
        message.success(res.data.message)
        window.location.reload()
      }else{
        message.error(res.data.message) 
      }
    }catch(err){
      message.error('Something Went Wrong')
    }
  }

  useEffect(() => {
    getDoctors()
  }, [])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <span>{record.first_name} {record.last_name}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'Phone',
      dataIndex: 'contact_number'
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
          <div>
            {record.status === 'pending' ? (<button className='btn btn-success' onClick={ () => handleAccountStatus(record, "approved")}>Approve</button>): (<button className='btn btn-danger'>Reject</button> )}
          </div>
      ),
    }
  ]

  return (
    <Layout>
        <h1>Doctors List</h1>
        <Table columns={columns} dataSource={doctors}/>
    </Layout>
  )
}

export default Doctors