import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Search, Send, Paperclip, Smile, MessageSquare, Phone, Video, MoreVertical, ArrowLeft, Check, CheckCheck, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';

/* ─── Types ──────────────────────────────────────────────────── */

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'them';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'location';
  media?: string;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  category: string;
  messages: Message[];
}

/* ─── Mock data ───────────────────────────────────────────────── */

const CONTACTS: Contact[] = [
  {
    id: '1', name: 'Alex Johnson', lastMessage: 'Is the mountain bike still available?',
    time: '2m', unread: 3, online: true, category: 'Marketplace',
    messages: [
      { id: 'a1', content: 'Hey! I saw your listing for the mountain bike.', sender: 'them', timestamp: new Date(Date.now() - 1800000), status: 'read', type: 'text' },
      { id: 'a2', content: 'Yes it is! Would you like to come see it?', sender: 'me', timestamp: new Date(Date.now() - 600000), status: 'read', type: 'text' },
      { id: 'a3', content: 'Is the mountain bike still available?', sender: 'them', timestamp: new Date(Date.now() - 120000), status: 'delivered', type: 'text' },
    ],
  },
  {
    id: '2', name: 'Tasty Bites', lastMessage: 'Your order is being prepared!',
    time: '15m', unread: 1, online: true, category: 'Food',
    messages: [
      { id: 'b1', content: 'Hi, I just placed an order.', sender: 'me', timestamp: new Date(Date.now() - 1200000), status: 'read', type: 'text' },
      { id: 'b2', content: 'Thanks for your order! We received it.', sender: 'them', timestamp: new Date(Date.now() - 1080000), status: 'read', type: 'text' },
      { id: 'b3', content: 'Your order is being prepared!', sender: 'them', timestamp: new Date(Date.now() - 900000), status: 'delivered', type: 'text' },
    ],
  },
  {
    id: '3', name: 'Michael K. (Driver)', lastMessage: "I'm 5 minutes away",
    time: '32m', unread: 0, online: true, category: 'Taxi',
    messages: [
      { id: 'c1', content: 'I have accepted your ride request.', sender: 'them', timestamp: new Date(Date.now() - 2400000), status: 'read', type: 'text' },
      { id: 'c2', content: 'Great! How far are you?', sender: 'me', timestamp: new Date(Date.now() - 2280000), status: 'read', type: 'text' },
      { id: 'c3', content: "I'm 5 minutes away", sender: 'them', timestamp: new Date(Date.now() - 1920000), status: 'read', type: 'text' },
    ],
  },
  {
    id: '4', name: 'Sarah Miller', lastMessage: 'The coffee table is already sold, sorry!',
    time: '2h', unread: 0, online: false, category: 'Marketplace',
    messages: [
      { id: 'd1', content: 'Hi Sarah, is the coffee table still available?', sender: 'me', timestamp: new Date(Date.now() - 7800000), status: 'read', type: 'text' },
      { id: 'd2', content: 'The coffee table is already sold, sorry!', sender: 'them', timestamp: new Date(Date.now() - 7200000), status: 'read', type: 'text' },
    ],
  },
  {
    id: '5', name: 'Spice Garden', lastMessage: "We have a lunch special — 20% off!",
    time: '3h', unread: 0, online: true, category: 'Food',
    messages: [
      { id: 'e1', content: "We have a lunch special today — 20% off!", sender: 'them', timestamp: new Date(Date.now() - 10800000), status: 'read', type: 'text' },
      { id: 'e2', content: 'What dishes are included?', sender: 'me', timestamp: new Date(Date.now() - 10500000), status: 'read', type: 'text' },
      { id: 'e3', content: 'All curries and biryanis. Would you like to order?', sender: 'them', timestamp: new Date(Date.now() - 10200000), status: 'read', type: 'text' },
    ],
  },
  {
    id: '6', name: 'David Chen', lastMessage: "I can do $800, final offer",
    time: '1d', unread: 0, online: false, category: 'Marketplace',
    messages: [
      { id: 'f1', content: "Would you take $750 for the Trek bike?", sender: 'them', timestamp: new Date(Date.now() - 86400000), status: 'read', type: 'text' },
      { id: 'f2', content: "The lowest I can go is $820.", sender: 'me', timestamp: new Date(Date.now() - 82800000), status: 'read', type: 'text' },
      { id: 'f3', content: "I can do $800, final offer", sender: 'them', timestamp: new Date(Date.now() - 79200000), status: 'read', type: 'text' },
    ],
  },
  {
    id: '7', name: 'Support Team', lastMessage: 'Is there anything else we can help with?',
    time: '2d', unread: 0, online: true, category: 'Support',
    messages: [
      { id: 'g1', content: 'Hello! How can we help you today?', sender: 'them', timestamp: new Date(Date.now() - 172800000), status: 'read', type: 'text' },
      { id: 'g2', content: 'I have a question about posting a listing.', sender: 'me', timestamp: new Date(Date.now() - 169200000), status: 'read', type: 'text' },
      { id: 'g3', content: 'Go to Marketplace and tap "My Listings" to create one.', sender: 'them', timestamp: new Date(Date.now() - 165600000), status: 'read', type: 'text' },
      { id: 'g4', content: 'Is there anything else we can help with?', sender: 'them', timestamp: new Date(Date.now() - 162000000), status: 'read', type: 'text' },
    ],
  },
];

