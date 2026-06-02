
import { getCollection } from '@/lib/mockMongodb';
import { FeatureFlag } from '@/types/adminTypes';
import { BaseAdminService } from './BaseAdminService';
import { LoggingService, loggingService } from './LoggingService';

export class FeatureService extends BaseAdminService {
  private static instance: FeatureService | null = null;

  // Override the getInstance method with the correct return type
  static getInstance(): FeatureService {
    if (!FeatureService.instance) {
      FeatureService.instance = new FeatureService();
    }
    return FeatureService.instance;
  }

  async toggleFeature(featureName: string, enabled: boolean, scope: 'global' | 'user' = 'global', targetUsers?: string[]): Promise<void> {
    try {
      const collection = await getCollection<FeatureFlag>('feature_flags');
      
      await collection.updateOne(
        { name: featureName },
        {
          $set: {
            enabled,
            scope,
            targetUsers,
            lastModified: new Date(),
            modifiedBy: 'admin'
          }
        },
        { upsert: true }
      );

      await loggingService.logAdminAction(
        'toggle_feature',
        'admin',
        { featureName, enabled, scope, targetUsers }
      );
    } catch (error) {
      console.error('Error toggling feature:', error);
      throw new Error('Failed to toggle feature');
    }
  }

  async getAllFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const collection = await getCollection<FeatureFlag>('feature_flags');
      return collection.find().toArray();
    } catch (error) {
      console.error('Error getting feature flags:', error);
      throw new Error('Failed to get feature flags');
    }
  }
}

export const featureService = FeatureService.getInstance();
