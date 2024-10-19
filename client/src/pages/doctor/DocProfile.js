import React,{useState, useEffect}  from 'react'
import {Layout} from '../../components/Layout'
import { Col, Form, Input, message, Row, TimePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment';

const DocProfile = () => {
    const {user} = useSelector(state => state.user)
    const [doctor, setDoctor] = useState(null)
    const params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    //handle form
    const handleFinish = async (values) => {
      try{
          //console.log(values);
          dispatch(showLoading());
          const res  = await axios.post('/api/v1/doctor/updateProfile', {
            ...values, 
            userId: user._id, 
            timings: [
              moment(values.timings[0]).format("HH:mm"),
              moment(values.timings[1]).format("HH:mm")
            ]}, 
            {
               headers:{
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               },
          })
          dispatch(hideLoading());
          if(res.data.success){
              message.success(res.data.message)
              navigate('/')
          }else{
              message.error(res.data.success)
          }
      }catch(err){
          dispatch(hideLoading());
          //console.log(err);
          message.error('Something Went Wrong')
      }
  }

    //getDoctorInfo
    //console.log(params.id);
    const getDoctorInfo = async () => {
        try{
            const res = await axios.post('/api/v1/doctor/getDoctorInfo', {
                userId: params.id
            },{
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              });

            if(res.data.success){
                setDoctor(res.data.doctor)
            }
        }catch(err){
            //console.log(err);
        }
    }

    useEffect(() => {
        getDoctorInfo()
    },[])
  return (
    <Layout>
        <h1>Manage Profile</h1>
        {doctor && (
          <Form layout="vertical" onFinish={handleFinish} className='m-3' initialValues={{...doctor, timings: [moment(doctor.timings[0], 'HH:mm'),moment(doctor.timings[1], 'HH:mm')]}}>
          <h4>Personal Details : </h4>
              <Row gutter={20}>
                  <Col xs={24} md={24} lg={8}>
                      <Form.Item label="First Name" name="first_name" required rules={[{required:true}]}>
                          <Input type="text" placeholder='Your First Name' />
                      </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                      <Form.Item label="Last Name" name="last_name" required rules={[{required:true}]}>
                          <Input type="text" placeholder='Your Last Name' />
                      </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                      <Form.Item label="Contact No" name="contact_number" required rules={[{required:true}]}>
                          <Input type="number" placeholder='Your Contact No.' />
                      </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                      <Form.Item label="Email" name="email" required rules={[{required:true}]}>
                          <Input type="email" placeholder='Your Email Address' />
                      </Form.Item>  
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                      <Form.Item label="Address" name="address" required rules={[{required:true}]}>
                          <Input type="text" placeholder='Your Clinic Address' />
                      </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                      <Form.Item label="Website" name="website" rules={[{required:false}]}>
                          <Input type="text" placeholder='Your Website' />
                      </Form.Item>
                  </Col>
              </Row><br/>
              <h4>Professional Details</h4>
              <Row gutter={20}>
                  <Col xs={24} md={24} lg={8}>
                      <Form.Item label="Specialization" name="specialization" required rules={[{required:true}]}>
                          <Input type="text" placeholder='Your Specialization' />
                      </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                      <Form.Item label="Experiance" name="years_of_experience" required rules={[{required:true}]}>
                          <Input type="number" placeholder='Your Experiance' />
                      </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                      <Form.Item label="Fees Per Consaltation" name="fees" required rules={[{required:true}]}>
                          <Input type="number" placeholder='Your Fees' />
                      </Form.Item>
                  </Col>
                  <Col xs={24} md={24} lg={8}>
                            <Form.Item label="Timings" name="timings" rules={[{ required: true }]}>
                                <TimePicker.RangePicker format="HH:mm" />
                            </Form.Item>
                    </Col>
                  <Col xs={24} md={24} lg={8}></Col>
                  <Col xs={24} md={24} lg={8}>
                      <button className='btn btn-primary form-btn' type="submit">Update</button>
                  </Col>
              </Row>
          </Form>
        )}
    </Layout>
    
  )
}

export default DocProfile