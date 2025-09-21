'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function BlogsPage() {
  const { userIdentity } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    tags: '',
    featuredImage: ''
  });

  // Redirect if not blog manager
  useEffect(() => {
    if (userIdentity && userIdentity !== '1') {
      window.location.href = '/dashboard';
    }
  }, [userIdentity]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        createdAt: editingBlog ? editingBlog.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingBlog) {
        await updateDoc(doc(db, 'blogs', editingBlog.id), blogData);
      } else {
        await addDoc(collection(db, 'blogs'), blogData);
      }

      setFormData({
        title: '',
        content: '',
        excerpt: '',
        status: 'draft',
        tags: '',
        featuredImage: ''
      });
      setShowForm(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      status: blog.status,
      tags: blog.tags.join(', '),
      featuredImage: blog.featuredImage || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (blogId) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteDoc(doc(db, 'blogs', blogId));
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (userIdentity !== '1') {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">You don't have permission to access this section.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your blog posts and content
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </button>
        </div>

        {/* Blog Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingBlog(null);
                      setFormData({
                        title: '',
                        content: '',
                        excerpt: '',
                        status: 'draft',
                        tags: '',
                        featuredImage: ''
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Excerpt</label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={10}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="technology, education, tips"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Featured Image URL</label>
                    <input
                      type="url"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingBlog(null);
                        setFormData({
                          title: '',
                          content: '',
                          excerpt: '',
                          status: 'draft',
                          tags: '',
                          featuredImage: ''
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      {editingBlog ? 'Update' : 'Create'} Blog Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Blogs List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <li key={blog.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {blog.featuredImage ? (
                        <img className="h-10 w-10 rounded-lg object-cover" src={blog.featuredImage} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{blog.title}</p>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{blog.excerpt}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-400">
                          Created: {new Date(blog.createdAt?.seconds * 1000).toLocaleDateString()}
                        </p>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="ml-4 flex space-x-1">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {blogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new blog post.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}