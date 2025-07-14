import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toggleDarkMode } from '@/store/slices/uiSlice';
import { createChatroom, deleteChatroom, setActiveChatroom } from '@/store/slices/chatSlice';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schema for new chatroom
const newChatroomSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title is too long'),
});

type NewChatroomFormValues = z.infer<typeof newChatroomSchema>;

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { darkMode, searchQuery } = useSelector((state: RootState) => state.ui);
  const { chatrooms, activeChatroomId } = useSelector((state: RootState) => state.chat);
  const [showNewChatroomForm, setShowNewChatroomForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form for new chatroom
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewChatroomFormValues>({
    resolver: zodResolver(newChatroomSchema),
  });

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
    if (isMounted) {
      toast.success('Logged out successfully');
    }
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
    if (isMounted) {
      toast.success(`${darkMode ? 'Light' : 'Dark'} mode activated`);
    }
  };

  // Handle new chatroom creation
  const onNewChatroomSubmit = (data: NewChatroomFormValues) => {
    dispatch(createChatroom({ title: data.title }));
    setShowNewChatroomForm(false);
    reset();
    if (isMounted) {
      toast.success('New chat created');
    }
  };

  // Handle chatroom deletion
  const handleDeleteChatroom = (id: string) => {
    dispatch(deleteChatroom({ id }));
    setShowDeleteConfirm(null);
    if (isMounted) {
      toast.success('Chat deleted');
    }
  };

  // Handle chatroom selection
  const handleSelectChatroom = (id: string) => {
    dispatch(setActiveChatroom({ id }));
  };

  // Filter chatrooms based on search term
  const filteredChatrooms = chatrooms.filter((chatroom) =>
    (chatroom.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Debounced search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Gemini Chat</h1>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          className="w-full btn btn-primary flex items-center justify-center"
          onClick={() => setShowNewChatroomForm(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Chat
        </button>
      </div>

      {/* New Chatroom Form */}
      {showNewChatroomForm && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit(onNewChatroomSubmit)}>
            <div className="mb-2">
              <input
                type="text"
                {...register('title')}
                className="input"
                placeholder="Enter chat title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="flex-1 btn btn-primary">
                Create
              </button>
              <button
                type="button"
                className="flex-1 btn btn-outline"
                onClick={() => {
                  setShowNewChatroomForm(false);
                  reset();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <input
            type="text"
            className="input pl-10"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Chatroom List */}
      <div className="flex-1 overflow-y-auto">
        {!isMounted ? (
          // Show a placeholder during server-side rendering
          <div className="p-4 text-center text-text-muted-light dark:text-text-muted-dark">
            Loading chats...
          </div>
        ) : filteredChatrooms.length === 0 ? (
          <div className="p-4 text-center text-text-muted-light dark:text-text-muted-dark">
            {searchTerm ? 'No chats found' : 'No chats yet. Create a new chat to get started.'}
          </div>
        ) : (
          <ul>
            {filteredChatrooms.map((chatroom) => (
              <li
                key={chatroom.id}
                className={`p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                  activeChatroomId === chatroom.id
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <div
                    className="flex-1"
                    onClick={() => handleSelectChatroom(chatroom.id)}
                  >
                    <h3 className="font-medium text-text-light dark:text-text-dark">
                      {chatroom.title}
                    </h3>
                    {chatroom.lastMessage && (
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark truncate">
                        {chatroom.lastMessage}
                      </p>
                    )}
                  </div>
                  {showDeleteConfirm === chatroom.id ? (
                    <div className="flex space-x-2">
                      <button
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDeleteChatroom(chatroom.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                      onClick={() => setShowDeleteConfirm(chatroom.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <button
            className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-light"
            onClick={handleDarkModeToggle}
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
          <button
            className="text-text-light dark:text-text-dark hover:text-primary dark:hover:text-primary-light"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
