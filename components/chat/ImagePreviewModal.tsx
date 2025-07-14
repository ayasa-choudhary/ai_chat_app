import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImagePreviewModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImagePreviewModal({ imageUrl, isOpen, onClose }: ImagePreviewModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    
    // Add event listener to close modal on escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Don't render anything on server-side
  if (!isMounted) return null;
  
  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <div 
          className="relative w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Image 
            src={imageUrl} 
            alt="Image preview" 
            className="object-contain max-w-full max-h-[90vh]"
            width={1200}
            height={900}
          />
          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
            onClick={onClose}
            aria-label="Close preview"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
      </div>
    </div>
  );
}