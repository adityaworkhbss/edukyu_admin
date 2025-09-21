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

  const signup = async (email, password, userIdentity) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user identity in Firestore using the user's UID as document ID
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        password: password, // Store password as per your schema
        userIdentity: userIdentity,
        createdAt: new Date()
      });
      
      return userCredential;
    } catch (error) {
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