'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ComprehensiveCourseForm from '@/components/Forms/ComprehensiveCourseForm';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit, Trash2, BookOpen, University, Calendar, DollarSign } from 'lucide-react';

export default function CoursesPage() {
  const { userIdentity } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

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

  const handleSubmit = async (formData) => {
    try {
      // Create the exact JSON structure as provided
      const courseData = {
        [formData.university_key]: {
          [formData.course_key]: {
            page: formData.page,
            programBenefits: formData.programBenefits,
            eligibility: formData.eligibility,
            curriculum: formData.curriculum,
            admissionProcess: formData.admissionProcess,
            careerOpportunities: formData.careerOpportunities,
            faqs: formData.faqs,
            hiringPartners: formData.hiringPartners,
            scholarships: formData.scholarships,
            bank_loan_assistance: formData.bank_loan_assistance
          }
        },
        createdAt: editingCourse ? editingCourse.createdAt : new Date(),
        updatedAt: new Date(),
        // Add metadata for easier querying and display
        _metadata: {
          university_key: formData.university_key,
          course_key: formData.course_key,
          title: formData.page?.title || '',
          university: formData.page?.university || '',
          isActive: true
        }
      };

      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), courseData);
      } else {
        await addDoc(collection(db, 'courses'), courseData);
      }

      setShowForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    }
  };

  const handleEdit = (course) => {
    // Extract the course data from the nested structure
    const universityKey = course._metadata?.university_key;
    const courseKey = course._metadata?.course_key;
    
    if (universityKey && courseKey && course[universityKey] && course[universityKey][courseKey]) {
      const courseData = course[universityKey][courseKey];
      setEditingCourse({
        ...course,
        university_key: universityKey,
        course_key: courseKey,
        ...courseData
      });
    } else {
      // Fallback for older data structure
      setEditingCourse(course);
    }
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

  const getCourseDisplayData = (course) => {
    const universityKey = course._metadata?.university_key;
    const courseKey = course._metadata?.course_key;
    
    if (universityKey && courseKey && course[universityKey] && course[universityKey][courseKey]) {
      return course[universityKey][courseKey];
    }
    
    // Fallback for older structure
    return course;
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
              Manage comprehensive course information and details
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

        {/* Comprehensive Course Form */}
        <ComprehensiveCourseForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
          onSubmit={handleSubmit}
          editingCourse={editingCourse}
        />

        {/* Courses List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {courses.map((course) => {
              const displayData = getCourseDisplayData(course);
              return (
                <li key={course.id}>
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {displayData.page?.logo ? (
                            <img className="h-12 w-12 rounded-lg object-cover" src={displayData.page.logo} alt="" />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <University className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-lg font-medium text-gray-900">{displayData.page?.title || 'Untitled Course'}</p>
                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {course._metadata?.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{displayData.page?.university || 'University'}</p>
                          <p className="text-sm text-gray-500 mb-2">{displayData.page?.description || 'No description available'}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            {displayData.page?.duration?.length && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Duration: {displayData.page.duration.length}
                              </div>
                            )}
                            {displayData.page?.fees?.total && (
                              <div className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />
                                Fees: {displayData.page.fees.total}
                              </div>
                            )}
                            {displayData.page?.courses && (
                              <div className="flex items-center">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {displayData.page.courses.length} programs
                              </div>
                            )}
                          </div>
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
                  </div>
                </li>
              );
            })}
          </ul>
          {courses.length === 0 && (
            <div className="text-center py-12">
              <University className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new comprehensive course.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}