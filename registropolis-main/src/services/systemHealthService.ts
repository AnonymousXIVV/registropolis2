
import { getCollection } from '@/lib/mockMongodb';
import type { Document } from '@/lib/mockMongodb';

export interface SystemHealth extends Document {
  timestamp: Date;
  status: 'healthy' | 'degraded' | 'down';
  services: {
    database: {
      status: 'online' | 'degraded' | 'offline';
      responseTime: number; // in ms
      connectionCount: number;
    };
    api: {
      status: 'online' | 'degraded' | 'offline';
      responseTime: number; // in ms
      errorRate: number; // percentage
    };
    fileStorage: {
      status: 'online' | 'degraded' | 'offline';
      usedSpace: number; // in bytes
      totalSpace: number; // in bytes
    };
  };
  performance: {
    cpuUsage: number; // percentage
    memoryUsage: number; // percentage
    activeUsers: number;
    requestsPerMinute: number;
  };
  lastIncident?: {
    timestamp: Date;
    description: string;
    resolvedAt?: Date;
  };
}

export interface PerformanceMetrics extends Document {
  timestamp: Date;
  pageLoadTime: number; // in ms
  apiResponseTime: number; // in ms
  errorCount: number;
  userCount: number;
}

class SystemHealthService {
  private static instance: SystemHealthService;
  private intervalId: number | null = null;
  private mockHealthData: SystemHealth | null = null;

  private constructor() {
    // Initialize with mock data for demonstration
    this.mockHealthData = {
      timestamp: new Date(),
      status: 'healthy',
      services: {
        database: {
          status: 'online',
          responseTime: 45,
          connectionCount: 12,
        },
        api: {
          status: 'online',
          responseTime: 120,
          errorRate: 0.5,
        },
        fileStorage: {
          status: 'online',
          usedSpace: 1073741824, // 1GB
          totalSpace: 5368709120, // 5GB
        },
      },
      performance: {
        cpuUsage: 25,
        memoryUsage: 40,
        activeUsers: 150,
        requestsPerMinute: 300,
      },
    };
  }

  static getInstance(): SystemHealthService {
    if (!SystemHealthService.instance) {
      SystemHealthService.instance = new SystemHealthService();
    }
    return SystemHealthService.instance;
  }

  async startMonitoring(intervalMs: number = 60000): Promise<void> {
    // In a real app, this would set up actual monitoring
    // For our mock app, we'll simulate health checks
    if (this.intervalId !== null) return;
    
    this.intervalId = window.setInterval(async () => {
      await this.recordHealthSnapshot();
    }, intervalMs);
    
    // Record initial snapshot
    await this.recordHealthSnapshot();
  }

  stopMonitoring(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async getSystemHealth(): Promise<SystemHealth> {
    // In a real app, this would perform actual health checks
    // For our mock app, return the latest snapshot or generate one
    try {
      const collection = await getCollection<SystemHealth>('system_health');
      const latestSnapshot = await collection
        .find()
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();
      
      if (latestSnapshot.length > 0) {
        return latestSnapshot[0];
      } else {
        // Generate a mock health snapshot if none exists
        if (this.mockHealthData) {
          this.mockHealthData.timestamp = new Date();
          return this.mockHealthData;
        } else {
          throw new Error('No health data available');
        }
      }
    } catch (error) {
      console.error('Error getting system health:', error);
      
      // Fallback to mock data in case of error
      if (this.mockHealthData) {
        this.mockHealthData.timestamp = new Date();
        return this.mockHealthData;
      } else {
        throw new Error('Failed to get system health');
      }
    }
  }

  async recordHealthSnapshot(): Promise<void> {
    try {
      // Get current health data (in a real app, these would be real metrics)
      const healthData = await this.simulateHealthCheck();
      
      const collection = await getCollection<SystemHealth>('system_health');
      await collection.insertOne(healthData);
    } catch (error) {
      console.error('Error recording health snapshot:', error);
    }
  }

  async recordPerformanceMetrics(metrics: Omit<PerformanceMetrics, '_id' | 'timestamp'>): Promise<void> {
    try {
      const collection = await getCollection<PerformanceMetrics>('performance_metrics');
      await collection.insertOne({
        ...metrics,
        timestamp: new Date()
      } as PerformanceMetrics);
    } catch (error) {
      console.error('Error recording performance metrics:', error);
    }
  }

  async getPerformanceHistory(hours: number = 24): Promise<PerformanceMetrics[]> {
    try {
      const collection = await getCollection<PerformanceMetrics>('performance_metrics');
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - hours);
      
      return collection
        .find({
          timestamp: { $gte: startTime }
        })
        .sort({ timestamp: 1 })
        .toArray();
    } catch (error) {
      console.error('Error getting performance history:', error);
      throw new Error('Failed to get performance history');
    }
  }

