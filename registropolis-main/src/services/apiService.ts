import { toast } from 'sonner';
import { getCollection } from '@/lib/mockDatabase';

// Define consistent response types
type ApiSuccessResponse<T> = {
  success: boolean;
  message: string;
  data?: T; 
  user?: any;
  token?: string;
  messages?: any[];
};

// Helper for making API requests with mock implementation
export const apiRequest = async (
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: any,
  requiresAuth: boolean = true
): Promise<ApiSuccessResponse<any>> => {
  try {
    console.log(`Making ${method} request to: ${endpoint} (mock)`);
    
    // Handle authentication
    if (requiresAuth) {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required');
      }
    }
    
    // Implement mock responses based on the endpoint
    return await mockApiResponse(endpoint, method, data);
  } catch (error) {
    // Handle errors
    console.error('API request error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        // Clear local storage and redirect to login if auth is required
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
      
      toast.error(error.message);
    } else {
      toast.error('An unknown error occurred');
    }
    
    throw error;
  }
};

// Mock API response implementation
const mockApiResponse = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Parse the endpoint to determine the response
  if (endpoint.startsWith('/auth/')) {
    return handleAuthEndpoints(endpoint, method, data);
  } else if (endpoint.startsWith('/admin/')) {
    return handleAdminEndpoints(endpoint, method, data);
  } else if (endpoint.startsWith('/messages/')) {
    return handleMessageEndpoints(endpoint, method, data);
  } else if (endpoint.startsWith('/groups/')) {
    return handleGroupEndpoints(endpoint, method, data);
  } else if (endpoint.startsWith('/businesses')) {
    return handleBusinessEndpoints(endpoint, method, data);
  } else if (endpoint.startsWith('/contacts')) {
    return handleContactEndpoints(endpoint, method, data);
  }
  
  throw new Error('Endpoint not implemented in mock mode');
};

// Authentication endpoints
const handleAuthEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  switch (endpoint) {
    case '/auth/request-otp':
      console.log('Mock: OTP requested for phone number:', data?.phoneNumber);
      return { success: true, message: 'OTP sent successfully' };
      
    case '/auth/verify-otp':
      console.log('Mock: Verifying OTP:', data?.otp, 'for phone:', data?.phoneNumber);
      // Accept any 6-digit OTP for development
      if (data?.otp?.length === 6) {
        return { success: true, message: 'OTP verified successfully' };
      }
      throw new Error('Invalid verification code');
      
    case '/auth/complete-profile': {
      console.log('Mock: Completing profile for:', data?.name);
      // Generate mock user ID
      const userId = 'user_' + Math.random().toString(36).substring(2, 15);
      
      // Check if this is admin email
      const isAdmin = data.email === 'admin';
      
      // Create mock user
      const user = {
        id: userId,
        phoneNumber: data.phoneNumber,
        name: data.name,
        email: data.email,
        profileImageUrl: data.profileImageUrl || null,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      };
      
      // Create mock token
      const token = 'mock_token_' + Math.random().toString(36).substring(2, 15);
      
      // Store the mock user in localStorage for future requests
      localStorage.setItem('mock_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      
      return { 
        success: true, 
        message: 'Profile created successfully',
        user,
        token
      };
    }
    
    case '/auth/me':
      // Return the stored user if available
      const storedUser = localStorage.getItem('mock_user') || localStorage.getItem('user');
      if (storedUser) {
        return { 
          success: true, 
          message: 'User retrieved successfully', 
          user: JSON.parse(storedUser) 
        };
      }
      throw new Error('User not found');
      
    case '/auth/refresh-token':
      return { 
        success: true, 
        message: 'Token refreshed successfully', 
        token: 'mock_refresh_token_' + Math.random().toString(36).substring(2, 15) 
      };
      
    case '/auth/logout':
      localStorage.removeItem('mock_user');
      localStorage.removeItem('auth_token');
      return { success: true, message: 'Logged out successfully' };
      
    default:
      throw new Error('Auth endpoint not implemented in mock mode');
  }
};

