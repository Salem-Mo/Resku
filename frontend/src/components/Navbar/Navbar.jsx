import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../store/authStore";
import cookies from 'js-cookie';
import i18n from "i18next";
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import UserAvatar from '../UserAvatar';


const Navbar = () => {
    const { user, logout } = useAuthStore();
    const lng = cookies.get('i18next') || 'en';
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLangDropdown, setShowLangDropdown] = useState(false);

    const handleMouseEnter = () => setShowDropdown(true);
    const handleMouseLeave = () => setShowDropdown(false);

    const handleLangMouseEnter = () => setShowLangDropdown(true);
    const handleLangMouseLeave = () => setShowLangDropdown(false);

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
        cookies.set('i18next', language);
        setShowLangDropdown(false);
    };

    const goToProfile = () => navigate('/profile');
    const goToChat = () => navigate('/chat');
    const handleLogout = () => logout();

    return (
        <nav className="navbar">
            <div className="logo">ReskU</div>
            <div className="nav-items">
                <div
                    className="profile-container"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="profile-icon">
                        {/* <img
                            src={profileImg}
                            alt="Profile Icon"
                            className="profile-img"
                        /> */}
                        <UserAvatar currentUser={user}/>
                    </div>
                    {showDropdown && (
                        <div className="dropdown-menu" >
                            <ul>
                                <p className="user-name">{user.name}</p>
                                <li onClick={goToProfile}>{i18n.t('Profile')}</li>
                                {/* <li>{i18n.t('Settings')}</li> */}
                                <li onClick={goToChat}>{i18n.t('Chat')}</li>
                                <li onClick={handleLogout}>{i18n.t('Logout')}</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div
                    className="language-container"
                    onMouseEnter={handleLangMouseEnter}
                    onMouseLeave={handleLangMouseLeave}
                >
                    <PublicOutlinedIcon className="language-icon" />
                    {showLangDropdown && (
                        <div className="language-dropdown">
                            <ul>
                                <li onClick={() => changeLanguage('en')}>
                                    <div>
                                        <img src="/english-icon.png" alt="" />
                                        <span>English</span>
                                    </div>
                                </li>
                                <li onClick={() => changeLanguage('ar')}>
                                    <div>
                                        <img src="/ar-icon.png" alt="" />
                                        <span>Arabic</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
