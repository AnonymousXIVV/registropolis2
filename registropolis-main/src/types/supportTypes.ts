
import { Document } from '@/lib/mockMongodb';

export interface SupportTicket extends Document {
  ticketId: string;
  userId: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'technical' | 'billing' | 'report' | 'complaint';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  resolution?: string;
  userWarned?: boolean;
}

export interface TicketResponse extends Document {
  ticketId: string;
  responseId: string;
  responderId: string;
  message: string;
  createdAt: Date;
  isAdminResponse: boolean;
}

export interface UserWarning extends Document {
  userId: string;
  ticketId: string;
  reason: string;
  warningLevel: 'low' | 'medium' | 'high';
  createdAt: Date;
  expiresAt?: Date;
  acknowledgedAt?: Date;
}
