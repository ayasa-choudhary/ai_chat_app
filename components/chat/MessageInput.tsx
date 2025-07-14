import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import ImagePreviewModal from './ImagePreviewModal';

// Define the form schema
const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
});

type MessageFormValues = z.infer<typeof messageSchema>;

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
  });

  // Handle form submission
  const onSubmit = (data: MessageFormValues) => {
    if (!isMounted) return;
    onSendMessage(data.content, imagePreview || undefined);
    reset();
    setImagePreview(null);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMounted) return;

    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle removing the image
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (isMounted && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle pressing Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isMounted && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      {/* Image preview - only shown on client side */}
      {isMounted && imagePreview && (
        <div className="relative mb-2 w-24 h-24 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
          <div 
            className="w-full h-full cursor-pointer" 
            onClick={() => setIsPreviewModalOpen(true)}
          >
            <Image 
              src={imagePreview} 
              alt="Preview" 
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <button
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
      )}

      {/* Image preview modal */}
      {imagePreview && (
        <ImagePreviewModal 
          imageUrl={imagePreview} 
          isOpen={isPreviewModalOpen} 
          onClose={() => setIsPreviewModalOpen(false)} 
        />
      )}

      {/* Message form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end">
        <div className="flex-1 relative">
          <textarea
            {...register('content')}
            className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white resize-none"
            placeholder="Type a message..."
            rows={1}
            onKeyDown={handleKeyDown}
          />
          {errors.content && (
            <p className="absolute -top-6 left-0 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}

          {/* Image upload button */}
          <label
            htmlFor="image-upload"
            className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
          </label>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white p-3 rounded-r-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
