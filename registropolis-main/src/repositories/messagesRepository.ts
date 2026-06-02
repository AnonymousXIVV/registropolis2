
import { ObjectId } from '@/lib/mockMongodb';
import { getCollection } from '@/lib/mockMongodb';
import type { MessageDocument } from '@/types/databaseTypes';

export class MessagesRepository {
  static async getMessagesBetweenUsers(currentUserId: string, otherUserId: string): Promise<MessageDocument[]> {
    try {
      const collection = await getCollection<MessageDocument>('messages');
      const messages = await collection.find({
        $or: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId }
        ]
      }).sort({ createdAt: -1 }).limit(50).toArray();

      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  static async createMessage(message: Omit<MessageDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const collection = await getCollection<MessageDocument>('messages');
      const now = new Date();
      const result = await collection.insertOne({
        ...message,
        createdAt: now,
        updatedAt: now
      });

      return result.insertedId;
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('Failed to create message');
    }
  }

  static async updateMessageStatus(messageId: string, status: MessageDocument['status']): Promise<void> {
    try {
      const collection = await getCollection<MessageDocument>('messages');
      await collection.updateOne(
        { _id: messageId },
        { 
          $set: { 
            status,
            updatedAt: new Date()
          } 
        }
      );
    } catch (error) {
      console.error('Error updating message status:', error);
      throw new Error('Failed to update message status');
    }
  }
}
