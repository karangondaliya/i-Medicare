// import React, {useState, useEffect} from 'react'
// import {Layout} from '../components/Layout';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { DatePicker, message, TimePicker } from 'antd';
// import moment from 'moment';
// import { showLoading, hideLoading } from '../redux/features/alertSlice';
// import { useDispatch, useSelector } from 'react-redux'

// const BookingPage = () => {

//     const {user} = useSelector(state => state.user)
//     const [doctor, setDoctor] = useState([]);
//     const [date, setDate] = useState();
//     const [time, setTime] = useState();
//     const [isAvailable, setIsAvailable] = useState();
//     const params = useParams();
//     const dispatch = useDispatch();
//     //Login User Data
//     const getUserData = async () => {
//         try {
//             const res = await axios.post('/api/v1/doctor/getDoctorById', {doctorId: params.doctorId}, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 }
//             })
//             if(res.data.success){
//                 setDoctor(res.data.data);
//             }
//         } catch (err) {
//             //console.log(err);
//         }
//     }
//     //Booking Function
//     const handleBooking = async () => {
//         try{
//             if(!date && !time) {
//                 return alert('Date & Time Required');
//             }
            
//             // Check if the selected time is in the past
//             const selectedDateTime = moment(date + ' ' + time, 'DD-MM-YYYY HH:mm');
//             const now = moment();
            
//             if(selectedDateTime.isBefore(now)) {
//                 return message.error('Cannot book an appointment in the past');
//             }
            
//             // First check availability
//             dispatch(showLoading());
//             const availRes = await axios.post('/api/v1/user/booking-availability',
//                 {
//                     doctor_id: params.doctorId,
//                     date,
//                     time
//                 },
//                 {
//                     headers:{
//                         Authorization: `Bearer ${localStorage.getItem('token')}`
//                     }
//                 }
//             );
            
//             if(!availRes.data.success || availRes.data.message !== 'Appointment Available') {
//                 dispatch(hideLoading());
//                 return message.error('This slot is not available');
//             }
            
//             // If available, proceed with booking
//             const bookRes = await axios.post('/api/v1/user/book-appointment', {
//                 doctor_id: params.doctorId,
//                 user_id: user._id,
//                 doctorInfo: doctor,
//                 userInfo: user,
//                 date: date,
//                 time: time
//             }, {
//                 headers:{
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
            
//             dispatch(hideLoading());
//             if(bookRes.data.success){
//                 setIsAvailable(true);
//                 message.success(bookRes.data.message);
//             }
//         } catch(err) {
//             dispatch(hideLoading()); // Fixed from dispatchEvent to dispatch
//             message.error('Something went wrong');
//         }
//     }
//     const handleAvailabilty = async () => {
//         try{
//             if(!date && !time) {
//                 return alert('Date & Time Required');
//             }
//             dispatch(showLoading())
//             const res = await axios.post('/api/v1/user/booking-availability',
//                 {
//                     doctor_id: params.doctorId,
//                     date,
//                     time
//                 },
//                 {
//                     headers:{
//                         Authorization: `Bearer ${localStorage.getItem('token')}`
//                     }
//                 }
//             )
//             if(res.data.success){
//                 if(res.data.message === 'Appointment Available') {
//                     setIsAvailable(true);
//                     message.success(res.data.message);
//                 } else {
//                     setIsAvailable(false);
//                     message.error(res.data.message);
//                 }
//             }
//             dispatch(hideLoading())
//         }catch(err){
//             dispatch(hideLoading())
//             //console.log(err);

//         }
//     }
//     useEffect(() => {
//         getUserData();
//     }, []);

//     const disabledDate = (current) => {
//         return current && current < moment().startOf('day'); // Disable all dates before today
//       };

//   return (
//     <Layout>
//         <center>
//         <h2>Appointment Booking</h2><br/><br/>
//         <div className='container m-2'>
//             {doctor && (
//                 <div>
//                     <h4>Dr. {doctor.first_name} {doctor.last_name}</h4>
//                     <h4>Fees Per Consultation: {doctor.fees}</h4>
//                     {/* <h4>Timings: {doctor.timings[0]} - { doctor.timings[1]}</h4> */}

//                     <div className='d-flex flex-column w-50'>
//                         <DatePicker aria-required={true} className='m-2' format="DD-MM-YY"  disabledDate={disabledDate} onChange={(value) =>{
//                             //setIsAvailable(false) 
//                             setDate(moment(value).format('DD-MM-YYYY'))
//                         } }/>
//                         <TimePicker aria-required={true} className='m-2' format="HH:mm" onChange={(value) => {
//                             //setIsAvailable(false)
//                             setTime(
//                                 moment(value).format('HH:mm')
//                             )
//                         } } />
//                         <button className='btn btn-primary mt-2' onClick={handleAvailabilty}>Check Availability</button>
//                         <button className='btn btn-dark mt-2' onClick={handleBooking}>Book Now</button>
//                         {/* {isAvailable && (
                            
//                         )} */}
//                     </div>
//                 </div>
//             )}
//         </div>
//         </center>
//     </Layout>
    
//   )
// }

// export default BookingPage





