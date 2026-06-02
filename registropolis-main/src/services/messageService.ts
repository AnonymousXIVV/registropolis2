
import { Message } from '@/hooks/useMessages';

// Mock localStorage-based message service (instead of MongoDB)
const STORAGE_KEY = 'arzov_messages';

// Initialize the messages storage
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  }
};

// Get all messages from storage
const getMessagesFromStorage = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    console.error('Error parsing messages from storage:', e);
    return {};
  }
};

// Save messages to storage
const saveMessagesToStorage = (messages: Record<string, Message[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    return true;
  } catch (e) {
    console.error('Error saving messages to storage:', e);
    return false;
  }
};

// Save a message
export async function saveMessage(chatId: string, message: Message) {
  try {
    const allMessages = getMessagesFromStorage();
    if (!allMessages[chatId]) {
      allMessages[chatId] = [];
    }
    
    allMessages[chatId].push({
      ...message,
      createdAt: new Date().toISOString()
    });
    
    saveMessagesToStorage(allMessages);
    console.log(`Message saved to storage: ${message.id}`);
    return true;
  } catch (error) {
    console.error('Error saving message:', error);
    return false;
  }
}

// Get messages for a chat
export async function getMessages(chatId: string) {
  try {
    const allMessages = getMessagesFromStorage();
    const messages = allMessages[chatId] || [];
    
    // Sort by timestamp
    messages.sort((a: Message, b: Message) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    console.log(`Retrieved ${messages.length} messages for chat ${chatId}`);
    return messages as Message[];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

// Update a message
export async function updateMessage(chatId: string, messageId: string, updates: Partial<Message>) {
  try {
    const allMessages = getMessagesFromStorage();
    if (!allMessages[chatId]) return false;
    
    allMessages[chatId] = allMessages[chatId].map((msg: Message) => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    );
    
    saveMessagesToStorage(allMessages);
    console.log(`Message updated in storage: ${messageId}`);
    return true;
  } catch (error) {
    console.error('Error updating message:', error);
    return false;
  }
}

// Delete a message
export async function deleteMessage(chatId: string, messageId: string) {
  try {
    const allMessages = getMessagesFromStorage();
    if (!allMessages[chatId]) return false;
    
    allMessages[chatId] = allMessages[chatId].filter((msg: Message) => msg.id !== messageId);
    
    saveMessagesToStorage(allMessages);
    console.log(`Message deleted from storage: ${messageId}`);
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
}
