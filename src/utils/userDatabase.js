import { db } from '@/lib/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Save user data to Firestore after signup
 * @param {string} uid - User UID from Firebase Auth
 * @param {object} userData - User data object
 */
export const saveUserToDatabase = async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Also save to admin_users collection for admin management
    const adminUserRef = doc(db, 'admin_users', uid);
    await setDoc(adminUserRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    });
    
    console.log('User saved to database successfully');
    return { success: true };
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw new Error('Failed to save user data');
  }
};

/**
 * Get user data from Firestore
 * @param {string} uid - User UID
 */
export const getUserFromDatabase = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error getting user from database:', error);
    throw error;
  }
};

/**
 * Update user data in Firestore
 * @param {string} uid - User UID
 * @param {object} updateData - Data to update
 */
export const updateUserInDatabase = async (uid, updateData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    // Also update admin_users collection
    const adminUserRef = doc(db, 'admin_users', uid);
    await updateDoc(adminUserRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    console.log('User updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Get all users with specific role/identity
 * @param {string} userIdentity - User identity (1 or 2)
 */
export const getUsersByRole = async (userIdentity) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef, 
      where('userIdentity', '==', parseInt(userIdentity)),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users by role:', error);
    throw error;
  }
};

/**
 * Get all admin users with pagination
 * @param {number} limitCount - Number of users to fetch
 */
export const getAllAdminUsers = async (limitCount = 50) => {
  try {
    const usersRef = collection(db, 'admin_users');
    const q = query(
      usersRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting all admin users:', error);
    throw error;
  }
};

/**
 * Update user's last login timestamp
 * @param {string} uid - User UID
 */
export const updateLastLogin = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Also update admin_users collection
    const adminUserRef = doc(db, 'admin_users', uid);
    await updateDoc(adminUserRef, {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
  } catch (error) {
    console.error('Error updating last login:', error);
    // Don't throw error for this non-critical operation
  }
};

/**
 * Deactivate user account
 * @param {string} uid - User UID
 */
export const deactivateUser = async (uid) => {
  try {
    const updateData = {
      isActive: false,
      deactivatedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, updateData);
    
    const adminUserRef = doc(db, 'admin_users', uid);
    await updateDoc(adminUserRef, updateData);
    
    console.log('User deactivated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error deactivating user:', error);
    throw error;
  }
};

/**
 * Search users by email
 * @param {string} email - Email to search for
 */
export const searchUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Error searching user by email:', error);
    throw error;
  }
};