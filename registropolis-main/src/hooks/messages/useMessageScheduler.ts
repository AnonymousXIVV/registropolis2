
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { MessagesState, Message, ScheduledMessage } from '@/types/messageTypes';

interface UseMessageSchedulerProps {
  messages: MessagesState;
  setMessages: React.Dispatch<React.SetStateAction<MessagesState>>;
}

export function useMessageScheduler({ messages, setMessages }: UseMessageSchedulerProps) {
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const { toast } = useToast();

  const handleScheduleMessage = (chatId: string, content: string, scheduledTime: Date) => {
    const scheduledMessage: Message = {
      id: uuidv4(),
      content,
      timestamp: new Date().toISOString(),
      sender: 'user',
      status: 'sent',
      scheduledFor: scheduledTime.toISOString()
    };
    
    setScheduledMessages(prev => [
      ...prev,
      {
        chatId,
        message: scheduledMessage,
        scheduledTime
      }
    ]);
    
    toast({
      title: "Message scheduled",
      description: `Your message will be sent ${scheduledTime.toLocaleString()}.`
    });
  };

  const processScheduledMessages = () => {
    const now = new Date();
    
    const dueMessages = scheduledMessages.filter(
      item => new Date(item.scheduledTime) <= now
    );
    
    if (dueMessages.length > 0) {
      dueMessages.forEach(item => {
        const updatedMessage: Message = {
          ...item.message,
          status: 'sent' as const,
          scheduledFor: undefined
        };
        
        setMessages(prev => ({
          ...prev,
          [item.chatId]: [
            ...(prev[item.chatId] || []),
            updatedMessage
          ]
        }));
        
        toast({
          title: "Scheduled message sent",
          description: `Your scheduled message has been sent.`
        });
      });
      
      setScheduledMessages(prev => 
        prev.filter(item => new Date(item.scheduledTime) > now)
      );
    }
  };

  return {
    scheduledMessages,
    handleScheduleMessage,
    processScheduledMessages
  };
}
