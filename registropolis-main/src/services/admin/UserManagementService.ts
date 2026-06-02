
import { getCollection } from '@/lib/mockMongodb';
import { UserActivity, UserRestriction } from '@/types/adminTypes';
import { UserDocument } from '@/types/databaseTypes';
import { BaseAdminService } from './BaseAdminService';
import { LoggingService, loggingService } from './LoggingService';

export class UserManagementService extends BaseAdminService {
  private static instance: UserManagementService | null = null;

  // Override the getInstance method with the correct return type
  static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  async restrictUser(userId: string, restriction: Omit<UserRestriction, 'userId' | 'status'>): Promise<void> {
    try {
      const collection = await getCollection<UserRestriction>('user_restrictions');
      
      await collection.insertOne({
        userId,
        ...restriction,
        status: 'active'
      } as UserRestriction);

      await loggingService.logAdminAction(
        'restrict_user',
        restriction.createdBy,
        { userId, restriction }
      );
    } catch (error) {
      console.error('Error restricting user:', error);
      throw new Error('Failed to restrict user');
    }
  }

  async updateUserRole(userId: string, newRole: 'user' | 'admin' | 'moderator'): Promise<void> {
    try {
      const collection = await getCollection<UserDocument>('users');
      
      await collection.updateOne(
        { _id: userId },
        { $set: { role: newRole } }
      );

      await loggingService.logAdminAction(
        'update_user_role',
        'system',
        { userId, newRole }
      );
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const collection = await getCollection<UserDocument>('users');
      
      await collection.deleteOne({ _id: userId });

      await loggingService.logAdminAction(
        'delete_user',
        'system',
        { userId }
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async getUserActivities(userId?: string, limit: number = 100): Promise<UserActivity[]> {
    try {
      const collection = await getCollection<UserActivity>('user_activities');
      const query = userId ? { userId } : {};
      
      return collection
        .find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error getting user activities:', error);
      throw new Error('Failed to get user activities');
    }
  }

  async getUserRestrictions(userId?: string): Promise<UserRestriction[]> {
    try {
      const collection = await getCollection<UserRestriction>('user_restrictions');
      const query = userId ? { userId, status: 'active' as const } : { status: 'active' as const };
      
      return collection
        .find(query)
        .sort({ startDate: -1 })
        .toArray();
    } catch (error) {
      console.error('Error getting user restrictions:', error);
      throw new Error('Failed to get user restrictions');
    }
  }

  async trackUserActivity(activity: Omit<UserActivity, 'timestamp'>): Promise<void> {
    try {
      const collection = await getCollection<UserActivity>('user_activities');
      
      await collection.insertOne({
        ...activity,
        timestamp: new Date()
      } as UserActivity);
    } catch (error) {
      console.error('Error tracking user activity:', error);
      throw new Error('Failed to track user activity');
    }
  }
}

export const userManagementService = UserManagementService.getInstance();
