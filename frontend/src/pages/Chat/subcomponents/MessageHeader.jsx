import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { RiCloseFill } from 'react-icons/ri';
import { useChatStore } from '@/store/chatStore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoomAvatar } from '@/components/UserAvatar';
import {ServerUrl} from '@/utils/constants';


const MessageHeader = () => {
  const { closeChat, selectedChatData , selectedChatType} = useChatStore();

  const Host = `${ServerUrl}/`;
  const colors = [
    "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
    "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
    "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
    "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]"
  ];

  const getColor = (index) => {
    return index !== undefined ? colors[index] : Cookies.get('selectedColor') || colors[0];
  };

  return (
    <div className='h-10vh border-b-2 border-[#2f303b] flex items-center justify-between px-20'>
      <div className='flex gap-5 items-center p-2'>
        <div className='flex gap-3 items-center justify-center'>  
        {selectedChatType === 'dm' &&
          <Avatar>
            {selectedChatData?.userImage ? (
              <>
                <AvatarImage
                  src={`${Host}${selectedChatData.userImage}`}
                  alt={`${selectedChatData?.name || 'User'}'s avatar`}
                  style={{
                    objectFit: 'contain',
                    backgroundImage: `url(${Host}${selectedChatData.userImage})`,
                  }}
                />
                <AvatarImage
                  className={`${getColor(selectedChatData.color)}`}
                  src={selectedChatData.userImage}
                  alt={`${selectedChatData?.name || 'User'}'s avatar`}
                />
              </>
            ) : (
              <AvatarFallback className={`${getColor(selectedChatData?.color || 0)}`}>
                {selectedChatData?.name ? selectedChatData.name[0] : 'U'}
              </AvatarFallback>
            )}
          </Avatar>}
          {selectedChatType === 'room' &&
              <RoomAvatar/>
                  }
          <div className='text-lg font-bold '>{selectedChatData?.name || 'Room'}</div>
        </div>
        <div className='flex items-center justify-center gap-5'>
          <button
            className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
            onClick={closeChat}
          >
            <RiCloseFill className='text-3xl' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
