import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { useTranslation } from "react-i18next";
import './styles/Profile.css';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ArrowBackIos, Add, DeleteOutline } from "@mui/icons-material";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Select from 'react-select';
import countries from 'world-countries';
import Flag from 'react-world-flags';
import toast from "react-hot-toast";

import Cookies from 'js-cookie';
import React, { useEffect, useState, useRef } from "react";
import { ServerUrl } from '@/utils/constants';

const Profile = () => {
  const { updateProfile, addProfileImg, delProfileImg, error, isLoading, message, user, logout } = useAuthStore();
  const token = Cookies.get("token");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userImg, setUserImg] = useState(user.userImage || null);
  const [selectedCountry, setSelectedCountry] = useState(user.country);
  const [hovered, setHovered] = useState(null);
  const fileInputRef = useRef(null);
  const Host = `${ServerUrl}/`;
  const colors = [
    "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
    "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
    "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
    "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]"
  ];
  const [selectedColor, setSelectedColor] = useState(user.color || Cookies.get('selectedColor') || colors[0]);
  const getColor = (index) => {
    return index !== undefined ? colors[index] : selectedColor;
  };

  const [userName, setUserName] = useState(user.name);

  const handleLogout = () => {
    logout();
    Cookies.remove('selectedCountry');
  };

  useEffect(() => {

    const savedCountry = Cookies.get('selectedCountry') || user.country;
    if (savedCountry) {
      setSelectedCountry(options.find(option => option.value === savedCountry) || null);
    }
  }, []);

  const options = countries.map((country) => ({
    value: country.cca2,
    label: t(`${country.name.common}`),
    flag: country.cca2.toLowerCase(),
  }));

  const customOption = (props) => (
    <div
      {...props.innerProps}
      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
    >
      <Flag code={props.data.flag} style={{ width: 20, marginRight: 10 }} />
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
      '&:hover': {
        backgroundColor: '#374151',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      cursor: 'text',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#f9fafb',
    }),
  };

  const handleCountryChange = (option) => {
    setSelectedCountry(option);
    Cookies.set('selectedCountry', option ? option.value : '', { expires: 365 });
  };
  const handleNameChange = (newName) => {
    setUserName(newName);
  };
  const handleSaveChanges = async () => {
    const country = Cookies.get('selectedCountry')
    const color = Cookies.get('selectedColor')
    const name = userName
    const userID = user._id
    try {
      await updateProfile(userID, name, country, color);

      toast.success(t("Profile updated successfully"));
    } catch (error) {
      console.error(error);
      toast.error(error.message || t("Error resetting password"));
    }
  }


  const handleFileInputClick = () => {
    fileInputRef.current.click();
  }
  const handleImgChange = async (event) => {
    const imgFile = event.target.files[0];
    const userID = user._id
    try {
      await addProfileImg(userID, imgFile);

      toast.success(t("Image updated successfully"));
      setUserImg(user.userImage);
    } catch (error) {
      console.error(error);
      toast.error(error.message || t("Error uploading image"));
    }
    console.log(imgFile);

  }
  const handleImgDel = async (e) => {
    try {
      const userID = user._id

      await delProfileImg(userID);
      setUserImg(null);
      toast.success(t("Image removed successfully"));
    } catch (error) {
      console.error(error);
      toast.error(error.message || t("Error Removing image"));
    }
  }
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
  const [badgesData, setBadgesData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched) {
      console.log("Fetching badge data...");
      const fetchBadges = async () => {
        try {
          const response = await fetch("/db/badges.json");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();

          console.log("Fetched badges:", data);

          // Ensure we extract only the `badges` array
          setBadgesData(data.badges || []);
          setHasFetched(true);
        } catch (error) {
          console.error("Error fetching badges:", error);
        }
      };
      fetchBadges();
    }
  }, [hasFetched]);

  useEffect(() => {
    console.log("Checking user data:", user);
    console.log("Checking fetched badge data:", badgesData);

    if (Array.isArray(badgesData) && badgesData.length > 0 && user?.badges?.length) {
      const userBadgeNames = user.badges.map(
        (id) => badgesData.find((badge) => String(badge.id) === String(id))?.name || `Unknown Badge (${id})`
      );
      console.log("User's badge names:", userBadgeNames);
    } else {
      console.log("No badge data available yet.");
    }
  }, [badgesData, user]);
  const [helped, setHelped] = useState(user.helped);
  const [creditPoints, setcreditPoints] = useState(user.creditPoints);

  return (
    <>
      <Tabs defaultValue="badges" className="relative grid profile-container mt-0 place-items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 mx-auto bg-gray-900 border border-gray-800 shadow-2xl bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl"
        >
<TabsList className="absolute top-5 right-2 flex flex-col gap-[4px] bg-opacity-0">
  <TabsTrigger 
    value="edit" 
    className="px-3 text-sm font-semibold transition duration-300 ease-in-out transform rounded-lg bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 shadow-md data-[state=active]:bg-white data-[state=active]:text-black"
  >
    <img src="/edit.svg" className="w-4 h-4" alt="edit" />
  </TabsTrigger>
  <TabsTrigger 
    value="badges" 
    className="px-3 text-sm font-semibold transition duration-300 ease-in-out transform rounded-lg bg-gray-800 text-white hover:bg-gray-700 hover:scale-105 shadow-md data-[state=active]:bg-white data-[state=active]:text-black"
  >
    <img src="/badge.png" className="w-4 h-4" alt="Badges" srcset="" />
  </TabsTrigger>
</TabsList>


          <div className="w-full">
            <TabsContent value="edit" className="space-y-6 w-full">
              <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text">
                {t('Edit your Profile')}
              </h2>
              <motion.div
                className="p-4 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="relative group w-fit"
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
                        <AvatarFallback className={`${getColor(selectedColor)} text-2xl`}>
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
                              accept=".png, .jpg, .jpeg"
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-xl font-semibold text-green-400 mb-4 flex flex-col items-center `}>

                  {user.name}
                </div>
                {user.name ? (
                  <>
                    <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                      <div className="w-full">
                        <input
                          type="text"
                          value={user.email}
                          disabled
                          className="m-1 w-full rounded-lg p-3 bg-gray-800 border-none"
                          style={{ textAlign: 'left !important', color: '#919090', fontWeight: 'bold' }}
                        />

                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          style={{ textAlign: 'left !important' }}
                          className="m-1 w-full rounded-lg p-3 bg-gray-800 border-none"
                        />
                        <Select
                          className="m-1 w-full"
                          options={options}
                          value={selectedCountry}
                          onChange={handleCountryChange}
                          getOptionLabel={(option) => (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Flag code={option.flag} style={{ width: 20, marginRight: 10 }} />
                              {option.label}
                            </div>
                          )}
                          getOptionValue={(option) => option.value}
                          components={{ Option: customOption }}
                          placeholder={t('Select a country')}
                          isClearable
                          styles={customStyles}
                        />
                        <div className="w-full flex gap-5 justify-center m-3">
                          {colors.map((color, index) => (
                            <div
                              key={index}
                              className={`${color} flex items-center justify-center w-10 h-10 rounded-full cursor-pointer ${selectedColor === index ? 'outline outline-2 outline-white/50' : ''}`}
                              onClick={() => {
                                setSelectedColor(index);
                                Cookies.set('selectedColor', index);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pb-2">
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
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full gap-5 text-xl font-semibold text-center text-white">
                    No User Found
                  </div>
                )}
              </motion.div>
            </TabsContent>
            <TabsContent value="badges" className="space-y-6 relative ">
              <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text">
                {t('Badges')}
              </h2>
              <motion.div
                className="p-4 bg-gray-800 bg-opacity-50 w-full border border-gray-700 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* User Image and Name */}
                <div className="flex flex-col items-center mb-5">
                  <Avatar className="w-24 h-24 border-2 border-emerald-500">
                    {userImg ? (
                      <AvatarImage
                        src={userImg.startsWith('blob:') ? userImg : Host + userImg}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className={`${getColor(selectedColor)} text-2xl`}>
                        {userName[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-xl font-semibold text-green-400 mt-4">
                    {user.name}
                  </div>
                </div>

                {/* Credit Points */}
                <div className="flex justify-center gap-8 mb-4">
                  <div className="text-center">
                  <div className="text-lg font-semibold text-white">
  {t('Credit Points')}
</div>
<div className="text-2xl font-bold text-emerald-500 inline-flex items-center gap-1">
  {user.creditPoints || 0}
  <img src="/coins.png" alt="R Coin" className="w-6" />
</div>

                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">
                      {t('Users Helped')}
                    </div>
                    <div className="text-2xl font-bold text-emerald-500">
                      {user.helped || 0}
                    </div>
                  </div>
                </div>


                {/* Badges */}
                <div className="text-center mb-6">
                  <ScrollArea className="h-[200px] w-full rounded-md border-none p-0">
                    <div className="flex flex-wrap justify-center gap-2">
                      {badgesData.map((badge) => {
                        const isEarned = user.badges?.some(b => String(b) === String(badge.id));
                        return (
                          <TooltipProvider key={badge.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`flex flex-col items-center justify-center w-28 h-28 p-4 bg-gray-700 rounded-lg transition-all 
                  ${!isEarned ? 'grayscale opacity-50' : 'hover:scale-105'}`}
                                >
                                  <img
                                    src={badge.icon}
                                    alt={t(badge.name)}
                                    className="w-12 h-12 mb-2 object-contain"
                                  />
                                  <div className="text-sm font-semibold text-center">
                                    {t(badge.name)}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {isEarned ? (
                                  <p className="bold text-green-600">{t(badge.description)}</p>
                                ) : (
                                  <div className="text-xs text-red-800">
                                    {t(badge.description)}
                                  </div>
                                )}
                              </TooltipContent>

                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>


              </motion.div>
            </TabsContent>
          </div>
        </motion.div>
      </Tabs>

    </>
  );
};

export default Profile;


