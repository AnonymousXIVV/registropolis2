
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Message, MessagesState } from '@/types/messageTypes';

interface UseMessageSendingProps {
  messages: MessagesState;
  setMessages: React.Dispatch<React.SetStateAction<MessagesState>>;
  replyingTo: Message | null;
  setReplyingTo: React.Dispatch<React.SetStateAction<Message | null>>;
}

export function useMessageSending({
  messages,
  setMessages,
  replyingTo,
  setReplyingTo
}: UseMessageSendingProps) {
  const [isContactTyping, setIsContactTyping] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (chatId: string, content: string) => {
    if (!content.trim()) return;
    
    console.log("Sending message to chat:", chatId, content);
    
    // Create message object
    let replyData = undefined;
    if (replyingTo) {
      replyData = {
        id: replyingTo.id,
        content: replyingTo.content,
        sender: replyingTo.sender,
        senderName: replyingTo.senderName
      };
    }
    
    const newMessage: Message = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      sender: 'user',
      status: 'sent',
      repliedToMessage: replyData
    };
    
    // Update local state
    setMessages(prev => {
      const chatMessages = [...(prev[chatId] || [])];
      chatMessages.push(newMessage);
      
      return {
        ...prev,
        [chatId]: chatMessages
      };
    });
    
    // Clear reply state
    setReplyingTo(null);
    
    try {
      // Simulate typing indicator
      setIsContactTyping(true);
      
      setTimeout(() => {
        setIsContactTyping(false);
        
        // Simulate reply
        const replyMessage: Message = {
          id: uuidv4(),
          content: 'This is an automated reply.',
          timestamp: new Date().toISOString(),
          sender: 'contact',
          senderName: chatId.startsWith('g-') ? 'Group Member' : 'Contact',
          status: 'sent'
        };
        
        setMessages(prev => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), replyMessage]
        }));
        
        // Simulate message delivery
        setTimeout(() => {
          setMessages(prev => {
            const updatedMessages = prev[chatId].map(msg => 
              msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
            );
            
            return {
              ...prev,
              [chatId]: updatedMessages
            };
          });
          
          // Simulate message read
          setTimeout(() => {
            setMessages(prev => {
              const updatedMessages = prev[chatId].map(msg => 
                msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
              );
              
              return {
                ...prev,
                [chatId]: updatedMessages
              };
            });
          }, 2000);
          
        }, 1000);
        
      }, 2000);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      
      setMessages(prev => {
        const updatedMessages = prev[chatId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'error' as const } : msg
        );
        
        return {
          ...prev,
          [chatId]: updatedMessages
        };
      });
      
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    isContactTyping,
    handleSendMessage
  };
}
