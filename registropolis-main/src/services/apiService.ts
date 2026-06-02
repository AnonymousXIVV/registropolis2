import { toast } from 'sonner';
import { getCollection } from '@/lib/mockDatabase';

type ApiSuccessResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  user?: any;
  token?: string;
  messages?: any[];
};

export const apiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: any,
  requiresAuth: boolean = true
): Promise<ApiSuccessResponse<any>> => {
  try {
    if (requiresAuth) {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Authentication required');
    }
    return await mockApiResponse(endpoint, method, data);
  } catch (error) {
    if (error instanceof Error && error.message !== 'Authentication required') {
      toast.error(error.message);
    }
    throw error;
  }
};

const mockApiResponse = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (endpoint.startsWith('/auth/'))      return handleAuthEndpoints(endpoint, method, data);
  if (endpoint.startsWith('/admin/'))     return handleAdminEndpoints(endpoint, method, data);
  if (endpoint.startsWith('/messages/'))  return handleMessageEndpoints(endpoint, method, data);
  if (endpoint.startsWith('/groups/'))    return handleGroupEndpoints(endpoint, method, data);
  if (endpoint.startsWith('/businesses')) return handleBusinessEndpoints(endpoint, method, data);
  if (endpoint.startsWith('/contacts'))   return handleContactEndpoints(endpoint, method, data);

  throw new Error('Endpoint not implemented');
};

const handleAuthEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  switch (endpoint) {
    case '/auth/request-otp':
      return { success: true, message: 'OTP sent successfully' };

    case '/auth/verify-otp':
      if (data?.otp?.length === 6) return { success: true, message: 'OTP verified successfully' };
      throw new Error('Invalid verification code');

    case '/auth/complete-profile': {
      const userId = 'user_' + Math.random().toString(36).substring(2, 15);
      const isAdmin = data.email === 'admin';
      const user = { id: userId, phoneNumber: data.phoneNumber, name: data.name, email: data.email, profileImageUrl: data.profileImageUrl || null, role: isAdmin ? 'admin' : 'user', createdAt: new Date().toISOString() };
      const token = 'mock_token_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('mock_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
      return { success: true, message: 'Profile created successfully', user, token };
    }

    case '/auth/me': {
      const storedUser = localStorage.getItem('mock_user') || localStorage.getItem('user');
      if (storedUser) return { success: true, message: 'User retrieved successfully', user: JSON.parse(storedUser) };
      throw new Error('User not found');
    }

    case '/auth/refresh-token':
      return { success: true, message: 'Token refreshed', token: 'mock_refresh_token_' + Math.random().toString(36).substring(2, 15) };

    case '/auth/logout':
      localStorage.removeItem('mock_user');
      localStorage.removeItem('auth_token');
      return { success: true, message: 'Logged out successfully' };

    default:
      throw new Error('Auth endpoint not implemented');
  }
};

const handleAdminEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  const storedUser = localStorage.getItem('mock_user') || localStorage.getItem('user');
  if (!storedUser) throw new Error('Authentication required');
  const user = JSON.parse(storedUser);
  if (user.role !== 'admin' && user.email !== 'admin') throw new Error('Unauthorized: Admin access required');

  if (endpoint === '/admin/users' && method === 'GET') {
    const users = await (await getCollection('users')).find().toArray();
    return { success: true, message: 'Users retrieved', data: users };
  }
  if (endpoint === '/admin/users/add-admin' && method === 'POST') {
    if (!data?.email) throw new Error('Email is required');
    const usersCol = await getCollection('users');
    const target = await usersCol.findOne({ email: data.email });
    if (!target) throw new Error('User not found');
    await usersCol.updateOne({ email: data.email }, { $set: { role: 'admin' } });
    return { success: true, message: `${data.email} is now an admin` };
  }
  if (endpoint === '/admin/dashboard' && method === 'GET') {
    const [usersCount, messagesCount, groupsCount] = await Promise.all([
      (await getCollection('users')).countDocuments(),
      (await getCollection('messages')).countDocuments(),
      (await getCollection('groups')).countDocuments(),
    ]);
    return { success: true, message: 'Stats retrieved', data: { usersCount, messagesCount, groupsCount, lastActive: new Date().toISOString() } };
  }
  throw new Error('Admin endpoint not implemented');
};

const handleMessageEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  if (endpoint === '/messages' && method === 'POST') {
    const messagesCol = await getCollection('messages');
    const message = { id: 'msg_' + Math.random().toString(36).substring(2, 15), ...data, sender: 'user_current', timestamp: new Date().toISOString(), status: 'sent' };
    await messagesCol.insertOne(message);
    return { success: true, message: 'Message sent', data: message };
  }
  if (endpoint.match(/\/messages\/[^/]+$/) && method === 'GET') {
    const chatId = endpoint.split('/').pop();
    const messages = await (await getCollection('messages')).find().toArray();
    return { success: true, message: 'Messages retrieved', data: messages.filter(m => m.chatId === chatId || m.sender === chatId || m.receiver === chatId) };
  }
  if (endpoint.match(/\/messages\/[^/]+\/status$/) && method === 'PATCH') {
    const messageId = endpoint.split('/')[2];
    await (await getCollection('messages')).updateOne({ id: messageId }, { $set: { status: data.status } });
    return { success: true, message: `Status updated to ${data.status}` };
  }
  throw new Error('Message endpoint not implemented');
};

const handleGroupEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  if (endpoint === '/groups') {
    if (method === 'GET') {
      return { success: true, message: 'Groups retrieved', data: await (await getCollection('groups')).find().toArray() };
    }
    if (method === 'POST') {
      const group = { id: 'group_' + Math.random().toString(36).substring(2, 15), ...data, createdAt: new Date().toISOString(), createdBy: 'user_current' };
      await (await getCollection('groups')).insertOne(group);
      return { success: true, message: 'Group created', data: group };
    }
  }
  if (endpoint.match(/\/groups\/[^/]+\/messages$/)) {
    const groupId = endpoint.split('/')[2];
    if (method === 'GET') {
      const msgs = await (await getCollection('messages')).find().toArray();
      return { success: true, message: 'Group messages retrieved', data: msgs.filter(m => m.groupId === groupId) };
    }
    if (method === 'POST') {
      const message = { id: 'msg_' + Math.random().toString(36).substring(2, 15), ...data, sender: 'user_current', groupId, timestamp: new Date().toISOString(), status: 'sent' };
      await (await getCollection('messages')).insertOne(message);
      return { success: true, message: 'Group message sent', data: message };
    }
  }
  throw new Error('Group endpoint not implemented');
};

const handleBusinessEndpoints = async (endpoint: string, method: string, data?: any): Promise<ApiSuccessResponse<any>> => {
  if (method === 'GET') {
    const col = await getCollection('businesses');
    let businesses = await col.find().toArray();
    const typeParam = endpoint.includes('?type=') ? endpoint.split('?type=')[1] : null;
    if (typeParam) businesses = businesses.filter(b => b.type === typeParam);
    return { success: true, message: 'Businesses retrieved', data: businesses };
  }
  if (method === 'POST') {
    const business = { id: 'business_' + Math.random().toString(36).substring(2, 15), ...data, owner: 'user_current', createdAt: new Date().toISOString() };
    await (await getCollection('businesses')).insertOne(business);
    return { success: true, message: 'Business created', data: business };
  }
  throw new Error('Business endpoint not implemented');
};

const handleContactEndpoints = async (endpoint: string, method: string): Promise<ApiSuccessResponse<any>> => {
  if (endpoint === '/contacts' && method === 'GET') {
    const users = await (await getCollection('users')).find().toArray();
    return { success: true, message: 'Contacts retrieved', data: users.filter(u => u.id !== 'user_current') };
  }
  throw new Error('Contact endpoint not implemented');
};

export const authAPI = {
  requestOTP: (phoneNumber: string) => apiRequest('/auth/request-otp', 'POST', { phoneNumber }, false),
  verifyOTP: (phoneNumber: string, otp: string) => apiRequest('/auth/verify-otp', 'POST', { phoneNumber, otp }, false),
  completeProfile: (phoneNumber: string, name: string, email?: string, profileImageUrl?: string) => apiRequest('/auth/complete-profile', 'POST', { phoneNumber, name, email, profileImageUrl }, false),
  getCurrentUser: () => apiRequest('/auth/me'),
  refreshToken: () => apiRequest('/auth/refresh-token', 'POST'),
  logout: () => apiRequest('/auth/logout', 'POST'),
  addAdmin: (email: string) => apiRequest('/admin/users/add-admin', 'POST', { email }),
};

export const adminAPI = {
  getUsers: () => apiRequest('/admin/users'),
  getDashboardStats: () => apiRequest('/admin/dashboard'),
  addAdminRole: (email: string) => apiRequest('/admin/users/add-admin', 'POST', { email }),
};

export const messagesAPI = {
  getMessages: (userId: string) => apiRequest(`/messages/${userId}`),
  sendMessage: (receiverId: string, content: string) => apiRequest('/messages', 'POST', { receiverId, content }),
  updateMessageStatus: (messageId: string, status: 'sent' | 'delivered' | 'read') => apiRequest(`/messages/${messageId}/status`, 'PATCH', { status }),
};

export const groupsAPI = {
  getGroups: () => apiRequest('/groups'),
  createGroup: (name: string, members: string[]) => apiRequest('/groups', 'POST', { name, members }),
  getGroupMessages: (groupId: string) => apiRequest(`/groups/${groupId}/messages`),
  sendGroupMessage: (groupId: string, content: string) => apiRequest(`/groups/${groupId}/messages`, 'POST', { content }),
};

export const contactsAPI = {
  getContacts: () => apiRequest('/contacts'),
};

export const businessesAPI = {
  getBusinesses: (type?: string) => apiRequest(type ? `/businesses?type=${type}` : '/businesses', 'GET', undefined, false),
  createBusiness: (businessData: any) => apiRequest('/businesses', 'POST', businessData),
};
