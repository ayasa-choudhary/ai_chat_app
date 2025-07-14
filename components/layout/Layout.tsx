import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Apply dark mode class to html element - only on client side
  useEffect(() => {
    if (isMounted) {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode, isMounted]);

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar - hidden on mobile by default, shown when menu is open */}
      <div className="hidden md:flex md:w-80 md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar - shown when menu is open */}
      <div className="md:hidden">
        {/* Mobile menu button would go here */}
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