  async getIncidents(limit: number = 10): Promise<SystemHealth[]> {
    try {
      const collection = await getCollection<SystemHealth>('system_health');
      return collection
        .find({
          status: { $ne: 'healthy' }
        })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
    } catch (error) {
      console.error('Error getting incidents:', error);
      throw new Error('Failed to get system incidents');
    }
  }

  async resolveIncident(incidentId: string, resolution: string): Promise<void> {
    try {
      const collection = await getCollection<SystemHealth>('system_health');
      await collection.updateOne(
        { _id: incidentId },
        {
          $set: {
            'lastIncident.resolvedAt': new Date(),
            'lastIncident.resolution': resolution
          }
        }
      );
    } catch (error) {
      console.error('Error resolving incident:', error);
      throw new Error('Failed to resolve system incident');
    }
  }

  private async simulateHealthCheck(): Promise<SystemHealth> {
    // In a real app, this would perform actual health checks
    // For this mock, we'll generate random-ish data
    
    // Only modify our mock data if it exists
    if (!this.mockHealthData) {
      this.mockHealthData = {
        timestamp: new Date(),
        status: 'healthy',
        services: {
          database: {
            status: 'online',
            responseTime: 45,
            connectionCount: 12,
          },
          api: {
            status: 'online',
            responseTime: 120,
            errorRate: 0.5,
          },
          fileStorage: {
            status: 'online',
            usedSpace: 1073741824, // 1GB
            totalSpace: 5368709120, // 5GB
          },
        },
        performance: {
          cpuUsage: 25,
          memoryUsage: 40,
          activeUsers: 150,
          requestsPerMinute: 300,
        },
      };
    }
    
    // Randomly vary some metrics
    const data = { ...this.mockHealthData, timestamp: new Date() };
    
    // DB response time varies between 30-120ms
    data.services.database.responseTime = Math.floor(30 + Math.random() * 90);
    
    // API response time varies between 80-250ms
    data.services.api.responseTime = Math.floor(80 + Math.random() * 170);
    
    // API error rate varies between 0-3%
    data.services.api.errorRate = Math.random() * 3;
    
    // CPU usage varies between 15-70%
    data.performance.cpuUsage = Math.floor(15 + Math.random() * 55);
    
    // Memory usage varies between 30-85%
    data.performance.memoryUsage = Math.floor(30 + Math.random() * 55);
    
    // Active users varies between 50-300
    data.performance.activeUsers = Math.floor(50 + Math.random() * 250);
    
    // Requests per minute varies between 100-600
    data.performance.requestsPerMinute = Math.floor(100 + Math.random() * 500);
    
    // Used space increases slowly over time
    data.services.fileStorage.usedSpace = Math.min(
      data.services.fileStorage.totalSpace,
      data.services.fileStorage.usedSpace + Math.floor(Math.random() * 1048576) // Up to 1MB increase
    );
    
    // Occasionally simulate database degradation (1% chance)
    if (Math.random() < 0.01) {
      data.services.database.status = 'degraded';
      data.services.database.responseTime *= 3;
      data.status = 'degraded';
      data.lastIncident = {
        timestamp: new Date(),
        description: 'Database performance degradation detected'
      };
    }
    
    // Save the updated mock data for next time
    this.mockHealthData = { ...data };
    
    return data;
  }
}

export const systemHealthService = SystemHealthService.getInstance();
