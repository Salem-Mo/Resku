// import React, { useState, useRef, useEffect } from "react";
// import { GrAttachment } from "react-icons/gr";
// import { RiEmojiStickerLine } from "react-icons/ri";
// import { IoSend } from "react-icons/io5";
// import { CiMicrophoneOn } from "react-icons/ci";
// import EmojiPicker from "emoji-picker-react";
// import { useChatStore } from "@/store/chatStore";
// import { useAuthStore } from "@/store/authStore";
// import { io } from "socket.io-client";
// import axios from "axios";

// const MessageBar = () => {
//   const emojiRef = useRef();
//   const fileInputRef = useRef();
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const [recording, setRecording] = useState(false);
//   const [message, setMessage] = useState("");
//   const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
//   const { selectedChatData, selectedChatType } = useChatStore();
//   const { user } = useAuthStore();
//   const { addMessage } = useChatStore();
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const handleEmojiPickerOutside = (event) => {
//       if (emojiRef.current && !emojiRef.current.contains(event.target)) {
//         setEmojiPickerOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleEmojiPickerOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleEmojiPickerOutside);
//     };
//   }, []);

//   useEffect(() => {
//     const newSocket = io("http://localhost:5000");
//     setSocket(newSocket);

//     newSocket.emit("joinRoom", { userId: user._id });

//     newSocket.on("receiveMessage", (msg) => {
//       addMessage(msg);
//       console.log(msg);
//     });

//     return () => newSocket.close();
//   }, [user._id, addMessage]);

//   const handleAddEmoji = (emoji) => {
//     setMessage((prev) => prev + emoji.emoji);
//   };

//   const handleMicPress = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) audioChunksRef.current.push(e.data);
//       };

//       mediaRecorder.start();
//       setRecording(true);
//     } catch (error) {
//       console.error("Error accessing microphone:", error);
//     }
//   };

//   const handleMicRelease = async () => {
//     if (!mediaRecorderRef.current) return;

//     mediaRecorderRef.current.stop();
//     mediaRecorderRef.current.onstop = async () => {
//       const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//       const audioFile = new File([audioBlob], "recording.mp3", { type: "audio/webm" });

//       const fakeEvent = { target: { files: [audioFile] } };
//       await handleAttachmentChange(fakeEvent);

//       setRecording(false);
//     };
//   };

//   const handleAttachmentClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleAttachmentChange = async (event) => {
//     try {
//       const file = event.target.files[0];
//       if (file && file.size > 0) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("sender", user._id);
//         formData.append("recipient", selectedChatData._id);
//         formData.append("msgType", file.type.startsWith("audio") ? "audio" : "file");

//         const response = await axios.post(
//           "http://localhost:5000/api/chat/upload-file",
//           formData,
//           { withCredentials: true }
//         );

//         if (response.data.success) {
//           const newMessage = {
//             sender: user._id,
//             content: undefined,
//             recipient: selectedChatData._id,
//             msgType: file.type.startsWith("audio") ? "audio" : "file",
//             fileURL: response.data.filePath,
//             timestamp: new Date(),
//           };

//           socket.emit("sendMessage", { to: selectedChatData._id, newMessage });
//           addMessage(newMessage);
//         }
//       } else {
//         console.error("File is empty or invalid.");
//       }
//     } catch (error) {
//       console.error("Error handling attachment change:", error);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (message && selectedChatData._id && selectedChatType === "dm") {
//       const newMessage = {
//         sender: user._id,
//         content: message,
//         recipient: selectedChatData._id,
//         msgType: "text",
//         fileURL: undefined,
//         timestamp: new Date(),
//       };
//       if (message && selectedChatData._id && selectedChatType === "room") {
//         const newMessage = {
//           sender: user._id,
//           content: message,
//           recipient: selectedChatData._id,
//           roomID: selectedChatData._id,
//           msgType: "text",
//           fileURL: undefined,
//           timestamp: new Date(),
//         };
//       try {
//         socket.emit("sendMessage", { to: selectedChatData._id, newMessage });

//         const response = await axios.post(
//           "http://localhost:5000/api/chat/save-msg",
//           { newMessage },
//           { withCredentials: true }
//         );
//         if (response.data.success) {
//           addMessage(newMessage);
//           setMessage("");
//         }
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }}
//   };
//   const handleSendMessage = async () => {
//     if (message && selectedChatData._id) {
//         let newMessage;
        
//         if (selectedChatType === "dm") {
//             newMessage = {
//                 sender: user._id,
//                 content: message,
//                 recipient: selectedChatData._id,
//                 msgType: "text",
//                 fileURL: undefined,
//                 timestamp: new Date(),
//             };
//         } else if (selectedChatType === "room") {
//             newMessage = {
//                 sender: user._id,
//                 content: message,
//                 recipient: selectedChatData._id,
//                 roomID: selectedChatData._id,
//                 msgType: "text",
//                 fileURL: undefined,
//                 timestamp: new Date(),
//             };
//         }

//         if (newMessage) {
//             try {
//                 socket.emit("sendMessage", { to: selectedChatData._id, newMessage });

//                 const response = await axios.post(
//                     "http://localhost:5000/api/chat/save-msg",
//                     { newMessage },
//                     { withCredentials: true }
//                 );

