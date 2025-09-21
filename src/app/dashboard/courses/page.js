'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';

export default function CoursesPage() {
  const { userIdentity } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'beginner',
    category: '',
    instructor: '',
    price: '',
    currency: 'USD',
    prerequisites: '',
    learningOutcomes: '',
    syllabus: '',
    imageUrl: '',
    isActive: true
  });

  // Redirect if not content manager
  useEffect(() => {
    if (userIdentity && userIdentity === '1') {
      window.location.href = '/dashboard';
    }
  }, [userIdentity]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        prerequisites: formData.prerequisites.split(',').map(req => req.trim()),
        learningOutcomes: formData.learningOutcomes.split(',').map(outcome => outcome.trim()),
        syllabus: formData.syllabus.split(',').map(topic => topic.trim()),
        price: parseFloat(formData.price) || 0,
        createdAt: editingCourse ? editingCourse.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), courseData);
      } else {
        await addDoc(collection(db, 'courses'), courseData);
      }

      setFormData({
        title: '',
        description: '',
        duration: '',
        level: 'beginner',
        category: '',
        instructor: '',
        price: '',
        currency: 'USD',
        prerequisites: '',
        learningOutcomes: '',
        syllabus: '',
        imageUrl: '',
        isActive: true
      });
      setShowForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      level: course.level,
      category: course.category,
      instructor: course.instructor,
      price: course.price?.toString() || '',
      currency: course.currency || 'USD',
      prerequisites: course.prerequisites?.join(', ') || '',
      learningOutcomes: course.learningOutcomes?.join(', ') || '',
      syllabus: course.syllabus?.join(', ') || '',
      imageUrl: course.imageUrl || '',
      isActive: course.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', courseId));
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (userIdentity === '1') {
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
            <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage course information and details
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </button>
        </div>

        {/* Course Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingCourse(null);
                      setFormData({
                        title: '',
                        description: '',
                        duration: '',
                        level: 'beginner',
                        category: '',
                        instructor: '',
                        price: '',
                        currency: 'USD',
                        prerequisites: '',
                        learningOutcomes: '',
                        syllabus: '',
                        imageUrl: '',
                        isActive: true
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Course Title *</label>
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
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Technology, Business, Arts"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="4 weeks, 3 months"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Level</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Instructor</label>
                      <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="INR">INR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prerequisites (comma separated)</label>
                    <textarea
                      name="prerequisites"
                      value={formData.prerequisites}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Basic programming knowledge, High school mathematics"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Learning Outcomes (comma separated)</label>
                    <textarea
                      name="learningOutcomes"
                      value={formData.learningOutcomes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Understand basic concepts, Apply practical skills, Build projects"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Syllabus (comma separated)</label>
                    <textarea
                      name="syllabus"
                      value={formData.syllabus}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Introduction, Module 1, Module 2, Final Project"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Course is active
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingCourse(null);
                        setFormData({
                          title: '',
                          description: '',
                          duration: '',
                          level: 'beginner',
                          category: '',
                          instructor: '',
                          price: '',
                          currency: 'USD',
                          prerequisites: '',
                          learningOutcomes: '',
                          syllabus: '',
                          imageUrl: '',
                          isActive: true
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
                      {editingCourse ? 'Update' : 'Add'} Course
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {courses.map((course) => (
              <li key={course.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {course.imageUrl ? (
                        <img className="h-12 w-12 rounded-lg object-cover" src={course.imageUrl} alt="" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{course.title}</p>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.level === 'beginner' 
                            ? 'bg-green-100 text-green-800' 
                            : course.level === 'intermediate'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {course.level}
                        </span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.isActive 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{course.description}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-400">
                          Duration: {course.duration} | Instructor: {course.instructor}
                        </p>
                        <p className="text-xs text-gray-400 ml-4">
                          Price: {course.currency} {course.price}
                        </p>
                      </div>
                      {course.prerequisites && course.prerequisites.length > 0 && (
                        <div className="flex space-x-1 mt-1">
                          {course.prerequisites.slice(0, 3).map((prereq, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {prereq}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new course.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}