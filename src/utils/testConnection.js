import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Test function to verify connection to your existing Firebase database
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test 1: Get all users from the users collection
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    console.log('✅ Successfully connected to Firebase');
    console.log(`📊 Found ${usersSnapshot.docs.length} users in the database`);
    
    // Display user data
    const users = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        email: userData.email,
        user_identity: userData.user_identity || userData.userIdentity,
        hasPassword: !!userData.password
      });
    });
    
    console.log('👥 Users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   User Identity: ${user.user_identity}`);
      console.log(`   Has Password: ${user.hasPassword}`);
      console.log('---');
    });
    
    return {
      success: true,
      userCount: usersSnapshot.docs.length,
      users: users
    };
    
  } catch (error) {
    console.error('❌ Error connecting to Firebase:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to get a specific user by ID
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Function to get user by email
export const getUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
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