//                 if (response.data.success) {
//                     addMessage(newMessage);
//                     setMessage("");
//                 }
//             } catch (error) {
//                 console.error("Error sending message:", error);
//             }
//         }
//     }
// };

//   return (
//     <div className="h-[10vh] bg-[#1c1b25] flex justify-center items-center px-8 mb-6 gap-6">
//       <div className="flex-1 flex bg-[#2a2b33] items-center gap-5 pr-5 rounded-md">
//         <input
//           type="text"
//           className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
//           placeholder="Type a message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button
//           onMouseDown={handleMicPress}
//           onMouseUp={handleMicRelease}
//           className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
//         >
//           <CiMicrophoneOn
//             className={`text-2xl ${recording ? "text-red-500" : "text-neutral-500"}`}
//           />
//         </button>
//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           onChange={handleAttachmentChange}
//         />
//         <button
//           className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
//           onClick={handleAttachmentClick}
//         >
//           <GrAttachment className="text-2xl" />
//         </button>
//         <button
//           className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
//           onClick={() => setEmojiPickerOpen((prev) => !prev)}
//         >
//           <RiEmojiStickerLine className="text-2xl" />
//         </button>
//         {emojiPickerOpen && (
//           <div ref={emojiRef} className="absolute bottom-16 right-0">
//             <EmojiPicker theme="dark" onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
//           </div>
//         )}
//       </div>
//       <button
//         className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
//         onClick={handleSendMessage}
//       >
//         <IoSend className="text-2xl" />
//       </button>
//     </div>
//   );
// };

// export default MessageBar;
import React, { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { CiMicrophoneOn } from "react-icons/ci";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { io } from "socket.io-client";
import axios from "axios";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { selectedChatData, selectedChatType } = useChatStore();
  const { user } = useAuthStore();
  const { addMessage } = useChatStore();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const handleEmojiPickerOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleEmojiPickerOutside);
    return () => {
      document.removeEventListener("mousedown", handleEmojiPickerOutside);
    };
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("joinRoom", { userId: user._id });

    newSocket.on("receiveMessage", (msg) => {
      addMessage(msg);
      console.log(msg);
    });

    return () => newSocket.close();
  }, [user._id, addMessage]);

  const handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleMicPress = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleMicRelease = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const audioFile = new File([audioBlob], "recording.mp3", { type: "audio/webm" });

      const fakeEvent = { target: { files: [audioFile] } };
      await handleAttachmentChange(fakeEvent);

      setRecording(false);
    };
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file && file.size > 0) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sender", user._id);
        formData.append("recipient", selectedChatData._id);
        formData.append("msgType", file.type.startsWith("audio") ? "audio" : "file");

        const response = await axios.post(
          "http://localhost:5000/api/chat/upload-file",
          formData,
          { withCredentials: true }
        );

        if (response.data.success) {
          const newMessage = {
            sender: user._id,
            content: undefined,
            recipient: selectedChatData._id,
            msgType: file.type.startsWith("audio") ? "audio" : "file",
            fileURL: response.data.filePath,
            timestamp: new Date(),
          };

          socket.emit("sendMessage", { to: selectedChatData._id, newMessage });
          addMessage(newMessage);
        }
      } else {
        console.error("File is empty or invalid.");
      }
    } catch (error) {
      console.error("Error handling attachment change:", error);
    }
  };

  const handleSendMessage = async () => {
    if (message && selectedChatData._id) {
      // let newMessage;
      const newMessage = {
          sender: user._id,
          content: message,
          recipient: selectedChatData._id,
          msgType: "text",
          fileURL: undefined,
          timestamp: new Date(),
      };

      // if (selectedChatType === "dm") {
      //   newMessage = {
      //     sender: user._id,
      //     content: message,
      //     recipient: selectedChatData._id,
      //     msgType: "text",
      //     fileURL: undefined,
      //     timestamp: new Date(),
      //   };
      // } else if (selectedChatType === "room") {
        // newMessage = {
        //   sender: user._id,
        //   content: message,
        //   recipient: selectedChatData._id,
        //   roomID: selectedChatData._id,
        //   msgType: "text",
        //   fileURL: undefined,
        //   timestamp: new Date(),
        // };
      // }

      if (newMessage) {
        try {
          socket.emit("sendMessage", { to: selectedChatData._id, newMessage });

          const response = await axios.post(
            "http://localhost:5000/api/chat/save-msg",
            { newMessage },
            { withCredentials: true }
          );

          if (response.data.success) {
            addMessage(newMessage);
            setMessage("");
          }
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    }
  };

  return (
    <div className="h-[10vh] bg-[#1c1b25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] items-center gap-5 pr-5 rounded-md">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onMouseDown={handleMicPress}
          onMouseUp={handleMicRelease}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <CiMicrophoneOn
            className={`text-2xl ${recording ? "text-red-500" : "text-neutral-500"}`}
          />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleAttachmentChange}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={() => setEmojiPickerOpen((prev) => !prev)}
        >
          <RiEmojiStickerLine className="text-2xl" />
        </button>
        {emojiPickerOpen && (
          <div ref={emojiRef} className="absolute bottom-16 right-0">
            <EmojiPicker theme="dark" onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
          </div>
        )}
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
