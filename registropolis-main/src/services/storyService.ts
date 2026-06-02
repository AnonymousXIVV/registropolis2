import { getCollection, Document } from '@/lib/mockMongodb';

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  media: {
    type: 'image' | 'video';
    url: string;
  }[];
  timestamp: string;
  viewers: string[];
  isExpired: boolean;
}

// Save a story
export async function saveStory(story: Story) {
  try {
    const collection = await getCollection<Story>('stories');
    await collection.insertOne({
      ...story,
      createdAt: new Date()
    } as any);
    console.log(`Story saved to MongoDB: ${story.id}`);
    return true;
  } catch (error) {
    console.error('Error saving story:', error);
    return false;
  }
}

// Get active stories
export async function getActiveStories() {
  try {
    const collection = await getCollection<Story>('stories');
    // Get stories less than 24 hours old
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const stories = await collection
      .find({ 
        timestamp: { $gte: oneDayAgo.toISOString() },
        isExpired: false
      })
      .sort({ timestamp: -1 })
      .toArray();
    
    console.log(`Retrieved ${stories.length} active stories`);
    return stories as Story[];
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

// Mark a story as viewed by a user
export async function markStoryAsViewed(storyId: string, userId: string) {
  try {
    const collection = await getCollection<Story>('stories');
    await collection.updateOne(
      { id: storyId },
      { $addToSet: { viewers: userId } }
    );
    console.log(`Story ${storyId} marked as viewed by user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error marking story as viewed:', error);
    return false;
  }
}

// Mark a story as expired
export async function markStoryAsExpired(storyId: string) {
  try {
    const collection = await getCollection<Story>('stories');
    await collection.updateOne(
      { id: storyId },
      { $set: { isExpired: true } }
    );
    console.log(`Story ${storyId} marked as expired`);
    return true;
  } catch (error) {
    console.error('Error marking story as expired:', error);
    return false;
  }
}
