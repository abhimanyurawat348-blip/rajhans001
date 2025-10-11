import React, { useState } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Image {
  url: string;
  uploadedAt?: Date;
}

interface ImageGalleryProps {
  images: Image[];
  folderName: string;
  onClose: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, folderName, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-50">
        <h2 className="text-white text-xl font-bold truncate max-w-md md:max-w-2xl">
          {folderName}
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-white text-sm hidden md:inline">
            {currentIndex + 1} of {images.length}
          </span>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {currentImage && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <div className="flex items-center justify-center w-full h-full">
              <img
                src={currentImage.url}
                alt={`Event image ${currentIndex + 1}`}
                className={`max-h-[80vh] max-w-[90vw] object-contain ${isLoading ? 'hidden' : 'block'}`}
                onLoad={handleImageLoad}
              />
            </div>

            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 text-white hover:text-gray-300 z-10 p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="p-4 bg-black bg-opacity-50">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.div
              key={`image-${index}`}
              className="relative group overflow-hidden rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => {
                  setCurrentIndex(index);
                  setIsLoading(true);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                  index === currentIndex ? 'border-white' : 'border-transparent'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;