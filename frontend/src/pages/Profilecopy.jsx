// import { motion } from "framer-motion";
// import { useAuthStore } from "../store/authStore";
// import { formatDate } from "../utils/date";
// import { useTranslation } from "react-i18next";
// import './styles/Profile.css';
// import { useNavigate } from "react-router-dom";

// import { ArrowBackIos, Add, DeleteOutline } from "@mui/icons-material";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import Select from 'react-select';
// import countries from 'world-countries';
// import Flag from 'react-world-flags';
// import toast from "react-hot-toast";

// import Cookies from 'js-cookie';
// import React, { useEffect, useState, useRef } from "react";
// import {ServerUrl} from '@/utils/constants';

// const Profile = () => {
// 	const { updateProfile, addProfileImg, delProfileImg, error, isLoading, message ,  user, logout  } = useAuthStore();
// 	const token = Cookies.get("token");
// 	const { t } = useTranslation();
// 	const navigate = useNavigate();
// 	const [userImg, setUserImg] = useState(user?.userImage  || null);
//   const [selectedCountry, setSelectedCountry] = useState(user.country);
// 	const [hovered, setHovered] = useState(null);
// 	const fileInputRef = useRef(null);
// 	const Host = `${ServerUrl}/`;
// 	const colors = [
// 		"bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
// 		"bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
// 		"bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
// 		"bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]"
// 	];
// 	const [selectedColor, setSelectedColor] = useState(user.color ||Cookies.get('selectedColor') || colors[0]);
// 	const getColor = (index) => {
// 		return index !== undefined ? colors[index] : selectedColor;
// 	};

// 	const [userName, setUserName] = useState(user.name);

// 	const handleLogout = () => {
// 		logout();
// 		Cookies.remove('selectedCountry');
// 	};

// 	useEffect(() => {
		
// 		const savedCountry = Cookies.get('selectedCountry') || user.country;
// 		if (savedCountry) {
// 			setSelectedCountry(options.find(option => option.value === savedCountry) || null);
// 		}
// 	}, []);

// 	const options = countries.map((country) => ({
// 		value: country.cca2,
// 		label: t(`${country.name.common}`),
// 		flag: country.cca2.toLowerCase(),
// 	}));

// 	const customOption = (props) => (
// 		<div
// 			{...props.innerProps}
// 			style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
// 		>
// 			<Flag code={props.data.flag} style={{ width: 20, marginRight: 10 }} />
// 			{props.data.label}
// 		</div>
// 	);

// 	const customStyles = {
// 		control: (provided) => ({
// 			...provided,
// 			backgroundColor: '#1f2937',
// 			border: 'none',
// 			borderRadius: '0.5rem',
// 			padding: '0.5rem',
// 			boxShadow: 'none',
// 			color: '#f9fafb',
// 			width: '100%',
// 			cursor: 'pointer',
// 		}),
// 		menu: (provided) => ({
// 			...provided,
// 			backgroundColor: '#1f2937',
// 			borderRadius: '0.5rem',
// 			overflow: 'hidden',
// 		}),
// 		option: (provided, state) => ({
// 			...provided,
// 			backgroundColor: state.isSelected ? '#374151' : '#1f2937',
// 			color: '#f9fafb',
// 			cursor: 'pointer',
// 			'&:hover': {
// 				backgroundColor: '#374151',
// 			},
// 		}),
// 		singleValue: (provided) => ({
// 			...provided,
// 			color: '#f9fafb',
// 			display: 'flex',
// 			alignItems: 'center',
// 			cursor: 'text',
// 		}),
// 		placeholder: (provided) => ({
// 			...provided,
// 			color: '#f9fafb',
// 		}),
// 	};

// 	const handleCountryChange = (option) => {
// 		setSelectedCountry(option);
// 		Cookies.set('selectedCountry', option ? option.value : '', { expires: 365 });
// 	};
// 	const handleNameChange = (newName) => {
// 		setUserName(newName);
// 	};
// 	const handleSaveChanges = async () => {
// 		const country = Cookies.get('selectedCountry')
// 		const color = Cookies.get('selectedColor')
// 		const name = userName
// 		const userID = user._id
// 		try {
// 			await updateProfile(userID, name, country, color);

