import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { FiEdit2 } from "react-icons/fi";
import UserAvatar from '../../components/UserAvatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/ui/tooltip"
import { useNavigate } from 'react-router-dom';
import NewDM from './subcomponents/NewDM';
import axios from 'axios';
import { useChatStore } from '../../store/chatStore'
import ContactsList from '../../components/ContactsList';
import CreateRooms from './subcomponents/CreateRooms';
import { ScrollArea } from '../../components/ui/scroll-area'
import {ServerUrl} from '../../utils/constants';



const ContactsContainer = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    const { dmContacts, setDMContacts, rooms, setRooms,selectedChatType, setSelectedChatType} = useChatStore()


    useEffect(() => {

        const getContacts = async () => {
            try {
                const response = await axios.post(
                    `${ServerUrl}/api/chat/get-dm-contacts`,
                    { userId: user._id },
                    { withCredentials: true }
                );

                if (response?.data?.success) {
                    setDMContacts(response.data.contacts);
                } else {
                    console.error("Unexpected response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching contacts:", error.message);
            }
        }

        const getRooms = async () => {
            try {
                const response = await axios.get(
                    `${ServerUrl}/api/room/get-user-rooms`,
                    { withCredentials: true }
                );
                if (response?.data?.success) {
                    setRooms(response.data.rooms);
                }
            } catch (error) {
                console.error("Error fetching rooms:", error.message);
            }
        }
        getRooms()
        getContacts()

    }, [])

    return (
        <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full left-0 '>
            <div className="flex p-5  justify-start items-center gap-2">
                <img src="/logo.png" alt="ReskU" className="w-20" />
                <span className="text-3xl font-semibold ">ReskU</span>
            </div>
            <div className="my-5">
                <div className='flex items-center justify-between pr-10'>
                    <Title text="Direct Messages" />
                    <NewDM />

                </div>
                <ScrollArea className='max-h-[40vh] w-full'>
                    <ContactsList contacts={dmContacts} type="dm"/>
                </ScrollArea>
            </div>
            <div className="my-5">
                <div className='flex items-center justify-between pr-10'>
                    <Title text="Rooms" />
                    <CreateRooms />
                </div>
                <ScrollArea className='max-h-[24vh] w-full'>
                    <ContactsList contacts={rooms} type="room" />
                </ScrollArea>

            </div>
            {/* Profile info */}
            <div className="rounded-t-[12px] absolute bottom-0 h-16 flex items-center justify-evenly gap-5 px-30 w-full bg-[#2a2b33]">
                <div className="flex items-center gap-3 justify-center">
                    <div >
                        <UserAvatar currentUser={user} />
                    </div>
                </div>
                <div>{user.name}</div>
                <div className="flex gap-5">
                    <TooltipProvider >
                        <Tooltip>
                            <TooltipTrigger onClick={() => navigate('/profile')}>
                                <FiEdit2 className='text-purple-500 text-xl font-medium' />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Edit Profile</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                </div>
            </div>
        </div>
    )
}

export default ContactsContainer

const Title = ({ text }) => {
    return (
        <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>{text}</h6>
    );
};