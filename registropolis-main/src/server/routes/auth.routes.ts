import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { getDb } from '../db/mongodb';
import config from '../config';
import { redisClient, getMainRedisClient } from '../db/redis';
import { twilioService } from '../services/twilio.service';
import { RateLimitService } from '../services/rateLimit.service';
import { RateLimitError } from '../services/errors.service';

const router = express.Router();

// Request OTP via SMS/WhatsApp
router.post('/request-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ 
        status: 'error',
        code: 'MISSING_PHONE',
        message: 'Phone number is required' 
      });
    }

    if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_PHONE',
        message: 'Invalid phone number format. Must be E.164 format (e.g. +1234567890)'
      });
    }

    // Check rate limit
    try {
      await RateLimitService.checkOTPLimit(phoneNumber);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return res.status(429).json({
          status: 'error',
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many OTP requests. Please try again later.',
          retryAfter: error.remainingTime
        });
      }
      throw error; // Re-throw if it's not a rate limit error
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Get Redis client
    const redis = getMainRedisClient();
    
    try {
      // Store OTP in Redis with 10-minute expiration
      await redis.set(`otp:${phoneNumber}`, otp, { EX: 600 });

      // Send OTP via WhatsApp using Twilio
      await twilioService.sendWhatsAppMessage(
        phoneNumber,
        {
          "1": otp,
          "2": "10" // minutes until expiration
        }
      );
    } catch (error) {
      // If Redis or Twilio fails, ensure we don't leave a partial state
      await redis.del(`otp:${phoneNumber}`);
      
      console.error('Error in OTP process:', error);
      return res.status(500).json({
        status: 'error',
        code: 'OTP_DELIVERY_FAILED',
        message: 'Failed to send OTP. Please try again.'
      });
    }
    
    res.status(200).json({ 
      status: 'success',
      message: 'OTP sent successfully' 
    });
  } catch (error) {
    console.error('Unexpected error in request-otp:', error);
    res.status(500).json({ 
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred' 
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }
    
    // Get Redis client
    const redis = getMainRedisClient();
    
    // Get stored OTP from Redis
    const storedOTP = await redis.get(`otp:${phoneNumber}`);
    
    if (!storedOTP || storedOTP !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    
    // OTP is valid, check if user exists
    const db = await getDb();
    const user = await db.collection('users').findOne({ phoneNumber });
    
    // Delete OTP from Redis
    await redis.del(`otp:${phoneNumber}`);
    
    if (user) {
      // User exists, generate JWT token
      const token = jwt.sign(
        { userId: user._id.toString(), phoneNumber },
        config.jwtSecret,
        { expiresIn: '7d' }
      );
      
      // Store token in Redis
      await redis.set(`token:${user._id.toString()}`, token, { EX: 604800 }); // 7 days
      
      return res.status(200).json({
        message: 'OTP verified successfully',
        token,
        user: {
          id: user._id.toString(),
          phoneNumber: user.phoneNumber,
          name: user.name,
          profileImage: user.profileImage,
          isProfileComplete: !!user.name
        }
      });
    } else {
      // New user, just return verification success
      return res.status(200).json({
        message: 'OTP verified successfully',
        isNewUser: true,
        phoneNumber
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Complete user profile after OTP verification
router.post('/complete-profile', async (req, res) => {
  try {
    const { phoneNumber, name, profileImageUrl } = req.body;
    
    if (!phoneNumber || !name) {
      return res.status(400).json({ message: 'Phone number and name are required' });
    }
    
    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ phoneNumber });
    
    let userId;
    
    if (existingUser) {
      // Update existing user
      await db.collection('users').updateOne(
        { _id: existingUser._id },
        { $set: { name, profileImage: profileImageUrl || existingUser.profileImage || null } }
      );
      userId = existingUser._id.toString();
    } else {
      // Create new user
      const result = await db.collection('users').insertOne({
        phoneNumber,
        name,
        profileImage: profileImageUrl || null,
        createdAt: new Date(),
        lastActive: new Date()
      });
      userId = result.insertedId.toString();
    }
    
    // Get Redis client
    const redis = getMainRedisClient();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId, phoneNumber },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    
    // Store token in Redis
    await redis.set(`token:${userId}`, token, { EX: 604800 }); // 7 days
    
    res.status(200).json({
      message: 'Profile completed successfully',
      token,
      user: {
        id: userId,
        phoneNumber,
        name,
        profileImage: profileImageUrl || null
      }
    });
  } catch (error) {
    console.error('Error completing profile:', error);
    res.status(500).json({ message: 'Failed to complete profile' });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify JWT
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    
    // Get user from database
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update last active timestamp
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastActive: new Date() } }
    );
    
    res.status(200).json({
      user: {
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        name: user.name,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify JWT
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    
    // Get Redis client
    const redis = getMainRedisClient();
    
    // Remove token from Redis
    await redis.del(`token:${decoded.userId}`);
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Failed to logout' });
  }
});

export default router;
