import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Layout from '@/components/layout/Layout';
import ChatInterface from '@/components/chat/ChatInterface';
import EmptyChatState from '@/components/chat/EmptyChatState';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { chatrooms, activeChatroomId } = useSelector((state: RootState) => state.chat);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect to login if not authenticated - only on client side
  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, isMounted]);

  // If not authenticated and mounted, show nothing (will redirect)
  if (isMounted && !isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      {activeChatroomId && chatrooms.find(chat => chat.id === activeChatroomId) ? (
        <ChatInterface />
      ) : (
        <EmptyChatState />
      )}
    </Layout>
  );
}
