import './styles/ChatPage.css'
import { useChatStore } from '../store/chatStore'
import ChatContainer from './Chat/ChatContainer'
import ContactsContainer from './Chat/ContactsContainer'
import EmptyChatContainer from './Chat/EmptyChatContainer'

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