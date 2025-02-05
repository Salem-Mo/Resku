// import React, { useEffect, useRef } from 'react';
// import { useAuthStore } from '../../../store/authStore';
// import { useChatStore } from '../../../store/chatStore';
// import moment from 'moment';
// import axios from 'axios';
// // import { FaFileImage, FaFileVideo, FaFileAudio, FaFileAlt, FaFileArchive, FaFilePdf, FaFileExcel, FaFileWord, FaFile } from 'react-icons/fa';
// import { FaFileAlt, FaFilePdf, FaFileWord, FaFile } from 'react-icons/fa';
// import AudioPlayer from '../../../components/Audio';
// import {ServerUrl} from '../../../utils/constants';


// const MessageContainer = () => {
//     const scrollRef = useRef();
//     const { user } = useAuthStore();
//     const { selectedChatData, selectedChatMessages, selectedChatType, setSelectedChatMessages } = useChatStore();
//     const scroolBar = 'overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#8417ff]/40';

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 if (selectedChatType === "dm") {
//                     const response = await axios.post(
//                         `${ServerUrl}/api/chat/get-msg`,
//                         {
//                             sender: user._id,
//                             recipient: selectedChatData._id,
//                             roomID: null
//                         },
//                         { withCredentials: true }
//                     );

//                     if (response.data.success) {
                        
//                         setSelectedChatMessages(response.data.messages);
//                     }
//                 } else if (selectedChatType === "room") {
//                     const response = await axios.post(
//                         `${ServerUrl}/api/chat/get-msg`,
//                         {
//                             sender: user._id,
//                             recipient: selectedChatData._id,
//                             roomID: selectedChatData._id
//                         },
//                         { withCredentials: true }
//                     );

//                     if (response.data.success) {
                        
//                         setSelectedChatMessages(response.data.messages);
//                     }
//                 }

//             } catch (error) {
//                 console.error("Error fetching messages:", error);
//             }
//         };

//         fetchMessages();
//     }, [selectedChatType, selectedChatData, user._id, setSelectedChatMessages]);

//     useEffect(() => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollIntoView({ behavior: 'smooth' });
//         }
//     }, [selectedChatMessages]);

//     const getFileType = (message, isSender) => {
//         let fileURL = message.fileURL

//         if (!fileURL) return null;
//         const extension = fileURL.split('.').pop().toLowerCase();
//         fileURL = `${ServerUrl}/` + fileURL;
//         const openInNewTab = (fileToOpen) => {
//             window.open(fileToOpen, '_blank');
//         }
//         const fileData = {
//             jpg: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="jpg" className="w-32 h-32 object-cover" /> },
//             jpeg: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="jpeg" className="w-32 h-32 object-cover" /> },
//             png: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="png" className="w-32 h-32 object-cover" /> },
//             gif: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="gif" className="w-32 h-32 object-cover" /> },
//             svg: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="svg" className="w-32 h-32 object-cover" /> },
//             bmp: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="bmp" className="w-32 h-32 object-cover" /> },
//             tiff: { type: 'Image', preview: <img onClick={() => { openInNewTab(fileURL) }} src={fileURL} alt="tiff" className="w-32 h-32 object-cover" /> },

//             mp4: { type: 'Video', preview: <video src={fileURL} controls className="w-32 h-32" /> },
//             mov: { type: 'Video', preview: <video src={fileURL} controls className="w-32 h-32" /> },
//             avi: { type: 'Video', preview: <video src={fileURL} controls className="w-32 h-32" /> },
//             mkv: { type: 'Video', preview: <video src={fileURL} controls className="w-32 h-32" /> },
//             mp3: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },
//             webm: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },
//             wav: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },
//             ogg: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },
//             flac: { type: 'Audio', preview: <AudioPlayer user={isSender ? user : selectedChatData} source={fileURL} /> },

//             pdf: { type: 'PDF Document', preview: <FaFilePdf onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
//             doc: { type: 'Word Document', preview: <FaFileWord onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
//             docx: { type: 'Word Document', preview: <FaFileWord onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
//             odt: { type: 'Document', preview: <FaFileAlt onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
//             default: { type: 'Unknown File', preview: <FaFile onClick={() => { openInNewTab(fileURL) }} className="cursor-pointer" /> },
//         };
//         return fileData[extension]?.preview || fileData.default.preview;
//     };


//     const renderMessages = () => {
//         let lastDate = null;


//         return selectedChatMessages.map((message, index) => {
//             if (message) {
//                 const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
//                 const showDate = messageDate !== lastDate;
//                 lastDate = messageDate;

//                 const timestamp = moment(message.timestamp).format('LT');
//                 const isSender = message.sender === user._id;

//                 return (
//                     <div key={index}>
//                         {showDate && (
//                             <div className="text-center text-gray-500 my-3">
//                                 <div className="font-medium text-sm">{moment(message.timestamp).format('LL')}</div>
//                             </div>
//                         )}
//                         <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} items-start`}>
//                             <div
//                                 className={`relative ${isSender
//                                     ? 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/40'
//                                     : 'bg-[#2a2b33]/10 text-white/90 border-white/30'
//                                     } border py-2 px-4 rounded-lg my-1 max-w-[60%] break-words`}
//                             >
//                                 <div className={`text-sm ${isSender ? 'text-right' : 'text-left'}`}>
//                                     {message.content || (
//                                         <div className="text-[28px] !important">
//                                             {getFileType(message, isSender)}
//                                         </div>
//                                     )}
//                                 </div>
//                                 <span
//                                     className={`relative  ${isSender ? 'right-3' : 'left-3'} font-thin text-[10px]`}
//                                     style={{
//                                         color: isSender ? '#8417ff' : 'rgba(255, 255, 255, 0.9)',
//                                     }}
//                                 >
//                                     {timestamp}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             }
//         });
//     };

//     return (
//         <div className={`flex-1 overflow-y-auto ${scroolBar} p-4 px-8`}>
//             {renderMessages()}
//             <div ref={scrollRef} />
//         </div>
//     );
// };

// export default MessageContainer;
import React, { useEffect, useRef } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useChatStore } from '../../../store/chatStore';
import moment from 'moment';
import axios from 'axios';
import { FaFileAlt, FaFilePdf, FaFileWord, FaFile } from 'react-icons/fa';
import AudioPlayer from '../../../components/Audio';
import { ServerUrl } from '../../../utils/constants';

