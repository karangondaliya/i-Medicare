import React, {useState, useEffect} from 'react'
import { Layout } from '../components/Layout'
import axios from 'axios'
import moment from 'moment'
import { Table } from 'antd'

const Appointments = () => {

    const [appointments, setAppointments] = useState([])

    const getAppointments = async () => {
        try{
            const res = await axios.get('/api/v1/user/user-appointment', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if(res.data.success){
                setAppointments(res.data.data)
            }
        }catch(err){
            //console.log(err);
        }
    }

    useEffect(() => {
        getAppointments();
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <span>
                    {record.doctorInfo.first_name} {record.doctorInfo.last_name}
                </span>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'contact_number',
            render: (text, record) => (
                <span>
                    {record.doctorInfo.contact_number}
                </span>
            )
        },
        {
            title: 'Date & Time',
            dataIndex: 'date',
            render: (text, record) => (
                <span>
                    {moment(record.date).format('DD-MM-YYYY')} &nbsp;
                    {moment(record.time).format('HH:mm')}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status', 
        },
        
    ]
  return (
    <Layout>
        <h1 className='text-center'>Appointments Lists</h1>
        <Table columns={columns} dataSource={appointments} />
    </Layout>
  )
}

export default Appointments