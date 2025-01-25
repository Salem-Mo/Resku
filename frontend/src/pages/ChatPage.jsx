import React, { useEffect, useState } from 'react'
import './styles/ChatPage.css'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import ChatContainer from './Chat/chatContainer'
import ContactsContainer from './Chat/contactsContainer'
import EmptyChatContainer from './Chat/emptyChatContainer'

const ChatPage = () => {
  const {user} = useAuthStore()
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