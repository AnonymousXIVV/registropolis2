import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Search, Send, Paperclip, Smile, ArrowLeft, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import type { Message } from '@/components/chat/MessageList';
import { useIsMobile } from '@/hooks/use-mobile';

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  category: string;
  messages: Message[];
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    lastMessage: 'Is the mountain bike still available?',
    time: '2m',
    unread: 3,
    isOnline: true,
    category: 'Marketplace',
    messages: [
      { id: 'm1', content: 'Hey! I saw your listing for the mountain bike.', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 30), status: 'read', type: 'text' },
      { id: 'm2', content: 'Is it still available?', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 29), status: 'read', type: 'text' },
      { id: 'm3', content: 'Yes it is! Would you like to come see it?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 10), status: 'read', type: 'text' },
      { id: 'm4', content: 'Is the mountain bike still available?', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 2), status: 'delivered', type: 'text' },
    ],
  },
  {
    id: '2',
    name: 'Tasty Bites',
    lastMessage: 'Your order is being prepared!',
    time: '15m',
    unread: 1,
    isOnline: true,
    category: 'Food',
    messages: [
      { id: 'm1', content: 'Hi, I just placed an order for a Double Cheeseburger.', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 20), status: 'read', type: 'text' },
      { id: 'm2', content: 'Thanks for your order! We received it.', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 18), status: 'read', type: 'text' },
      { id: 'm3', content: 'Your order is being prepared!', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 15), status: 'delivered', type: 'text' },
    ],
  },
  {
    id: '3',
    name: 'Michael K. (Driver)',
    lastMessage: "I'm 5 minutes away from your location",
    time: '32m',
    unread: 0,
    isOnline: true,
    category: 'Taxi',
    messages: [
      { id: 'm1', content: 'I have accepted your ride request.', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 40), status: 'read', type: 'text' },
      { id: 'm2', content: 'Great! How far are you?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 38), status: 'read', type: 'text' },
      { id: 'm3', content: "I'm 5 minutes away from your location", sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 32), status: 'read', type: 'text' },
    ],
  },
  {
    id: '4',
    name: 'Sarah Miller',
    lastMessage: 'The coffee table is already sold, sorry!',
    time: '2h',
    unread: 0,
    isOnline: false,
    category: 'Marketplace',
    messages: [
      { id: 'm1', content: 'Hi Sarah, is the coffee table still available?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 130), status: 'read', type: 'text' },
      { id: 'm2', content: 'The coffee table is already sold, sorry!', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 120), status: 'read', type: 'text' },
      { id: 'm3', content: 'No worries, thanks for letting me know!', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 118), status: 'read', type: 'text' },
    ],
  },
  {
    id: '5',
    name: 'Spice Garden',
    lastMessage: 'We have a lunch special today — 20% off!',
    time: '3h',
    unread: 0,
    isOnline: true,
    category: 'Food',
    messages: [
      { id: 'm1', content: 'We have a lunch special today — 20% off!', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 180), status: 'read', type: 'text' },
      { id: 'm2', content: 'That sounds great! What dishes are included?', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 175), status: 'read', type: 'text' },
      { id: 'm3', content: 'All curries and biryanis. Would you like to order?', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 170), status: 'read', type: 'text' },
    ],
  },
  {
    id: '6',
    name: 'David Chen',
    lastMessage: "I can do $800 for the bike, final offer",
    time: '1d',
    unread: 0,
    isOnline: false,
    category: 'Marketplace',
    messages: [
      { id: 'm1', content: 'I saw the Trek bike listing. Would you take $750?', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), status: 'read', type: 'text' },
      { id: 'm2', content: 'The lowest I can go is $820.', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), status: 'read', type: 'text' },
      { id: 'm3', content: "I can do $800 for the bike, final offer", sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), status: 'read', type: 'text' },
    ],
  },
  {
    id: '7',
    name: 'Support Team',
    lastMessage: 'Is there anything else we can help you with?',
    time: '2d',
    unread: 0,
    isOnline: true,
    category: 'Support',
    messages: [
      { id: 'm1', content: 'Hello! Welcome to Buzzer. How can we help you today?', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), status: 'read', type: 'text' },
      { id: 'm2', content: 'Hi, I have a question about posting a listing.', sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47), status: 'read', type: 'text' },
      { id: 'm3', content: 'Of course! Go to Marketplace and tap "My Listings" to create one.', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46), status: 'read', type: 'text' },
      { id: 'm4', content: 'Is there anything else we can help you with?', sender: 'contact', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 45), status: 'read', type: 'text' },
    ],
  },
];

