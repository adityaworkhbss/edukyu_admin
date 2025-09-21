'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userIdentity, setUserIdentity] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, userIdentity, additionalData = {}) => {
    try {
      // Create user account with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Prepare user data for Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        userIdentity: parseInt(userIdentity),
        role: userIdentity === '1' ? 'Blog Manager' : 'Content Manager',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        ...additionalData // Any additional data passed during signup
      };
      
      // Store user data in Firestore using the user's UID as document ID
      await setDoc(doc(db, 'users', user.uid), userData);
      
      // Also store in an admin collection for easier management
      await setDoc(doc(db, 'admin_users', user.uid), {
        ...userData,
        signupMethod: 'email_password'
      });
      
      console.log('User successfully created and saved to database:', user.uid);
      return userCredential;
    } catch (error) {
      console.error('Error in signup process:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const fetchUserIdentity = async (user) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserIdentity(userData.userIdentity);
        
        // Update last login timestamp
        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          lastLogin: new Date(),
          updatedAt: new Date()
        }, { merge: true });
        
        return userData.userIdentity;
      }
    } catch (error) {
      console.error('Error fetching user identity:', error);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const identity = await fetchUserIdentity(user);
        setUserIdentity(identity);
      } else {
        setCurrentUser(null);
        setUserIdentity(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userIdentity,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};