import React, { useState, useRef } from 'react';
import { useEventGallery } from '../contexts/EventGalleryContext';
import { Camera, Plus, Upload, Trash2, Folder, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

const EventGallery: React.FC = () => {
  const { folders, loading, error, createFolder, uploadImages } = useEventGallery();
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      setIsCreatingFolder(true);
      
      await createFolder(newFolderName, 'StaffID123');
      setNewFolderName('');
    } catch (err) {
      console.error('Failed to create folder:', err);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleUploadClick = (folderId: string) => {
    setSelectedFolder(folderId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedFolder) return;
    
    try {
      
      const onProgress = (progress: number) => {
        setUploadProgress(prev => ({ ...prev, [selectedFolder]: progress }));
      };
      
      
      setUploadProgress(prev => ({ ...prev, [selectedFolder]: 0 }));
      
      
      await uploadImages(selectedFolder, e.target.files, onProgress);
    } catch (err) {
      console.error('Failed to upload images:', err);
    } finally {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[selectedFolder];
        return newProgress;
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Event Gallery</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleCreateFolder}
            disabled={isCreatingFolder || !newFolderName.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>Create Folder</span>
          </button>
        </div>
      </div>

      {folders.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No event folders created yet.</p>
          <p className="text-gray-400 text-sm mt-2">Create your first folder to start uploading event photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative">
                {folder.coverImage ? (
                  <img 
                    src={folder.coverImage} 
                    alt={folder.eventName}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {folder.images.length} {folder.images.length === 1 ? 'image' : 'images'}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate">{folder.eventName}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {folder.date.toLocaleDateString()}
                </p>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleUploadClick(folder.id)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                </div>
                
                {uploadProgress[folder.id] !== undefined && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[folder.id]}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Uploading... {Math.round(uploadProgress[folder.id])}%
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default EventGallery;