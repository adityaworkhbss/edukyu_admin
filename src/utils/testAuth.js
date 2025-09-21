import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';

/**
 * Test if email/password authentication is enabled
 */
export const testAuthEnabled = async () => {
  console.log('🔥 Testing if Email/Password authentication is enabled...');
  
  const testEmail = `test_auth_${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  
  try {
    // Try to create a test user
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    const user = userCredential.user;
    
    console.log('✅ Email/Password authentication is ENABLED');
    console.log('Test user created successfully:', user.uid);
    
    // Clean up - sign out the test user
    await signOut(auth);
    console.log('✅ Test user signed out');
    
    return {
      success: true,
      message: 'Email/Password authentication is properly enabled',
      testEmail,
      userId: user.uid
    };
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    
    if (error.code === 'auth/operation-not-allowed') {
      return {
        success: false,
        message: 'Email/Password authentication is NOT enabled in Firebase Console',
        solution: [
          '1. Go to Firebase Console → Authentication',
          '2. Click on Sign-in method tab',
          '3. Enable Email/Password provider',
          '4. Save changes and try again'
        ],
        error: error
      };
    } else if (error.code === 'auth/weak-password') {
      return {
        success: false,
        message: 'Authentication is enabled but password is too weak',
        solution: ['Use a stronger password (at least 6 characters)'],
        error: error
      };
    } else {
      return {
        success: false,
        message: `Authentication error: ${error.message}`,
        error: error
      };
    }
  }
};

/**
 * Check current Firebase project configuration
 */
export const checkFirebaseConfig = () => {
  const config = {
    projectId: auth.app.options.projectId,
    authDomain: auth.app.options.authDomain,
    apiKey: auth.app.options.apiKey ? '✓ Set' : '✗ Missing'
  };
  
  console.log('🔧 Firebase Configuration:');
  console.log('Project ID:', config.projectId);
  console.log('Auth Domain:', config.authDomain);
  console.log('API Key:', config.apiKey);
  
  return config;
};