'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit, Trash2, BarChart3 } from 'lucide-react';

export default function ComparePage() {
  const { userIdentity } = useAuth();
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingComparison, setEditingComparison] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'colleges',
    items: [],
    criteria: [],
    isActive: true
  });

  // Redirect if not content manager
  useEffect(() => {
    if (userIdentity && userIdentity === '1') {
      window.location.href = '/dashboard';
    }
  }, [userIdentity]);

  useEffect(() => {
    fetchComparisons();
  }, []);

  const fetchComparisons = async () => {
    try {
      const comparisonsRef = collection(db, 'comparisons');
      const q = query(comparisonsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const comparisonsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComparisons(comparisonsData);
    } catch (error) {
      console.error('Error fetching comparisons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const comparisonData = {
        ...formData,
        items: formData.items.filter(item => item.trim() !== ''),
        criteria: formData.criteria.filter(criterion => criterion.trim() !== ''),
        createdAt: editingComparison ? editingComparison.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingComparison) {
        await updateDoc(doc(db, 'comparisons', editingComparison.id), comparisonData);
      } else {
        await addDoc(collection(db, 'comparisons'), comparisonData);
      }

      setFormData({
        title: '',
        description: '',
        type: 'colleges',
        items: [],
        criteria: [],
        isActive: true
      });
      setShowForm(false);
      setEditingComparison(null);
      fetchComparisons();
    } catch (error) {
      console.error('Error saving comparison:', error);
    }
  };

  const handleEdit = (comparison) => {
    setEditingComparison(comparison);
    setFormData({
      title: comparison.title,
      description: comparison.description,
      type: comparison.type,
      items: comparison.items || [],
      criteria: comparison.criteria || [],
      isActive: comparison.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (comparisonId) => {
    if (confirm('Are you sure you want to delete this comparison?')) {
      try {
        await deleteDoc(doc(db, 'comparisons', comparisonId));
        fetchComparisons();
      } catch (error) {
        console.error('Error deleting comparison:', error);
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

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, '']
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? value : item)
    }));
  };

  const addCriterion = () => {
    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, '']
    }));
  };

  const removeCriterion = (index) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index)
    }));
  };

  const updateCriterion = (index, value) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.map((criterion, i) => i === index ? value : criterion)
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
            <h1 className="text-2xl font-bold text-gray-900">Comparison Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage comparison data and tools
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Comparison
          </button>
        </div>

        {/* Comparison Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingComparison ? 'Edit Comparison' : 'Add New Comparison'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingComparison(null);
                      setFormData({
                        title: '',
                        description: '',
                        type: 'colleges',
                        items: [],
                        criteria: [],
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
                      <label className="block text-sm font-medium text-gray-700">Title *</label>
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
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="colleges">Colleges</option>
                        <option value="courses">Courses</option>
                        <option value="programs">Programs</option>
                        <option value="universities">Universities</option>
                      </select>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Items to Compare</label>
                    <div className="space-y-2">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateItem(index, e.target.value)}
                            placeholder={`Item ${index + 1}`}
                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addItem}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Comparison Criteria</label>
                    <div className="space-y-2">
                      {formData.criteria.map((criterion, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={criterion}
                            onChange={(e) => updateCriterion(index, e.target.value)}
                            placeholder={`Criterion ${index + 1}`}
                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeCriterion(index)}
                            className="px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addCriterion}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Add Criterion
                      </button>
                    </div>
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
                      Comparison is active
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingComparison(null);
                        setFormData({
                          title: '',
                          description: '',
                          type: 'colleges',
                          items: [],
                          criteria: [],
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
                      {editingComparison ? 'Update' : 'Add'} Comparison
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Comparisons List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {comparisons.map((comparison) => (
              <li key={comparison.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{comparison.title}</p>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          comparison.type === 'colleges' 
                            ? 'bg-blue-100 text-blue-800' 
                            : comparison.type === 'courses'
                            ? 'bg-green-100 text-green-800'
                            : comparison.type === 'programs'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comparison.type}
                        </span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          comparison.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {comparison.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{comparison.description}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-400">
                          Items: {comparison.items?.length || 0} | Criteria: {comparison.criteria?.length || 0}
                        </p>
                      </div>
                      {comparison.items && comparison.items.length > 0 && (
                        <div className="flex space-x-1 mt-1">
                          {comparison.items.slice(0, 3).map((item, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {item}
                            </span>
                          ))}
                          {comparison.items.length > 3 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{comparison.items.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(comparison)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comparison.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {comparisons.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No comparisons</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new comparison.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}