// 			toast.success(t("Profile updated successfully"));
// 		} catch (error) {
// 			console.error(error);
// 			toast.error(error.message || t("Error resetting password"));
// 		}
// 	}


// 	const handleFileInputClick = () => {
// 		fileInputRef.current.click();
// 	}
// 	// const handleImgChange = async (event) => {
// 	// 	const imgFile = event.target.files[0];
// 	// 	const userID = user._id
// 	// 	try {
// 	// 		await addProfileImg(userID, imgFile);

// 	// 		toast.success(t("Image updated successfully"));
// 	// 		setUserImg(user.userImage);
// 	// 	} catch (error) {
// 	// 		console.error(error);
// 	// 		toast.error(error.message || t("Error uploading image"));
// 	// 	}
// 	// 	console.log(imgFile);

// 	// }
//   const handleImgChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     setUserImg(URL.createObjectURL(file));
//     try {
//         await addProfileImg(user._id, file);
//         toast.success(t("Image updated successfully"));

//     } catch (error) {
//         toast.error(error.message || t("Error uploading image"));
//     }
// };
// 	const handleImgDel = async (e) => {
// 		try {
// 			const userID = user._id
			
// 			await delProfileImg(userID);
// 			setUserImg(null);
// 			toast.success(t("Image removed successfully"));
// 		} catch (error) {
// 			console.error(error);
// 			toast.error(error.message || t("Error Removing image"));
// 		}
// 	}

// 	return (
// 		<>
// 			{/* Profile Edit */}
// 			<div className="grid profile-container mt-0 place-items-center">
// 				<motion.div
// 					initial={{ opacity: 0, scale: 0.9 }}
// 					animate={{ opacity: 1, scale: 1 }}
// 					exit={{ opacity: 0, scale: 0.9 }}
// 					transition={{ duration: 0.5 }}
// 					className="w-full max-w-md p-8 mx-auto bg-gray-900 border border-gray-800 shadow-2xl bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl"
// 				>
// 					<h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text">
// 						{t('Complete your Profile')}
// 					</h2>

// 					<div className="space-y-6">
// 						<motion.div
// 							className="p-4 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg"
// 							initial={{ opacity: 0, y: 20 }}
// 							animate={{ opacity: 1, y: 0 }}
// 							transition={{ delay: 0.2 }}
// 						>
// 							<div className={`text-xl font-semibold text-green-400 mb-4 flex flex-col items-center `}>
// 								<div
// 									style={{ width: 'fit-content' }}
// 									onMouseEnter={() => setHovered(true)}
// 									onMouseLeave={() => setHovered(false)}
// 								>
// 									<Avatar>
										
// 										{userImg &&
// 										<AvatarImage 
// 										src={Host +userImg} alt={`${user?.name || 'User'}'s avatar`} 
// 										style={{objectFit: 'contain',
// 											backgroundImage:`url(${Host+userImg})` }}
// 											// Blur the bg image
// 										/>
// 										}

// 										<AvatarImage
// 											className={`${getColor(selectedColor)}`}
// 											src={user.userImg}
// 											alt={`${user?.name || 'User'}'s avatar`}
// 										/>
// 										<AvatarFallback className={`${getColor(selectedColor)}`}>
// 											{user?.name ? user.name[0] : 'U'}
// 										</AvatarFallback>
// 										{hovered &&
// 											<div className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer bg-black/50 "
// 												onClick={userImg ? handleImgDel : handleImgChange}
// 											>
// 												{userImg ?
// 													<DeleteOutline className="text-2xl font-bold text-white cursor-pointer " />
// 													: <Add className="text-2xl font-bold text-white cursor-pointer" />}
// 											</div>
// 										}
// 										{userImg ?
// 										<button
// 										onClick={handleImgDel}
// 										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
// 									/>
// 										:
// 										<input
// 											type="file"
// 											accept=".png , .jpg, .jpeg , .webp"
// 											ref={fileInputRef}
// 											onChange={handleImgChange}
// 											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
// 											name="profile-image"
// 										/>
// 										}
// 									</Avatar>
// 								</div>
// 								{user.name}
// 							</div>
// 							{user.name ? (
// 								<>
// 									<div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
// 										<div className="w-full">
// 											<input
// 												type="text"
// 												value={user.email}
// 												disabled
// 												className="m-1 w-full rounded-lg p-3 bg-gray-800 border-none"
// 												style={{ textAlign: 'left !important', color: '#919090', fontWeight: 'bold' }}
// 											/>

