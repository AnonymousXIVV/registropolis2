
import { useState, useEffect } from 'react';
import { useMessageLoading } from './messages/useMessageLoading';
import { useMessageSending } from './messages/useMessageSending';
import { useMessageActions } from './messages/useMessageActions';
import { useMessageScheduler } from './messages/useMessageScheduler';
import { MessagesState, Message } from '@/types/messageTypes';
import { v4 as uuidv4 } from 'uuid';

export function useMessages() {
  const [messages, setMessages] = useState<MessagesState>({});
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  // Initialize with some demo chats and messages
  useEffect(() => {
    // Initialize some demo chats if none exist
    if (Object.keys(messages).length === 0) {
      const demoMessages: MessagesState = {
        "1": [
          {
            id: uuidv4(),
            content: "Hey there! How are you?",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            sender: 'contact',
            status: 'read'
          },
          {
            id: uuidv4(),
            content: "I'm good! How about you?",
            timestamp: new Date(Date.now() - 3500000).toISOString(),
            sender: 'user',
            status: 'read'
          },
          {
            id: uuidv4(),
            content: "Doing great! Want to meet up later?",
            timestamp: new Date(Date.now() - 3400000).toISOString(),
            sender: 'contact',
            status: 'read'
          }
        ],
        "2": [
          {
            id: uuidv4(),
            content: "Can we discuss the project timeline?",
            timestamp: new Date(Date.now() - 2600000).toISOString(),
            sender: 'contact',
            status: 'read'
          },
          {
            id: uuidv4(),
            content: "Sure, I'm available around 3 PM",
            timestamp: new Date(Date.now() - 2500000).toISOString(),
            sender: 'user',
            status: 'read'
          }
        ],
        "3": [
          {
            id: uuidv4(),
            content: "Did you get the document I sent?",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            sender: 'contact',
            status: 'read'
          },
          {
            id: uuidv4(),
            content: "Yes, I'll review it today",
            timestamp: new Date(Date.now() - 85400000).toISOString(),
            sender: 'user',
            status: 'read'
          }
        ]
      };
      setMessages(demoMessages);
    }
  }, []);
  
  // Compose hooks
  const messageLoader = useMessageLoading({ messages, setMessages });
  const messageSender = useMessageSending({ messages, setMessages, replyingTo, setReplyingTo });
  const messageActions = useMessageActions({ messages, setMessages, replyingTo, setReplyingTo });
  const messageScheduler = useMessageScheduler({ messages, setMessages });
  
  // Set up interval to check for scheduled messages
  useEffect(() => {
    const intervalId = setInterval(() => {
      messageScheduler.processScheduledMessages();
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [messageScheduler]);

  return {
    messages,
    isContactTyping: messageSender.isContactTyping,
    replyingTo,
    setReplyingTo,
    
    // Message loading
    loadInitialMessages: messageLoader.loadInitialMessages,
    simulateProductInquiry: messageLoader.simulateProductInquiry,
    
    // Message sending
    handleSendMessage: messageSender.handleSendMessage,
    
    // Message management
    handleEditMessage: messageActions.handleEditMessage,
    handleDeleteMessage: messageActions.handleDeleteMessage,
    handleReplyToMessage: messageActions.handleReplyToMessage,
    
    // Message scheduling
    handleScheduleMessage: messageScheduler.handleScheduleMessage
  };
}

export type { Message } from '@/types/messageTypes';
