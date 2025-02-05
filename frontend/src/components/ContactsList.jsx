import UserAvatar, { RoomAvatar } from './UserAvatar'
import { useChatStore } from '../store/chatStore'
const ContactsList = ({ contacts, type }) => {
    const { setSelectedChatData, setSelectedChatType } = useChatStore()
    return (

        <div className='flex flex-col scrollbar-none cursor-pointer gap-5 max-h-[70%] relative scrollbar-hide overflow-y-scroll overflow-x-hidden w-[100%] p-3'>
            {contacts.map((contact) => (
                <div key={contact._id} className="inline-flex items-center gap-3 hover:bg-[#2f303b] p-3 overflow-x-hidden rounded-lg"
                onClick={() => {
                        setSelectedChatType(`${type}`)
                        setSelectedChatData(contact)
                    }}
                >
                    {type === "dm" ? (
                        <>
                            <UserAvatar currentUser={contact} />
                            <div className="flex flex-col items-start justify-center gap-2">
                                <span className="text-lg font-bold">{contact.name}</span>

                            </div>
                        </>
                    ): (
                        <>
                        <RoomAvatar />
                        <div className="flex flex-col items-start justify-center gap-2">
                            <span className="text-lg font-bold">{contact.name}</span>
                            {/* <span className="text-sm text-[#8a8a8a]">{contact.members[0]}</span> */}
                        </div>
                    </>
                    )}
                </div>
            ))}
        </div>)
}

export default ContactsList