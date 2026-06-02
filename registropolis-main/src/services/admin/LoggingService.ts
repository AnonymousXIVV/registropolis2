
import { getCollection } from '@/lib/mockMongodb';
import { AdminLog, AdminAction } from '@/types/adminTypes';
import { BaseAdminService } from './BaseAdminService';

export class LoggingService extends BaseAdminService {
  private static instance: LoggingService | null = null;

  // Override the getInstance method with the correct return type
  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  async logAdminAction(action: string, performedBy: string, details: Record<string, any>): Promise<void> {
    try {
      const collection = await getCollection<AdminLog>('admin_logs');
      await collection.insertOne({
        action,
        performedBy,
        timestamp: new Date(),
        details
      } as AdminLog);
    } catch (error) {
      console.error('Error logging admin action:', error);
      throw new Error('Failed to log admin action');
    }
  }

  async createAdminAction(actionData: Partial<AdminAction>): Promise<AdminAction> {
    try {
      const collection = await getCollection<AdminAction>('admin_actions');
      const action: AdminAction = {
        ...actionData,
        status: 'pending',
        createdAt: new Date()
      } as AdminAction;

      const result = await collection.insertOne(action);
      return { ...action, _id: result.insertedId };
    } catch (error) {
      console.error('Error creating admin action:', error);
      throw new Error('Failed to create admin action');
    }
  }

  async getAdminLogs(limit: number = 100): Promise<AdminLog[]> {
    try {
      const collection = await getCollection<AdminLog>('admin_logs');
      return collection
        .find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error getting admin logs:', error);
      throw new Error('Failed to get admin logs');
    }
  }
}

export const loggingService = LoggingService.getInstance();
