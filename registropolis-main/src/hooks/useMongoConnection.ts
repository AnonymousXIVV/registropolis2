
import { useState, useEffect } from 'react';
import { testConnection, getCollection } from '@/lib/mockMongodb';
import { toast } from 'sonner';
import type { Document } from '@/lib/mockMongodb';

export const useMongoConnection = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Test the database connection on hook initialization
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Test database connection
        const connected = await testConnection();
        
        if (connected) {
          setIsConnected(true);
          setRetryCount(0);
          toast.success("Connected to MongoDB successfully");
        } else {
          setIsConnected(false);
          throw new Error("Connection test returned false");
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to connect to database'));
        setIsConnected(false);
        toast.error(`Database connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [retryCount]);

  // Function to retry connection
  const retryConnection = () => {
    setRetryCount(prev => prev + 1);
  };

  // Function to safely get a collection
  const getDbCollection = async <T extends Document = Document>(collectionName: string) => {
    if (!isConnected) {
      toast.error("Not connected to database");
      throw new Error("Not connected to database");
    }
    
    try {
      return await getCollection<T>(collectionName);
    } catch (err) {
      toast.error(`Failed to get collection: ${collectionName}`);
      setError(err instanceof Error ? err : new Error(`Failed to get collection: ${collectionName}`));
      throw err;
    }
  };

  return {
    isConnected,
    isLoading,
    error,
    retryConnection,
    getDbCollection
  };
};