// 											<input
// 												type="text"
// 												value={userName}
// 												onChange={(e) => handleNameChange(e.target.value)}
// 												style={{ textAlign: 'left !important' }}
// 												className="m-1 w-full rounded-lg p-3 bg-gray-800 border-none"
// 											/>
// 											<Select
// 												className="m-1 w-full"
// 												options={options}
// 												value={selectedCountry}
// 												onChange={handleCountryChange}
// 												getOptionLabel={(option) => (
// 													<div style={{ display: 'flex', alignItems: 'center' }}>
// 														<Flag code={option.flag} style={{ width: 20, marginRight: 10 }} />
// 														{option.label}
// 													</div>
// 												)}
// 												getOptionValue={(option) => option.value}
// 												components={{ Option: customOption }}
// 												placeholder={t('Select a country')}
// 												isClearable
// 												styles={customStyles}
// 											/>
// 											<div className="w-full flex gap-5 justify-center m-3">
// 												{colors.map((color, index) => (
// 													<div
// 														key={index}
// 														className={`${color} flex items-center justify-center w-10 h-10 rounded-full cursor-pointer ${selectedColor === index ? 'outline outline-2 outline-white/50' : ''}`}
// 														onClick={() => {
// 															setSelectedColor(index);
// 															Cookies.set('selectedColor', index);
// 														}}
// 													/>
// 												))}
// 											</div>
// 										</div>
// 										<motion.button
// 											whileHover={{ scale: 1.05 }}
// 											whileTap={{ scale: 0.95 }}
// 											onClick={() => handleSaveChanges()}
// 											className="mb-1 w-full px-4 py-3 font-bold text-white rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
// 										>
// 											{t('Save Changes')}
// 										</motion.button>
// 									</div>

// 									<motion.button
// 										whileHover={{ scale: 1.05 }}
// 										whileTap={{ scale: 0.95 }}
// 										className="w-full px-4 py-3 font-bold text-gray-900 bg-gray-200 rounded-lg shadow-lg"
// 										onClick={handleLogout}
// 									>
// 										{t('Logout')}
// 									</motion.button>
// 								</>
// 							) : (
// 								<div className="flex items-center justify-center w-full gap-5 text-xl font-semibold text-center text-white">
// 									No User Found
// 								</div>
// 							)}
// 						</motion.div>
// 					</div>
// 				</motion.div>
// 			</div>
// 		</>
// 	);
// };

// export default Profile;

import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "react-i18next";
import './styles/Profile.css';
import { useNavigate } from "react-router-dom";

import { Add, DeleteOutline } from "@mui/icons-material";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Select from 'react-select';
import countries from 'world-countries';
import Flag from 'react-world-flags';
import toast from "react-hot-toast";

import Cookies from 'js-cookie';
import React, { useEffect, useState, useRef } from "react";
import { ServerUrl } from '@/utils/constants';