import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DatePicker, TimePicker, Card, message, Spin } from 'antd';
import { UserOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/BookingPage.css';

const BookingPage = () => {
    const { user } = useSelector(state => state.user);
    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [selectedDateMoment, setSelectedDateMoment] = useState(null);
    const [selectedTimeMoment, setSelectedTimeMoment] = useState(null);
    const [isAvailable, setIsAvailable] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Login User Data
    const getUserData = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post('/api/v1/doctor/getDoctorById', 
                { doctorId: params.doctorId }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                }
            );
            if (res.data.success) {
                setDoctor(res.data.data);
            }
        } catch (err) {
            message.error('Error fetching doctor details');
        } finally {
            setIsLoading(false);
        }
    }

    //Booking Function
    const handleBooking = async () => {
        try {
            if (!date || !time) {
                return message.error('Please select both date and time');
            }
            
            const selectedDateTime = moment(date + ' ' + time, 'DD-MM-YYYY HH:mm');
            const now = moment();
            
            if (selectedDateTime.isBefore(now)) {
                return message.error('Cannot book an appointment in the past');
            }

            // Show confirmation dialog
            if (!window.confirm('Are you sure you want to book this appointment?')) {
                return;
            }
            
            dispatch(showLoading());
            const bookRes = await axios.post('/api/v1/user/book-appointment', {
                doctor_id: params.doctorId,
                user_id: user._id,
                doctorInfo: doctor,
                userInfo: user,
                date: date,
                time: time
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            dispatch(hideLoading());
            if (bookRes.data.success) {
                message.success('Appointment booked successfully!');
                navigate('/appointments'); // Redirect to appointments page
            }
        } catch (err) {
            dispatch(hideLoading());
            message.error('Error booking appointment. Please try again.');
        }
    };

    const handleAvailability = async () => {
        try {
            if (!date || !time) {
                return message.error('Please select both date and time');
            }

            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/booking-availability',
                {
                    doctor_id: params.doctorId,
                    date,
                    time
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (res.data.success) {
                setIsAvailable(res.data.message === 'Appointment Available');
                message[res.data.message === 'Appointment Available' ? 'success' : 'error'](res.data.message);
            }
            dispatch(hideLoading());
        } catch (err) {
            dispatch(hideLoading());
            message.error('Error checking availability');
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const disabledDate = (current) => {
        // Disable dates before today and after 30 days from now
        return (
            current && 
            (current < moment().startOf('day') || 
             current > moment().add(30, 'days'))
        );
    };

    const disabledTime = (selectedTime) => {
        const hours = moment(selectedTime).hours();
        // Disable times outside of 9 AM to 5 PM
        return hours < 9 || hours >= 17;
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="loading-container">
                    <Spin size="large" />
                    <p>Loading doctor details...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="booking-container">
                <h2 className="booking-title">Appointment Booking</h2>
                
                {doctor && (
                    <div className="doctor-booking-card">
                        <Card className="doctor-detail-card">
                            <div className="doctor-profile">
                                <div className="doctor-avatar">
                                    <UserOutlined />
                                </div>
                                <div className="doctor-info">
                                    <h3 className="doctor-name">
                                        Dr. {doctor.first_name} {doctor.last_name}
                                    </h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <strong>Specialization:</strong>
                                            <span>{doctor.specialization}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Experience:</strong>
                                            <span>{doctor.experience} years</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Fees:</strong>
                                            <span>${doctor.fees}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Available Hours:</strong>
                                            <span>{doctor.timings?.[0]} - {doctor.timings?.[1]}</span>
                                        </div>
                                        <div className="info-item">
                                            <strong>Phone:</strong>
                                            <span>{doctor.phone}</span>
                                        </div>
                                        <div className="info-item full-width">
                                            <strong>Address:</strong>
                                            <span>{doctor.address}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="booking-section">
                                <h4 className="booking-section-title">
                                    Schedule Your Appointment
                                </h4>
                                <div className="date-time-picker">
                                    <div className="picker-container">
                                        <CalendarOutlined className="picker-icon" />
                                        <DatePicker
                                            className="date-picker"
                                            format="DD-MM-YYYY"
                                            disabledDate={disabledDate}
                                            value={selectedDateMoment}
                                            onChange={(value) => {
                                                setSelectedDateMoment(value);
                                                if (value) {
                                                    setDate(moment(value).format('DD-MM-YYYY'));
                                                }
                                            }}
                                            placeholder="Select Date"
                                        />
                                    </div>
                                    <div className="picker-container">
                                        <ClockCircleOutlined className="picker-icon" />
                                        <TimePicker
                                            className="time-picker"
                                            format="HH:mm"
                                            value={selectedTimeMoment}
                                            onChange={(value) => {
                                                setSelectedTimeMoment(value);
                                                if (value) {
                                                    setTime(moment(value).format('HH:mm'));
                                                }
                                            }}
                                            minuteStep={30}
                                            hideDisabledOptions
                                            placeholder="Select Time"
                                        />
                                    </div>
                                </div>

                                {isAvailable !== null && (
                                    <div className={`availability-status ${isAvailable ? 'available' : 'unavailable'}`}>
                                        {isAvailable ? 'This slot is available!' : 'This slot is not available'}
                                    </div>
                                )}

                                <div className="booking-buttons">
                                    <button 
                                        className="check-availability-btn"
                                        onClick={handleAvailability}
                                        disabled={!date || !time}
                                    >
                                        Check Availability
                                    </button>
                                    <button 
                                        className="book-now-btn"
                                        onClick={handleBooking}
                                        disabled={!isAvailable || !date || !time}
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BookingPage;    