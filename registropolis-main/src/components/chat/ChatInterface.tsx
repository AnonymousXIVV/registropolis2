
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'audio' | 'location';
  media?: string;
}

interface ChatInterfaceProps {
  contact: {
    id: string;
    name: string;
    imageUrl?: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  onBackClick?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ contact, onBackClick }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hey there!',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'read',
      type: 'text'
    },
    {
      id: '2',
      content: 'Hi! How are you?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9), // 1.9 hours ago
      status: 'read',
      type: 'text'
    },
    {
      id: '3',
      content: 'I\'m doing well, thanks for asking!',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8), // 1.8 hours ago
      status: 'read',
      type: 'text'
    },
    {
      id: '4',
      content: 'Check out this photo I took yesterday',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      status: 'read',
      type: 'text'
    },
    {
      id: '5',
      content: '',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 29), // 29 mins ago
      status: 'read',
      type: 'image',
      media: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?auto=format&fit=crop&w=500'
    },
    {
      id: '6',
      content: 'Wow, that looks amazing!',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
      status: 'read',
      type: 'text'
    },
    {
      id: '7',
      content: 'Where was this taken?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 24), // 24 mins ago
      status: 'read',
      type: 'text'
    },
    {
      id: '8',
      content: 'It\'s at the new park downtown. I can share the location.',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 mins ago
      status: 'read',
      type: 'text'
    },
    {
      id: '9',
      content: '',
      sender: 'contact',
      timestamp: new Date(Date.now() - 1000 * 60 * 19), // 19 mins ago
      status: 'read',
      type: 'location',
      media: 'location-data'
    },
    {
      id: '10',
      content: 'Perfect! Let\'s meet there tomorrow at 5pm?',
      sender: 'user',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      status: 'delivered',
      type: 'text'
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (newMessage: string) => {
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: uuidv4(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    };
    
    setMessages([...messages, message]);
    
    // Simulate reply after a short delay
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const reply: Message = {
          id: uuidv4(),
          content: 'Sure, that works for me! See you tomorrow.',
          sender: 'contact',
          timestamp: new Date(),
          status: 'delivered',
          type: 'text'
        };
        
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <ChatHeader contact={contact} onBackClick={onBackClick} />
      
      {/* Messages - flex-1 for scrollable area */}
      <div className="flex-1 overflow-y-auto bg-background/50 p-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area - fixed to bottom with mt-auto */}
      <div className="mt-auto w-full border-t border-border bg-card">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;
