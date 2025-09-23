import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

// Blog collection reference
const BLOG_COLLECTION = 'blogs';

// Create a new blog post
export const createBlog = async (blogData) => {
  try {
    const docRef = await addDoc(collection(db, BLOG_COLLECTION), {
      ...blogData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: blogData.status || 'draft', // draft, published, archived
      views: 0,
      likes: 0
    });
    return { id: docRef.id, ...blogData };
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Update an existing blog post
export const updateBlog = async (blogId, blogData) => {
  try {
    const blogRef = doc(db, BLOG_COLLECTION, blogId);
    await updateDoc(blogRef, {
      ...blogData,
      updatedAt: serverTimestamp()
    });
    return { id: blogId, ...blogData };
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlog = async (blogId) => {
  try {
    await deleteDoc(doc(db, BLOG_COLLECTION, blogId));
    return true;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

// Get all blog posts
export const getAllBlogs = async () => {
  try {
    const q = query(collection(db, BLOG_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const blogs = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    return blogs;
  } catch (error) {
    console.error('Error getting blogs:', error);
    throw error;
  }
};

// Get a single blog post
export const getBlog = async (blogId) => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, blogId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Blog not found');
    }
  } catch (error) {
    console.error('Error getting blog:', error);
    throw error;
  }
};

// Get blogs by status
export const getBlogsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION), 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const blogs = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    return blogs;
  } catch (error) {
    console.error('Error getting blogs by status:', error);
    throw error;
  }
};

// Upload image to Firebase Storage
export const uploadBlogImage = async (file, blogId) => {
  try {
    const fileName = `blog-images/${blogId}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Search blogs
export const searchBlogs = async (searchTerm) => {
  try {
    const q = query(
      collection(db, BLOG_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const blogs = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchFields = [
        data.title?.toLowerCase(),
        data.shortDescription?.toLowerCase(),
        data.category?.toLowerCase(),
        data.content?.toLowerCase()
      ].join(' ');
      
      if (searchFields.includes(searchTerm.toLowerCase())) {
        blogs.push({ id: doc.id, ...data });
      }
    });
    return blogs;
  } catch (error) {
    console.error('Error searching blogs:', error);
    throw error;
  }
};

// Update blog view count
export const incrementBlogViews = async (blogId) => {
  try {
    const blogRef = doc(db, BLOG_COLLECTION, blogId);
    const blogDoc = await getDoc(blogRef);
    if (blogDoc.exists()) {
      const currentViews = blogDoc.data().views || 0;
      await updateDoc(blogRef, {
        views: currentViews + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
    throw error;
  }
};
