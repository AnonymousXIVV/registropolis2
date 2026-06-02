
import { getCollection } from '@/lib/mockMongodb';
import { SupportTicket, TicketResponse, UserWarning } from '@/types/supportTypes';
import { v4 as uuidv4 } from 'uuid';

class SupportService {
  private static instance: SupportService;

  private constructor() {}

  static getInstance(): SupportService {
    if (!SupportService.instance) {
      SupportService.instance = new SupportService();
    }
    return SupportService.instance;
  }

  async createTicket(ticket: Omit<SupportTicket, 'ticketId' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    const collection = await getCollection<SupportTicket>('support_tickets');
    const now = new Date();
    
    // Fix: Make sure newTicket includes all required SupportTicket properties
    // by destructuring ticket which should contain userId, subject, description, priority, and category
    const newTicket: SupportTicket = {
      userId: ticket.userId,
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority,
      category: ticket.category,
      ticketId: uuidv4(),
      status: 'open',
      createdAt: now,
      updatedAt: now
    };

    await collection.insertOne(newTicket);
    return newTicket.ticketId;
  }

  async getTickets(filters?: Partial<SupportTicket>): Promise<SupportTicket[]> {
    const collection = await getCollection<SupportTicket>('support_tickets');
    return collection.find(filters || {}).sort({ createdAt: -1 }).toArray();
  }

  async updateTicket(ticketId: string, updates: Partial<SupportTicket>): Promise<void> {
    const collection = await getCollection<SupportTicket>('support_tickets');
    await collection.updateOne(
      { ticketId },
      { 
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );
  }

  async addResponse(response: Omit<TicketResponse, 'responseId' | 'createdAt'>): Promise<void> {
    const collection = await getCollection<TicketResponse>('ticket_responses');
    await collection.insertOne({
      ...response,
      responseId: uuidv4(),
      createdAt: new Date()
    });
  }

  async getResponses(ticketId: string): Promise<TicketResponse[]> {
    const collection = await getCollection<TicketResponse>('ticket_responses');
    return collection.find({ ticketId }).sort({ createdAt: 1 }).toArray();
  }

  async issueWarning(warning: Omit<UserWarning, 'createdAt'>): Promise<void> {
    const collection = await getCollection<UserWarning>('user_warnings');
    await collection.insertOne({
      ...warning,
      createdAt: new Date()
    });

    // Update the ticket to indicate a warning was issued
    await this.updateTicket(warning.ticketId, { userWarned: true });
  }

  async getUserWarnings(userId: string): Promise<UserWarning[]> {
    const collection = await getCollection<UserWarning>('user_warnings');
    return collection.find({ userId }).sort({ createdAt: -1 }).toArray();
  }
}

export const supportService = SupportService.getInstance();
