'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react';

export default function CollegesPage() {
  const { userIdentity } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: 'public',
    establishedYear: '',
    website: '',
    description: '',
    courses: '',
    facilities: '',
    admissionRequirements: '',
    contactEmail: '',
    contactPhone: '',
    imageUrl: ''
  });

  // Redirect if not content manager
  useEffect(() => {
    if (userIdentity && userIdentity === '1') {
      window.location.href = '/dashboard';
    }
  }, [userIdentity]);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const collegesRef = collection(db, 'colleges');
      const q = query(collegesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const collegesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setColleges(collegesData);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const collegeData = {
        ...formData,
        courses: formData.courses.split(',').map(course => course.trim()),
        facilities: formData.facilities.split(',').map(facility => facility.trim()),
        establishedYear: parseInt(formData.establishedYear),
        createdAt: editingCollege ? editingCollege.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingCollege) {
        await updateDoc(doc(db, 'colleges', editingCollege.id), collegeData);
      } else {
        await addDoc(collection(db, 'colleges'), collegeData);
      }

      setFormData({
        name: '',
        location: '',
        type: 'public',
        establishedYear: '',
        website: '',
        description: '',
        courses: '',
        facilities: '',
        admissionRequirements: '',
        contactEmail: '',
        contactPhone: '',
        imageUrl: ''
      });
      setShowForm(false);
      setEditingCollege(null);
      fetchColleges();
    } catch (error) {
      console.error('Error saving college:', error);
    }
  };

  const handleEdit = (college) => {
    setEditingCollege(college);
    setFormData({
      name: college.name,
      location: college.location,
      type: college.type,
      establishedYear: college.establishedYear?.toString() || '',
      website: college.website || '',
      description: college.description || '',
      courses: college.courses?.join(', ') || '',
      facilities: college.facilities?.join(', ') || '',
      admissionRequirements: college.admissionRequirements || '',
      contactEmail: college.contactEmail || '',
      contactPhone: college.contactPhone || '',
      imageUrl: college.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (collegeId) => {
    if (confirm('Are you sure you want to delete this college?')) {
      try {
        await deleteDoc(doc(db, 'colleges', collegeId));
        fetchColleges();
      } catch (error) {
        console.error('Error deleting college:', error);
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
            <h1 className="text-2xl font-bold text-gray-900">College Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage college information and details
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add College
          </button>
        </div>

        {/* College Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingCollege ? 'Edit College' : 'Add New College'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingCollege(null);
                      setFormData({
                        name: '',
                        location: '',
                        type: 'public',
                        establishedYear: '',
                        website: '',
                        description: '',
                        courses: '',
                        facilities: '',
                        admissionRequirements: '',
                        contactEmail: '',
                        contactPhone: '',
                        imageUrl: ''
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
                      <label className="block text-sm font-medium text-gray-700">College Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="government">Government</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Established Year</label>
                      <input
                        type="number"
                        name="establishedYear"
                        value={formData.establishedYear}
                        onChange={handleInputChange}
                        min="1800"
                        max="2024"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Courses (comma separated)</label>
                      <textarea
                        name="courses"
                        value={formData.courses}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Computer Science, Engineering, Medicine"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Facilities (comma separated)</label>
                      <textarea
                        name="facilities"
                        value={formData.facilities}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Library, Sports Complex, Hostel"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Admission Requirements</label>
                    <textarea
                      name="admissionRequirements"
                      value={formData.admissionRequirements}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
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

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingCollege(null);
                        setFormData({
                          name: '',
                          location: '',
                          type: 'public',
                          establishedYear: '',
                          website: '',
                          description: '',
                          courses: '',
                          facilities: '',
                          admissionRequirements: '',
                          contactEmail: '',
                          contactPhone: '',
                          imageUrl: ''
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
                      {editingCollege ? 'Update' : 'Add'} College
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Colleges List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {colleges.map((college) => (
              <li key={college.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {college.imageUrl ? (
                        <img className="h-12 w-12 rounded-lg object-cover" src={college.imageUrl} alt="" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{college.name}</p>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          college.type === 'public' 
                            ? 'bg-blue-100 text-blue-800' 
                            : college.type === 'private'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {college.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{college.location}</p>
                      <p className="text-sm text-gray-400">{college.description}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-400">
                          Established: {college.establishedYear}
                        </p>
                        {college.courses && college.courses.length > 0 && (
                          <div className="ml-4 flex space-x-1">
                            {college.courses.slice(0, 3).map((course, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {course}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(college)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(college.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {colleges.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No colleges</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new college.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}