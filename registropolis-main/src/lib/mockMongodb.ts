
// In-memory storage for collections
const inMemoryDb: Record<string, any[]> = {};

// Define types locally instead of importing from mongodb
export type Document = Record<string, any>;

interface CollectionMethods<T extends Document> {
  find: (query?: any) => {
    sort: (sortOptions?: any) => {
      limit: (limitCount: number) => {
        toArray: () => Promise<T[]>;
      };
      toArray: () => Promise<T[]>;
    };
    toArray: () => Promise<T[]>;
  };
  findOne: (query?: any) => Promise<T | null>;
  insertOne: (doc: any) => Promise<{ insertedId: string; acknowledged: boolean }>;
  insertMany: (docs: any[]) => Promise<{ insertedIds: Record<string, string>; acknowledged: boolean; insertedCount: number }>;
  updateOne: (query: any, update: any, options?: any) => Promise<{ modifiedCount: number; matchedCount: number; acknowledged: boolean; upsertedCount?: number }>;
  deleteOne: (query: any) => Promise<{ deletedCount: number; acknowledged: boolean }>;
  countDocuments: (query?: any) => Promise<number>;
}

// Mock MongoDB functionality for browser environment
export async function getCollection<T extends Document>(name: string): Promise<CollectionMethods<T>> {
  // Initialize collection if it doesn't exist
  if (!inMemoryDb[name]) {
    inMemoryDb[name] = [];
  }

  // Create a mock Collection implementation
  const mockCollection: CollectionMethods<T> = {
    find: (query = {}) => {
      return {
        sort: (sortOptions = {}) => {
          return {
            limit: (limitCount: number) => {
              return {
                toArray: async () => {
                  let results = [...inMemoryDb[name]];
                  
                  // Very basic filtering based on equality
                  if (Object.keys(query).length > 0) {
                    results = results.filter(item => {
                      return Object.entries(query).every(([key, value]) => {
                        // Handle special cases like $or
                        if (key === '$or' && Array.isArray(value)) {
                          return value.some((condition: any) => {
                            return Object.entries(condition).every(([condKey, condValue]) => {
                              return item[condKey] === condValue;
                            });
                          });
                        }
                        
                        return item[key] === value;
                      });
                    });
                  }
                  
                  // Very basic sorting - just one level for now
                  if (Object.keys(sortOptions).length > 0) {
                    const [sortKey, sortOrder] = Object.entries(sortOptions)[0];
                    results.sort((a, b) => {
                      if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
                      if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
                      return 0;
                    });
                  }
                  
                  // Apply limit
                  if (limitCount > 0) {
                    results = results.slice(0, limitCount);
                  }
                  
                  return results as T[];
                }
              };
            },
            toArray: async () => {
              let results = [...inMemoryDb[name]];
              
              // Very basic filtering
              if (Object.keys(query).length > 0) {
                results = results.filter(item => {
                  return Object.entries(query).every(([key, value]) => {
                    return item[key] === value;
                  });
                });
              }
              
              // Very basic sorting
              if (Object.keys(sortOptions).length > 0) {
                const [sortKey, sortOrder] = Object.entries(sortOptions)[0];
                results.sort((a, b) => {
                  if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
                  if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
                  return 0;
                });
              }
              
              return results as T[];
            }
          };
        },
        toArray: async () => {
          let results = [...inMemoryDb[name]];
          
          // Very basic filtering
          if (Object.keys(query).length > 0) {
            results = results.filter(item => {
              return Object.entries(query).every(([key, value]) => {
                return item[key] === value;
              });
            });
          }
          
          return results as T[];
        }
      };
    },
    findOne: async (query = {}) => {
      const results = inMemoryDb[name].filter(item => {
        return Object.entries(query).every(([key, value]) => {
          return item[key] === value;
        });
      });
      return (results[0] || null) as T | null;
    },
    insertOne: async (doc: any) => {
      const id = Math.random().toString(36).substring(2, 15);
      const newDoc = { ...doc, _id: doc._id || id };
      inMemoryDb[name].push(newDoc);
      return { insertedId: newDoc._id, acknowledged: true };
    },
    insertMany: async (docs: any[]) => {
      const insertedIds: Record<string, string> = {};
      docs.forEach((doc, index) => {
        const id = doc._id || Math.random().toString(36).substring(2, 15);
        const newDoc = { ...doc, _id: id };
        inMemoryDb[name].push(newDoc);
        insertedIds[index] = id;
      });
      return { insertedIds, acknowledged: true, insertedCount: docs.length };
    },
    updateOne: async (query: any, update: any, options: any = {}) => {
      const index = inMemoryDb[name].findIndex(item => {
        return Object.entries(query).every(([key, value]) => {
          return item[key] === value;
        });
      });
      
      if (index !== -1) {
        if (update.$set) {
          inMemoryDb[name][index] = { 
            ...inMemoryDb[name][index], 
            ...update.$set 
          };
        }
        return { modifiedCount: 1, matchedCount: 1, acknowledged: true };
      } else if (options.upsert) {
        const newDoc = { ...query, ...update.$set };
        inMemoryDb[name].push(newDoc);
        return { modifiedCount: 0, matchedCount: 0, upsertedCount: 1, acknowledged: true };
      }
      
      return { modifiedCount: 0, matchedCount: 0, acknowledged: true };
    },
    deleteOne: async (query: any) => {
      const initialLength = inMemoryDb[name].length;
      inMemoryDb[name] = inMemoryDb[name].filter(item => {
        return !Object.entries(query).every(([key, value]) => {
          return item[key] === value;
        });
      });
      return { 
        deletedCount: initialLength - inMemoryDb[name].length,
        acknowledged: true 
      };
    },
    countDocuments: async (query = {}) => {
      if (Object.keys(query).length === 0) {
        return inMemoryDb[name].length;
      }
      
      const filtered = inMemoryDb[name].filter(item => {
        return Object.entries(query).every(([key, value]) => {
          return item[key] === value;
        });
      });
      
      return filtered.length;
    }
  };

  return mockCollection;
}

// Test connection - always returns true in mock
export async function testConnection(): Promise<boolean> {
  console.log("Mock MongoDB connection test: Success");
  return true;
}

// Mock database initialization with some data
export async function initializeMockDatabase() {
  // Initialize users collection with some sample data
  const usersCollection = await getCollection('users');
  await usersCollection.insertMany([
    { 
      name: 'Admin User', 
      email: 'admin@example.com', 
      role: 'admin',
      phoneNumber: '+1234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      name: 'Regular User', 
      email: 'user@example.com', 
      role: 'user',
      phoneNumber: '+9876543210',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // Initialize other collections as needed
  console.log('Mock database initialized with sample data');
}

// Mock database operations for browser environment
export async function getDatabase() {
  return {
    collection: (name: string) => {
      if (!inMemoryDb[name]) {
        inMemoryDb[name] = [];
      }
      return getCollection(name);
    },
    runCommand: async (command: any) => {
      if (command.ping === 1) {
        return { ok: 1 };
      }
      return { ok: 0 };
    },
    clearAll: async () => {
      Object.keys(inMemoryDb).forEach(key => {
        inMemoryDb[key] = [];
      });
      console.log('All mock collections cleared');
    }
  };
}

// Initialize mock database
initializeMockDatabase();

// Export a mock ObjectId class to use in place of MongoDB's ObjectId
export class ObjectId {
  id: string;
  
  constructor(id?: string) {
    this.id = id || Math.random().toString(36).substring(2, 15);
  }
  
  toString() {
    return this.id;
  }
  
  equals(otherId: ObjectId) {
    return this.id === otherId.id;
  }
}
