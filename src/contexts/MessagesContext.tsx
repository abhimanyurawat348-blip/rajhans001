import React, { createContext, useContext, useState, ReactNode } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
}

interface MessagesContextType {
  messages: Message[];
  conversations: Conversation[];
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<boolean>;
  loadMessages: (conversationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  markAsRead: (messageId: string) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};

export const MessagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const loadMessages = async (receiverId: string) => {
    try {
      // Load messages where the current user is either sender or receiver
      const messagesQuery = query(
        collection(db, 'messages'),
        where('receiverId', '==', receiverId)
      );
      const querySnapshot = await getDocs(messagesQuery);
      const loadedMessages: Message[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp)
        } as Message);
      });
      
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'conversations'));
      const loadedConversations: Conversation[] = [];
      
      querySnapshot.forEach((doc) => {
        loadedConversations.push({
          id: doc.id,
          ...doc.data()
        } as Conversation);
      });
      
      setConversations(loadedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp'>): Promise<boolean> => {
    try {
      const newMessage: Message = {
        ...messageData,
        id: '',
        timestamp: new Date()
      };

      const docRef = await addDoc(collection(db, 'messages'), newMessage);
      newMessage.id = docRef.id;

      setMessages(prev => [...prev, newMessage]);

      // Update conversation with last message
      const conversationRef = doc(db, 'conversations', messageData.receiverId);
      const conversationSnap = await getDoc(conversationRef);
      
      if (conversationSnap.exists()) {
        await updateDoc(conversationRef, {
          lastMessage: messageData.content,
          lastMessageTime: new Date()
        });
      } else {
        await addDoc(collection(db, 'conversations'), {
          participants: [messageData.senderId, messageData.receiverId],
          lastMessage: messageData.content,
          lastMessageTime: new Date()
        });
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, { read: true });
      
      setMessages(prev =>
        prev.map(message =>
          message.id === messageId ? { ...message, read: true } : message
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <MessagesContext.Provider value={{
      messages,
      conversations,
      sendMessage,
      loadMessages,
      loadConversations,
      markAsRead
    }}>
      {children}
    </MessagesContext.Provider>
  );
};