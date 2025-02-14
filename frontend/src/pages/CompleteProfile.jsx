// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Select from 'react-select';
// import countries from 'world-countries';
// import Flag from 'react-world-flags';
// import toast from "react-hot-toast";
// import { useAuthStore } from "../store/authStore";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";
// import Cookies from 'js-cookie';


// const CompleteProfile = () => {
//     const { updateProfile, addProfileImg, delProfileImg, error, isLoading, message, user, logout } = useAuthStore();
//     const [step, setStep] = useState(1);
//     const [profilePicture, setProfilePicture] = useState(null);
//     const [username, setUsername] = useState("");
//     const [country, setCountry] = useState("");
//     const [selectedSupplies, setSelectedSupplies] = useState([]);
//     const [selectedCountry, setSelectedCountry] = useState(user.country);
//     const [userName, setUserName] = useState(user.name);
//     const fileInputRef = useRef(null);


//     const { t } = useTranslation();
//     const handleNextStep = () => {
//         if (step === 1 && !profilePicture) {
//             alert("Please upload a profile picture.");
//             return;
//         }
//         if (step === 2 && !username.trim()) {
//             alert("Please enter a username.");
//             return;
//         }
//         setStep(step + 1);
//     };
//     const handlePreviousStep = () => {
//         setStep(step - 1);
//     };
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setProfilePicture(file);
//     };
//     const handleNameChange = (newName) => {
//         setUserName(newName);
//     };


//     useEffect(() => {

//         const savedCountry = Cookies.get('selectedCountry') || user.country;
//         if (savedCountry) {
//             setSelectedCountry(options.find(option => option.value === savedCountry) || null);
//         }
//     }, []);

//     const options = countries.map((country) => ({
//         value: country.cca2,
//         label: t(`${country.name.common}`),
//         flag: country.cca2.toLowerCase(),
//     }));

//     const customOption = (props) => (
//         <div
//             {...props.innerProps}
//             style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
//         >
//             <Flag code={props.data.flag} style={{ width: 20, marginRight: 10 }} />
//             {props.data.label}
//         </div>
//     );

//     const customStyles = {
//         control: (provided) => ({
//             ...provided,
//             backgroundColor: '#1f2937',
//             border: 'none',
//             borderRadius: '0.5rem',
//             padding: '0.5rem',
//             boxShadow: 'none',
//             color: '#f9fafb',
//             width: '100%',
//             cursor: 'pointer',
//         }),
//         menu: (provided) => ({
//             ...provided,
//             backgroundColor: '#1f2937',
//             borderRadius: '0.5rem',
//             overflow: 'hidden',
//         }),
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected ? '#374151' : '#1f2937',
//             color: '#f9fafb',
//             cursor: 'pointer',
//             '&:hover': {
//                 backgroundColor: '#374151',
//             },
//         }),
//         singleValue: (provided) => ({
//             ...provided,
//             color: '#f9fafb',
//             display: 'flex',
//             alignItems: 'center',
//             cursor: 'text',
//         }),
//         placeholder: (provided) => ({
//             ...provided,
//             color: '#f9fafb',
//         }),
//     };



//     const handleUsernameChange = (e) => {
//         setUsername(e.target.value);
//     };

//     const handleCountryChange = (e) => {
//         setCountry(e.target.value);
//     };

//     const handleSupplyChange = (e) => {
//         const value = e.target.value;
//         if (selectedSupplies.includes(value)) {
//             setSelectedSupplies(selectedSupplies.filter((item) => item !== value));
//         } else {
//             setSelectedSupplies([...selectedSupplies, value]);
//         }
//     };

//     const handleFileInputClick = () => {
//         fileInputRef.current.click();
//     }
//     const handleImgChange = async (event) => {
//         const imgFile = event.target.files[0];
//         const userID = user._id
//         try {
//             await addProfileImg(userID, imgFile);

//             toast.success(t("Image updated successfully"));
//             setUserImg(user.userImage);
//         } catch (error) {
//             console.error(error);
//             toast.error(error.message || t("Error uploading image"));
//         }
//         console.log(imgFile);