const MessageContainer = () => {
    const scrollRef = useRef();
    const { user } = useAuthStore();
    const { selectedChatData, selectedChatMessages, selectedChatType, setSelectedChatMessages } = useChatStore();
    const scrollBar = 'overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#8417ff]/40';

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const requestData = {
                    sender: user._id,
                    recipient: selectedChatData._id,
                    roomID: selectedChatType === "room" ? selectedChatData._id : null,
                };

                const response = await axios.post(`${ServerUrl}/api/chat/get-msg`, requestData, { withCredentials: true });

                if (response.data.success) {
                    setSelectedChatMessages(response.data.messages);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [selectedChatType, selectedChatData, user._id, setSelectedChatMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedChatMessages]);

    const getFileType = (message, isSender) => {
        const fileURL = `${ServerUrl}/${message.fileURL}`;
        const extension = message.fileURL.split('.').pop().toLowerCase();
        
        const openInNewTab = (file) => {
            window.open(file, '_blank');
        };

        const fileData = {
            image: {
                extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'tiff'],
                preview: (file) => <img onClick={() => openInNewTab(file)} src={file} alt="file" className="w-32 h-32 object-cover" />,
            },
            video: {
                extensions: ['mp4', 'mov', 'avi', 'mkv'],
                preview: (file) => <video src={file} controls className="w-32 h-32" />,
            },
            audio: {
                extensions: ['mp3', 'webm', 'wav', 'ogg', 'flac'],
                preview: (file) => <AudioPlayer user={isSender ? user : selectedChatData} source={file} />,
            },
            pdf: {
                extensions: ['pdf'],
                preview: (file) => <FaFilePdf onClick={() => openInNewTab(file)} className="cursor-pointer" />,
            },
            word: {
                extensions: ['doc', 'docx'],
                preview: (file) => <FaFileWord onClick={() => openInNewTab(file)} className="cursor-pointer" />,
            },
            document: {
                extensions: ['odt'],
                preview: (file) => <FaFileAlt onClick={() => openInNewTab(file)} className="cursor-pointer" />,
            },
            unknown: {
                preview: (file) => <FaFile onClick={() => openInNewTab(file)} className="cursor-pointer" />,
            },
        };

        let fileType = fileData.unknown;

        Object.values(fileData).forEach((type) => {
            if (type.extensions.includes(extension)) {
                fileType = type;
            }
        });

        return fileType.preview(fileURL);
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
                                    className={`relative ${isSender ? 'right-3' : 'left-3'} font-thin text-[10px]`}
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
            return null;
        });
    };

    return (
        <div className={`flex-1 overflow-y-auto ${scrollBar} p-4 px-8`}>
            {renderMessages()}
            <div ref={scrollRef} />
        </div>
    );
};

export default MessageContainer;
