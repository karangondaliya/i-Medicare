import React from 'react'
import '../styles/LayoutStyles.css'
import { message, Badge } from 'antd'
import { adminMenu, userMenu } from '../Data/data'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';

export const Layout = ({ children }) => {
    const { user } = useSelector(state => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    //logout function
    const handleLogout = () => {
        localStorage.clear();
        message.success('Logout Successfully');
        navigate('/login');
    }

    //----------------------------Doctor Menu-----------------
const doctorMenu = [
    {
        name: 'Home',
        path: '/',
        icon: 'fa-solid fa-house'
    },
    {
        name: 'Appointments',
        path: '/doctor-appointments',
        icon: 'fa-solid fa-list'
    },
    {
        name: 'Profile',
        path: `/doctor/DocProfile/${user?._id}`,
        icon: 'fa-solid fa-user'
    },
    {
        name: 'Add Records',
        path: `/doctor/AddRecords`,
        icon: 'fa-solid fa-user'
    },
    {
        name: 'Pation Records',
        path: `/admin/allmedicalhistory`,
        icon: 'fa-solid fa-user'
    },
    {
        name: 'OrganDonationsList',
        path: '/admin/organdonationsdetails',
        icon: 'fa-solid fa-user'
    },
]

    //rendering menu list
    const SidebarMenu = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
    return (
        <>
            <div className="main">
                <div className="layout">
                    <div className="sidebar">
                        <div className="logo">
                            <h6>i-Medicare</h6>
                        </div>
                        <hr />
                        <div className="menu">
                            {SidebarMenu.map(menu => {
                                const isActive = location.pathname === menu.path;
                                return (
                                    <>
                                        <div className={`menu-item ${isActive && "active"}`}>
                                            <i className={menu.icon}></i>
                                            <Link to={menu.path}> {menu.name} </Link>
                                        </div>
                                    </>
                                )
                            })}
                            <div className={`menu-item`} onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <Link to="/login"> Logout </Link>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="header">
                            <div className="header-content" style={{cursor: "pointer"}}>
                                <Badge count={user && user.notification.length} onClick={() => {navigate('/notification');}}>
                                    <i className="fa-solid fa-bell"></i>
                                </Badge>
                                <Link to="/profile">{user?.username}</Link>
                            </div>
                        </div>
                        <div className="body">{children}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
