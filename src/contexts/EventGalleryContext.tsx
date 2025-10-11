import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

interface Image {
  url: string;
  uploadedAt?: Date;
}

interface EventFolder {
  id: string;
  eventName: string;
  uploadedBy: string;
  date: Date;
  coverImage?: string;
  images: Image[];
}

interface EventGalleryContextType {
  folders: EventFolder[];
  loading: boolean;
  error: string | null;
  createFolder: (folderName: string, userId: string) => Promise<void>;
  uploadImages: (folderId: string, files: FileList, onProgress?: (progress: number) => void) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  deleteImage: (folderId: string, imageUrl: string) => Promise<void>;
  loadFolders: () => Promise<void>;
}

const EventGalleryContext = createContext<EventGalleryContextType | undefined>(undefined);

export const useEventGallery = () => {
  const context = useContext(EventGalleryContext);
  if (context === undefined) {
    throw new Error('useEventGallery must be used within an EventGalleryProvider');
  }
  return context;
};

export const EventGalleryProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<EventFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load folders from Firestore
  const loadFolders = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'eventGallery'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const foldersData: EventFolder[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        foldersData.push({
          id: doc.id,
          eventName: data.eventName,
          uploadedBy: data.uploadedBy,
          date: data.date.toDate ? data.date.toDate() : new Date(data.date),
          coverImage: data.coverImage,
          images: data.images || []
        });
      });
      
      setFolders(foldersData);
      setError(null);
    } catch (err) {
      console.error('Error loading folders:', err);
      setError('Failed to load event folders');
    } finally {
      setLoading(false);
    }
  };

  // Create a new folder
  const createFolder = async (folderName: string, userId: string) => {
    try {
      const newFolder: Omit<EventFolder, 'id'> = {
        eventName: folderName,
        uploadedBy: userId,
        date: new Date(),
        images: []
      };
      
      const docRef = await addDoc(collection(db, 'eventGallery'), newFolder);
      setFolders(prev => [{
        ...newFolder,
        id: docRef.id
      }, ...prev]);
      
      setError(null);
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Failed to create folder');
      throw err;
    }
  };

  // Upload images to a folder
  const uploadImages = async (folderId: string, files: FileList, onProgress?: (progress: number) => void) => {
    try {
      const folder = folders.find(f => f.id === folderId);
      if (!folder) throw new Error('Folder not found');
      
      const uploadedImages: Image[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `eventGallery/${folderId}/${fileName}`);
        
        // Upload file
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        // Wait for upload to complete with progress tracking
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Progress tracking
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (onProgress) {
                onProgress(progress);
              }
            },
            (error) => reject(error),
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                uploadedImages.push({
                  url: downloadURL,
                  uploadedAt: new Date()
                });
                resolve();
              } catch (err) {
                reject(err);
              }
            }
          );
        });
      }
      
      // Update folder in Firestore
      const folderRef = doc(db, 'eventGallery', folderId);
      const updatedImages = [...folder.images, ...uploadedImages];
      
      // Set first image as cover if none exists
      const coverImage = folder.coverImage || uploadedImages[0]?.url;
      
      await updateDoc(folderRef, {
        images: updatedImages,
        coverImage
      });
      
      // Update local state
      setFolders(prev => prev.map(f => 
        f.id === folderId 
          ? { ...f, images: updatedImages, coverImage } 
          : f
      ));
      
      setError(null);
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images');
      throw err;
    }
  };

  // Delete a folder and all its images
  const deleteFolder = async (folderId: string) => {
    try {
      // Delete all images from storage
      const folder = folders.find(f => f.id === folderId);
      if (folder) {
        for (const image of folder.images) {
          try {
            const imageRef = ref(storage, image.url);
            await deleteObject(imageRef);
          } catch (err) {
            console.warn('Failed to delete image from storage:', err);
          }
        }
      }
      
      // Delete folder from Firestore
      await deleteDoc(doc(db, 'eventGallery', folderId));
      
      // Update local state
      setFolders(prev => prev.filter(f => f.id !== folderId));
      
      setError(null);
    } catch (err) {
      console.error('Error deleting folder:', err);
      setError('Failed to delete folder');
      throw err;
    }
  };

  // Delete a single image
  const deleteImage = async (folderId: string, imageUrl: string) => {
    try {
      const folder = folders.find(f => f.id === folderId);
      if (!folder) throw new Error('Folder not found');
      
      // Delete image from storage
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (err) {
        console.warn('Failed to delete image from storage:', err);
      }
      
      // Update folder in Firestore
      const folderRef = doc(db, 'eventGallery', folderId);
      const updatedImages = folder.images.filter(img => img.url !== imageUrl);
      
      // Update cover image if it was deleted
      let coverImage = folder.coverImage;
      if (coverImage === imageUrl) {
        coverImage = updatedImages[0]?.url || '';
      }
      
      await updateDoc(folderRef, {
        images: updatedImages,
        coverImage
      });
      
      // Update local state
      setFolders(prev => prev.map(f => 
        f.id === folderId 
          ? { ...f, images: updatedImages, coverImage } 
          : f
      ));
      
      setError(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
      throw err;
    }
  };

  // Load folders on initial mount
  useEffect(() => {
    loadFolders();
  }, []);

  return (
    <EventGalleryContext.Provider value={{
      folders,
      loading,
      error,
      createFolder,
      uploadImages,
      deleteFolder,
      deleteImage,
      loadFolders
    }}>
      {children}
    </EventGalleryContext.Provider>
  );
};