import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import {ServerUrl} from '@/utils/constants';


const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const newSocket = io(ServerUrl);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
