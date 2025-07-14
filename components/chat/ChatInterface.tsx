import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { sendMessage, receiveMessage, setTypingStatus, Message } from '@/store/slices/chatSlice';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import toast from 'react-hot-toast';

export default function ChatInterface() {
  const dispatch = useDispatch();
  const { chatrooms, activeChatroomId, isTyping } = useSelector((state: RootState) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const messagesPerPage = 20;
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get active chatroom
  const activeChatroom = chatrooms.find((room) => room.id === activeChatroomId);

  // Get paginated messages
  const allMessages = activeChatroom?.messages || [];
  const paginatedMessages = allMessages.slice(-page * messagesPerPage);

  // Scroll to bottom when messages change or when typing status changes
  useEffect(() => {
    if (isMounted) {
      scrollToBottom();
    }
  }, [paginatedMessages.length, isTyping, isMounted]);

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    if (isMounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle loading more messages (pagination)
  const handleLoadMore = () => {
    if (page * messagesPerPage < allMessages.length) {
      setPage(page + 1);
    }
  };

  // Handle sending a message
  const handleSendMessage = (content: string, imageUrl?: string) => {
    if (!activeChatroomId || !isMounted) return;

    // Send user message
    dispatch(sendMessage({ content, imageUrl }));

    // Simulate AI typing
    dispatch(setTypingStatus(true));

    // Simulate AI response after a delay
    const delay = Math.floor(Math.random() * 2000) + 1000; // Random delay between 1-3 seconds

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        // Generate a simple AI response
        let response = '';

        if (content.toLowerCase().includes('hello') || content.toLowerCase().includes('hi')) {
          response = 'Hello! How can I assist you today?';
        } else if (content.toLowerCase().includes('help')) {
          response = 'I\'m here to help. What do you need assistance with?';
        } else if (content.toLowerCase().includes('thank')) {
          response = 'You\'re welcome! Is there anything else you\'d like to know?';
        } else if (content.toLowerCase().includes('bye') || content.toLowerCase().includes('goodbye')) {
          response = 'Goodbye! Have a great day!';
        } else if (content.toLowerCase().includes('weather')) {
          response = 'I\'m sorry, I don\'t have access to real-time weather data. You might want to check a weather service for that information.';
        } else if (content.toLowerCase().includes('name')) {
          response = 'I\'m Gemini, an AI assistant designed to help you with various tasks and answer your questions.';
        } else if (imageUrl) {
          response = 'I can see the image you shared. It looks interesting! What would you like to know about it?';
        } else {
          // Default responses
          const defaultResponses = [
            'That\'s an interesting point. Can you tell me more?',
            'I understand. How can I help you further with this?',
            'Thanks for sharing that information. What would you like to do next?',
            'I see what you mean. Is there a specific aspect you\'d like to explore?',
            'That\'s a good question. Let me think about how to best address it.',
          ];
          response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }

        // Stop typing and send AI response
        dispatch(setTypingStatus(false));
        dispatch(receiveMessage({ content: response }));
      }, delay);
    }
  };

  // Handle copying message to clipboard
  const handleCopyMessage = (message: Message) => {
    if (isMounted && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(message.content)
        .then(() => {
          toast.success('Message copied to clipboard');
        })
        .catch(() => {
          toast.error('Failed to copy message');
        });
    }
  };

  if (!activeChatroom) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
          {activeChatroom.title}
        </h2>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Load more button */}
        {allMessages.length > paginatedMessages.length && (
          <div className="flex justify-center mb-4">
            <button
              className="btn btn-outline text-sm py-1"
              onClick={handleLoadMore}
            >
              Load older messages
            </button>
          </div>
        )}

        {/* Messages */}
        {!isMounted ? (
          // Show a placeholder during server-side rendering
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Loading messages...
            </p>
          </div>
        ) : paginatedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-text-muted-light dark:text-text-muted-dark">
              No messages yet. Start a conversation!
            </p>
          </div>
        ) : (
          paginatedMessages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onCopy={() => handleCopyMessage(message)}
            />
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-text-muted-light dark:text-text-muted-dark my-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '600ms' }}></div>
            </div>
            <p>Gemini is typing...</p>
          </div>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
