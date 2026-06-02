
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search } from 'lucide-react';

// This component would ideally fetch messages through an API call
// For now, let's use mock data
const mockMessages = [
  {
    id: 'msg1',
    sender: 'John Doe',
    receiver: 'Jane Smith',
    content: 'Hello there!',
    timestamp: '2024-04-18T10:30:00Z',
    status: 'delivered'
  },
  {
    id: 'msg2',
    sender: 'Jane Smith',
    receiver: 'John Doe',
    content: 'Hi! How are you?',
    timestamp: '2024-04-18T10:32:00Z',
    status: 'read'
  },
  {
    id: 'msg3',
    sender: 'Bob Johnson',
    receiver: 'John Doe',
    content: 'Meeting at 3 PM',
    timestamp: '2024-04-18T11:15:00Z',
    status: 'sent'
  }
];

const AdminMessages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [messages] = useState(mockMessages);
  
  const filteredMessages = messages.filter(message => 
    message.content?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    message.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.receiver?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Message Statistics</CardTitle>
          <CardDescription>Overview of message activity</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Messages</span>
            <span className="text-2xl font-bold">{messages.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Unread Messages</span>
            <span className="text-2xl font-bold">{messages.filter(m => m.status === 'sent').length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Read Messages</span>
            <span className="text-2xl font-bold">{messages.filter(m => m.status === 'read').length}</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <div className="max-w-sm flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Button variant="outline" className="ml-4">
          <MessageCircle className="mr-2 h-4 w-4" /> Export Messages
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>{message.sender}</TableCell>
                  <TableCell>{message.receiver}</TableCell>
                  <TableCell className="max-w-xs truncate">{message.content}</TableCell>
                  <TableCell>{new Date(message.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={message.status === 'read' ? 'default' : (message.status === 'delivered' ? 'secondary' : 'outline')}
                    >
                      {message.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No messages found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminMessages;