// Admin endpoints
const handleAdminEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  // Check if current user is an admin
  const storedUser = localStorage.getItem('mock_user') || localStorage.getItem('user');
  if (!storedUser) {
    throw new Error('Authentication required');
  }
  
  const user = JSON.parse(storedUser);
  if (user.role !== 'admin' && user.email !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }
  
  if (endpoint === '/admin/users') {
    if (method === 'GET') {
      // Get all users
      const usersCollection = await getCollection('users');
      const users = await usersCollection.find().toArray();
      
      return {
        success: true,
        message: 'Users retrieved successfully',
        data: users
      };
    }
  } else if (endpoint === '/admin/users/add-admin') {
    if (method === 'POST') {
      // Add admin role to a user
      const { email } = data;
      
      if (!email) {
        throw new Error('Email is required');
      }
      
      const usersCollection = await getCollection('users');
      const targetUser = await usersCollection.findOne({ email });
      
      if (!targetUser) {
        throw new Error('User not found');
      }
      
      await usersCollection.updateOne(
        { email },
        { $set: { role: 'admin' } }
      );
      
      return {
        success: true,
        message: `User ${email} is now an admin`
      };
    }
  } else if (endpoint === '/admin/dashboard') {
    if (method === 'GET') {
      // Get dashboard stats
      const usersCollection = await getCollection('users');
      const messagesCollection = await getCollection('messages');
      const groupsCollection = await getCollection('groups');
      
      const usersCount = await usersCollection.countDocuments();
      const messagesCount = await messagesCollection.countDocuments();
      const groupsCount = await groupsCollection.countDocuments();
      
      return {
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: {
          usersCount,
          messagesCount,
          groupsCount,
          lastActive: new Date().toISOString()
        }
      };
    }
  }
  
  throw new Error('Admin endpoint not implemented in mock mode');
};

// Message endpoints
const handleMessageEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  if (endpoint === '/messages') {
    // Create new message
    if (method === 'POST') {
      const messagesCollection = await getCollection('messages');
      const messageId = 'msg_' + Math.random().toString(36).substring(2, 15);
      
      const message = {
        id: messageId,
        ...data,
        sender: 'user_current',
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      
      await messagesCollection.insertOne(message);
      
      return {
        success: true,
        message: 'Message sent successfully',
        data: message
      };
    }
  } else if (endpoint.match(/\/messages\/[^/]+$/)) {
    // Get messages for a specific chat
    const chatId = endpoint.split('/').pop();
    
    if (method === 'GET') {
      const messagesCollection = await getCollection('messages');
      const messages = await messagesCollection.find().toArray();
      
      // Filter messages for this chat
      const chatMessages = messages.filter(msg => 
        msg.chatId === chatId || 
        msg.sender === chatId || 
        msg.receiver === chatId
      );
      
      return {
        success: true,
        message: 'Messages retrieved successfully',
        data: chatMessages
      };
    }
  } else if (endpoint.match(/\/messages\/[^/]+\/status$/)) {
    // Update message status
    if (method === 'PATCH') {
      const messageId = endpoint.split('/')[2];
      
      const messagesCollection = await getCollection('messages');
      await messagesCollection.updateOne(
        { id: messageId },
        { $set: { status: data.status } }
      );
      
      return {
        success: true,
        message: `Message status updated to ${data.status}`
      };
    }
  }
  
  throw new Error('Message endpoint not implemented in mock mode');
};

// Group endpoints
const handleGroupEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  if (endpoint === '/groups') {
    if (method === 'GET') {
      // Get all groups
      const groupsCollection = await getCollection('groups');
      const groups = await groupsCollection.find().toArray();
      
      return {
        success: true,
        message: 'Groups retrieved successfully',
        data: groups
      };
    } else if (method === 'POST') {
      // Create new group
      const groupsCollection = await getCollection('groups');
      const groupId = 'group_' + Math.random().toString(36).substring(2, 15);
      
      const group = {
        id: groupId,
        ...data,
        createdAt: new Date().toISOString(),
        createdBy: 'user_current'
      };
      
      await groupsCollection.insertOne(group);
      
      return {
        success: true,
        message: 'Group created successfully',
        data: group
      };
    }
  } else if (endpoint.match(/\/groups\/[^/]+\/messages$/)) {
    const groupId = endpoint.split('/')[2];
    
    if (method === 'GET') {
      // Get messages for a specific group
      const messagesCollection = await getCollection('messages');
      const messages = await messagesCollection.find().toArray();
      
      // Filter messages for this group
      const groupMessages = messages.filter(msg => msg.groupId === groupId);
      
      return {
        success: true,
        message: 'Group messages retrieved successfully',
        data: groupMessages
      };
    } else if (method === 'POST') {
      // Send message to group
      const messagesCollection = await getCollection('messages');
      const messageId = 'msg_' + Math.random().toString(36).substring(2, 15);
      
      const message = {
        id: messageId,
        ...data,
        sender: 'user_current',
        groupId,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      
      await messagesCollection.insertOne(message);
      
      return {
        success: true,
        message: 'Message sent to group successfully',
        data: message
      };
    }
  }
  
  throw new Error('Group endpoint not implemented in mock mode');
};

