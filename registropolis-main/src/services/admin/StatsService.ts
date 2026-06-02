
import { getCollection } from '@/lib/mockMongodb';
import { AdminStats } from '@/types/adminTypes';
import { UserDocument, MessageDocument, GroupDocument } from '@/types/databaseTypes';
import { BaseAdminService } from './BaseAdminService';

export class StatsService extends BaseAdminService {
  private static instance: StatsService | null = null;

  // Override the getInstance method with the correct return type
  static getInstance(): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }
    return StatsService.instance;
  }

  async getDashboardStats(): Promise<AdminStats> {
    try {
      const [users, messages, groups] = await Promise.all([
        this.getTotalUsers(),
        this.getTotalMessages(),
        this.getTotalGroups()
      ]);

      return {
        totalUsers: users,
        totalMessages: messages,
        totalGroups: groups,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new Error('Failed to get dashboard statistics');
    }
  }

  private async getTotalUsers(): Promise<number> {
    const collection = await getCollection<UserDocument>('users');
    return collection.countDocuments();
  }

  private async getTotalMessages(): Promise<number> {
    const collection = await getCollection<MessageDocument>('messages');
    return collection.countDocuments();
  }

  private async getTotalGroups(): Promise<number> {
    const collection = await getCollection<GroupDocument>('groups');
    return collection.countDocuments();
  }
}

export const statsService = StatsService.getInstance();
