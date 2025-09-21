'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { AccreditationsSection, CoursesSection, BenefitsSection, DegreeSection } from './CollegeFormSections';
import { AdmissionSection, PlacementSection, FaqsSection } from './CollegeFormSectionsExtra';

export default function CollegeFormModal({ 
  showForm, 
  setShowForm, 
  formData, 
  setFormData, 
  handleSubmit, 
  editingCollege, 
  setEditingCollege 
}) {
  const [activeTab, setActiveTab] = useState('basic');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setFormData(prev => {
      // Deep clone to avoid reference issues
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      
      // Navigate to the target property
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Set the value
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Helper functions for array management with proper deep cloning
  const addArrayItem = (path, item) => {
    setFormData(prev => {
      // Deep clone the entire form data to avoid reference issues
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      
      // Navigate to the target array
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Ensure the target is an array
      const targetKey = keys[keys.length - 1];
      if (!Array.isArray(current[targetKey])) {
        current[targetKey] = [];
      }
      
      // Add the new item
      current[targetKey] = [...current[targetKey], item];
      return newData;
    });
  };

  const removeArrayItem = (path, index) => {
    setFormData(prev => {
      // Deep clone to avoid reference issues
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      
      // Navigate to the target array
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const targetKey = keys[keys.length - 1];
      if (Array.isArray(current[targetKey]) && index >= 0 && index < current[targetKey].length) {
        current[targetKey] = current[targetKey].filter((_, i) => i !== index);
      }
      
      return newData;
    });
  };

  const updateArrayItem = (path, index, field, value) => {
    setFormData(prev => {
      // Deep clone to avoid reference issues
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      
      // Navigate to the target array
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const targetKey = keys[keys.length - 1];
      if (Array.isArray(current[targetKey]) && index >= 0 && index < current[targetKey].length) {
        if (field) {
          // Update a specific field of an object in the array
          if (typeof current[targetKey][index] === 'object') {
            current[targetKey][index][field] = value;
          }
        } else {
          // Replace the entire item
          current[targetKey][index] = value;
        }
      }
      
      return newData;
    });
  };

  // Special function for nested arrays (like specializations within courses)
  const updateNestedArrayItem = (basePath, baseIndex, nestedField, nestedIndex, value) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = basePath.split('.');
      let current = newData;
      
      // Navigate to the base array
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const targetKey = keys[keys.length - 1];
      if (Array.isArray(current[targetKey]) && baseIndex >= 0 && baseIndex < current[targetKey].length) {
        const item = current[targetKey][baseIndex];
        if (!Array.isArray(item[nestedField])) {
          item[nestedField] = [];
        }
        if (nestedIndex >= 0 && nestedIndex < item[nestedField].length) {
          item[nestedField][nestedIndex] = value;
        }
      }
      
      return newData;
    });
  };

  const addNestedArrayItem = (basePath, baseIndex, nestedField, value) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = basePath.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const targetKey = keys[keys.length - 1];
      if (Array.isArray(current[targetKey]) && baseIndex >= 0 && baseIndex < current[targetKey].length) {
        const item = current[targetKey][baseIndex];
        if (!Array.isArray(item[nestedField])) {
          item[nestedField] = [];
        }
        item[nestedField] = [...item[nestedField], value];
      }
      
      return newData;
    });
  };

  const removeNestedArrayItem = (basePath, baseIndex, nestedField, nestedIndex) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = basePath.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const targetKey = keys[keys.length - 1];
      if (Array.isArray(current[targetKey]) && baseIndex >= 0 && baseIndex < current[targetKey].length) {
        const item = current[targetKey][baseIndex];
        if (Array.isArray(item[nestedField]) && nestedIndex >= 0 && nestedIndex < item[nestedField].length) {
          item[nestedField] = item[nestedField].filter((_, i) => i !== nestedIndex);
        }
      }
      
      return newData;
    });
  };

  const resetForm = () => {
    setFormData({
      collegeKey: '',
      database: { host: '', user: '', password: '', name: '' },
      university_info: {
        name: '', logo: '', banner_image: '', accreditations: [],
        about: { description: '', highlights: [], images: [] },
        courses: [], benefits: [],
        degree: { description: '', highlights: [], certificate_image: '' },
        degree_sample: { image: '', description: '', highlights: [] },
        admission_process: [], placement: {
          partners: [], benefits: [], statistics: { average_package: '', highest_package: '' }
        }, faqs: []
      },
      redirects: { success: '' }
    });
  };

  if (!showForm) return null;

  const tabs = [
    { id: 'basic', name: 'Basic Info', color: 'blue' },
    { id: 'database', name: 'Database', color: 'purple' },
    { id: 'about', name: 'About', color: 'green' },
    { id: 'accreditations', name: 'Accreditations', color: 'yellow' },
    { id: 'courses', name: 'Courses', color: 'red' },
    { id: 'benefits', name: 'Benefits', color: 'indigo' },
    { id: 'degree', name: 'Degree Info', color: 'pink' },
    { id: 'admission', name: 'Admission', color: 'gray' },
    { id: 'placement', name: 'Placement', color: 'orange' },
    { id: 'faqs', name: 'FAQs', color: 'teal' },
    { id: 'redirects', name: 'Redirects', color: 'cyan' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {editingCollege ? 'Edit College Data' : 'Add New College Data'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCollege(null);
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? `border-${tab.color}-500 text-${tab.color}-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">College Identifier & Basic Info</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">College Key (e.g., DYP) *</label>
                      <input
                        type="text"
                        name="collegeKey"
                        value={formData.collegeKey}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter unique college identifier (e.g., DYP, MIT, etc.)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">University Name *</label>
                      <input
                        type="text"
                        name="university_info.name"
                        value={formData.university_info.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter university name"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                        <input
                          type="url"
                          name="university_info.logo"
                          value={formData.university_info.logo}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Banner Image URL</label>
                        <input
                          type="url"
                          name="university_info.banner_image"
                          value={formData.university_info.banner_image}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="https://example.com/banner.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Database Tab */}
            {activeTab === 'database' && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Database Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Host</label>
                    <input
                      type="text"
                      name="database.host"
                      value={formData.database.host}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="localhost"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <input
                      type="text"
                      name="database.user"
                      value={formData.database.user}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="EDUKYU_CRM_230500001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      name="database.password"
                      value={formData.database.password}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Database Name</label>
                    <input
                      type="text"
                      name="database.name"
                      value={formData.database.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="edukyu_enqbooks"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">About University</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="university_info.about.description"
                      value={formData.university_info.about.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Enter university description..."
                    />
                  </div>
                  
                  {/* Highlights */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                    {formData.university_info.about.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => updateArrayItem('university_info.about.highlights', index, null, e.target.value)}
                          className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Enter highlight..."
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('university_info.about.highlights', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('university_info.about.highlights', '')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Highlight
                    </button>
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                    {formData.university_info.about.images.map((image, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => updateArrayItem('university_info.about.images', index, null, e.target.value)}
                          className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          placeholder="Enter image URL..."
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem('university_info.about.images', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem('university_info.about.images', '')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Accreditations Tab */}
            {activeTab === 'accreditations' && (
              <AccreditationsSection 
                formData={formData}
                setFormData={setFormData}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                updateArrayItem={updateArrayItem}
              />
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <CoursesSection 
                formData={formData}
                setFormData={setFormData}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                updateArrayItem={updateArrayItem}
                addNestedArrayItem={addNestedArrayItem}
                removeNestedArrayItem={removeNestedArrayItem}
                updateNestedArrayItem={updateNestedArrayItem}
              />
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <BenefitsSection 
                formData={formData}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                updateArrayItem={updateArrayItem}
              />
            )}

            {/* Degree Tab */}
            {activeTab === 'degree' && (
              <DegreeSection 
                formData={formData}
                handleInputChange={handleInputChange}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                updateArrayItem={updateArrayItem}
              />
            )}

            {/* Admission Tab */}
            {activeTab === 'admission' && (
              <AdmissionSection 
                formData={formData}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                updateArrayItem={updateArrayItem}
              />
            )}

            {/* Placement Tab */}
            {activeTab === 'placement' && (
              <PlacementSection 
                formData={formData}
                handleInputChange={handleInputChange}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                updateArrayItem={updateArrayItem}
              />
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <FaqsSection 
                formData={formData}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                updateArrayItem={updateArrayItem}
              />
            )}

            {/* Redirects Tab */}
            {activeTab === 'redirects' && (
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Redirect URLs</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Success Redirect URL</label>
                  <input
                    type="url"
                    name="redirects.success"
                    value={formData.redirects.success}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    placeholder="https://example.com/thank-you"
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCollege(null);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {editingCollege ? 'Update' : 'Save'} College Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}