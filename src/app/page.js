'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// async function addSampleData() {
//   try {
//     const docRef = await addDoc(collection(db, "sampleCollection"), {
//       name: "Sample Name",
//       description: "This is a sample description",
//       createdAt: new Date()
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

export default function Home() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [currentUser, loading, router]);

  
  

  return null;

  // return (<>
  //   <button onClick={addSampleData} className='cursor-pointer'>Add Sample Data</button>
  // </>);
}