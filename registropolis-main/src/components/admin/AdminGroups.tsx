
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Search } from 'lucide-react';

// Mock data for groups
const mockGroups = [
  {
    id: 'group1',
    name: 'Work Team',
    memberCount: 5,
    createdBy: 'John Doe',
    createdAt: '2024-03-15T10:30:00Z',
    isActive: true
  },
  {
    id: 'group2',
    name: 'Family',
    memberCount: 8,
    createdBy: 'Jane Smith',
    createdAt: '2024-03-10T15:45:00Z',
    isActive: true
  },
  {
    id: 'group3',
    name: 'Book Club',
    memberCount: 12,
    createdBy: 'Bob Johnson',
    createdAt: '2024-02-20T09:15:00Z',
    isActive: false
  }
];

const AdminGroups: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groups] = useState(mockGroups);
  
  const filteredGroups = groups.filter(group => 
    group.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    group.createdBy?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Group Statistics</CardTitle>
          <CardDescription>Overview of group activity</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Groups</span>
            <span className="text-2xl font-bold">{groups.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Active Groups</span>
            <span className="text-2xl font-bold">{groups.filter(g => g.isActive).length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Members</span>
            <span className="text-2xl font-bold">{groups.reduce((acc, curr) => acc + curr.memberCount, 0)}</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <div className="max-w-sm flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Button variant="outline" className="ml-4">
          <Users className="mr-2 h-4 w-4" /> Manage Groups
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell>{group.createdBy}</TableCell>
                  <TableCell>{group.memberCount}</TableCell>
                  <TableCell>{new Date(group.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={group.isActive ? 'default' : 'secondary'}
                    >
                      {group.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No groups found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminGroups;
