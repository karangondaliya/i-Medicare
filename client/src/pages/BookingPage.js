import React, {useState, useEffect} from 'react'
import {Layout} from '../components/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DatePicker, message, TimePicker } from 'antd';
import moment from 'moment';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { useDispatch, useSelector } from 'react-redux'

const BookingPage = () => {

    const {user} = useSelector(state => state.user)
    const [doctor, setDoctor] = useState([]);
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [isAvailable, setIsAvailable] = useState();
    const params = useParams();
    const dispatch = useDispatch();
    //Login User Data
    const getUserData = async () => {
        try {
            const res = await axios.post('/api/v1/doctor/getDoctorById', {doctorId: params.doctorId}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })
            if(res.data.success){
                setDoctor(res.data.data);
            }
        } catch (err) {
            //console.log(err);
        }
    }
    //Booking Function
    const handleBooking = async () => {
        try{
            setIsAvailable(true);
            if(!date && !time) {
                return alert('Date & Time Required')
            }
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/book-appointment', {
                doctor_id: params.doctorId,
                user_id: user._id,
                doctorInfo: doctor,
                userInfo: user,
                date : date,
                time: time
            }, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(hideLoading())
            if((await res).data.success){
                message.success((await res).data.message)
            }
        }catch(err){
            dispatchEvent(hideLoading());
            //console.log(err);
        }
    }

    const handleAvailabilty = async () => {
        try{
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/booking-availability',
                {
                    doctor_id: params.doctorId,
                    date,
                    time
                },
                {
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if(res.data.success){
                setIsAvailable(true)
                message.success(res.data.message)
            }else{
                message.success(res.data.message)
            }
            dispatch(hideLoading())
        }catch(err){
            dispatch(hideLoading())
            //console.log(err);

        }
    }
    useEffect(() => {
        getUserData();
    }, []);

  return (
    <Layout>
        <center>
        <h2>Appointment Booking Page</h2><br/><br/>
        <div className='container m-2'>
            {doctor && (
                <div>
                    <h4>Dr. {doctor.first_name} {doctor.last_name}</h4>
                    <h4>Fees Per Consultation: {doctor.fees}</h4>
                    {/* <h4>Timings: {doctor.timings[0]} - { doctor.timings[1]}</h4> */}

                    <div className='d-flex flex-column w-50'>
                        <DatePicker aria-required={true} className='m-2' format="DD-MM-YY" onChange={(value) =>{
                            //setIsAvailable(false) 
                            setDate(moment(value).format('DD-MM-YYYY'))
                        } }/>
                        <TimePicker aria-required={true} className='m-2' format="HH:mm" onChange={(value) => {
                            //setIsAvailable(false)
                            setTime(
                                moment(value).format('HH:mm')
                            )
                        } } />
                        <button className='btn btn-primary mt-2' onClick={handleAvailabilty}>Check Availability</button>
                        <button className='btn btn-dark mt-2' onClick={handleBooking}>Book Now</button>
                        {/* {isAvailable && (
                            
                        )} */}
                    </div>
                </div>
            )}
        </div>
        </center>
    </Layout>
    
  )
}

export default BookingPage