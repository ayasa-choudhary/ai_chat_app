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

// Create default chatrooms
export const createDefaultChatrooms = (): Chatroom[] => {
  const now = Date.now();
  const timeInterval = 60000; // 1 minute interval between messages

  // First default chat - AI Assistant Help
  const firstChat: Chatroom = {
    id: (now - timeInterval * 25).toString(),
    title: "AI Assistant Help",
    lastMessage: "Is there anything else you'd like to know about AI assistants?",
    lastMessageTimestamp: now - timeInterval,
    messages: [
      {
        id: (now - timeInterval * 25).toString(),
        content: "Welcome to the AI Assistant Help chat! I'm here to answer your questions about AI and how to use this application effectively.",
        sender: "ai",
        timestamp: now - timeInterval * 25
      },
      {
        id: (now - timeInterval * 24).toString(),
        content: "Hi! What can AI assistants like you do?",
        sender: "user",
        timestamp: now - timeInterval * 24
      },
      {
        id: (now - timeInterval * 23).toString(),
        content: "AI assistants like me can help with a variety of tasks including answering questions, providing information, assisting with creative writing, summarizing content, and engaging in conversations. I'm designed to be helpful, harmless, and honest in my interactions.",
        sender: "ai",
        timestamp: now - timeInterval * 23
      },
      {
        id: (now - timeInterval * 22).toString(),
        content: "How do you work? Do you understand what I'm saying?",
        sender: "user",
        timestamp: now - timeInterval * 22
      },
      {
        id: (now - timeInterval * 21).toString(),
        content: "I work using large language models that have been trained on vast amounts of text data. I process your input by analyzing patterns and context to generate appropriate responses. While I don't 'understand' in the human sense, I can recognize patterns, context, and semantic meaning to provide relevant and helpful responses.",
        sender: "ai",
        timestamp: now - timeInterval * 21
      },
      {
        id: (now - timeInterval * 20).toString(),
        content: "Are my conversations with you private?",
        sender: "user",
        timestamp: now - timeInterval * 20
      },
      {
        id: (now - timeInterval * 19).toString(),
        content: "In this application, your conversations are stored locally in your browser's localStorage. They aren't sent to external servers unless that functionality has been specifically implemented by the developers. Always check the privacy policy of any AI application you use to understand how your data is handled.",
        sender: "ai",
        timestamp: now - timeInterval * 19
      },
      {
        id: (now - timeInterval * 18).toString(),
        content: "Can you remember things I tell you between different chats?",
        sender: "user",
        timestamp: now - timeInterval * 18
      },
      {
        id: (now - timeInterval * 17).toString(),
        content: "In this implementation, I don't have the ability to remember information between different chat sessions. Each chat is treated as a separate conversation. If you want me to know something important, you'll need to mention it in the current chat.",
        sender: "ai",
        timestamp: now - timeInterval * 17
      },
      {
        id: (now - timeInterval * 16).toString(),
        content: "What are your limitations?",
        sender: "user",
        timestamp: now - timeInterval * 16
      },
      {
        id: (now - timeInterval * 15).toString(),
        content: "I have several limitations: I don't have access to the internet or real-time data, I can't run code or access external systems, my knowledge has a cutoff date, I can't learn in the traditional sense (though I can follow instructions within a conversation), and I may occasionally provide incorrect information. I also can't see or hear - I can only process text input.",
        sender: "ai",
        timestamp: now - timeInterval * 15
      },
      {
        id: (now - timeInterval * 14).toString(),
        content: "How can I get the best results when talking with you?",
        sender: "user",
        timestamp: now - timeInterval * 14
      },
      {
        id: (now - timeInterval * 13).toString(),
        content: "To get the best results: 1) Be specific and clear in your requests, 2) Provide context when needed, 3) Break complex questions into smaller parts, 4) If my response isn't helpful, try rephrasing your question, 5) Let me know if you want more detailed or simpler explanations, and 6) Provide feedback so I can adjust my responses.",
        sender: "ai",
        timestamp: now - timeInterval * 13
      },
      {
        id: (now - timeInterval * 12).toString(),
        content: "Can you help me with coding problems?",
        sender: "user",
        timestamp: now - timeInterval * 12
      },
      {
        id: (now - timeInterval * 11).toString(),
        content: "Yes, I can help with coding problems by explaining concepts, suggesting approaches, reviewing code snippets, helping debug issues, and providing examples in various programming languages. However, I can't execute code or test solutions directly, so you'll need to implement and test the code yourself.",
        sender: "ai",
        timestamp: now - timeInterval * 11
      },
      {
        id: (now - timeInterval * 10).toString(),
        content: "What about creative writing? Can you help with that?",
        sender: "user",
        timestamp: now - timeInterval * 10
      },
      {
        id: (now - timeInterval * 9).toString(),
        content: "Absolutely! I can assist with creative writing by generating story ideas, helping develop characters, suggesting plot points, providing feedback on your writing, helping overcome writer's block, and even drafting sample content based on your specifications. Just let me know what kind of creative project you're working on.",
        sender: "ai",
        timestamp: now - timeInterval * 9
      },
      {
        id: (now - timeInterval * 8).toString(),
        content: "How do I create a new chat in this application?",
        sender: "user",
        timestamp: now - timeInterval * 8
      },
      {
        id: (now - timeInterval * 7).toString(),
        content: "To create a new chat in this application, look for a 'New Chat' button in the sidebar or navigation menu. Clicking this button will start a fresh conversation. Your previous chats should still be accessible from the sidebar if you want to return to them later.",
        sender: "ai",
        timestamp: now - timeInterval * 7
      },
      {
        id: (now - timeInterval * 6).toString(),
        content: "Can I delete messages or entire chats?",
        sender: "user",
        timestamp: now - timeInterval * 6
      },
      {
        id: (now - timeInterval * 5).toString(),
        content: "Yes, most chat interfaces allow you to delete entire conversations. Look for a delete option (often represented by a trash icon) next to each chat in the sidebar. Individual message deletion might not be supported in all implementations, but check for context menus when you right-click or hover over messages.",
        sender: "ai",
        timestamp: now - timeInterval * 5
      },
      {
        id: (now - timeInterval * 4).toString(),
        content: "What happens if I refresh the page or close my browser?",
        sender: "user",
        timestamp: now - timeInterval * 4
      },
      {
        id: (now - timeInterval * 3).toString(),
        content: "Since this application stores your chats in localStorage, they should persist even if you refresh the page or close your browser. When you return to the application, your previous conversations should still be available. However, if you clear your browser data or use private/incognito mode, your chat history might be lost.",
        sender: "ai",
        timestamp: now - timeInterval * 3
      },
      {
        id: (now - timeInterval * 2).toString(),
        content: "Thanks for all this information! It's very helpful.",
        sender: "user",
        timestamp: now - timeInterval * 2
      },
      {
        id: (now - timeInterval).toString(),
        content: "You're welcome! I'm glad I could help. Is there anything else you'd like to know about AI assistants?",
        sender: "ai",
        timestamp: now - timeInterval
      }
    ]
  };

  // Second default chat - Technology Guide
  const secondChat: Chatroom = {
    id: now.toString(),
    title: "Technology Guide",
    lastMessage: "Feel free to ask more questions about any technology topic!",
    lastMessageTimestamp: now,
    messages: [
      {
        id: (now - timeInterval * 24).toString(),
        content: "Welcome to the Technology Guide! I can help answer your questions about various technology topics.",
        sender: "ai",
        timestamp: now - timeInterval * 24
      },
      {
        id: (now - timeInterval * 23).toString(),
        content: "Hi! Can you explain what artificial intelligence is in simple terms?",
        sender: "user",
        timestamp: now - timeInterval * 23
      },
      {
        id: (now - timeInterval * 22).toString(),
        content: "Artificial Intelligence (AI) is technology that enables computers to perform tasks that typically require human intelligence. This includes recognizing patterns, learning from experience, making decisions, and understanding language. Think of it as teaching computers to think and solve problems in ways similar to humans, but often using different methods.",
        sender: "ai",
        timestamp: now - timeInterval * 22
      },
      {
        id: (now - timeInterval * 21).toString(),
        content: "What's the difference between AI, machine learning, and deep learning?",
        sender: "user",
        timestamp: now - timeInterval * 21
      },
      {
        id: (now - timeInterval * 20).toString(),
        content: "These terms are related but different in scope: AI is the broadest concept - any technology that enables machines to mimic human intelligence. Machine learning is a subset of AI where systems learn from data without explicit programming. Deep learning is a specialized type of machine learning using neural networks with many layers (hence 'deep') to process data in increasingly complex ways, particularly effective for tasks like image and speech recognition.",
        sender: "ai",
        timestamp: now - timeInterval * 20
      },
      {
        id: (now - timeInterval * 19).toString(),
        content: "What is cloud computing?",
        sender: "user",
        timestamp: now - timeInterval * 19
      },
      {
        id: (now - timeInterval * 18).toString(),
        content: "Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the internet ('the cloud'). Instead of owning and maintaining physical servers and infrastructure, you can rent these resources from cloud providers like AWS, Microsoft Azure, or Google Cloud. This offers benefits like flexibility, cost-efficiency, scalability, and accessibility from anywhere with an internet connection.",
        sender: "ai",
        timestamp: now - timeInterval * 18
      },
      {
        id: (now - timeInterval * 17).toString(),
        content: "Can you explain what blockchain technology is?",
        sender: "user",
        timestamp: now - timeInterval * 17
      },
      {
        id: (now - timeInterval * 16).toString(),
        content: "Blockchain is a distributed digital ledger technology that records transactions across many computers so that any involved record cannot be altered retroactively. It works by combining several key elements: decentralization (no single authority controls it), transparency (all transactions are visible), immutability (records can't be changed once added), and cryptographic security. While best known for powering cryptocurrencies like Bitcoin, blockchain has many other potential applications including supply chain tracking, digital identity verification, and smart contracts.",
        sender: "ai",
        timestamp: now - timeInterval * 16
      },
      {
        id: (now - timeInterval * 15).toString(),
        content: "What is the Internet of Things (IoT)?",
        sender: "user",
        timestamp: now - timeInterval * 15
      },
      {
        id: (now - timeInterval * 14).toString(),
        content: "The Internet of Things (IoT) refers to the network of physical objects—'things'—embedded with sensors, software, and other technologies to connect and exchange data with other devices and systems over the internet. Examples include smart home devices (thermostats, lights, security systems), wearable fitness trackers, connected appliances, and industrial sensors. IoT enables these objects to collect and share data, creating opportunities for more direct integration between the physical world and computer-based systems.",
        sender: "ai",
        timestamp: now - timeInterval * 14
      },
      {
        id: (now - timeInterval * 13).toString(),
        content: "What's the difference between augmented reality (AR) and virtual reality (VR)?",
        sender: "user",
        timestamp: now - timeInterval * 13
      },
      {
        id: (now - timeInterval * 12).toString(),
        content: "Augmented Reality (AR) enhances your real-world environment by overlaying digital information on top of it. Examples include Pokémon GO or furniture placement apps. Virtual Reality (VR), on the other hand, replaces your environment with a completely virtual one, typically using headsets that block out the physical world. The key difference: AR adds to reality, while VR replaces it entirely. There's also Mixed Reality (MR), which blends elements of both by anchoring virtual objects to the real world that can interact with your environment.",
        sender: "ai",
        timestamp: now - timeInterval * 12
      },
      {
        id: (now - timeInterval * 11).toString(),
        content: "What is 5G technology?",
        sender: "user",
        timestamp: now - timeInterval * 11
      },
      {
        id: (now - timeInterval * 10).toString(),
        content: "5G is the fifth generation of cellular network technology, designed to significantly increase the speed and responsiveness of wireless networks. Compared to 4G, 5G offers faster data speeds (up to 10 Gbps), lower latency (1-10 milliseconds), increased capacity for more connected devices, and more reliability. These improvements enable new applications like enhanced mobile broadband, mission-critical communications, and massive IoT deployments. 5G uses higher frequency radio waves than previous generations, which provide more bandwidth but travel shorter distances.",
        sender: "ai",
        timestamp: now - timeInterval * 10
      },
      {
        id: (now - timeInterval * 9).toString(),
        content: "What are some emerging technologies I should know about?",
        sender: "user",
        timestamp: now - timeInterval * 9
      },
      {
        id: (now - timeInterval * 8).toString(),
        content: "Some important emerging technologies include: 1) Quantum Computing - using quantum mechanics to process information in new ways, 2) Edge Computing - processing data closer to where it's created rather than in centralized data centers, 3) Extended Reality (XR) - combining VR, AR and MR, 4) Autonomous Vehicles - self-driving cars and other transport, 5) Biotechnology advances like CRISPR gene editing, 6) Advanced AI systems with greater reasoning capabilities, and 7) Sustainable energy technologies. These fields are rapidly evolving and likely to significantly impact society in the coming years.",
        sender: "ai",
        timestamp: now - timeInterval * 8
      },
      {
        id: (now - timeInterval * 7).toString(),
        content: "How does cybersecurity work?",
        sender: "user",
        timestamp: now - timeInterval * 7
      },
      {
        id: (now - timeInterval * 6).toString(),
        content: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. It works through multiple layers of protection including: 1) Network security (firewalls, intrusion detection), 2) Endpoint security (antivirus software, device management), 3) Application security (code reviews, authentication), 4) Data security (encryption, backups), and 5) Identity management (access controls, multi-factor authentication). Effective cybersecurity also requires ongoing monitoring, regular updates, security awareness training, and incident response planning to address evolving threats.",
        sender: "ai",
        timestamp: now - timeInterval * 6
      },
      {
        id: (now - timeInterval * 5).toString(),
        content: "What programming languages are most popular right now?",
        sender: "user",
        timestamp: now - timeInterval * 5
      },
      {
        id: (now - timeInterval * 4).toString(),
        content: "The most popular programming languages currently include: 1) Python - widely used in data science, AI, web development, and automation, 2) JavaScript - essential for web development, 3) Java - common in enterprise applications and Android development, 4) C/C++ - used for system programming and performance-critical applications, 5) TypeScript - a typed superset of JavaScript gaining popularity, 6) Go - efficient for cloud and network services, 7) Rust - valued for memory safety and performance, and 8) SQL - still crucial for database management. The best language to learn depends on your specific goals and the field you're interested in.",
        sender: "ai",
        timestamp: now - timeInterval * 4
      },
      {
        id: (now - timeInterval * 3).toString(),
        content: "How is AI being used in healthcare?",
        sender: "user",
        timestamp: now - timeInterval * 3
      },
      {
        id: (now - timeInterval * 2).toString(),
        content: "AI is transforming healthcare in numerous ways: 1) Diagnostic assistance - analyzing medical images to detect diseases like cancer, 2) Drug discovery - accelerating the identification of potential new medications, 3) Personalized medicine - tailoring treatments based on individual patient data, 4) Predictive analytics - forecasting patient deterioration or disease outbreaks, 5) Virtual nursing assistants - monitoring patients and answering questions, 6) Administrative efficiency - automating paperwork and scheduling, and 7) Robotic surgery - enhancing precision in surgical procedures. These applications aim to improve patient outcomes, reduce costs, and address healthcare workforce shortages.",
        sender: "ai",
        timestamp: now - timeInterval * 2
      },
      {
        id: (now - timeInterval).toString(),
        content: "Thanks for all this information! I've learned a lot.",
        sender: "user",
        timestamp: now - timeInterval
      },
      {
        id: now.toString(),
        content: "You're welcome! I'm glad you found it helpful. Feel free to ask more questions about any technology topic!",
        sender: "ai",
        timestamp: now
      }
    ]
  };

  return [firstChat, secondChat];
};

// Load chatrooms from localStorage if available
const loadChatroomsFromStorage = (): Chatroom[] => {
  if (typeof window !== 'undefined') {
    const storedChatrooms = localStorage.getItem('chatrooms');
    if (storedChatrooms) {
      return JSON.parse(storedChatrooms);
    }
  }
  // Return default chatrooms if none found in localStorage
  const defaultChatrooms = createDefaultChatrooms();
  // Save default chatrooms to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('chatrooms', JSON.stringify(defaultChatrooms));
  }
  return defaultChatrooms;
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
