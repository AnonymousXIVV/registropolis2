
import { getCollection } from './mockMongodb';
import { APP_FEATURES } from '@/config/features';

// Enhanced admin feature control interface
export interface AdminFeatureControl {
  featureId: string;
  enabled: boolean;
  moderationEnabled: boolean;
  restrictedToRoles?: string[];
  moderationRules?: {
    requiresApproval: boolean;
    autoModeration: boolean;
    maxDailySubmissions?: number;
  };
}

// Function to update feature controls
export async function updateFeatureControls(featureId: string, controls: Partial<AdminFeatureControl>) {
  const collection = await getCollection<AdminFeatureControl>('feature_controls');
  await collection.updateOne(
    { featureId },
    { $set: controls },
    { upsert: true }
  );
}

// Function to get feature controls
export async function getFeatureControls(featureId: string): Promise<AdminFeatureControl | null> {
  const collection = await getCollection<AdminFeatureControl>('feature_controls');
  return collection.findOne({ featureId });
}

// Initialize default feature controls
export async function initializeFeatureControls() {
  const collection = await getCollection<AdminFeatureControl>('feature_controls');
  
  // Create default controls for each feature
  for (const feature of Object.values(APP_FEATURES)) {
    const existingControl = await collection.findOne({ featureId: feature });
    
    if (!existingControl) {
      await collection.insertOne({
        featureId: feature,
        enabled: true,
        moderationEnabled: true,
        restrictedToRoles: ['admin', 'user'],
        moderationRules: {
          requiresApproval: false,
          autoModeration: true,
          maxDailySubmissions: 50
        }
      });
    }
  }
}

// Initialize on import
initializeFeatureControls();
