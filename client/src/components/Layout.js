import React from 'react';
import '../styles/LayoutStyles.css';
import { message, Badge } from 'antd';
import { adminMenu, userMenu } from '../Data/data';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Layout = ({ children }) => {
    const { user } = useSelector(state => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
        localStorage.clear();
        message.success('Logout Successfully');
        navigate('/login');
    };

    //----------------------------Doctor Menu-----------------
    const doctorMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'fa-solid fa-house',
        },
        {
            name: 'Appointments',
            path: '/doctor-appointments',
            icon: 'fa-solid fa-list',
        },
        {
            name: 'Profile',
            path: `/doctor/DocProfile/${user?._id}`,
            icon: 'fa-solid fa-user',
        },
        {
            name: 'Add Records',
            path: `/doctor/AddRecords`,
            icon: 'fa-solid fa-plus',
        },
        {
            name: 'Patient Records',
            path: `/admin/allmedicalhistory`,
            icon: 'fa-solid fa-file',
        },
        {
            name: 'Organ Donations',
            path: '/admin/organdonationsdetails',
            icon: 'fa-solid fa-hand-holding-medical',
        },

        {
            name: 'About Us',
            path: '/about-us',
            icon: 'fa-solid fa-info-circle' // Change this to the info circle icon
        },
    
    ];

    // Rendering menu list
    const SidebarMenu = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;

    // Determine user type for the header
    const userType = user?.isAdmin
        ? 'Admin Side'
        : user?.isDoctor
        ? 'Doctor Side'
        : 'Patient Side';

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
                            {SidebarMenu.map((menu) => {
                                const isActive = location.pathname === menu.path;
                                return (
                                    <div className={`menu-item ${isActive && 'active'}`} key={menu.name}>
                                        <i className={menu.icon}></i>
                                        <Link to={menu.path}> {menu.name} </Link>
                                    </div>
                                );
                            })}
                            <div className="menu-item" onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <Link to="/login"> Logout </Link>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="header">
                            <div className="header-content">
                                {/* Left side: Notification */}
                                <div className="header-left" style={{ cursor: 'pointer' }}>
                                    <Badge
                                        count={user && user.notification.length}
                                        onClick={() => {
                                            navigate('/notification');
                                        }}
                                    >
                                        <i className="fa-solid fa-bell"></i>
                                    </Badge>
                                </div>

                                {/* Middle: User Type */}
                                <div className="header-center">
                                    <span>{userType}</span> {/* Display the user type here */}
                                </div>

                                {/* Right side: Profile */}
                                <div className="header-right">
                                    <Link to="/profile">{user?.username}</Link>
                                </div>
                            </div>
                        </div>
                        <div className="body">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};