//     }

//     const handleSubmit = () => {
//         const profileData = {
//             profilePicture,
//             username,
//             country,
//             selectedSupplies,
//         };
//         console.log("Profile Data:", profileData);
//         alert("Profile completed successfully!");
//     };

//     // Animation variants for steps
//     const stepVariants = {
//         hidden: { opacity: 0, x: step > 1 ? 50 : -50 },
//         visible: { opacity: 1, x: 0 },
//         exit: { opacity: 0, x: step > 1 ? -50 : 50 },
//     };

//     const handleSaveChanges = async () => {
// 		const country = Cookies.get('selectedCountry')
// 		const color = Cookies.get('selectedColor')
// 		const name = userName
// 		const userID = user._id
//         const supplies = selectedSupplies
// 		try {
// 			await updateProfile(userID, name, country, color , supplies);

// 			toast.success(t("Profile updated successfully"));
// 		} catch (error) {
// 			console.error(error);
// 			toast.error(error.message || t("Error resetting password"));
// 		}
// 	}

//     return (
//         <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
//                 {/* Progress Bar */}
//                 <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
//                     <div
//                         className="bg-pink-500 h-2 rounded-full transition-all duration-300"
//                         style={{ width: `${((step - 1) / 3) * 100}%` }}
//                     ></div>
//                 </div>

//                 <AnimatePresence mode="wait">
//                     {step === 1 && (
//                         <motion.div
//                             key="step1"
//                             variants={stepVariants}
//                             initial="hidden"
//                             animate="visible"
//                             exit="exit"
//                             transition={{ duration: 0.3 }}
//                             className="space-y-6"
//                         >
//                             <h2 className="text-2xl font-bold text-gray-800 text-center">
//                                 Step 1: Choose Your Profile Picture
//                             </h2>
//                             <div className="flex justify-center">
//                                 <label
//                                     htmlFor="profile-picture"
//                                     className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer hover:border-pink-500 transition-colors"
//                                 >
//                                     {profilePicture ? (
//                                         <img
//                                             src={URL.createObjectURL(profilePicture)}
//                                             alt="Profile Preview"
//                                             className="w-full h-full rounded-full object-cover"
//                                         />
//                                     ) : (
//                                         <span className="text-gray-500 text-sm">Upload</span>
//                                     )}
//                                 </label>
//                                 <input
//                                     id="profile-picture"
//                                     type="file"
//                                     accept="image/*"
//                                     ref={fileInputRef}
//                                     onChange={[handleFileChange, handleImgChange]}
//                                     className="hidden"
//                                 />
//                             </div>
//                             <button
//                                 onClick={handleNextStep}
//                                 className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
//                             >
//                                 Next
//                             </button>
//                         </motion.div>
//                     )}

//                     {step === 2 && (
//                         <motion.div
//                             key="step2"
//                             variants={stepVariants}
//                             initial="hidden"
//                             animate="visible"
//                             exit="exit"
//                             transition={{ duration: 0.3 }}
//                             className="space-y-6"
//                         >
//                             <h2 className="text-2xl font-bold text-gray-800 text-center">
//                                 Step 2: Enter Your Username
//                             </h2>
//                             <input
//                                 type="text"
//                                 placeholder="Username"
//                                 value={userName}
//                                 onChange={(e) => {
//                                     handleNameChange(e.target.value)
//                                     handleUsernameChange
//                                 }

//                                 }

//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
//                                 required
//                             />
//                             <div className="flex justify-between">
//                                 <button
//                                     onClick={handlePreviousStep}
//                                     className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg mr-2 hover:bg-gray-400 transition-colors"
//                                 >
//                                     Back
//                                 </button>
//                                 <button
//                                     onClick={handleNextStep}
//                                     className="w-1/2 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </motion.div>
//                     )}