const CATEGORY_STYLES: Record<string, string> = {
  Marketplace: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Food:        'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  Taxi:        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Support:     'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

const AUTO_REPLIES = [
  "Got it, thanks!",
  "Sure, let me check on that.",
  "That works for me!",
  "I'll get back to you shortly.",
  "Thanks for reaching out!",
  "Sounds good!",
];

/* ─── Sub-components ──────────────────────────────────────────── */

const ContactRow: React.FC<{
  contact: Contact;
  selected: boolean;
  onClick: () => void;
}> = ({ contact, selected, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
      selected ? 'bg-accent' : 'hover:bg-muted/50'
    )}
  >
    <div className="relative shrink-0">
      <Avatar className="h-11 w-11">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {contact.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      {contact.online && (
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-background" />
      )}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-semibold text-sm truncate leading-none">{contact.name}</span>
        <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{contact.time}</span>
      </div>
      <p className="text-xs text-muted-foreground truncate mb-1">{contact.lastMessage}</p>
      <div className="flex items-center justify-between">
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', CATEGORY_STYLES[contact.category] ?? 'bg-muted text-muted-foreground')}>
          {contact.category}
        </span>
        {contact.unread > 0 && (
          <Badge className="h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-primary rounded-full">
            {contact.unread}
          </Badge>
        )}
      </div>
    </div>
  </button>
);

const Bubble: React.FC<{ msg: Message }> = ({ msg }) => {
  const isMe = msg.sender === 'me';
  return (
    <div className={cn('flex mb-2', isMe ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'max-w-[72%] rounded-2xl px-3.5 py-2',
        isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'
      )}>
        {msg.type === 'text' && <p className="text-sm leading-relaxed break-words">{msg.content}</p>}
        {msg.type === 'image' && msg.media && (
          <img src={msg.media} alt="" className="rounded-xl max-w-full max-h-48 object-cover mb-1" />
        )}
        {msg.type === 'location' && (
          <div className="flex items-center gap-2 py-0.5">
            <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
            <span className="text-sm">Shared a location</span>
          </div>
        )}
        <div className={cn('flex items-center justify-end gap-1 mt-0.5', isMe ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
          <span className="text-[10px]">{format(msg.timestamp, 'HH:mm')}</span>
          {isMe && (msg.status === 'read' ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
      <MessageSquare className="h-8 w-8 text-primary" />
    </div>
    <h3 className="font-semibold text-lg">Your Messages</h3>
    <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
      Select a conversation to start chatting, or contact sellers, restaurants, and drivers directly from their listings.
    </p>
  </div>
);

/* ─── Main component ──────────────────────────────────────────── */

const MessagesSection: React.FC = () => {
  const isMobile = useIsMobile();
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = contacts.find(c => c.id === selectedId) ?? null;

  const filtered = search.trim()
    ? contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages.length]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || !selectedId) return;

    const msg: Message = {
      id: uuidv4(), content: text, sender: 'me',
      timestamp: new Date(), status: 'sent', type: 'text',
    };

    setContacts(prev => prev.map(c =>
      c.id === selectedId
        ? { ...c, messages: [...c.messages, msg], lastMessage: text, time: 'now' }
        : c
    ));
    setInput('');

    setTimeout(() => {
      const reply: Message = {
        id: uuidv4(),
        content: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        sender: 'them', timestamp: new Date(), status: 'delivered', type: 'text',
      };
      setContacts(prev => prev.map(c =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, reply], lastMessage: reply.content, time: 'now' }
          : c
      ));
    }, 1400);
  };

  const showList = !isMobile || !selectedId;
  const showChat = !isMobile || !!selectedId;

  return (
    <div className="flex h-full bg-background">
      {/* ── Contact list panel ── */}
      {showList && (
        <div className={cn(
          'flex flex-col border-r border-border bg-card',
          isMobile ? 'w-full' : 'w-[320px] shrink-0'
        )}>
          {/* Header */}
          <div className="px-4 pt-5 pb-3 border-b border-border shrink-0">
            <h2 className="text-xl font-bold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search conversations…"
                className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {filtered.length > 0
              ? filtered.map(c => (
                  <ContactRow
                    key={c.id}
                    contact={c}
                    selected={c.id === selectedId}
                    onClick={() => handleSelect(c.id)}
                  />
                ))
              : (
                <div className="py-16 text-center text-muted-foreground text-sm">
                  No conversations found
                </div>
              )
            }
          </div>
        </div>
      )}

      {/* ── Chat panel ── */}
      {showChat && (
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {selected ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
                {isMobile && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setSelectedId(null)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {selected.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate leading-none">{selected.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {selected.online
                      ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span className="text-xs text-green-600">Online</span></>
                      : <span className="text-xs text-muted-foreground">Offline</span>
                    }
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 bg-muted/20">
                {selected.messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="shrink-0 border-t border-border bg-card px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message…"
                    className="flex-1 h-9"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  />
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon" className="h-9 w-9 shrink-0"
                    onClick={handleSend}
                    disabled={!input.trim()}
                  >
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
