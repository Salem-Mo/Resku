import { create } from 'zustand';
export const useChatStore = create((set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    dmContacts: [],
    rooms: [],
    setRooms: (rooms) => set({ rooms }),

    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDMContacts: (dmContacts) => set({ dmContacts }),


    addRoom: (room) => {
        const rooms = get().rooms;
        set({
            rooms: [...rooms, room],
        });
    },

    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        set({
            selectedChatMessages: [...selectedChatMessages, message],
        });
        
    },


    closeChat: () =>
        set({
            selectedChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: [],
        }),
}));