// Business endpoints
const handleBusinessEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  if (endpoint.startsWith('/businesses')) {
    if (method === 'GET') {
      // Get all businesses or filter by type
      const businessesCollection = await getCollection('businesses');
      let businesses = await businessesCollection.find().toArray();
      
      // Apply type filter if provided
      const typeParam = endpoint.includes('?type=') ? endpoint.split('?type=')[1] : null;
      if (typeParam) {
        businesses = businesses.filter(business => business.type === typeParam);
      }
      
      return {
        success: true,
        message: 'Businesses retrieved successfully',
        data: businesses
      };
    } else if (method === 'POST') {
      // Create new business
      const businessesCollection = await getCollection('businesses');
      const businessId = 'business_' + Math.random().toString(36).substring(2, 15);
      
      const business = {
        id: businessId,
        ...data,
        owner: 'user_current',
        createdAt: new Date().toISOString()
      };
      
      await businessesCollection.insertOne(business);
      
      return {
        success: true,
        message: 'Business created successfully',
        data: business
      };
    }
  }
  
  throw new Error('Business endpoint not implemented in mock mode');
};

// Contact endpoints
const handleContactEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  if (endpoint === '/contacts') {
    if (method === 'GET') {
      // Return sample contacts
      const usersCollection = await getCollection('users');
      const users = await usersCollection.find().toArray();
      
      // Exclude current user
      const contacts = users.filter(user => user.id !== 'user_current');
      
      return {
        success: true,
        message: 'Contacts retrieved successfully',
        data: contacts
      };
    }
  }
  
  throw new Error('Contact endpoint not implemented in mock mode');
};

// Authentication API
export const authAPI = {
  requestOTP: (phoneNumber: string) => {
    return apiRequest('/auth/request-otp', 'POST', { phoneNumber }, false);
  },
  
  verifyOTP: (phoneNumber: string, otp: string) => {
    return apiRequest('/auth/verify-otp', 'POST', { phoneNumber, otp }, false);
  },
  
  completeProfile: (phoneNumber: string, name: string, email?: string, profileImageUrl?: string) => {
    return apiRequest('/auth/complete-profile', 'POST', { phoneNumber, name, email, profileImageUrl }, false);
  },
  
  getCurrentUser: () => {
    return apiRequest('/auth/me');
  },
  
  refreshToken: () => {
    return apiRequest('/auth/refresh-token', 'POST');
  },
  
  logout: () => {
    return apiRequest('/auth/logout', 'POST');
  },
  
  addAdmin: (email: string) => {
    return apiRequest('/admin/users/add-admin', 'POST', { email });
  }
};

// Admin API
export const adminAPI = {
  getUsers: () => {
    return apiRequest('/admin/users');
  },
  
  getDashboardStats: () => {
    return apiRequest('/admin/dashboard');
  },
  
  addAdminRole: (email: string) => {
    return apiRequest('/admin/users/add-admin', 'POST', { email });
  }
};

// Messages API
export const messagesAPI = {
  getMessages: (userId: string) => {
    return apiRequest(`/messages/${userId}`);
  },
  
  sendMessage: (receiverId: string, content: string, repliedToMessageId?: string) => {
    return apiRequest('/messages', 'POST', { receiverId, content, repliedToMessageId });
  },
  
  updateMessageStatus: (messageId: string, status: 'sent' | 'delivered' | 'read') => {
    return apiRequest(`/messages/${messageId}/status`, 'PATCH', { status });
  }
};

// Groups API
export const groupsAPI = {
  getGroups: () => {
    return apiRequest('/groups');
  },
  
  createGroup: (name: string, members: string[]) => {
    return apiRequest('/groups', 'POST', { name, members });
  },
  
  getGroupMessages: (groupId: string) => {
    return apiRequest(`/groups/${groupId}/messages`);
  },
  
  sendGroupMessage: (groupId: string, content: string, repliedToMessageId?: string) => {
    return apiRequest(`/groups/${groupId}/messages`, 'POST', { content, repliedToMessageId });
  }
};

// Contacts API
export const contactsAPI = {
  getContacts: () => {
    return apiRequest('/contacts');
  }
};

// Businesses API
export const businessesAPI = {
  getBusinesses: (type?: string) => {
    const endpoint = type ? `/businesses?type=${type}` : '/businesses';
    return apiRequest(endpoint, 'GET', undefined, false);
  },
  
  createBusiness: (businessData: any) => {
    return apiRequest('/businesses', 'POST', businessData);
  }
};
