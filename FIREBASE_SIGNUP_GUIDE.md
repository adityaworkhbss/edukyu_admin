# Firebase Signup Implementation

This document explains how the signup functionality works and how to save user data to Firebase.

## Overview

The signup system consists of several components working together:

1. **SignupForm Component** (`/src/components/Auth/SignupForm.js`)
2. **AuthContext** (`/src/contexts/AuthContext.js`)
3. **User Database Utilities** (`/src/utils/userDatabase.js`)
4. **Testing Utilities** (`/src/utils/testSignup.js`)

## How it Works

### 1. User Registration Flow

When a user fills out the signup form:

1. **Form Validation**: Client-side validation ensures:
   - Email is valid
   - Password is at least 6 characters
   - Passwords match
   - Required fields are filled

2. **Firebase Authentication**: Creates user account using `createUserWithEmailAndPassword`

3. **User Data Storage**: Saves user information to two Firestore collections:
   - `users` - Main user data
   - `admin_users` - Admin management data

### 2. Data Structure

When a user signs up, the following data is saved to Firebase:

```javascript
{
  uid: "firebase-user-uid",
  email: "user@example.com",
  userIdentity: 1, // 1 = Blog Manager, 2 = Content Manager
  role: "Blog Manager",
  firstName: "John",
  lastName: "Doe",
  displayName: "John Doe",
  phoneNumber: "+1234567890",
  isActive: true,
  profileComplete: true,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### 3. Security Features

- **No Password Storage**: Passwords are handled by Firebase Authentication, not stored in Firestore
- **UID-based Documents**: User documents use Firebase Auth UID as document ID
- **Timestamps**: Automatic creation and update timestamps
- **Validation**: Client and server-side validation

## File Explanations

### SignupForm.js

Enhanced signup form with:
- Additional fields (firstName, lastName, phoneNumber)
- Better validation
- Improved error handling
- Success feedback
- Responsive design

Key features:
```javascript
// Form state management
const [formData, setFormData] = useState({
  email: '',
  password: '',
  confirmPassword: '',
  userIdentity: '1',
  firstName: '',
  lastName: '',
  phoneNumber: ''
});

// Enhanced error handling
if (error.code === 'auth/email-already-in-use') {
  errorMessage = 'An account with this email already exists';
}
```

### AuthContext.js

Enhanced signup function:
```javascript
const signup = async (email, password, userIdentity, additionalData = {}) => {
  // Create Firebase Auth account
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Prepare user data
  const userData = {
    uid: user.uid,
    email: user.email,
    userIdentity: parseInt(userIdentity),
    role: userIdentity === '1' ? 'Blog Manager' : 'Content Manager',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
    ...additionalData
  };
  
  // Save to both collections
  await setDoc(doc(db, 'users', user.uid), userData);
  await setDoc(doc(db, 'admin_users', user.uid), {
    ...userData,
    signupMethod: 'email_password'
  });
};
```

### userDatabase.js

Utility functions for user management:
- `saveUserToDatabase()` - Save user data after signup
- `getUserFromDatabase()` - Retrieve user data
- `updateUserInDatabase()` - Update user information
- `getUsersByRole()` - Get users by role
- `getAllAdminUsers()` - Get all admin users
- `deactivateUser()` - Deactivate user account
- `searchUserByEmail()` - Search for user by email

### testSignup.js

Testing utilities to verify functionality:
- `testSignupFlow()` - Complete signup test
- `testLoginFlow()` - Login test
- `testDatabaseOperations()` - Database operations test

## Testing the Implementation

### 1. Using the Test Page

Navigate to `/test-connection` and run:

1. **Database Connection Test** - Verify Firebase connection
2. **Signup Flow Test** - Test complete signup process
3. **Database Operations Test** - Test basic Firestore operations

### 2. Manual Testing

1. Go to `/signup`
2. Fill out the form with test data
3. Submit and verify:
   - User created in Firebase Authentication
   - User data saved to Firestore collections
   - Successful redirect to dashboard

### 3. Firebase Console Verification

After signup, check Firebase Console:

1. **Authentication** → Users: Verify user account creation
2. **Firestore Database** → `users` collection: Verify user data
3. **Firestore Database** → `admin_users` collection: Verify admin data

## Database Collections

### users
Primary user data collection:
- Document ID: Firebase Auth UID
- Contains: Basic user information, preferences, profile data
- Used for: Authentication, user profile, application logic

### admin_users
Admin management collection:
- Document ID: Firebase Auth UID (same as users)
- Contains: Admin-specific data, management metadata
- Used for: Admin panel operations, user management

## Security Considerations

1. **Firestore Rules**: Update security rules to protect user data
2. **Environment Variables**: Keep Firebase config in environment variables
3. **Input Validation**: Client and server-side validation
4. **Error Handling**: Graceful error handling without exposing sensitive info

## Error Handling

Common error scenarios and handling:

```javascript
// Email already exists
if (error.code === 'auth/email-already-in-use') {
  errorMessage = 'An account with this email already exists';
}

// Weak password
if (error.code === 'auth/weak-password') {
  errorMessage = 'Password is too weak';
}

// Invalid email
if (error.code === 'auth/invalid-email') {
  errorMessage = 'Please enter a valid email address';
}
```

## Next Steps

1. **Set up environment variables** in `.env.local`
2. **Configure Firestore security rules**
3. **Test the signup flow** thoroughly
4. **Implement user management features**
5. **Add email verification** (optional)
6. **Set up password reset** functionality

## Usage Example

```javascript
// In a React component
import { useAuth } from '@/contexts/AuthContext';

const { signup } = useAuth();

const handleSignup = async () => {
  try {
    await signup(email, password, userIdentity, {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890'
    });
    
    // Success - user created and data saved
    router.push('/dashboard');
  } catch (error) {
    // Handle error
    setError(error.message);
  }
};
```

This implementation provides a robust, secure, and scalable signup system for your EduKyu admin panel.