import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import moment from 'moment';
import axios from 'axios';
import { FaFileImage, FaFileVideo, FaFileAudio, FaFileAlt, FaFileArchive, FaFilePdf, FaFileExcel, FaFileWord, FaFile } from 'react-icons/fa';
import AudioPlayer from '@/components/Audio';

const MessageContainer = () => {
    const scrollRef = useRef();
    const { user } = useAuthStore();
    const { selectedChatData, selectedChatMessages, selectedChatType, setSelectedChatMessages } = useChatStore();
    const scroolBar = 'overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#8417ff]/40';

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (selectedChatType == "dm") {
                    const response = await axios.post(
                        "http://localhost:5000/api/chat/get-msg",
                        {
                            sender: user._id,
                            recipient: selectedChatData._id,
                            roomID: null
                        },
                        { withCredentials: true }
                    );

                    if (response.data.success) {
                        
                        setSelectedChatMessages(response.data.messages);
                    }
                } else if (selectedChatType == "room") {
                    const response = await axios.post(
                        "http://localhost:5000/api/chat/get-msg",
                        {
                            sender: user._id,
                            recipient: selectedChatData._id,
                            roomID: selectedChatData._id
                        },
                        { withCredentials: true }
                    );

                    if (response.data.success) {
                        
                        setSelectedChatMessages(response.data.messages);
                    }
                }

            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [selectedChatMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedChatMessages]);

    const getFileType = (message, isSender) => {
        let fileURL = message.fileURL

        if (!fileURL) return null;
        const extension = fileURL.split('.').pop().toLowerCase();
        fileURL = 'http://localhost:5000/' + fileURL;
        const openInNewTab = (fileToOpen) => {
            window.open(fileToOpen, '_blank');
        }
        const fileData = {
            jpg: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="image" className="w-32 h-32 object-cover" /> },
            jpeg: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="image" className="w-32 h-32 object-cover" /> },
            png: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="image" className="w-32 h-32 object-cover" /> },
            gif: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="image" className="w-32 h-32 object-cover" /> },
            svg: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="image" className="w-32 h-32 object-cover" /> },
            bmp: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="image" className="w-32 h-32 object-cover" /> },
            tiff: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="image" className="w-32 h-32 object-cover" /> },

            mp4: { type: 'Video', preview: <video src={fileURL} controls className="w-32 h-32" /> },
            mov: { type: 'Video', preview: <video src={fileURL} controls className="w-32 h-32" /> },
            avi: { type: 'Video', preview: <video src={fileURL} controls className="w-32 h-32" /> },
            mkv: { type: 'Video', preview: <video src={fileURL} controls className="w-32 h-32" /> },
            mp3: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },
            webm: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },
            wav: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },
            ogg: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },
            flac: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },

            pdf: { type: 'PDF Document', preview: <FaFilePdf onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
            doc: { type: 'Word Document', preview: <FaFileWord onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
            docx: { type: 'Word Document', preview: <FaFileWord onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
            odt: { type: 'Document', preview: <FaFileAlt onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
            default: { type: 'Unknown File', preview: <FaFile onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
        };
        return fileData[extension]?.preview || fileData.default.preview;
    };


    const renderMessages = () => {
        let lastDate = null;


        return selectedChatMessages.map((message, index) => {
            if (message) {
                const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
                const showDate = messageDate !== lastDate;
                lastDate = messageDate;

                const timestamp = moment(message.timestamp).format('LT');
                const isSender = message.sender === user._id;

                return (
                    <div key={index}>
                        {showDate && (
                            <div className="text-center text-gray-500 my-3">
                                <div className="font-medium text-sm">{moment(message.timestamp).format('LL')}</div>
                            </div>
                        )}
                        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-start`}>
                            <div
                                className={`relative ${isSender
                                    ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/40'
                                    : 'bg-[#2a2b33]/10 text-white/90 border-white/30'
                                    } border py-2 px-4 rounded-lg my-1 max-w-[60%] break-words`}
                            >
                                <div className={`text-sm ${isSender ? 'text-right' : 'text-left'}`}>
                                    {message.content || (
                                        <div className="text-[28px] !important">
                                            {getFileType(message, isSender)}
                                        </div>
                                    )}
                                </div>
                                <span
                                    className={`relative  ${isSender ? 'right-3' : 'left-3'} font-thin text-[10px]`}
                                    style={{
                                        color: isSender ? '#8417ff' : 'rgba(255, 255, 255, 0.9)',
                                    }}
                                >
                                    {timestamp}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            }
        });
    };

    return (
        <div className={`flex-1 overflow-y-auto ${scroolBar} p-4 px-8`}>
            {renderMessages()}
            <div ref={scrollRef} />
        </div>
    );
};

export default MessageContainer;
