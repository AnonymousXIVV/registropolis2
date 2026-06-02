
// Mock database service for frontend use
// This replaces the MongoDB implementation which can't run in browsers

// Simulate connection delay
const MOCK_DELAY = 800;

// Load collections from localStorage or use default empty collections
const loadCollections = (): Record<string, any[]> => {
  const storedCollections = localStorage.getItem('mockDatabaseCollections');
  if (storedCollections) {
    try {
      return JSON.parse(storedCollections);
    } catch (error) {
      console.error('Error parsing stored collections:', error);
    }
  }
  
  // Default empty collections
  return {
    users: [],
    messages: [],
    groups: [],
    businesses: []
  };
};

// Save collections to localStorage
const saveCollections = (collections: Record<string, any[]>) => {
  try {
    localStorage.setItem('mockDatabaseCollections', JSON.stringify(collections));
  } catch (error) {
    console.error('Error saving collections to localStorage:', error);
  }
};

// In-memory storage with localStorage persistence
let collections = loadCollections();

export const testConnection = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a successful connection
      resolve(true);
    }, MOCK_DELAY);
  });
};

export const getCollection = async (collectionName: string) => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // Create collection if it doesn't exist
  if (!collections[collectionName]) {
    collections[collectionName] = [];
    saveCollections(collections);
  }
  
  return {
    find: () => ({
      toArray: async () => {
        // Return a deep copy to prevent direct mutation
        return JSON.parse(JSON.stringify(collections[collectionName] || []));
      }
    }),
    findOne: async (query: any) => {
      return collections[collectionName].find(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });
    },
    countDocuments: async (query?: any) => {
      if (!query) {
        return collections[collectionName].length;
      }
      
      // If query provided, count matching documents
      return collections[collectionName].filter(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      }).length;
    },
    insertOne: async (document: any) => {
      const id = Math.random().toString(36).substring(2, 15);
      const newDoc = { _id: id, ...document };
      collections[collectionName].push(newDoc);
      saveCollections(collections);
      return { insertedId: id, acknowledged: true };
    },
    insertMany: async (documents: any[]) => {
      const ids = [];
      for (const doc of documents) {
        const id = Math.random().toString(36).substring(2, 15);
        const newDoc = { _id: id, ...doc };
        collections[collectionName].push(newDoc);
        ids.push(id);
      }
      saveCollections(collections);
      return { insertedIds: ids, acknowledged: true };
    },
    updateOne: async (query: any, update: any) => {
      const index = collections[collectionName].findIndex(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });
      
      if (index !== -1) {
        if (update.$set) {
          collections[collectionName][index] = {
            ...collections[collectionName][index],
            ...update.$set
          };
          saveCollections(collections);
        }
        return { modifiedCount: 1, acknowledged: true };
      }
      
      return { modifiedCount: 0, acknowledged: true };
    },
    deleteOne: async (query: any) => {
      const initialLength = collections[collectionName].length;
      collections[collectionName] = collections[collectionName].filter(item => {
        for (const key in query) {
          if (item[key] === query[key]) return false;
        }
        return true;
      });
      
      saveCollections(collections);
      return { 
        deletedCount: initialLength - collections[collectionName].length,
        acknowledged: true 
      };
    },
    // Add a clear method for testing purposes
    clear: async () => {
      collections[collectionName] = [];
      saveCollections(collections);
      return { acknowledged: true };
    }
  };
};

export const getDatabase = async () => {
  return {
    collection: (name: string) => getCollection(name),
    command: async () => ({ ok: 1 }),
    clearAll: async () => {
      for (const key in collections) {
        collections[key] = [];
      }
      saveCollections(collections);
      return { acknowledged: true };
    }
  };
};
