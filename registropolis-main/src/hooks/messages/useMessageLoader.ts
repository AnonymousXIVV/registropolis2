
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { messagesAPI } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { Message, MessagesState } from '@/types/messageTypes';

interface UseMessageLoaderProps {
  messages: MessagesState;
  setMessages: React.Dispatch<React.SetStateAction<MessagesState>>;
}

export function useMessageLoader({ messages, setMessages }: UseMessageLoaderProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const loadInitialMessages = useCallback(async (chatId: string) => {
    console.log(`Loading initial messages for chat ${chatId}`);
    
    // Check if we already have messages for this chat
    if (messages[chatId] && messages[chatId].length > 0) {
      console.log(`Already have messages for chat ${chatId} in state`);
      return;
    }
    
    try {
      // Fetch messages from API
      const response = await messagesAPI.getMessages(chatId);
      
      // Check if we have a valid response with messages
      if (response && response.success && response.data && Array.isArray(response.data)) {
        console.log(`Loaded ${response.data.length} messages for chat ${chatId}`);
        
        // Transform API messages to our format
        const transformedMessages: Message[] = response.data.map((apiMessage: any) => {
          const isUserMessage = apiMessage.senderId === user?.id;
          
          return {
            id: apiMessage._id || uuidv4(),
            content: apiMessage.content,
            timestamp: new Date(apiMessage.timestamp || Date.now()).toISOString(),
            sender: isUserMessage ? 'user' as const : 'contact' as const,
            senderName: isUserMessage ? 'You' : apiMessage.senderName || 'Contact',
            status: apiMessage.status || 'sent',
            repliedToMessage: apiMessage.repliedToMessage,
            reactions: apiMessage.reactions,
            isStarred: apiMessage.isStarred,
            attachments: apiMessage.attachments
          };
        });
        
        setMessages(prev => ({
          ...prev,
          [chatId]: transformedMessages
        }));
        return;
      }
      
      // If no messages or invalid response, use some demo messages
      console.log(`No messages for chat ${chatId}, generating demo messages`);
      
      // Generate dummy chat content based on the chat ID
      const isGroup = chatId.startsWith('g-');
      const demoMessages: Message[] = [];
      
      // Add 3-5 dummy messages
      const messageCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < messageCount; i++) {
        const isUserMessage = i % 2 === 0;
        
        demoMessages.push({
          id: uuidv4(),
          content: isUserMessage 
            ? `This is your message #${i + 1} in this ${isGroup ? 'group' : 'chat'}.` 
            : `This is a reply from ${isGroup ? 'a group member' : 'your contact'} #${i + 1}.`,
          timestamp: new Date(Date.now() - (messageCount - i) * 60000).toISOString(),
          sender: isUserMessage ? 'user' : 'contact',
          senderName: isUserMessage ? 'You' : (isGroup ? `Member ${i}` : 'Contact'),
          status: 'read'
        });
      }
      
      // Update state
      setMessages(prev => ({
        ...prev,
        [chatId]: demoMessages
      }));
      
    } catch (error) {
      console.error(`Error loading messages for chat ${chatId}:`, error);
      toast({
        title: "Failed to load messages",
        description: "Could not retrieve message history.",
        variant: "destructive"
      });
      
      // Use empty array on error
      setMessages(prev => ({
        ...prev,
        [chatId]: []
      }));
    }
    
  }, [messages, setMessages, toast, user]);

  // Simulate a product inquiry for business chats
  const simulateProductInquiry = (chatId: string, productName: string, price: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content: `I'm interested in the ${productName} listed for ${price}. Is it still available?`,
      timestamp: new Date().toISOString(),
      sender: 'user',
      status: 'sent'
    };
    
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));
    
    // Send via API in a real implementation
    
    // Simulate reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: uuidv4(),
        content: `Yes, the ${productName} is still available! When would you like to pick it up?`,
        timestamp: new Date().toISOString(),
        sender: 'contact',
        status: 'sent'
      };
      
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), replyMessage]
      }));
    }, 1500);
  };

  return {
    loadInitialMessages,
    simulateProductInquiry
  };
}
