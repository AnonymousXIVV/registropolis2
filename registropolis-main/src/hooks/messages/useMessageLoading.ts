
import { v4 as uuidv4 } from 'uuid';
import { MessagesState, Message } from '@/types/messageTypes';

interface UseMessageLoadingProps {
  messages: MessagesState;
  setMessages: React.Dispatch<React.SetStateAction<MessagesState>>;
}

export function useMessageLoading({ messages, setMessages }: UseMessageLoadingProps) {
  // Load initial messages for a chat
  const loadInitialMessages = (chatId: string) => {
    console.log(`Loading messages for chat ${chatId}`);
    
    // Check if we already have messages for this chat
    if (messages[chatId] && messages[chatId].length > 0) {
      console.log(`Using existing ${messages[chatId].length} messages for chat ${chatId}`);
      return;
    }
    
    // If not, possibly load from API or use default initial messages
    if (!messages[chatId] || messages[chatId].length === 0) {
      console.log(`No messages found for chat ${chatId}, initializing with empty array`);
      setMessages(prev => ({
        ...prev,
        [chatId]: []
      }));
    }
  };

  // Simulate a product inquiry from a user to a business
  const simulateProductInquiry = (businessChatId: string, productName: string, productPrice: string) => {
    const inquiryMessage: Message = {
      id: uuidv4(),
      content: `I'm interested in ${productName} for ${productPrice}. Is it still available?`,
      timestamp: new Date().toISOString(),
      sender: 'user',
      status: 'delivered'
    };
    
    setMessages(prev => ({
      ...prev,
      [businessChatId]: [...(prev[businessChatId] || []), inquiryMessage]
    }));
    
    return inquiryMessage.id;
  };

  return {
    loadInitialMessages,
    simulateProductInquiry
  };
}