//                     {step === 3 && (
//                         <motion.div
//                             key="step3"
//                             variants={stepVariants}
//                             initial="hidden"
//                             animate="visible"
//                             exit="exit"
//                             transition={{ duration: 0.3 }}
//                             className="space-y-6"
//                         >
//                             <h2 className="text-2xl font-bold text-gray-800 text-center">
//                                 Step 3: Select Your Country
//                             </h2>
//                             <Select
//                                 className="m-1 w-full"
//                                 options={options}
//                                 value={selectedCountry}
//                                 onChange={handleCountryChange}
//                                 getOptionLabel={(option) => (
//                                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                                         <Flag code={option.flag} style={{ width: 20, marginRight: 10 }} />
//                                         {option.label}
//                                     </div>
//                                 )}
//                                 getOptionValue={(option) => option.value}
//                                 components={{ Option: customOption }}
//                                 placeholder={t('Select a country')}
//                                 isClearable
//                                 styles={customStyles}
//                             />
//                             <div className="flex justify-between">
//                                 <button
//                                     onClick={handlePreviousStep}
//                                     className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg mr-2 hover:bg-gray-400 transition-colors"
//                                 >
//                                     Back
//                                 </button>
//                                 <button
//                                     onClick={handleNextStep}
//                                     className="w-1/2 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </motion.div>
//                     )}

//                     {step === 4 && (
//                         <motion.div
//                             key="step4"
//                             variants={stepVariants}
//                             initial="hidden"
//                             animate="visible"
//                             exit="exit"
//                             transition={{ duration: 0.3 }}
//                             className="space-y-6"
//                         >
//                             <h2 className="text-2xl font-bold text-gray-800 text-center">
//                                 Step 4: Select First Aid Supplies and Rescue Tools
//                             </h2>
//                             <div className="grid grid-cols-2 gap-4">
//                                 {[
//                                     "First Aid Kit",
//                                     "Fire Extinguisher",
//                                     "Flashlight",
//                                     "Emergency Blanket",
//                                     "Water Bottle",
//                                     "Multi-tool",
//                                 ].map((supply) => (
//                                     <label
//                                         key={supply}
//                                         className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedSupplies.includes(supply)
//                                             ? "border-pink-500 bg-pink-50"
//                                             : "border-gray-200 hover:border-pink-500"
//                                             }`}
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             value={supply}
//                                             onChange={handleSupplyChange}
//                                             checked={selectedSupplies.includes(supply)}
//                                             className="mr-2"
//                                         />
//                                         <span className="text-gray-700">{supply}</span>
//                                     </label>
//                                 ))}
//                             </div>
//                             <div className="flex justify-between">
//                                 <button
//                                     onClick={handlePreviousStep}
//                                     className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg mr-2 hover:bg-gray-400 transition-colors"
//                                 >
//                                     Back
//                                 </button>
//                                 <button
// 											onClick={() => handleSaveChanges()}
//                                             className="w-1/2 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
//                                 >
//                                     Complete Profile
//                                 </button>
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//         </div>
//     );
// };

