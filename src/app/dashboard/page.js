'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, GraduationCap, BookOpen, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { userIdentity } = useAuth();

  const getRoleBasedStats = () => {
    if (userIdentity === '1') {
      return [
        { name: 'Total Blogs', value: '24', icon: FileText, color: 'bg-blue-500' },
        { name: 'Published', value: '18', icon: FileText, color: 'bg-green-500' },
        { name: 'Drafts', value: '6', icon: FileText, color: 'bg-yellow-500' },
        { name: 'Views', value: '2.4k', icon: FileText, color: 'bg-purple-500' },
      ];
    } else {
      return [
        { name: 'Colleges', value: '156', icon: GraduationCap, color: 'bg-blue-500' },
        { name: 'Courses', value: '89', icon: BookOpen, color: 'bg-green-500' },
        { name: 'Comparisons', value: '23', icon: BarChart3, color: 'bg-yellow-500' },
        { name: 'Total Views', value: '15.2k', icon: BarChart3, color: 'bg-purple-500' },
      ];
    }
  };

  const stats = getRoleBasedStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to EduKyu Admin Panel
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {userIdentity === '1' 
              ? 'Manage your blog content and publications' 
              : 'Manage colleges, courses, and comparison data'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quick Actions
            </h3>
            <div className="mt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userIdentity === '1' ? (
                  <>
                    <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
                      <div>
                        <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                          <FileText className="h-6 w-6" />
                        </span>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-lg font-medium">
                          <a href="/dashboard/blogs" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Create New Blog
                          </a>
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Write and publish a new blog post
                        </p>
                      </div>
                    </button>
                    <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
                      <div>
                        <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                          <FileText className="h-6 w-6" />
                        </span>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-lg font-medium">
                          <a href="/dashboard/blogs" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Manage Blogs
                          </a>
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Edit, delete, or view all blog posts
                        </p>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
                      <div>
                        <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                          <GraduationCap className="h-6 w-6" />
                        </span>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-lg font-medium">
                          <a href="/dashboard/colleges" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Manage Colleges
                          </a>
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Add, edit, or view college information
                        </p>
                      </div>
                    </button>
                    <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
                      <div>
                        <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                          <BookOpen className="h-6 w-6" />
                        </span>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-lg font-medium">
                          <a href="/dashboard/courses" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Manage Courses
                          </a>
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Add, edit, or view course details
                        </p>
                      </div>
                    </button>
                    <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
                      <div>
                        <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                          <BarChart3 className="h-6 w-6" />
                        </span>
                      </div>
                      <div className="mt-8">
                        <h3 className="text-lg font-medium">
                          <a href="/dashboard/compare" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            Manage Comparisons
                          </a>
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Create and manage comparison data
                        </p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}