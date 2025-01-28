import './styles/ChatPage.css'
import { useChatStore } from '@/store/chatStore'
import ChatContainer from './Chat/chatContainer'
import ContactsContainer from './Chat/contactsContainer'
import EmptyChatContainer from './Chat/emptyChatContainer'

const ChatPage = () => {
  const {selectedChatType} = useChatStore()
  
  return (
    <>
    <div className='flex h-[100vh] text-white overflow-hidden w-full'>

      <ContactsContainer />
      {
        selectedChatType === undefined ? <EmptyChatContainer /> : <ChatContainer />
      }
    </div>
    </>
  )
  
}

export default ChatPage