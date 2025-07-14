import { useDispatch } from 'react-redux';
import { createChatroom } from '@/store/slices/chatSlice';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function EmptyChatState() {
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCreateNewChat = () => {
    dispatch(createChatroom({ title: 'New Chat' }));
    if (isMounted) {
      toast.success('New chat created');
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-text-muted-light dark:text-text-muted-dark mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
          No Active Chat
        </h2>
        <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
          Select an existing chat from the sidebar or create a new one to start a conversation with Gemini.
        </p>
        <button
          className="btn btn-primary"
          onClick={handleCreateNewChat}
        >
          Create New Chat
        </button>
      </div>
    </div>
  );
}