const categoryColors: Record<string, string> = {
  Marketplace: 'bg-purple-100 text-purple-700',
  Food: 'bg-orange-100 text-orange-700',
  Taxi: 'bg-green-100 text-green-700',
  Support: 'bg-blue-100 text-blue-700',
};

const ContactItem: React.FC<{
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
}> = ({ contact, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={cn(
      'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors',
      isSelected ? 'bg-accent' : 'hover:bg-muted/50'
    )}
  >
    <div className="relative shrink-0">
      <Avatar className="h-11 w-11">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {contact.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {contact.isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-semibold text-sm truncate">{contact.name}</span>
        <span className="text-xs text-muted-foreground shrink-0 ml-2">{contact.time}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
        {contact.unread > 0 && (
          <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] ml-2 shrink-0 bg-primary">
            {contact.unread}
          </Badge>
        )}
      </div>
      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block', categoryColors[contact.category] || 'bg-gray-100 text-gray-600')}>
        {contact.category}
      </span>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
      <MessageSquare className="h-8 w-8 text-primary" />
    </div>
    <h3 className="font-semibold text-lg">Your Messages</h3>
    <p className="text-muted-foreground text-sm max-w-xs">
      Select a conversation to start chatting, or reach out to sellers, restaurants, and drivers directly from their listings.
    </p>
  </div>
);

const MessagesSection: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const selectedContact = contacts.find((c) => c.id === selectedContactId) ?? null;

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact?.messages]);

  const handleSelectContact = (id: string) => {
    setSelectedContactId(id);
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = () => {
    if (!messageInput.trim() || !selectedContactId) return;

    const newMessage: Message = {
      id: uuidv4(),
      content: messageInput.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
    };

    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedContactId
          ? { ...c, messages: [...c.messages, newMessage], lastMessage: messageInput.trim(), time: 'now' }
          : c
      )
    );
    setMessageInput('');

    setTimeout(() => {
      const replies = [
        "Got it, thanks!",
        "Sure, let me check.",
        "That works for me!",
        "I'll get back to you shortly.",
        "Thanks for reaching out!",
      ];
      const reply: Message = {
        id: uuidv4(),
        content: replies[Math.floor(Math.random() * replies.length)],
        sender: 'contact',
        timestamp: new Date(),
        status: 'delivered',
        type: 'text',
      };
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContactId
            ? { ...c, messages: [...c.messages, reply], lastMessage: reply.content, time: 'now' }
            : c
        )
      );
    }, 1500);
  };

  const showContactList = !isMobile || !selectedContactId;
  const showChat = !isMobile || !!selectedContactId;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {showContactList && (
        <div className={cn('flex flex-col border-r bg-card', isMobile ? 'w-full' : 'w-80 shrink-0')}>
          <div className="p-4 border-b shrink-0">
            <h2 className="text-lg font-bold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  isSelected={contact.id === selectedContactId}
                  onClick={() => handleSelectContact(contact.id)}
                />
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground text-sm">No conversations found</div>
            )}
          </div>
        </div>
      )}

      {showChat && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedContact ? (
            <>
              <ChatHeader
                contact={selectedContact}
                onBackClick={isMobile ? () => setSelectedContactId(null) : undefined}
              />
              <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
                <MessageList messages={selectedContact.messages} />
                <div ref={messagesEndRef} />
              </div>
              <div className="shrink-0 border-t bg-card px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="flex-1 h-9"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  />
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSend} disabled={!messageInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesSection;
