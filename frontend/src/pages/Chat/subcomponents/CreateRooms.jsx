import React, { useEffect, useState } from 'react'
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
    DialogTrigger,
} from "../../../components/ui/dialog"

import { FaPlus } from "react-icons/fa"
import ChatLoading from '../../../components/ChatLoading'
import axios from 'axios'
import UserAvatar from '../../../components/UserAvatar'
import { useAuthStore } from "../../../store/authStore";
import { useChatStore } from '../../../store/chatStore'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Button } from '../../../components/ui/button' 
import MultipleSelector from '../../../components/ui/multipleselect'
import {ServerUrl} from '../../../utils/constants';


const CreateRooms = () => {
    const {setSelectedChatData , setSelectedChatType,addRoom} =useChatStore()
    const { user } = useAuthStore();
    const [openNewRoomsModal, setNewRoomsModal] = useState(false);
    const [allContacts ,setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [roomName, setRoomsName] = useState("");
    




    useEffect(() => {
        try {
            const getAllContactsAV =async () => {
                const response = await axios.get(`${ServerUrl}/api/chat/get-all-contacts`, {userId: user._id }, { withCredentials: true })
                    setAllContacts(response.data.contacts)
            }
            getAllContactsAV()
        } catch (err) {
            console.log(err)
            
        }
    })

const createRooms = async()=>{
    try {
        if(roomName.length>0 && selectedContacts.length> 1){
            console.log({
                name:roomName,
                members:selectedContacts.map((contact) => contact.value),
                userID: user._id
            })
            const response = await axios.post(`${ServerUrl}/api/room/create-room`, {
                name: roomName,
                members: selectedContacts.map((contact) => contact.value),
                userID: user._id
            }, { withCredentials: true })

            
            if(response.data.success){
                setRoomsName("")
                setSelectedContacts([])
                setSelectedChatType("room")
                addRoom(response.data.room)
            }
        }
    } catch (error) {
        console.log(error)}
    }

    


    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger onClick={() => setNewRoomsModal(true)}>
                        <FaPlus />
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>Select New Contact</div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewRoomsModal} onOpenChange={setNewRoomsModal}>
            <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col justify-between">
    <DialogHeader>
        <DialogTitle>Create a new Room</DialogTitle>
        <DialogDescription></DialogDescription>
    </DialogHeader>
    <div>
        <input
            placeholder="Room Name"
            className="rounded-lg p-6 bg-[#2c2e3b] w-full h-[20%]"
            onChange={(e) => setRoomsName(e.target.value)}
        />
    </div>
    <MultipleSelector
        className="rounded-lg h-40 bg-[#2c2e3b] w-full "
        defaultOptions={allContacts}
        placeholder="Select Contacts"
        value={selectedContacts}
        onChange={setSelectedContacts}
        emptyIndicator={<p className="text-gray-600  text-lg">No contacts found</p>}
    />
    <div className="mt-auto">
        <Button
            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={createRooms}
        >
            Create Room
        </Button>
    </div>
</DialogContent>

            </Dialog>


        </>)
}

export default CreateRooms