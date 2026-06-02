
import React, { useState } from 'react';
import { 
  Plus, 
  Mic, 
  Camera, 
  Smile, 
  Send, 
  Image as ImageIcon,
  File,
  MapPin,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    onSendMessage(newMessage);
    setNewMessage('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="bg-card border-t border-border p-2 w-full">
      {showAttachments && (
        <div className="flex flex-wrap gap-2 p-2 bg-background/50 rounded-lg mb-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700"
          >
            <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 hover:text-purple-700"
          >
            <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700"
          >
            <File className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
          >
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full ml-auto"
            onClick={() => setShowAttachments(false)}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-9 w-9"
          onClick={() => setShowAttachments(!showAttachments)}
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        <div className="relative flex-1">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
            className="pr-10 h-9"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full"
          >
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-9 w-9"
        >
          {newMessage.trim() === '' ? (
            <Mic className="h-5 w-5" />
          ) : (
            <Send 
              className="h-5 w-5 text-primary" 
              onClick={handleSendMessage}
            />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
