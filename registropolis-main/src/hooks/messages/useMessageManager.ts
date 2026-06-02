
import { useToast } from '@/hooks/use-toast';
import { MessagesState, Message } from '@/types/messageTypes';

interface UseMessageManagerProps {
  messages: MessagesState;
  setMessages: React.Dispatch<React.SetStateAction<MessagesState>>;
  setReplyingTo: React.Dispatch<React.SetStateAction<Message | null>>;
}

export function useMessageManager({ 
  messages, 
  setMessages, 
  setReplyingTo 
}: UseMessageManagerProps) {
  const { toast } = useToast();

  // Edit a message
  const handleEditMessage = async (chatId: string, messageId: string, newContent: string) => {
    // Update local state
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
    
    // In a real implementation, would call API to update message
    
    toast({
      title: "Message updated",
      description: "Your message has been edited successfully."
    });
  };

  // Delete a message
  const handleDeleteMessage = (chatId: string, messageId: string) => {
    setMessages(prev => {
      if (!prev[chatId]) return prev;
      
      return {
        ...prev,
        [chatId]: prev[chatId].filter(msg => msg.id !== messageId)
      };
    });
    
    // In a real implementation, would call API to delete message
    
    toast({
      title: "Message deleted",
      description: "Your message has been removed."
    });
  };

  // Reply to a message
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
