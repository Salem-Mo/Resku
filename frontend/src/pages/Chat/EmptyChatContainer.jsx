import React from 'react'
import ChatLoading from '@/components/ChatLoading'
const EmptyChatContainer = () => {
    return (
        <div className='flex-1 md:bg-[#1c1b25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all'>
            <ChatLoading />
            <div className='text-opacity-800 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center'>
                <h3 className=' -medium'>
                    <span className='text-purple-500'>Hi!</span> Welcome to
                    <span className='text-purple-500'> ReskU</span> Chat<span className='text-purple-500'>.</span>
                </h3>
            </div>
        </div>
    )
}

export default EmptyChatContainer