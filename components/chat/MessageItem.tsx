import { useState, useEffect } from 'react';
import { Message } from '@/store/slices/chatSlice';
import Image from 'next/image';

interface MessageItemProps {
  message: Message;
  onCopy: () => void;
}

export default function MessageItem({ message, onCopy }: MessageItemProps) {
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Format timestamp
  const formatTime = (timestamp: number) => {
    if (!isMounted) {
      // Return a simple format for server-side rendering
      return '';
    }
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date if needed (for showing date separators)
  const formatDate = (timestamp: number) => {
    if (!isMounted) {
      // Return a simple format for server-side rendering
      return '';
    }
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div 
      className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => isMounted && setShowCopyButton(true)}
      onMouseLeave={() => isMounted && setShowCopyButton(false)}
    >
      <div 
        className={`relative max-w-[80%] rounded-lg p-4 ${
          message.sender === 'user' 
            ? 'bg-primary text-white rounded-tr-none' 
            : 'bg-gray-200 dark:bg-gray-800 text-text-light dark:text-text-dark rounded-tl-none'
        }`}
      >
        {/* Message content */}
        <div className="mb-1">
          {message.imageUrl && (
            <div className="mb-2 relative w-full h-48 rounded-md overflow-hidden">
              <Image 
                src={message.imageUrl} 
                alt="Uploaded image" 
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Timestamp */}
        <div className={`text-xs ${
          message.sender === 'user' 
            ? 'text-blue-100' 
            : 'text-text-muted-light dark:text-text-muted-dark'
        }`}>
          {formatTime(message.timestamp)}
        </div>

        {/* Copy button - only shown on client side */}
        {isMounted && showCopyButton && (
          <button 
            className={`absolute -top-3 -right-3 p-1 rounded-full ${
              message.sender === 'user' 
                ? 'bg-primary-dark text-white' 
                : 'bg-gray-300 dark:bg-gray-700 text-text-light dark:text-text-dark'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            aria-label="Copy message"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
