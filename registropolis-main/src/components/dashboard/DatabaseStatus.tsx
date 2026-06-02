import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Database, RefreshCw } from 'lucide-react';
import { getDatabase } from '@/lib/mockMongodb';

const DatabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [collectionStats, setCollectionStats] = useState<{[key: string]: number}>({});
  const { toast } = useToast();

  useEffect(() => {
    loadCollectionStats();
  }, []);

  const loadCollectionStats = async () => {
    try {
      setIsLoading(true);
      
      // Get mock database
      const db = await getDatabase();
      
      const stats: {[key: string]: number} = {};
      
      // Get counts for main collections
      const collections = ['users', 'messages', 'groups', 'businesses'];
      
      for (const collName of collections) {
        const coll = await db.collection(collName);
        const items = await coll.find().toArray();
        stats[collName] = items.length;
      }
      
      setCollectionStats(stats);
      setIsConnected(true);
    } catch (err) {
      console.error('Error loading collection stats:', err);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadCollectionStats();
      toast({
        title: "Database Refreshed",
        description: "Collection statistics have been updated.",
      });
    } catch (err) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh database stats.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all mock database collections? This will delete all data.")) {
      try {
        const db = await getDatabase();
        await db.clearAll();
        toast({
          title: "Mock Database Reset",
          description: "All collections have been cleared.",
        });
        // Refresh stats
        await loadCollectionStats();
      } catch (err) {
        toast({
          title: "Reset Failed",
          description: "Failed to reset mock database.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Status
        </CardTitle>
        <CardDescription>Mock Database Connection Status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span>Loading mock data...</span>
            </>
          ) : isConnected ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-green-500">Connected successfully to mock database</span>
            </>
          ) : (
            <>
              <Loader2 className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">
                Failed to load mock database
              </span>
            </>
          )}
        </div>
        
        {isConnected && !isLoading && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Collection Statistics:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(collectionStats).map(([collection, count]) => (
                <div key={collection} className="flex justify-between border rounded p-2">
                  <span className="capitalize">{collection}:</span>
                  <span className="font-mono">{count} items</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing || !isConnected}
        >
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh Stats
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleReset}
          disabled={!isConnected}
        >
          Reset Database
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseStatus;
