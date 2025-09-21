import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';

/**
 * Test Firebase connection and user signup functionality
 */
export const testSignupFlow = async () => {
  console.log('🔥 Testing Firebase Signup Flow...');
  
  try {
    // Test 1: Basic Firebase connection
    console.log('1. Testing Firebase connection...');
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      message: 'Firebase connected successfully',
      timestamp: new Date(),
      testId: Math.random().toString(36).substr(2, 9)
    });
    console.log('✅ Firebase connection successful');

    // Test 2: User signup simulation
    console.log('2. Testing user signup...');
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    // Create test user
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    const user = userCredential.user;
    console.log('✅ User created with UID:', user.uid);

    // Test 3: Save user data to Firestore
    console.log('3. Testing user data save...');
    const userData = {
      uid: user.uid,
      email: user.email,
      userIdentity: 1,
      role: 'Blog Manager',
      firstName: 'Test',
      lastName: 'User',
      displayName: 'Test User',
      phoneNumber: '+1234567890',
      isActive: true,
      profileComplete: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date()
    };

    // Save to users collection
    await setDoc(doc(db, 'users', user.uid), userData);
    console.log('✅ User data saved to users collection');

    // Save to admin_users collection
    await setDoc(doc(db, 'admin_users', user.uid), {
      ...userData,
      signupMethod: 'email_password'
    });
    console.log('✅ User data saved to admin_users collection');

    // Test 4: Retrieve user data
    console.log('4. Testing user data retrieval...');
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      console.log('✅ User data retrieved successfully:', userDoc.data());
    } else {
      throw new Error('User document not found');
    }

    // Test 5: Cleanup - delete test user (optional)
    console.log('5. Cleaning up test data...');
    await signOut(auth);
    console.log('✅ User signed out');

    console.log('🎉 All tests passed! Signup flow is working correctly.');
    
    return {
      success: true,
      message: 'All Firebase signup tests passed successfully',
      testEmail,
      userId: user.uid
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    // Try to sign out if still signed in
    try {
      await signOut(auth);
    } catch (signOutError) {
      console.error('Error during cleanup:', signOutError);
    }
    
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Test user login functionality
 */
export const testLoginFlow = async (email, password) => {
  console.log('🔥 Testing Firebase Login Flow...');
  
  try {
    // Test login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ User logged in successfully:', user.uid);

    // Retrieve user data
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      console.log('✅ User data found:', userDoc.data());
      return {
        success: true,
        userData: userDoc.data(),
        userId: user.uid
      };
    } else {
      throw new Error('User data not found in database');
    }

  } catch (error) {
    console.error('❌ Login test failed:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};

/**
 * Test Firestore database operations
 */
export const testDatabaseOperations = async () => {
  console.log('🔥 Testing Database Operations...');
  
  try {
    // Test collection creation and document addition
    const testCollection = collection(db, 'test_operations');
    const docRef = await addDoc(testCollection, {
      testType: 'database_operations',
      timestamp: new Date(),
      data: {
        string: 'test string',
        number: 123,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' }
      }
    });
    
    console.log('✅ Document added with ID:', docRef.id);
    
    // Test document retrieval
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('✅ Document retrieved:', docSnap.data());
    } else {
      throw new Error('Document not found');
    }
    
    return {
      success: true,
      message: 'Database operations test passed',
      documentId: docRef.id
    };
    
  } catch (error) {
    console.error('❌ Database operations test failed:', error);
    return {
      success: false,
      message: error.message,
      error: error
    };
  }
};