import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// i18n
import { withTranslation } from "react-i18next";

// users
import avatar2 from '../../../assets/images/users/avatar-2.jpg';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ t }) => {
    const [menu, setMenu] = useState(false);
    const [userRoles, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        const authUser = localStorage.getItem('authUser');
        if (!authUser) {
            navigate("/auth/login"); // Redirect to login if not authenticated
        } else {
            fetchUserRole();
        }
    }, [navigate]); // Adding navigate to dependency array

    const fetchUserRole = () => {
        const authUser = localStorage.getItem("authUser");
        const userRole = JSON.parse(authUser).role;
        setRole(userRole);
        console.log("userRole", userRole);
        if (userRole) {
            return { userRole }; // Correctly formats the Authorization header
          } else {
            return { userRole };
          }
    }
    const toggle = () => {
        setMenu(prevMenu => !prevMenu);
    };

    let role = "User";

    // Update username and email if user data exists
    if (userRoles) {
        role = userRoles;
    }

    return (
        <React.Fragment>
            <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block user-dropdown">
                <DropdownToggle tag="button" className="btn header-item waves-effect" id="page-header-user-dropdown">
                    <img className="rounded-circle header-profile-user me-1" src={avatar2} alt="Header Avatar" />
                    <span className="d-none d-xl-inline-block ms-1 text-transform">{role}</span>
                    <i className="mdi mdi-chevron-down d-none ms-1 d-xl-inline-block"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem href="#"><i className="ph-bold ph-user align-middle me-1"></i> {t('Profile')}</DropdownItem>
                    <DropdownItem className="d-block" href="#"><span className="badge badge-success float-end mt-1">11</span><i className="ph-bold ph-gear align-middle me-1"></i> {t('Settings')}</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem className="text-danger" href="/logout"><i className="ri-shut-down-line align-middle me-1 text-danger"></i> {t('Logout')}</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
}

export default withTranslation()(ProfileMenu);
