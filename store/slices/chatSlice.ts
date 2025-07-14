import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  imageUrl?: string;
}

export interface Chatroom {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp?: number;
  messages: Message[];
}

interface ChatState {
  chatrooms: Chatroom[];
  activeChatroomId: string | null;
  isTyping: boolean;
}

// Load chatrooms from localStorage if available
const loadChatroomsFromStorage = (): Chatroom[] => {
  if (typeof window !== 'undefined') {
    const storedChatrooms = localStorage.getItem('chatrooms');
    if (storedChatrooms) {
      return JSON.parse(storedChatrooms);
    }
  }
  return [];
};

const initialState: ChatState = {
  chatrooms: loadChatroomsFromStorage(),
  activeChatroomId: null,
  isTyping: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createChatroom: (state, action: PayloadAction<{ title: string }>) => {
      const newChatroom: Chatroom = {
        id: Date.now().toString(),
        title: action.payload.title,
        messages: [],
      };
      state.chatrooms.push(newChatroom);
      state.activeChatroomId = newChatroom.id;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatrooms', JSON.stringify(state.chatrooms));
      }
    },
    deleteChatroom: (state, action: PayloadAction<{ id: string }>) => {
      state.chatrooms = state.chatrooms.filter(
        (chatroom) => chatroom.id !== action.payload.id
      );
      
      if (state.activeChatroomId === action.payload.id) {
        state.activeChatroomId = state.chatrooms.length > 0 ? state.chatrooms[0].id : null;
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatrooms', JSON.stringify(state.chatrooms));
      }
    },
    setActiveChatroom: (state, action: PayloadAction<{ id: string }>) => {
      state.activeChatroomId = action.payload.id;
    },
    sendMessage: (state, action: PayloadAction<{ content: string; imageUrl?: string }>) => {
      if (!state.activeChatroomId) return;
      
      const chatroom = state.chatrooms.find(
        (room) => room.id === state.activeChatroomId
      );
      
      if (chatroom) {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: action.payload.content,
          sender: 'user',
          timestamp: Date.now(),
          imageUrl: action.payload.imageUrl,
        };
        
        chatroom.messages.push(newMessage);
        chatroom.lastMessage = newMessage.content;
        chatroom.lastMessageTimestamp = newMessage.timestamp;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('chatrooms', JSON.stringify(state.chatrooms));
        }
      }
    },
    receiveMessage: (state, action: PayloadAction<{ content: string; chatroomId?: string }>) => {
      const targetChatroomId = action.payload.chatroomId || state.activeChatroomId;
      if (!targetChatroomId) return;
      
      const chatroom = state.chatrooms.find(
        (room) => room.id === targetChatroomId
      );
      
      if (chatroom) {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: action.payload.content,
          sender: 'ai',
          timestamp: Date.now(),
        };
        
        chatroom.messages.push(newMessage);
        chatroom.lastMessage = newMessage.content;
        chatroom.lastMessageTimestamp = newMessage.timestamp;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('chatrooms', JSON.stringify(state.chatrooms));
        }
      }
    },
    setTypingStatus: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
  },
});

export const {
  createChatroom,
  deleteChatroom,
  setActiveChatroom,
  sendMessage,
  receiveMessage,
  setTypingStatus,
} = chatSlice.actions;

export default chatSlice.reducer;