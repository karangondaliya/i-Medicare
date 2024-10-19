import React from 'react'
import { useNavigate } from 'react-router-dom';

const DoctorList = ({doctor}) => {

    const navigate = useNavigate();
  return (
    <>
        <div className='card m-2' style={{cursor: 'pointer'}} onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}>
            <div className='card-header'>
                Dr. {doctor.first_name} {doctor.last_name}
            </div>
            <div className='card-body'>
                <p>
                    <b>Specialization:</b> {doctor.specialization}
                </p>
                <p>
                    <b>Experience:</b> {doctor.years_of_experience} Years
                </p>
                <p>
                    <b>Fees Per Consultation:</b> {doctor.fees}
                </p>
                <p>
                    <b>Timings</b> {doctor.timings[0]} - {doctor.timings[1]}
                </p>
            </div>
        </div>
    </>
  )
}

export default DoctorList