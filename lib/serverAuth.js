import dbConnect from './connectDb';
import User from '@/models/User';
import mongoose from 'mongoose';

/**
 * Verify admin token on server side
 * @param {string} userId - User ID from token
 * @returns {Object|null} - User object or null
 */
export async function verifyAdminToken(userId) {
  try {
    console.log('🔐 verifyAdminToken called with userId:', userId);

    if (!userId) {
      console.log('❌ No userId provided');
      return null;
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('❌ Invalid userId format:', userId);
      return null;
    }

    console.log('✅ Valid ObjectId format');

    // Connect to database
    await dbConnect();
    console.log('✅ Database connected for auth');
    
    // Find user
    const user = await User.findById(userId).select('-password').lean();
    
    if (!user) {
      console.log('❌ User not found with ID:', userId);
      return null;
    }

    console.log('✅ User found:', user.email);

    if (user.role !== 'admin') {
      console.log('❌ User is not admin. Role:', user.role);
      return null;
    }

    console.log('✅ User is admin');

    if (user.isActive === false) {
      console.log('❌ User account is not active');
      return null;
    }

    console.log('✅ User account is active');

    return user;
  } catch (error) {
    console.error('❌ Token verification error:', error);
    console.error('Error stack:', error.stack);
    return null;
  }
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} - User object or null
 */
export async function getUserById(userId) {
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return null;
    }

    await dbConnect();
    
    const user = await User.findById(userId).select('-password').lean();
    
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Check if user is admin
 * @param {string} userId - User ID
 * @returns {boolean} - True if admin
 */
export async function isAdminUser(userId) {
  try {
    const user = await getUserById(userId);
    return user && user.role === 'admin' && user.isActive !== false;
  } catch (error) {
    console.error('Check admin error:', error);
    return false;
  }
}