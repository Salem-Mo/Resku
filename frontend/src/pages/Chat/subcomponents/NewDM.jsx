import React, { useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../../components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"

import { FaPlus } from "react-icons/fa"
import ChatLoading from '../../../components/ChatLoading'
import axios from 'axios'
import UserAvatar from '../../../components/UserAvatar'
import { useAuthStore } from "../../../store/authStore";
import { useChatStore } from '../../../store/chatStore'
import { ScrollArea } from '../../../components/ui/scroll-area'
import {ServerUrl} from '../../../utils/constants';


const NewDM = () => {
    const {setSelectedChatData , setSelectedChatType} =useChatStore()
    const { user } = useAuthStore();
    const [openNewCountactModal, setNewCountactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);



    const selectNewContact =(contact) => {
        setSelectedChatType("contact")
        setSelectedChatData(contact)    
        setSearchedContacts([])
        setNewCountactModal(false)
    }


    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm) {
                const response = await axios.post(`${ServerUrl}/api/chat/search-contacts`, { searchTerm , userId: user._id }, { withCredentials: true })
                setSearchedContacts(response.data.contacts)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger onClick={() => setNewCountactModal(true)}>
                        <FaPlus />
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>Select New Contact</div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewCountactModal} onOpenChange={setNewCountactModal}>
                <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
                    <DialogHeader>
                        <DialogTitle>
                            Select a Contact
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <input placeholder='Search Contacts' className='rounded-lg p-6 bg-[#2c2e3b] w-full h-[20%]'
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    {searchedContacts.length <= 0 ? (
                        <ChatLoading />
                    ) : (
                        <ScrollArea className='h-[80%] w-full'>

                        <div className='flex flex-col gap-5'>
                            {searchedContacts.map((contact) => (
                                <div key={contact._id} 
                                onClick={() => selectNewContact(contact)} 
                                className='flex items-center gap-3 cursor-pointer border-b-2 border-[#2c2e3b]'>
                                    <UserAvatar currentUser={contact} />
                                    <div className='flex flex-col'>
                                        <span className='text-[#8f9bb3]'>{contact.name}</span>
                                        <span className='text-[#8f9bb3]'>{contact.email}</span>
                                    </div>
                                </div> 
                            ))}
                        </div>
                        </ScrollArea>

                    )}

                </DialogContent>
            </Dialog>


        </>)
}

export default NewDM