// export default CompleteProfile;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Select from 'react-select';
import countries from 'world-countries';
import Flag from 'react-world-flags';
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { ServerUrl } from "@/utils/constants";
const CompleteProfile = () => {
    const { updateProfile, addProfileImg, user } = useAuthStore();
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [profilePicture, setProfilePicture] = useState(ServerUrl + "/" + user?.userImage || null);
    const [userName, setUserName] = useState(user?.name || "");
    const [selectedSupplies, setSelectedSupplies] = useState(user?.supplies || []);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const fileInputRef = useRef(null);
    const navigator = useNavigate();
    // Memoized country options
    const options = useMemo(() => countries.map((country) => ({
        value: country.cca2,
        label: t(country.name.common),
        flag: country.cca2.toLowerCase(),
    })), [t]);

    useEffect(() => {
        const savedCountry = Cookies.get('selectedCountry') || user?.country;
        if (savedCountry) {
            const countryOption = options.find(option => option.value === savedCountry);
            setSelectedCountry(countryOption || null);
        }
    }, [user?.country, options]);

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#1f2937',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            boxShadow: 'none',
            color: '#f9fafb',
            width: '100%',
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
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#374151' },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
        }),
        placeholder: (provided) => ({ ...provided, color: '#f9fafb' }),
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProfilePicture(URL.createObjectURL(file));
        try {
            await addProfileImg(user._id, file);
            toast.success(t("Image updated successfully"));
        } catch (error) {
            toast.error(error.message || t("Error uploading image"));
        }
    };

    const handleSaveChanges = async () => {
        const supplies = selectedSupplies
        const color = Cookies.get('selectedColor')
        try {
            await updateProfile(
                user._id,
                userName,
                selectedCountry?.value,
                color,
                profilePicture,
                supplies
            );
            toast.success(t("Profile updated successfully"));
            navigator("/");
        } catch (error) {
            console.error(error);
            toast.error(error.message || t("Error updating profile"));
        }
    };

    const handleNextStep = () => {
        if (step === 1 && !profilePicture) {
            toast.error(t("Please upload a profile picture"));
            return;
        }
        if (step === 2 && !userName.trim()) {
            toast.error(t("Please enter a username"));
            return;
        }
        setStep(step + 1);
    };

    const handleSupplyChange = (value) => {
        setSelectedSupplies(prev =>
            prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
        );
    };

    const stepVariants = {
        hidden: { opacity: 0, x: step > 1 ? 50 : -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: step > 1 ? -50 : 50 },
    };

    const CustomOption = (props) => (
        <div {...props.innerProps} className="flex items-center p-2 hover:bg-gray-100">
            <Flag code={props.data.flag} className="w-6 mr-2" />
            {props.data.label}
        </div>
    );

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div
                        className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                    ></div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 text-center">
                                {t("Step 1: Choose Your Profile Picture")}
                            </h2>
                            <div className="flex justify-center">
                                <label
                                    htmlFor="profile-picture"
                                    className="flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer hover:border-pink-500"
                                >
                                    {profilePicture ? (
                                        <img
                                            src={profilePicture}
                                            alt="Profile Preview"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-sm">{t("Upload")}</span>
                                    )}
                                </label>
                                <input
                                    id="profile-picture"
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                            <button
                                onClick={handleNextStep}
                                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
                            >
                                {t("Next")}
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 text-center">
                                {t("Step 2: Enter Your Username")}
                            </h2>
                            <input
                                type="text"
                                placeholder={t("Username")}
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg mr-2 hover:bg-gray-400"
                                >
                                    {t("Back")}
                                </button>
                                <button
                                    onClick={handleNextStep}
                                    className="w-1/2 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
                                >
                                    {t("Next")}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 text-center">
                                {t("Step 3: Select Your Country")}
                            </h2>
                            <Select
                                options={options}
                                value={selectedCountry}
                                onChange={setSelectedCountry}
                                components={{ Option: CustomOption }}
                                styles={customStyles}
                                placeholder={t("Select a country")}
                            />
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg mr-2 hover:bg-gray-400"
                                >
                                    {t("Back")}
                                </button>
                                <button
                                    onClick={handleNextStep}
                                    className="w-1/2 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
                                >
                                    {t("Next")}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 text-center">
                                {t("Step 4: Select Emergency Supplies")}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {["First Aid Kit", "Fire Extinguisher", "Flashlight", "Emergency Blanket"].map((supply) => (
                                    <label
                                        key={supply}
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer ${selectedSupplies.includes(supply)
                                                ? "border-pink-500 bg-pink-50"
                                                : "border-gray-200 hover:border-pink-500"
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            value={supply}
                                            checked={selectedSupplies.includes(supply)}
                                            onChange={() => handleSupplyChange(supply)}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">{t(supply)}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(3)}
                                    className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-lg mr-2 hover:bg-gray-400"
                                >
                                    {t("Back")}
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    className="w-1/2 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
                                >
                                    {t("Complete Profile")}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CompleteProfile;

