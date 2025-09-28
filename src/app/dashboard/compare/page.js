'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import SingleCollegeCompareForm from '@/components/Forms/SingleCollegeCompareForm';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit, Trash2, School, Calendar, Globe, Award } from 'lucide-react';

export default function ComparePage() {
  const { userIdentity } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);

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
      const collegesRef = collection(db, 'compare');
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

  const handleSubmit = async (formData) => {
    try {
      const collegeData = {
        ...formData,
        createdAt: editingCollege ? editingCollege.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingCollege) {
        await updateDoc(doc(db, 'compare', editingCollege.id), collegeData);
      } else {
        await addDoc(collection(db, 'compare'), collegeData);
      }

      setShowForm(false);
      setEditingCollege(null);
      fetchColleges();
    } catch (error) {
      console.error('Error saving college:', error);
      alert('Error saving college. Please try again.');
    }
  };

  const handleEdit = (college) => {
    // Extract the college name and data from the college object
    // college structure: {"College Name": {...data...}, id: "...", createdAt: ...}
    const { id, createdAt, updatedAt, ...collegeEntries } = college;
    
    setEditingCollege({
      ...college,
      ...collegeEntries // This will be the {"College Name": {...data...}} part
    });
    setShowForm(true);
  };

  const getCollegeDisplayData = (college) => {
    const { id, createdAt, updatedAt, ...collegeEntries } = college;
    const collegeNames = Object.keys(collegeEntries);
    if (collegeNames.length > 0) {
      const collegeName = collegeNames[0];
      const collegeData = collegeEntries[collegeName];
      return {
        name: collegeName,
        data: collegeData
      };
    }
    return { name: 'Unknown College', data: {} };
  };

  const handleDelete = async (collegeId) => {
    if (confirm('Are you sure you want to delete this college?')) {
      try {
        await deleteDoc(doc(db, 'compare', collegeId));
        fetchColleges();
      } catch (error) {
        console.error('Error deleting college:', error);
      }
    }
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
            <h1 className="text-2xl font-bold text-gray-900">College Comparison Database</h1>
            <p className="mt-1 text-sm text-gray-500">
              Add and manage individual college details for comparison purposes
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add College
          </button>
        </div>

        {/* Single College Form */}
        <SingleCollegeCompareForm
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingCollege(null);
          }}
          onSubmit={handleSubmit}
          editingCollege={editingCollege}
        />

        {/* Colleges List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => {
            const displayData = getCollegeDisplayData(college);
            
            return (
              <div key={college.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {displayData.data.Colleges?.img ? (
                    <img 
                      className="w-full h-48 object-cover" 
                      src={displayData.data.Colleges.img} 
                      alt={displayData.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center" style={{display: displayData.data.Colleges?.img ? 'none' : 'flex'}}>
                    <School className="h-16 w-16 text-gray-400" />
                  </div>
                  
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(college)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 text-blue-600 p-2 rounded-full shadow-sm transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(college.id)}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 p-2 rounded-full shadow-sm transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {displayData.name}
                    </h3>
                    {displayData.data.Abbreviation && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
                        {displayData.data.Abbreviation}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {displayData.data['Institute Type'] && (
                      <div className="flex items-center">
                        <School className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{displayData.data['Institute Type']}</span>
                      </div>
                    )}
                    
                    {displayData.data.Establishment && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Est. {displayData.data.Establishment}</span>
                      </div>
                    )}
                    
                    {displayData.data.Website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-400" />
                        <a 
                          href={displayData.data.Website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 truncate"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-3">
                      {displayData.data['UGC'] === 'Yes' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          <Award className="h-3 w-3 mr-1" />
                          UGC
                        </span>
                      )}
                      {displayData.data['AICTE'] === 'Yes' && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          <Award className="h-3 w-3 mr-1" />
                          AICTE
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {displayData.data.About && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                      {displayData.data.About}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {colleges.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <School className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No colleges added yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first college for comparison.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First College
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}