'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const ComprehensiveCourseForm = ({ isOpen, onClose, onSubmit, editingCourse }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(() => {
    if (editingCourse) return editingCourse;
    
    return {
      university_key: '',
      course_key: '',
      page: {
        title: '',
        university: '',
        description: '',
        logo: '',
        duration: {
          length: '',
          semesters: ''
        },
        fees: {
          total: '',
          perSemester: '',
          original_price: '',
          yearly: ''
        },
        courses: [],
        accreditations: []
      },
      programBenefits: [],
      eligibility: {
        domestic: {
          educationalQualification: ''
        },
        international: {
          educationalQualification: ''
        }
      },
      curriculum: {
        semesters: []
      },
      admissionProcess: [],
      careerOpportunities: {
        jobRoles: [],
        industries: []
      },
      faqs: [],
      hiringPartners: [],
      scholarships: {
        regular_scholarships: [],
        cuet_scholarship: {
          levels: []
        },
        merit_scholarship: {
          levels: []
        },
        sports_scholarship: {
          levels: []
        },
        thakur_pratap_singh_memorial_scholarship: {
          description: '',
          eligibility: {
            indian_students: '',
            international_students: '',
            percentage_in_12th: ''
          }
        }
      },
      bank_loan_assistance: {
        description: '',
        loan_partners: []
      }
    };
  });

  // Deep clone helper for proper state management
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  // Generic array operations
  const addArrayItem = (path, item) => {
    setFormData(prev => {
      const newData = deepClone(prev);
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      const targetKey = keys[keys.length - 1];
      if (!Array.isArray(current[targetKey])) {
        current[targetKey] = [];
      }
      current[targetKey] = [...current[targetKey], item];
      return newData;
    });
  };

  const removeArrayItem = (path, index) => {
    setFormData(prev => {
      const newData = deepClone(prev);
      const keys = path.split('.');
      let current = newData;
      
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
      const newData = deepClone(prev);
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      const targetKey = keys[keys.length - 1];
      if (Array.isArray(current[targetKey]) && index >= 0 && index < current[targetKey].length) {
        if (field) {
          if (typeof current[targetKey][index] === 'object') {
            current[targetKey][index][field] = value;
          }
        } else {
          current[targetKey][index] = value;
        }
      }
      return newData;
    });
  };

  const handleInputChange = (path, value) => {
    setFormData(prev => {
      const newData = deepClone(prev);
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Validation function for university_key and course_key
  const validateKey = (value) => {
    // Only allow lowercase letters and underscores
    return /^[a-z_]*$/.test(value);
  };

  const handleKeyInput = (field, value) => {
    // Only update if the value is valid (lowercase letters and underscores only)
    if (validateKey(value)) {
      handleInputChange(field, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate keys before submission
    if (!validateKey(formData.university_key)) {
      alert('University Key can only contain lowercase letters and underscores');
      return;
    }
    
    if (!validateKey(formData.course_key)) {
      alert('Course Key can only contain lowercase letters and underscores');
      return;
    }
    
    onSubmit(formData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'benefits', label: 'Program Benefits' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'career', label: 'Career' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'partners', label: 'Partners' },
    { id: 'scholarships', label: 'Scholarships' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">University Key *</label>
                  <input
                    type="text"
                    value={formData.university_key || ''}
                    onChange={(e) => handleKeyInput('university_key', e.target.value)}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formData.university_key && !validateKey(formData.university_key) 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : ''
                    }`}
                    placeholder="noida_international_university"
                    pattern="^[a-z_]*$"
                    title="Only lowercase letters and underscores are allowed"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Only lowercase letters and underscores allowed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Key *</label>
                  <input
                    type="text"
                    value={formData.course_key || ''}
                    onChange={(e) => handleKeyInput('course_key', e.target.value)}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      formData.course_key && !validateKey(formData.course_key) 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : ''
                    }`}
                    placeholder="online_mba"
                    pattern="^[a-z_]*$"
                    title="Only lowercase letters and underscores are allowed"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Only lowercase letters and underscores allowed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Title *</label>
                  <input
                    type="text"
                    value={formData.page?.title || ''}
                    onChange={(e) => handleInputChange('page.title', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">University Name *</label>
                  <input
                    type="text"
                    value={formData.page?.university || ''}
                    onChange={(e) => handleInputChange('page.university', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.page?.description || ''}
                  onChange={(e) => handleInputChange('page.description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                <input
                  type="url"
                  value={formData.page?.logo || ''}
                  onChange={(e) => handleInputChange('page.logo', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Duration Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Duration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Length</label>
                    <input
                      type="text"
                      value={formData.page?.duration?.length || ''}
                      onChange={(e) => handleInputChange('page.duration.length', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="2 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Semesters</label>
                    <input
                      type="text"
                      value={formData.page?.duration?.semesters || ''}
                      onChange={(e) => handleInputChange('page.duration.semesters', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="4"
                    />
                  </div>
                </div>
              </div>

              {/* Fees Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Fees</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total</label>
                    <input
                      type="text"
                      value={formData.page?.fees?.total || ''}
                      onChange={(e) => handleInputChange('page.fees.total', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Rs 88,500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Per Semester</label>
                    <input
                      type="text"
                      value={formData.page?.fees?.perSemester || ''}
                      onChange={(e) => handleInputChange('page.fees.perSemester', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Rs 22,125"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Original Price</label>
                    <input
                      type="text"
                      value={formData.page?.fees?.original_price || ''}
                      onChange={(e) => handleInputChange('page.fees.original_price', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Rs 1,18,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yearly</label>
                    <input
                      type="text"
                      value={formData.page?.fees?.yearly || ''}
                      onChange={(e) => handleInputChange('page.fees.yearly', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Rs 44,250"
                    />
                  </div>
                </div>
              </div>

              {/* Courses Section */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Courses</h4>
                {(formData.page?.courses || []).map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Course Name</label>
                        <input
                          type="text"
                          value={course.name || ''}
                          onChange={(e) => updateArrayItem('page.courses', index, 'name', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <input
                          type="text"
                          value={course.duration || ''}
                          onChange={(e) => updateArrayItem('page.courses', index, 'duration', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                          value={course.type || ''}
                          onChange={(e) => updateArrayItem('page.courses', index, 'type', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        >
                          <option value="">Select Type</option>
                          <option value="UG">UG</option>
                          <option value="PG">PG</option>
                          <option value="Diploma/Certificate">Diploma/Certificate</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Original Fees</label>
                        <input
                          type="text"
                          value={course.fees?.original || ''}
                          onChange={(e) => {
                            const fees = course.fees || {};
                            fees.original = e.target.value;
                            updateArrayItem('page.courses', index, 'fees', fees);
                          }}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Discounted Fees</label>
                        <input
                          type="text"
                          value={course.fees?.discounted || ''}
                          onChange={(e) => {
                            const fees = course.fees || {};
                            fees.discounted = e.target.value;
                            updateArrayItem('page.courses', index, 'fees', fees);
                          }}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Display Fees</label>
                        <input
                          type="text"
                          value={course.fees?.display || ''}
                          onChange={(e) => {
                            const fees = course.fees || {};
                            fees.display = e.target.value;
                            updateArrayItem('page.courses', index, 'fees', fees);
                          }}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('page.courses', index)}
                      className="mt-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('page.courses', {
                    name: '', duration: '', type: '', fees: { original: '', discounted: '', display: '' }
                  })}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Course
                </button>
              </div>

              {/* Accreditations Section */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Accreditations</h4>
                {(formData.page?.accreditations || []).map((accreditation, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={accreditation.name || ''}
                          onChange={(e) => updateArrayItem('page.accreditations', index, 'name', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Icon URL</label>
                        <input
                          type="url"
                          value={accreditation.icon || ''}
                          onChange={(e) => updateArrayItem('page.accreditations', index, 'icon', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('page.accreditations', index)}
                      className="mt-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('page.accreditations', { name: '', icon: '' })}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Accreditation
                </button>
              </div>
            </div>
          )}

          {/* Program Benefits Tab */}
          {activeTab === 'benefits' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Program Benefits</h4>
              {(formData.programBenefits || []).map((benefit, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={benefit.title || ''}
                      onChange={(e) => updateArrayItem('programBenefits', index, 'title', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={benefit.description || ''}
                      onChange={(e) => updateArrayItem('programBenefits', index, 'description', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('programBenefits', index)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('programBenefits', { title: '', description: '' })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Benefit
              </button>
            </div>
          )}

          {/* Eligibility Tab */}
          {activeTab === 'eligibility' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Eligibility</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domestic Students</label>
                  <textarea
                    value={formData.eligibility?.domestic?.educationalQualification || ''}
                    onChange={(e) => handleInputChange('eligibility.domestic.educationalQualification', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Educational qualification requirements for domestic students"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">International Students</label>
                  <textarea
                    value={formData.eligibility?.international?.educationalQualification || ''}
                    onChange={(e) => handleInputChange('eligibility.international.educationalQualification', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Educational qualification requirements for international students"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Curriculum</h4>
              {(formData.curriculum?.semesters || []).map((semester, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Semester Number</label>
                      <input
                        type="number"
                        value={semester.number || ''}
                        onChange={(e) => updateArrayItem('curriculum.semesters', index, 'number', parseInt(e.target.value))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('curriculum.semesters', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Courses</label>
                    {(semester.courses || []).map((course, courseIndex) => (
                      <div key={courseIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={course}
                          onChange={(e) => {
                            const courses = [...(semester.courses || [])];
                            courses[courseIndex] = e.target.value;
                            updateArrayItem('curriculum.semesters', index, 'courses', courses);
                          }}
                          className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Course name"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const courses = [...(semester.courses || [])];
                            courses.splice(courseIndex, 1);
                            updateArrayItem('curriculum.semesters', index, 'courses', courses);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const courses = [...(semester.courses || []), ''];
                        updateArrayItem('curriculum.semesters', index, 'courses', courses);
                      }}
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      + Add Course
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('curriculum.semesters', { number: '', courses: [] })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Semester
              </button>
            </div>
          )}

          {/* Admissions Tab */}
          {activeTab === 'admissions' && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Admission Process</h4>
              {(formData.admissionProcess || []).map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Step Number</label>
                      <input
                        type="number"
                        value={step.step || ''}
                        onChange={(e) => updateArrayItem('admissionProcess', index, 'step', parseInt(e.target.value))}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={step.title || ''}
                        onChange={(e) => updateArrayItem('admissionProcess', index, 'title', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={step.description || ''}
                      onChange={(e) => updateArrayItem('admissionProcess', index, 'description', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('admissionProcess', index)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('admissionProcess', { step: '', title: '', description: '' })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </button>
            </div>
          )}

          {/* Career Tab */}
          {activeTab === 'career' && (
            <div className="space-y-6">
              {/* Job Roles */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Job Roles</h4>
                {(formData.careerOpportunities?.jobRoles || []).map((role, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => {
                        const roles = [...(formData.careerOpportunities?.jobRoles || [])];
                        roles[index] = e.target.value;
                        handleInputChange('careerOpportunities.jobRoles', roles);
                      }}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Job role"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const roles = [...(formData.careerOpportunities?.jobRoles || [])];
                        roles.splice(index, 1);
                        handleInputChange('careerOpportunities.jobRoles', roles);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const roles = [...(formData.careerOpportunities?.jobRoles || []), ''];
                    handleInputChange('careerOpportunities.jobRoles', roles);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Add Job Role
                </button>
              </div>

              {/* Industries */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Industries</h4>
                {(formData.careerOpportunities?.industries || []).map((industry, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => {
                        const industries = [...(formData.careerOpportunities?.industries || [])];
                        industries[index] = e.target.value;
                        handleInputChange('careerOpportunities.industries', industries);
                      }}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Industry"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const industries = [...(formData.careerOpportunities?.industries || [])];
                        industries.splice(index, 1);
                        handleInputChange('careerOpportunities.industries', industries);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const industries = [...(formData.careerOpportunities?.industries || []), ''];
                    handleInputChange('careerOpportunities.industries', industries);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Add Industry
                </button>
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h4>
              {(formData.faqs || []).map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question</label>
                    <input
                      type="text"
                      value={faq.question || ''}
                      onChange={(e) => updateArrayItem('faqs', index, 'question', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Answer</label>
                    <textarea
                      value={faq.answer || ''}
                      onChange={(e) => updateArrayItem('faqs', index, 'answer', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('faqs', index)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('faqs', { question: '', answer: '' })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add FAQ
              </button>
            </div>
          )}

          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Hiring Partners</h4>
              {(formData.hiringPartners || []).map((partner, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company Name</label>
                      <input
                        type="text"
                        value={partner.name || ''}
                        onChange={(e) => updateArrayItem('hiringPartners', index, 'name', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                      <input
                        type="url"
                        value={partner.logo || ''}
                        onChange={(e) => updateArrayItem('hiringPartners', index, 'logo', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('hiringPartners', index)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('hiringPartners', { name: '', logo: '' })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Partner
              </button>
            </div>
          )}

          {/* Scholarships Tab */}
          {activeTab === 'scholarships' && (
            <div className="space-y-6">
              {/* Regular Scholarships */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Regular Scholarships</h4>
                {(formData.scholarships?.regular_scholarships || []).map((scholarship, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={scholarship.name || ''}
                          onChange={(e) => updateArrayItem('scholarships.regular_scholarships', index, 'name', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Discount</label>
                        <input
                          type="text"
                          value={scholarship.discount || ''}
                          onChange={(e) => updateArrayItem('scholarships.regular_scholarships', index, 'discount', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                          placeholder="20%"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Eligibility</label>
                      <textarea
                        value={scholarship.eligibility || ''}
                        onChange={(e) => updateArrayItem('scholarships.regular_scholarships', index, 'eligibility', e.target.value)}
                        rows={2}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem('scholarships.regular_scholarships', index)}
                      className="mt-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('scholarships.regular_scholarships', { name: '', discount: '', eligibility: '' })}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Regular Scholarship
                </button>
              </div>

              {/* Bank Loan Assistance */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Bank Loan Assistance</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.bank_loan_assistance?.description || ''}
                    onChange={(e) => handleInputChange('bank_loan_assistance.description', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Partners</label>
                  {(formData.bank_loan_assistance?.loan_partners || []).map((partner, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={partner}
                        onChange={(e) => {
                          const partners = [...(formData.bank_loan_assistance?.loan_partners || [])];
                          partners[index] = e.target.value;
                          handleInputChange('bank_loan_assistance.loan_partners', partners);
                        }}
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Partner name"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const partners = [...(formData.bank_loan_assistance?.loan_partners || [])];
                          partners.splice(index, 1);
                          handleInputChange('bank_loan_assistance.loan_partners', partners);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const partners = [...(formData.bank_loan_assistance?.loan_partners || []), ''];
                      handleInputChange('bank_loan_assistance.loan_partners', partners);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Loan Partner
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submit/Cancel Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default ComprehensiveCourseForm;