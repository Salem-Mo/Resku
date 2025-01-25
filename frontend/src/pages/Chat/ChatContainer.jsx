import React from 'react'
import MessageBar from './subcomponents/MessageBar'
import MessageContainer from './subcomponents/MessageContainer'
import MessageHeader from './subcomponents/MessageHeader'

const ChatContainer = () => {
  return (
    <div className='fixed top-0 h[100vh] w-[100vw] bg-[#1c1b25] flex flex-col md:static md:flex-1 '>
        <MessageHeader/>
        <MessageContainer/>
        <MessageBar/>

    </div>
  )
}

export default ChatContainer