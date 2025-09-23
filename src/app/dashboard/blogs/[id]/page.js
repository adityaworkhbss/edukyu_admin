'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import BlogEditor from '@/components/Admin/BlogEditor';
import { getBlog, updateBlog } from '@/utils/blogDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userIdentity, loading: authLoading } = useAuth();

  useEffect(() => {
    // Check access control first
    if (!authLoading && userIdentity !== '1') {
      router.push('/dashboard');
      return;
    }
    
    if (userIdentity === '1') {
      loadBlog();
    }
  }, [params.id, userIdentity, authLoading, router]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const blogData = await getBlog(params.id);
      setBlog(blogData);
    } catch (error) {
      console.error('Error loading blog:', error);
      setError('Blog not found or error loading blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (blogData) => {
    try {
      await updateBlog(params.id, blogData);
      alert('Blog updated successfully!');
      router.push('/dashboard/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/blogs');
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  // Show access denied if userIdentity is not '1'
  if (userIdentity !== '1') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <Lock className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">
              You don't have permission to edit blog posts.
            </p>
            <p className="text-sm text-red-500 mb-6">
              Only users with Blog Manager role (userIdentity: 1) can access this feature.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-medium text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard/blogs')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blogs
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </button>
      </div>
      
      <BlogEditor
        initialData={blog}
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={true}
      />
    </DashboardLayout>
  );
}
