import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Function to migrate existing users to the new authentication system
export const migrateExistingUsers = async () => {
  try {
    // Get all existing users from your current structure
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const migratedUsers = [];
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Check if this is an existing user with email, password, user_identity structure
      if (userData.email && userData.password && userData.user_identity) {
        // Create a new document with the user's email as a unique identifier
        // This will help with the migration process
        const newUserRef = doc(db, 'migrated_users', userDoc.id);
        
        await setDoc(newUserRef, {
          originalId: userDoc.id,
          email: userData.email,
          password: userData.password,
          userIdentity: userData.user_identity,
          migratedAt: new Date(),
          status: 'migrated'
        });
        
        migratedUsers.push({
          id: userDoc.id,
          email: userData.email,
          userIdentity: userData.user_identity
        });
      }
    }
    
    return migratedUsers;
  } catch (error) {
    console.error('Error migrating users:', error);
    throw error;
  }
};

// Function to get user by email from existing structure
export const getUserByEmail = async (email) => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      if (userData.email === email) {
        return {
          id: userDoc.id,
          ...userData
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

// Function to create a user document in the new structure
export const createUserDocument = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      email: userData.email,
      password: userData.password,
      userIdentity: userData.user_identity,
      createdAt: new Date(),
      status: 'active'
    });
    
    return userRef;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};