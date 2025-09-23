'use client';

import { useState } from 'react';
import { Calendar, User, Eye, Tag, ExternalLink } from 'lucide-react';

const BlogPreview = ({ blog, onClose, onEdit }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getExcerpt = (content, maxLength = 200) => {
    const text = stripHtml(content);
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Blog Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Edit Blog
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Blog Header */}
            <div className="mb-6">
              {blog.imageUrl && (
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="flex items-center gap-4 mb-4">
                {getStatusBadge(blog.status)}
                <span className="text-sm text-gray-500">
                  Sort Order: {blog.sortOrder || 0}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {blog.title || 'Untitled Blog Post'}
              </h1>

              <p className="text-lg text-gray-600 mb-4">
                {blog.shortDescription || 'No description available'}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Author: Admin</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>Views: {blog.views || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>Category: {blog.category || 'Uncategorized'}</span>
                </div>
              </div>

              {/* Short URL */}
              {blog.shortUrl && (
                <div className="flex items-center gap-2 mb-4">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    URL: /blog/{blog.shortUrl}
                  </span>
                </div>
              )}
            </div>

            {/* Blog Content */}
            <div className="prose max-w-none">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ 
                  __html: showFullContent ? blog.content : getExcerpt(blog.content, 500) + (stripHtml(blog.content).length > 500 ? '...' : '')
                }}
              />
              
              {stripHtml(blog.content).length > 500 && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  {showFullContent ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* SEO Information */}
            {(blog.metaTitle || blog.metaDescription || blog.metaKeywords) && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Information</h3>
                <div className="space-y-3">
                  {blog.metaTitle && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                      <p className="text-sm text-gray-600">{blog.metaTitle}</p>
                    </div>
                  )}
                  {blog.metaDescription && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                      <p className="text-sm text-gray-600">{blog.metaDescription}</p>
                    </div>
                  )}
                  {blog.metaKeywords && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
                      <p className="text-sm text-gray-600">{blog.metaKeywords}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
