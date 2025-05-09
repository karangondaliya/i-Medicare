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
            if(!date && !time) {
                return alert('Date & Time Required');
            }
            
            // Check if the selected time is in the past
            const selectedDateTime = moment(date + ' ' + time, 'DD-MM-YYYY HH:mm');
            const now = moment();
            
            if(selectedDateTime.isBefore(now)) {
                return message.error('Cannot book an appointment in the past');
            }
            
            // First check availability
            dispatch(showLoading());
            const availRes = await axios.post('/api/v1/user/booking-availability',
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
            );
            
            if(!availRes.data.success || availRes.data.message !== 'Appointment Available') {
                dispatch(hideLoading());
                return message.error('This slot is not available');
            }
            
            // If available, proceed with booking
            const bookRes = await axios.post('/api/v1/user/book-appointment', {
                doctor_id: params.doctorId,
                user_id: user._id,
                doctorInfo: doctor,
                userInfo: user,
                date: date,
                time: time
            }, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            dispatch(hideLoading());
            if(bookRes.data.success){
                setIsAvailable(true);
                message.success(bookRes.data.message);
            }
        } catch(err) {
            dispatch(hideLoading()); // Fixed from dispatchEvent to dispatch
            message.error('Something went wrong');
        }
    }
    const handleAvailabilty = async () => {
        try{
            if(!date && !time) {
                return alert('Date & Time Required');
            }
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
                if(res.data.message === 'Appointment Available') {
                    setIsAvailable(true);
                    message.success(res.data.message);
                } else {
                    setIsAvailable(false);
                    message.error(res.data.message);
                }
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

    const disabledDate = (current) => {
        return current && current < moment().startOf('day'); // Disable all dates before today
      };

  return (
    <Layout>
        <center>
        <h2>Appointment Booking</h2><br/><br/>
        <div className='container m-2'>
            {doctor && (
                <div>
                    <h4>Dr. {doctor.first_name} {doctor.last_name}</h4>
                    <h4>Fees Per Consultation: {doctor.fees}</h4>
                    {/* <h4>Timings: {doctor.timings[0]} - { doctor.timings[1]}</h4> */}

                    <div className='d-flex flex-column w-50'>
                        <DatePicker aria-required={true} className='m-2' format="DD-MM-YY"  disabledDate={disabledDate} onChange={(value) =>{
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