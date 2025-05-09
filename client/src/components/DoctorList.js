import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const DoctorList = ({doctor}) => {
    const navigate = useNavigate();
    
    // Function to format timings properly
    const formatTimings = (timings) => {
        if (!timings) return '';
        
        // Case 1: Simple string format like "09:00 - 11:00"
        if (typeof timings === 'string') return timings;
        
        // Case 2: Object with start and end properties
        if (timings.start && timings.end) return `${timings.start} - ${timings.end}`;
        
        // Case 3: Array with two ISO date strings
        if (Array.isArray(timings) && timings.length === 2) {
            return `${timings[0]} - ${timings[1]}`;
        }
        
        // Case 4: ISO date strings in object format
        if (typeof timings === 'object') {
            let start = '';
            let end = '';
            
            // Try to extract time from various formats
            if (timings[0]) {
                start = moment(timings[0]).format('HH:mm');
            } else if (timings.start) {
                start = moment(timings.start).isValid() ? moment(timings.start).format('HH:mm') : timings.start;
            }
            
            if (timings[1]) {
                end = moment(timings[1]).format('HH:mm');
            } else if (timings.end) {
                end = moment(timings.end).isValid() ? moment(timings.end).format('HH:mm') : timings.end;
            }
            
            if (start && end) return `${start} - ${end}`;
        }
        
        return 'Time not available';
    };
    
    return (
        <>
            <div className='card m-2' style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}>
                <div className='card-header'>
                    <b>Dr. {doctor.first_name} {doctor.last_name}</b>
                </div>
                <div className='card-body' style={{ flex: 1 }}>
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
                        <b>Timings:</b> {formatTimings(doctor.timings)}
                    </p>
                </div>
            </div>
        </>
    );
}

export default DoctorList;