
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Message, MessagesState } from '@/types/messageTypes';

interface UseMessageActionsProps {
  messages: MessagesState;
  setMessages: React.Dispatch<React.SetStateAction<MessagesState>>;
  replyingTo: Message | null;
  setReplyingTo: React.Dispatch<React.SetStateAction<Message | null>>;
}

export function useMessageActions({ 
  messages, 
  setMessages,
  replyingTo,
  setReplyingTo 
}: UseMessageActionsProps) {
  const { toast } = useToast();

  const handleEditMessage = (chatId: string, messageId: string, newContent: string) => {
    setMessages(prev => {
      if (!prev[chatId]) return prev;
      
      const updatedMessages = prev[chatId].map(msg => 
        msg.id === messageId ? { ...msg, content: newContent } : msg
      );
      
      return {
        ...prev,
        [chatId]: updatedMessages
      };
    });
    
    toast({
      title: "Message updated",
      description: "Your message has been edited successfully."
    });
  };

  const handleDeleteMessage = (chatId: string, messageId: string) => {
    setMessages(prev => {
      if (!prev[chatId]) return prev;
      
      return {
        ...prev,
        [chatId]: prev[chatId].filter(msg => msg.id !== messageId)
      };
    });
    
    toast({
      title: "Message deleted",
      description: "Your message has been removed."
    });
  };

  const handleReplyToMessage = (chatId: string, messageId: string) => {
    const message = messages[chatId]?.find(msg => msg.id === messageId);
    
    if (message) {
      setReplyingTo(message);
      
      toast({
        title: "Replying to message",
        description: "Type your reply in the message box."
      });
    }
  };

  return {
    handleEditMessage,
    handleDeleteMessage,
    handleReplyToMessage
  };
}
