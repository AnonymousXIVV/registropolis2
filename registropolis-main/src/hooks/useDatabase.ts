
import { useState, useEffect } from 'react';
import { testConnection, getCollection, getDatabase } from '@/lib/mockMongodb';

export const useDatabase = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Test the database connection on hook initialization
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        
        // Test mock database connection
        const connected = await testConnection();
        setIsConnected(connected);
        
        // Initialize basic collections if they don't exist
        if (connected && !localStorage.getItem('dbInitialized')) {
          await initializeBasicCollections();
          localStorage.setItem('dbInitialized', 'true');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to connect to mock database'));
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  // Initialize some basic collections with sample data
  const initializeBasicCollections = async () => {
    try {
      // Get users collection
      const usersCollection = await getCollection('users');
      const users = await usersCollection.find().toArray();
      
      // Only add sample users if collection is empty
      if (users.length === 0) {
        await usersCollection.insertMany([
          { name: 'John Doe', email: 'john@example.com', role: 'user', id: 'user1' },
          { name: 'Jane Smith', email: 'jane@example.com', role: 'admin', id: 'user2' },
          { name: 'Bob Johnson', email: 'bob@example.com', role: 'user', id: 'user3' }
        ]);
      }
      
      // Get messages collection
      const messagesCollection = await getCollection('messages');
      const messages = await messagesCollection.find().toArray();
      
      // Only add sample messages if collection is empty
      if (messages.length === 0) {
        await messagesCollection.insertMany([
          { sender: 'user1', receiver: 'user2', content: 'Hello, how are you?', timestamp: new Date().toISOString(), id: 'msg1', chatId: 'chat1' },
          { sender: 'user2', receiver: 'user1', content: 'I\'m doing great!', timestamp: new Date().toISOString(), id: 'msg2', chatId: 'chat1' }
        ]);
      }
      
      // Get groups collection
      const groupsCollection = await getCollection('groups');
      const groups = await groupsCollection.find().toArray();
      
      // Only add sample groups if collection is empty
      if (groups.length === 0) {
        await groupsCollection.insertMany([
          { 
            name: 'Work Team', 
            members: ['user1', 'user2', 'user3'], 
            id: 'group1', 
            createdAt: new Date().toISOString(),
            createdBy: 'user1'
          }
        ]);
      }
      
      // Get businesses collection
      const businessesCollection = await getCollection('businesses');
      const businesses = await businessesCollection.find().toArray();
      
      // Only add sample businesses if collection is empty
      if (businesses.length === 0) {
        await businessesCollection.insertMany([
          { 
            name: 'ABC Restaurant', 
            owner: 'user1', 
            type: 'restaurant', 
            id: 'business1',
            description: 'Delicious food at affordable prices',
            details: {
              cuisine: 'Italian',
              priceRange: '$$',
              address: '123 Main St',
              specialties: ['Pizza', 'Pasta', 'Salads']
            }
          },
          { 
            name: 'XYZ Taxi Service', 
            owner: 'user2', 
            type: 'taxi', 
            id: 'business2',
            description: 'Reliable and affordable transportation',
            details: {
              vehicleType: 'Sedan',
              vehicleModel: 'Toyota Camry',
              rating: 4.7,
              experience: '5+ years',
              perMileRate: '$2.50'
            }
          }
        ]);
      }
    } catch (err) {
      console.error('Error initializing collections:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize mock database collections'));
    }
  };

  // Get a specific collection from the database
  const getDbCollection = async (collectionName: string) => {
    try {
      // Use mock database
      return await getCollection(collectionName);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get collection: ${collectionName}`));
      throw err;
    }
  };

  return {
    isConnected,
    isLoading,
    error,
    getDbCollection
  };
};
