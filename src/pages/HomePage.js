import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { Row, Col } from 'antd';
import DoctorList from '../components/DoctorList';

const HomePage = () => {

    const [doctors, setDoctors] = useState([]);
    //Login User Data
    const getUserData = async () => {
        try {
            const res = await axios.get('/api/v1/user/getAllDoctors', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token'),
                }
            })
            if(res.data.success){
                setDoctors(res.data.data);
            }
        } catch (err) {
            //console.log(err);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);
    
    return (
        <Layout>
            <h2 className='text-center'>Home Page</h2>
            <Row gutter={16}>
                {
                    doctors && doctors.map(doctor => (
                        <Col span={8} key={doctor._id} className='mt-2'>
                            <DoctorList doctor={doctor}/> 
                        </Col>
                    ))
                }
            </Row>
        </Layout>
    )
}

export default HomePage;
