import React from 'react'
import { Layout } from '../components/Layout';
import { Form } from 'antd';

const Profile = () => {

    const handleFinish = (values) => {
        console.log(values);
    }

  return (
    <Layout>
        <h4 className='text-center'>Profile Page</h4>

        <Form layout='vertical' onFinish={handleFinish} className='m-3'>
        </Form>

    </Layout>
  )
}

export default Profile