const Profile = () => {
    const { updateProfile, addProfileImg, delProfileImg, user, logout } = useAuthStore();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userImg, setUserImg] = useState(user?.userImage || null);
    const [selectedCountry, setSelectedCountry] = useState(user?.country);
    const [hovered, setHovered] = useState(false);
    const fileInputRef = useRef(null);
    const Host = `${ServerUrl}/`;
    
    const colors = [
        "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
        "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
        "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
        "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]"
    ];
    
    const [selectedColor, setSelectedColor] = useState(
        user?.color || Cookies.get('selectedColor') || colors[0]
    );
    const [userName, setUserName] = useState(user?.name || '');

    // Sync user data with store updates
    useEffect(() => {
        setUserImg(user?.userImage || null);
        setUserName(user?.name || '');
        setSelectedCountry(user?.country || null);
    }, [user]);

    const getColor = (index) => {
        return index !== undefined ? colors[index] : selectedColor;
    };

    const handleLogout = () => {
        logout();
        Cookies.remove('selectedCountry');
        navigate('/login');
    };

    useEffect(() => {
        const savedCountry = Cookies.get('selectedCountry') || user?.country;
        if (savedCountry) {
            const countryOption = options.find(option => option.value === savedCountry);
            setSelectedCountry(countryOption || null);
        }
    }, []);

    // Country select configuration
    const options = countries.map((country) => ({
        value: country.cca2,
        label: t(`${country.name.common}`),
        flag: country.cca2.toLowerCase(),
    }));

    const customOption = (props) => (
        <div {...props.innerProps} className="flex items-center p-2 hover:bg-gray-700">
            <Flag code={props.data.flag} className="w-5 h-5 mr-2" />
            {props.data.label}
        </div>
    );

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#1f2937',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            boxShadow: 'none',
            color: '#f9fafb',
            cursor: 'pointer',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#1f2937',
            borderRadius: '0.5rem',
            overflow: 'hidden',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#374151' : '#1f2937',
            color: '#f9fafb',
            '&:hover': { backgroundColor: '#374151' },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
        }),
    };

    const handleCountryChange = (option) => {
        setSelectedCountry(option);
        Cookies.set('selectedCountry', option?.value || '', { expires: 365 });
    };

    const handleSaveChanges = async () => {
        try {
            await updateProfile(
                user._id,
                userName,
                selectedCountry?.value,
                selectedColor
            );
            toast.success(t("Profile updated successfully"));
        } catch (error) {
            toast.error(error.message || t("Error updating profile"));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Immediate preview
        const previewUrl = URL.createObjectURL(file);
        setUserImg(previewUrl);

        try {
            await addProfileImg(user._id, file);
            toast.success(t("Image updated successfully"));
        } catch (error) {
            setUserImg(user?.userImage || null);
            toast.error(error.message || t("Error uploading image"));
        }
    };

    const handleImageDelete = async () => {
        try {
            await delProfileImg(user._id);
            setUserImg(null);
            toast.success(t("Image removed successfully"));
        } catch (error) {
            toast.error(error.message || t("Error removing image"));
        }
    };

    return (
        <div className="grid min-h-screen w-[100%] place-items-center bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-6 bg-gray-800 rounded-xl border border-gray-700"
            >
                <h2 className="mb-6 text-2xl font-bold text-center text-emerald-400">
                    {t('Profile Settings')}
                </h2>

                <div className="flex flex-col items-center space-y-6">
                    {/* Avatar Section */}
                    <div 
                        className="relative group"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <Avatar className="w-24 h-24 border-2 border-emerald-500">
                            {userImg ? (
                                <AvatarImage 
                                    src={userImg.startsWith('blob:') ? userImg : Host + userImg}
                                    className="object-cover"
                                />
                            ) : (
                                <AvatarFallback className={`${selectedColor} text-2xl`}>
                                    {userName[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            )}
                        </Avatar>

                        {hovered && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                                {userImg ? (
                                    <DeleteOutline
                                        className="text-white cursor-pointer hover:text-red-500"
                                        onClick={handleImageDelete}
                                    />
                                ) : (
                                    <label className="cursor-pointer">
                                        <Add className="text-white hover:text-emerald-500" />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                )}
                            </div>
                        )}
                    </div>
                    

                    {/* Profile Form */}
                    <div className="w-full space-y-4">
                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                {t('Display Name')}
                            </label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                {t('Country')}
                            </label>
                            <Select
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                options={options}
                                components={{ Option: customOption }}
                                styles={customStyles}
                                placeholder={t('Select your country')}
                                isClearable
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                {t('Theme Color')}
                            </label>
                            <div className="flex gap-3">
                                {colors.map((color, index) => (
                                    <button
                                        key={index}
                                        className={`w-8 h-8 rounded-full ${color} ${
                                            selectedColor === color 
                                                ? 'ring-2 ring-white' 
                                                : 'hover:ring-1 hover:ring-gray-300'
                                        }`}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
                            >
                                {t('Back')}
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="flex-1 px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-500"
                            >
                                {t('Save Changes')}
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500/10"
                        >
                            {t('Logout')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;