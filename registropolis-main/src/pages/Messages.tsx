
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import MessagesSkeleton from '@/components/messages/MessagesSkeleton';
import MessagesSection from '@/components/messages/MessagesSection';
import { useMessagesLayout } from '@/hooks/messages/useMessagesLayout';

const Messages = () => {
  const { isLoading } = useMessagesLayout();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { chatId } = useParams<{ chatId: string }>();
  
  // Set selected chat from URL params if available
  React.useEffect(() => {
    if (chatId) {
      setSelectedChat(chatId);
    }
  }, [chatId]);
  
  if (isLoading) {
    return (
      <AppLayout withSidebar={true} fullWidth>
        <MessagesSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout withSidebar={true} fullWidth>
      <div className="h-full overflow-hidden">
        <MessagesSection />
      </div>
    </AppLayout>
  );
};

export default Messages;
