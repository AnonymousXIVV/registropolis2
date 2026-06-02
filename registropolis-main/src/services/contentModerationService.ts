import { getCollection } from '@/lib/mockMongodb';
import type { Document } from '@/lib/mockMongodb';
import { loggingService } from '@/services/admin';

export interface ContentItem extends Document {
  _id: string;
  type: 'message' | 'post' | 'comment' | 'profile' | 'image';
  content: string;
  userId: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: Date;
  flags?: string[];
  reason?: string;
}

export interface ModerationRule extends Document {
  type: 'keyword' | 'regex';
  pattern: string;
  action: 'flag' | 'reject' | 'notify';
  enabled: boolean;
  severity: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: Date;
  scope: 'global' | 'message' | 'profile' | 'post';
}

class ContentModerationService {
  private static instance: ContentModerationService;
  private blocklistPatterns: RegExp[] = [];
  private moderationRules: ModerationRule[] = [];
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): ContentModerationService {
    if (!ContentModerationService.instance) {
      ContentModerationService.instance = new ContentModerationService();
    }
    return ContentModerationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await this.loadModerationRules();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize content moderation service:', error);
    }
  }

  async loadModerationRules(): Promise<void> {
    try {
      const collection = await getCollection<ModerationRule>('moderation_rules');
      this.moderationRules = await collection.find({ enabled: true }).toArray();
      
      // Compile regex patterns for keyword rules
      this.blocklistPatterns = this.moderationRules
        .filter(rule => rule.enabled)
        .map(rule => {
          try {
            if (rule.type === 'regex') {
              return new RegExp(rule.pattern, 'i');
            } else {
              // For keywords, escape special regex characters and create word boundary pattern
              const escaped = rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              return new RegExp(`\\b${escaped}\\b`, 'i');
            }
          } catch (e) {
            console.error(`Invalid pattern in moderation rule: ${rule.pattern}`, e);
            return null;
          }
        })
        .filter(pattern => pattern !== null) as RegExp[];
    } catch (error) {
      console.error('Error loading moderation rules:', error);
      throw new Error('Failed to load content moderation rules');
    }
  }

  async submitContentForModeration(content: Omit<ContentItem, '_id' | 'status' | 'moderatedBy' | 'moderatedAt'>): Promise<{ id: string; status: ContentItem['status']; flags?: string[] }> {
    try {
      const collection = await getCollection<ContentItem>('content_moderation');
      const newItem: Omit<ContentItem, '_id'> = {
        ...content,
        status: 'pending',
        createdAt: new Date()
      };
      
      // Check for automated moderation first
      const moderationResult = await this.checkContent(content.content, content.type);
      if (moderationResult.flags.length > 0) {
        newItem.flags = moderationResult.flags;
        newItem.status = moderationResult.action === 'reject' ? 'rejected' : 'pending';
      } else {
        newItem.status = 'approved'; // Auto-approve if no flags
      }
      
      const result = await collection.insertOne(newItem as ContentItem);
      
      // Log for audit purposes
      await loggingService.logAdminAction(
        'content_moderation',
        'system',
        { 
          contentId: result.insertedId,
          contentType: content.type,
          userId: content.userId,
          status: newItem.status,
          flags: newItem.flags
        }
      );
      
      return { 
        id: result.insertedId, 
        status: newItem.status as ContentItem['status'],
        flags: newItem.flags
      };
    } catch (error) {
      console.error('Error submitting content for moderation:', error);
      throw new Error('Failed to submit content for moderation');
    }
  }

  async moderateContent(contentId: string, decision: 'approved' | 'rejected', moderatorId: string, reason?: string): Promise<void> {
    try {
      const collection = await getCollection<ContentItem>('content_moderation');
      await collection.updateOne(
        { _id: contentId },
        {
          $set: {
            status: decision,
            moderatedBy: moderatorId,
            moderatedAt: new Date(),
            reason
          }
        }
      );
      
      // Log for audit purposes
      await loggingService.logAdminAction(
        'content_moderation_decision',
        moderatorId,
        { contentId, decision, reason }
      );
    } catch (error) {
      console.error('Error moderating content:', error);
      throw new Error('Failed to moderate content');
    }
  }

  async getPendingContent(limit: number = 20, contentType?: ContentItem['type']): Promise<ContentItem[]> {
    try {
      const collection = await getCollection<ContentItem>('content_moderation');
      let query: any = { status: 'pending' };
      if (contentType) {
        query.type = contentType;
      }
      
      return collection
        .find(query)
        .sort({ createdAt: 1 }) // Oldest first
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error getting pending content:', error);
      throw new Error('Failed to get pending content for moderation');
    }
  }

  async addModerationRule(rule: Omit<ModerationRule, '_id' | 'createdAt'>): Promise<string> {
    try {
      const collection = await getCollection<ModerationRule>('moderation_rules');
      const newRule = {
        ...rule,
        createdAt: new Date()
      };
      
      const result = await collection.insertOne(newRule as ModerationRule);
      
      // Reload rules
      await this.loadModerationRules();
      
      // Log for audit purposes
      await loggingService.logAdminAction(
        'add_moderation_rule',
        rule.createdBy,
        { ruleId: result.insertedId, pattern: rule.pattern, action: rule.action }
      );
      
      return result.insertedId;
    } catch (error) {
      console.error('Error adding moderation rule:', error);
      throw new Error('Failed to add moderation rule');
    }
  }

  async toggleModerationRule(ruleId: string, enabled: boolean, adminId: string): Promise<void> {
    try {
      const collection = await getCollection<ModerationRule>('moderation_rules');
      await collection.updateOne(
        { _id: ruleId },
        {
          $set: { enabled }
        }
      );
      
      // Reload rules
      await this.loadModerationRules();
      
      // Log for audit purposes
      await loggingService.logAdminAction(
        'toggle_moderation_rule',
        adminId,
        { ruleId, enabled }
      );
    } catch (error) {
      console.error('Error toggling moderation rule:', error);
      throw new Error('Failed to toggle moderation rule');
    }
  }

  async getContentModerationStats(): Promise<any> {
    try {
      const collection = await getCollection<ContentItem>('content_moderation');
      
      // Get counts for each status
      const approved = await collection.countDocuments({ status: 'approved' });
      const rejected = await collection.countDocuments({ status: 'rejected' });
      const pending = await collection.countDocuments({ status: 'pending' });
      
      // Get counts by content type
      const messageCount = await collection.countDocuments({ type: 'message' });
      const postCount = await collection.countDocuments({ type: 'post' });
      const commentCount = await collection.countDocuments({ type: 'comment' });
      const profileCount = await collection.countDocuments({ type: 'profile' });
      const imageCount = await collection.countDocuments({ type: 'image' });
      
      return {
        totalContent: approved + rejected + pending,
        statusBreakdown: { approved, rejected, pending },
        typeBreakdown: {
          message: messageCount,
          post: postCount,
          comment: commentCount,
          profile: profileCount,
          image: imageCount
        }
      };
    } catch (error) {
      console.error('Error getting content moderation stats:', error);
      throw new Error('Failed to get content moderation statistics');
    }
  }

  async flagContent(contentId: string, contentType: string, reason: string, reportedBy: string): Promise<void> {
    try {
      const collection = await getCollection<ContentItem>('content_moderation');
      await collection.updateOne(
        { _id: contentId },
        {
          $set: {
            status: 'flagged',
            moderatedBy: reportedBy,
            moderatedAt: new Date(),
            reason
          }
        }
      );
      
      // Log for audit purposes
      await loggingService.logAdminAction(
        'flag_content',
        reportedBy,
        { contentId, contentType, reason }
      );
    } catch (error) {
      console.error('Error flagging content:', error);
      throw new Error('Failed to flag content');
    }
  }

  private async checkContent(content: string, contentType: ContentItem['type']): Promise<{ flags: string[]; action: 'flag' | 'reject' | 'approve' }> {
    const flags: string[] = [];
    let highestSeverity: 'low' | 'medium' | 'high' = 'low';
    
    // Make sure rules are loaded
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Check content against all active rules for this content type
    for (const rule of this.moderationRules) {
      if (!rule.enabled) continue;
      if (rule.scope !== 'global' && rule.scope !== contentType) continue;
      
      let pattern: RegExp;
      try {
        if (rule.type === 'regex') {
          pattern = new RegExp(rule.pattern, 'i');
        } else {
          // For keywords
          const escaped = rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          pattern = new RegExp(`\\b${escaped}\\b`, 'i');
        }
        
        if (pattern.test(content)) {
          flags.push(rule.pattern);
          
          // Track highest severity for action determination
          if (rule.severity === 'high' || (rule.severity === 'medium' && highestSeverity === 'low')) {
            highestSeverity = rule.severity;
          }
        }
      } catch (e) {
        console.error(`Invalid pattern in moderation rule: ${rule.pattern}`, e);
      }
    }
    
    // Determine action based on severity
    let action: 'flag' | 'reject' | 'approve' = 'approve';
    if (flags.length > 0) {
      action = highestSeverity === 'high' ? 'reject' : 'flag';
    }
    
    return { flags, action };
  }
}

export const contentModerationService = ContentModerationService.getInstance();
