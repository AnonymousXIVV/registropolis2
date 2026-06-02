
import { getCollection } from '@/lib/mockMongodb';
import type { Document } from '@/lib/mockMongodb';

export interface AnalyticsData extends Document {
  timestamp: Date;
  metrics: {
    activeUsers: number;
    newUsers: number;
    messagesSent: number;
    avgResponseTime: number;
    errorRate: number;
  };
  pageViews: Record<string, number>;
  userActions: Record<string, number>;
}

export interface AnalyticsFilter {
  startDate?: Date;
  endDate?: Date;
  metrics?: string[];
}

class AdminAnalyticsService {
  private static instance: AdminAnalyticsService;

  private constructor() {}

  static getInstance(): AdminAnalyticsService {
    if (!AdminAnalyticsService.instance) {
      AdminAnalyticsService.instance = new AdminAnalyticsService();
    }
    return AdminAnalyticsService.instance;
  }

  async getAnalytics(filter?: AnalyticsFilter): Promise<AnalyticsData[]> {
    try {
      const collection = await getCollection<AnalyticsData>('analytics');
      
      let query = {};
      if (filter?.startDate || filter?.endDate) {
        query = {
          timestamp: {
            ...(filter.startDate && { $gte: filter.startDate }),
            ...(filter.endDate && { $lte: filter.endDate })
          }
        };
      }
      
      return collection.find(query).sort({ timestamp: -1 }).toArray();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to fetch analytics data');
    }
  }

  async recordPageView(page: string): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const collection = await getCollection<AnalyticsData>('analytics');
      const todayRecord = await collection.findOne({ 
        timestamp: today 
      });
      
      if (todayRecord) {
        const pageViews = todayRecord.pageViews || {};
        const currentCount = pageViews[page] || 0;
        
        await collection.updateOne(
          { timestamp: today },
          { 
            $set: { 
              [`pageViews.${page}`]: currentCount + 1 
            } 
          }
        );
      } else {
        await collection.insertOne({
          timestamp: today,
          metrics: {
            activeUsers: 0,
            newUsers: 0,
            messagesSent: 0,
            avgResponseTime: 0,
            errorRate: 0
          },
          pageViews: { [page]: 1 },
          userActions: {}
        });
      }
    } catch (error) {
      console.error('Error recording page view:', error);
    }
  }

  async recordUserAction(action: string): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const collection = await getCollection<AnalyticsData>('analytics');
      const todayRecord = await collection.findOne({ timestamp: today });
      
      if (todayRecord) {
        const userActions = todayRecord.userActions || {};
        const currentCount = userActions[action] || 0;
        
        await collection.updateOne(
          { timestamp: today },
          { 
            $set: { 
              [`userActions.${action}`]: currentCount + 1 
            } 
          }
        );
      } else {
        await collection.insertOne({
          timestamp: today,
          metrics: {
            activeUsers: 0,
            newUsers: 0,
            messagesSent: 0,
            avgResponseTime: 0,
            errorRate: 0
          },
          pageViews: {},
          userActions: { [action]: 1 }
        });
      }
    } catch (error) {
      console.error('Error recording user action:', error);
    }
  }

  async updateDailyMetrics(metrics: Partial<AnalyticsData['metrics']>): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const collection = await getCollection<AnalyticsData>('analytics');
      const todayRecord = await collection.findOne({ timestamp: today });
      
      if (todayRecord) {
        await collection.updateOne(
          { timestamp: today },
          { 
            $set: { 
              metrics: {
                ...todayRecord.metrics,
                ...metrics
              }
            } 
          }
        );
      } else {
        await collection.insertOne({
          timestamp: today,
          metrics: {
            activeUsers: metrics.activeUsers || 0,
            newUsers: metrics.newUsers || 0,
            messagesSent: metrics.messagesSent || 0,
            avgResponseTime: metrics.avgResponseTime || 0,
            errorRate: metrics.errorRate || 0
          },
          pageViews: {},
          userActions: {}
        });
      }
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }

  async generateReport(startDate: Date, endDate: Date): Promise<any> {
    try {
      const collection = await getCollection<AnalyticsData>('analytics');
      const records = await collection.find({
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }).toArray();
      
      // Aggregate data
      const report = {
        period: {
          start: startDate,
          end: endDate
        },
        totalActiveUsers: 0,
        totalNewUsers: 0,
        totalMessagesSent: 0,
        avgResponseTime: 0,
        topPages: {} as Record<string, number>,
        topActions: {} as Record<string, number>
      };
      
      records.forEach(record => {
        report.totalActiveUsers += record.metrics.activeUsers;
        report.totalNewUsers += record.metrics.newUsers;
        report.totalMessagesSent += record.metrics.messagesSent;
        report.avgResponseTime += record.metrics.avgResponseTime;
        
        // Aggregate page views
        Object.entries(record.pageViews || {}).forEach(([page, count]) => {
          report.topPages[page] = (report.topPages[page] || 0) + count;
        });
        
        // Aggregate user actions
        Object.entries(record.userActions || {}).forEach(([action, count]) => {
          report.topActions[action] = (report.topActions[action] || 0) + count;
        });
      });
      
      // Calculate average response time
      if (records.length > 0) {
        report.avgResponseTime = report.avgResponseTime / records.length;
      }
      
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Failed to generate analytics report');
    }
  }
}

export const adminAnalyticsService = AdminAnalyticsService.getInstance();
