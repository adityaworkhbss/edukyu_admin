'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import CollegeFormModal from '@/components/Forms/CollegeFormModal';
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
    collegeKey: '', // e.g., "DYP"
    database: {
      host: '',
      user: '',
      password: '',
      name: ''
    },
    university_info: {
      name: '',
      logo: '',
      banner_image: '',
      accreditations: [],
      about: {
        description: '',
        highlights: [],
        images: []
      },
      courses: [],
      benefits: [],
      degree: {
        description: '',
        highlights: [],
        certificate_image: ''
      },
      degree_sample: {
        image: '',
        description: '',
        highlights: []
      },
      admission_process: [],
      placement: {
        partners: [],
        benefits: [],
        statistics: {
          average_package: '',
          highest_package: ''
        }
      },
      faqs: []
    },
    redirects: {
      success: ''
    }
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
      // Create the final structure with collegeKey as the top level
      const collegeData = {
        [formData.collegeKey]: {
          database: formData.database,
          university_info: formData.university_info,
          redirects: formData.redirects
        },
        createdAt: editingCollege ? editingCollege.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingCollege) {
        await updateDoc(doc(db, 'colleges', editingCollege.id), collegeData);
      } else {
        await addDoc(collection(db, 'colleges'), collegeData);
      }

      // Reset form
      setFormData({
        collegeKey: '',
        database: {
          host: '',
          user: '',
          password: '',
          name: ''
        },
        university_info: {
          name: '',
          logo: '',
          banner_image: '',
          accreditations: [],
          about: {
            description: '',
            highlights: [],
            images: []
          },
          courses: [],
          benefits: [],
          degree: {
            description: '',
            highlights: [],
            certificate_image: ''
          },
          degree_sample: {
            image: '',
            description: '',
            highlights: []
          },
          admission_process: [],
          placement: {
            partners: [],
            benefits: [],
            statistics: {
              average_package: '',
              highest_package: ''
            }
          },
          faqs: []
        },
        redirects: {
          success: ''
        }
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
    
    // Extract the college key (e.g., "DYP") from the college data
    const collegeKey = Object.keys(college).find(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
    const collegeData = college[collegeKey] || {};
    
    setFormData({
      collegeKey: collegeKey || '',
      database: collegeData.database || {
        host: '',
        user: '',
        password: '',
        name: ''
      },
      university_info: collegeData.university_info || {
        name: '',
        logo: '',
        banner_image: '',
        accreditations: [],
        about: {
          description: '',
          highlights: [],
          images: []
        },
        courses: [],
        benefits: [],
        degree: {
          description: '',
          highlights: [],
          certificate_image: ''
        },
        degree_sample: {
          image: '',
          description: '',
          highlights: []
        },
        admission_process: [],
        placement: {
          partners: [],
          benefits: [],
          statistics: {
            average_package: '',
            highest_package: ''
          }
        },
        faqs: []
      },
      redirects: collegeData.redirects || {
        success: ''
      }
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
        <CollegeFormModal 
          showForm={showForm}
          setShowForm={setShowForm}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          editingCollege={editingCollege}
          setEditingCollege={setEditingCollege}
        />

        {/* Colleges List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {colleges.map((college) => {
              // Extract the college key and data
              const collegeKey = Object.keys(college).find(key => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt');
              const collegeData = college[collegeKey] || {};
              const universityInfo = collegeData.university_info || {};
              
              return (
                <li key={college.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {universityInfo.logo ? (
                          <img className="h-12 w-12 rounded-lg object-cover" src={universityInfo.logo} alt="" />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{universityInfo.name || 'Unknown University'}</p>
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {collegeKey}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {universityInfo.about?.description ? 
                            universityInfo.about.description.substring(0, 100) + '...' : 
                            'No description available'
                          }
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-gray-400">
                            Courses: {universityInfo.courses?.length || 0}
                          </p>
                          <p className="text-xs text-gray-400 ml-4">
                            Accreditations: {universityInfo.accreditations?.length || 0}
                          </p>
                          {universityInfo.banner_image && (
                            <span className="ml-4 text-xs text-green-600">Has Banner</span>
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
              );
            })}
          </ul>
          {colleges.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No colleges</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new college with comprehensive data.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}