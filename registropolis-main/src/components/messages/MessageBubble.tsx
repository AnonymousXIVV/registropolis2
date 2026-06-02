
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Reply, Trash2, Edit2, Star, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Message } from '@/types/messageTypes';
import MessageStatus from './message/MessageStatus';
import ReplyPreview from './message/ReplyPreview';
import MessageReactionDisplay from './message/MessageReactionDisplay';
import MessageActions from './message/MessageActions';

export interface MessageBubbleProps extends Message {
  isOwnMessage: boolean;
  onEdit: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
  onReply: (id: string) => void;
  onReaction: (messageId: string, reaction: string) => void;
  onStar?: (id: string, star: boolean) => void;
  onShare?: (id: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  id,
  content,
  timestamp,
  sender,
  status,
  isOwnMessage,
  repliedToMessage,
  reactions,
  isStarred,
  onEdit,
  onDelete,
  onReply,
  onReaction,
  onStar,
  onShare
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isHovered, setIsHovered] = useState(false);

  // Format timestamp string to Date object if it's a string
  const messageTime = typeof timestamp === 'string' 
    ? new Date(timestamp) 
    : timestamp;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedContent.trim() !== content && editedContent.trim() !== '') {
      onEdit(id, editedContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleReaction = (emoji: string) => {
    onReaction(id, emoji);
  };

  // Emojis for reactions
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

  return (
    <div 
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`max-w-[75%] relative ${isHovered ? 'z-10' : 'z-0'}`}>
        {repliedToMessage && (
          <ReplyPreview 
            repliedToMessage={repliedToMessage} 
            isOwnMessage={isOwnMessage} 
          />
        )}
        
        <div 
          className={`rounded-lg ${
            repliedToMessage ? 'rounded-t-none' : ''
          } px-3 py-2 ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'bg-accent text-accent-foreground shadow-sm'
          } transition-all duration-200 hover:shadow-md`}
        >
          {isEditing ? (
            <div className="flex flex-col space-y-2">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="p-2 rounded bg-background text-foreground text-sm min-h-[60px] w-full resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleCancelEdit();
                  } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSaveEdit();
                  }
                }}
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCancelEdit}
                  className="h-8 px-3"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit}
                  className="h-8 px-3"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap break-words">{content}</p>
              <div className="flex justify-between items-center mt-1 text-xs opacity-70">
                <span>{format(messageTime, 'h:mm a')}</span>
                
                {isOwnMessage && (
                  <MessageStatus status={status} />
                )}
              </div>
            </>
          )}
        </div>
        
        {!isEditing && (
          <div className={`flex justify-end mt-1 space-x-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <MessageActions 
              id={id}
              isOwnMessage={isOwnMessage}
              onEdit={handleEdit}
              onDelete={onDelete}
              onReply={onReply}
              onReaction={handleReaction}
              onStar={onStar}
              onShare={onShare}
              isStarred={isStarred}
              emojis={emojis}
            />
          </div>
        )}
        
        {reactions && reactions.length > 0 && (
          <MessageReactionDisplay reactions={reactions} />
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
