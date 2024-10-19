import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import { setUser } from '../redux/features/UserSlice';
import { get } from 'mongoose';
import axios from 'axios';
import { use } from 'bcrypt/promises';

export default function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);

    //get user
    const getUser = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/getUserData', { token: localStorage.getItem('token') }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            dispatch(hideLoading());
            if (res.data.success) {
                dispatch(setUser(res.data.data));
            } else {
                navigate('/login');
                localStorage.clear();
            }
        } catch (err) {
            localStorage.clear();
            //console.log(err);
        }
    };

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user, getUser])

    if (localStorage.getItem('token')) {
        return children;
    } else {
        return <Navigate to="/login" />
    }
}
