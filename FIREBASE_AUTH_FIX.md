# Fix: Firebase auth/operation-not-allowed Error

## Problem
You're getting the error: `Firebase: Error (auth/operation-not-allowed)` when trying to sign up users.

## Root Cause
Email/Password authentication is not enabled in your Firebase project.

## Solution

### Step 1: Enable Email/Password Authentication

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `edukyuadminpanel`

2. **Navigate to Authentication**
   - Click **Authentication** in the left sidebar
   - If you see "Get started", click it first

3. **Enable Email/Password**
   - Click the **Sign-in method** tab
   - Find **Email/Password** in the providers list
   - Click on **Email/Password**
   - Toggle **Enable** to ON
   - Click **Save**

### Step 2: Verify the Fix

1. **Run the Authentication Test**
   - Go to: http://localhost:3001/test-connection
   - Click the **"Test Auth"** button (red button at the top)
   - This will verify if Email/Password authentication is working

2. **Test Signup Form**
   - Go to: http://localhost:3001/signup
   - Try signing up with a test email
   - Should work without the `auth/operation-not-allowed` error

### Step 3: Optional - Configure Additional Settings

1. **Password Requirements** (optional)
   - In Authentication > Settings
   - Configure password strength requirements

2. **Authorized Domains** (already configured)
   - Should include `localhost` for development
   - Add your production domain when deploying

## Screenshots Guide

### Before Fix:
- Email/Password provider shows as "Disabled"

### After Fix:
- Email/Password provider shows as "Enabled"

## Common Issues After Enabling

### Issue: Still getting errors?
**Solution:** Wait 1-2 minutes after enabling for changes to propagate

### Issue: Different error codes?
- `auth/weak-password`: Password too short (need 6+ characters)
- `auth/email-already-in-use`: Email already registered
- `auth/invalid-email`: Invalid email format

## Testing Commands

After enabling authentication, you can test using our built-in tools:

```bash
# 1. Run the development server
npm run dev

# 2. Visit test page
# http://localhost:3001/test-connection

# 3. Click "Test Auth" button
```

## Firebase Console URLs

- **Project Overview**: https://console.firebase.google.com/project/edukyuadminpanel
- **Authentication**: https://console.firebase.google.com/project/edukyuadminpanel/authentication
- **Sign-in Methods**: https://console.firebase.google.com/project/edukyuadminpanel/authentication/providers

## Expected Result

After enabling Email/Password authentication:
- ✅ Authentication test passes
- ✅ Signup form works
- ✅ Users can register successfully
- ✅ User data saves to Firestore

## Need Help?

If you're still having issues:
1. Check Firebase Console for any error messages
2. Verify your project ID matches: `edukyuadminpanel`
3. Make sure you're in the correct Firebase project
4. Try refreshing the Firebase Console page

The error should be resolved after enabling Email/Password authentication in Firebase Console!