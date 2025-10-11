import React, { useState } from 'react';
import { Camera, ArrowRight } from 'lucide-react';
import { useEventGallery } from '../contexts/EventGalleryContext';
import ImageGallery from './ImageGallery';

const MemoriesFlashcard: React.FC = () => {
  const { folders, loading, error } = useEventGallery();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  if (loading || error || folders.length === 0) {
    return null;
  }

  const latestFolder = folders[0];

  const handleOpenGallery = () => {
    setSelectedFolder(latestFolder.id);
  };

  const handleCloseGallery = () => {
    setSelectedFolder(null);
  };

  return (
    <>
      <div 
        onClick={handleOpenGallery}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300 relative overflow-hidden cursor-pointer"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 mx-auto shadow-lg">
          <Camera className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-center mb-3 text-gray-900">
          Memories
        </h3>
        <p className="text-gray-700 text-center text-sm">
          Relive our most cherished moments from school events
        </p>
        <div className="text-center mt-4">
          <div className="inline-flex items-center font-semibold text-sm transition-colors duration-200 text-purple-600 hover:text-purple-700">
            View Gallery
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          NEW
        </div>
      </div>

      {selectedFolder && (
        <ImageGallery
          images={latestFolder.images}
          folderName={latestFolder.eventName}
          onClose={handleCloseGallery}
        />
      )}
    </>
  );
};

export default MemoriesFlashcard;