
import React from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { ChatItemProps } from './ChatItem';
import { GroupChatProps } from '../groups/GroupChat';
import ChatListHeader from './ChatListHeader';
import SearchBar from './SearchBar';
import StoriesSection from './StoriesSection';
import GroupActions from './GroupActions';
import ChatListContent from './ChatListContent';

interface ChatListProps {
  chats: ChatItemProps[];
  groups: GroupChatProps[];
  selectedChat: string | null;
  selectChat: (chatId: string, isGroup?: boolean) => void;
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  activeTab: 'personal' | 'groups';
  setActiveTab: (tab: 'personal' | 'groups') => void;
  showCreateGroup: () => void;
  showJoinGroup: () => void;
  sidebarCollapsed?: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  groups,
  selectedChat,
  selectChat,
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  showCreateGroup,
  showJoinGroup,
  sidebarCollapsed = true
}) => {
  const { sidebarTransitionClass } = useSidebar();
  
  return (
    <div className="flex flex-col h-full w-full">
      <ChatListHeader viewMode={viewMode} setViewMode={setViewMode} />
      <SearchBar />
      <StoriesSection />
      <GroupActions showCreateGroup={showCreateGroup} showJoinGroup={showJoinGroup} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatListContent 
          chats={chats}
          groups={groups}
          selectedChat={selectedChat}
          selectChat={selectChat}
          viewMode={viewMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
};

export default ChatList;
