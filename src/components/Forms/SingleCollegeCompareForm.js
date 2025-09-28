'use client';

import { useState, useEffect } from 'react';
import { X, School, MapPin, Calendar, Globe, Award, BookOpen, DollarSign, Users, Star, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

function SingleCollegeCompareForm({ isOpen, onClose, onSubmit, editingCollege }) {
  const [formData, setFormData] = useState({
    collegeName: '',
    Colleges: { text: '', img: '' },
    Abbreviation: '',
    'Institute Type': '',
    Establishment: '',
    About: '',
    Accreditation: '',
    'UGC': '',
    'AICTE': '',
    'DEB': '',
    Duration: '',
    'Learning Methodology': '',
    Fees: '',
    Programs: '',
    Specialisation: '',
    Review: '',
    Eligibility: '',
    'Any Issue': '',
    'Our recommendation': '',
    Website: ''
  });

  useEffect(() => {
    if (editingCollege) {
      // Extract college name and data from the editing object
      // editingCollege should be like: {"College Name": {...data...}}
      const collegeEntries = Object.entries(editingCollege);
      if (collegeEntries.length > 0) {
        const [collegeName, collegeData] = collegeEntries[0];
        setFormData({
          collegeName: collegeName,
          Colleges: collegeData.Colleges || { text: '', img: '' },
          Abbreviation: collegeData.Abbreviation || '',
          'Institute Type': collegeData['Institute Type'] || '',
          Establishment: collegeData.Establishment || '',
          About: collegeData.About || '',
          Accreditation: collegeData.Accreditation || '',
          'UGC': collegeData['UGC'] || '',
          'AICTE': collegeData['AICTE'] || '',
          'DEB': collegeData['DEB'] || '',
          Duration: collegeData.Duration || '',
          'Learning Methodology': collegeData['Learning Methodology'] || '',
          Fees: collegeData.Fees || '',
          Programs: collegeData.Programs || '',
          Specialisation: collegeData.Specialisation || '',
          Review: collegeData.Review || '',
          Eligibility: collegeData.Eligibility || '',
          'Any Issue': collegeData['Any Issue'] || '',
          'Our recommendation': collegeData['Our recommendation'] || '',
          Website: collegeData.Website || ''
        });
      }
    } else {
      // Reset form for new entry
      setFormData({
        collegeName: '',
        Colleges: { text: '', img: '' },
        Abbreviation: '',
        'Institute Type': '',
        Establishment: '',
        About: '',
        Accreditation: '',
        'UGC': '',
        'AICTE': '',
        'DEB': '',
        Duration: '',
        'Learning Methodology': '',
        Fees: '',
        Programs: '',
        Specialisation: '',
        Review: '',
        Eligibility: '',
        'Any Issue': '',
        'Our recommendation': '',
        Website: ''
      });
    }
  }, [editingCollege, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.collegeName.trim()) {
      alert('Please enter a college name');
      return;
    }
    
    // Create the structure: {"College Name": {...all data except collegeName}}
    const { collegeName, ...collegeData } = formData;
    
    // Make sure college name is also set in Colleges.text if not provided
    const finalCollegeData = {
      ...collegeData,
      Colleges: {
        ...collegeData.Colleges,
        text: collegeData.Colleges.text || collegeName
      }
    };
    
    const submissionData = {
      [collegeName.trim()]: finalCollegeData
    };
    
    onSubmit(submissionData);
  };

  const handleInputChange = (field, value) => {
    if (field === 'Colleges.text' || field === 'Colleges.img') {
      const subField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        Colleges: {
          ...prev.Colleges,
          [subField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (!isOpen) return null;

  const formSections = [
    {
      title: 'Basic Information',
      icon: School,
      color: 'bg-blue-50 border-blue-200',
      fields: [
        { key: 'collegeName', label: 'College/University Name', type: 'text', required: true },
        { key: 'Colleges.text', label: 'College Display Name', type: 'text' },
        { key: 'Colleges.img', label: 'College Image URL', type: 'url' },
        { key: 'Abbreviation', label: 'Abbreviation', type: 'text' },
        { key: 'Institute Type', label: 'Institute Type', type: 'select', options: ['Private', 'Government', 'Deemed', 'Central University', 'State University'] }
      ]
    },
    {
      title: 'Establishment & Location',
      icon: MapPin,
      color: 'bg-green-50 border-green-200',
      fields: [
        { key: 'Establishment', label: 'Establishment Year', type: 'text' },
        { key: 'About', label: 'About College', type: 'textarea' }
      ]
    },
    {
      title: 'Accreditation & Approvals',
      icon: Award,
      color: 'bg-purple-50 border-purple-200',
      fields: [
        { key: 'Accreditation', label: 'Accreditation', type: 'text' },
        { key: 'UGC', label: 'UGC', type: 'select', options: ['Yes', 'No', 'Under Process'] },
        { key: 'AICTE', label: 'AICTE', type: 'select', options: ['Yes', 'No', 'Under Process'] },
        { key: 'DEB', label: 'DEB', type: 'select', options: ['Yes', 'No', 'Under Process'] }
      ]
    },
    {
      title: 'Program Details',
      icon: BookOpen,
      color: 'bg-yellow-50 border-yellow-200',
      fields: [
        { key: 'Duration', label: 'Program Duration', type: 'text' },
        { key: 'Learning Methodology', label: 'Learning Methodology', type: 'select', options: ['Online', 'Offline', 'Hybrid', 'Distance Learning'] },
        { key: 'Programs', label: 'Programs Offered', type: 'textarea' },
        { key: 'Specialisation', label: 'Specializations', type: 'textarea' }
      ]
    },
    {
      title: 'Financial & Admission',
      icon: DollarSign,
      color: 'bg-red-50 border-red-200',
      fields: [
        { key: 'Fees', label: 'Fee Structure', type: 'textarea' },
        { key: 'Eligibility', label: 'Eligibility Criteria', type: 'textarea' }
      ]
    },
    {
      title: 'Reviews & Recommendations',
      icon: Star,
      color: 'bg-indigo-50 border-indigo-200',
      fields: [
        { key: 'Review', label: 'Reviews', type: 'textarea' },
        { key: 'Any Issue', label: 'Any Issues/Concerns', type: 'textarea' },
        { key: 'Our recommendation', label: 'Our Recommendation', type: 'textarea' }
      ]
    },
    {
      title: 'Contact Information',
      icon: Globe,
      color: 'bg-gray-50 border-gray-200',
      fields: [
        { key: 'Website', label: 'Website URL', type: 'url' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <School className="h-6 w-6 mr-2 text-blue-600" />
            {editingCollege ? 'Edit College Details' : 'Add College for Comparison'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {formSections.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <div key={sectionIndex} className={`p-6 rounded-lg border-2 ${section.color}`}>
                <h4 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <IconComponent className="h-5 w-5 mr-2" />
                  {section.title}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field, fieldIndex) => (
                    <div 
                      key={fieldIndex} 
                      className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'select' ? (
                        <select
                          value={field.key.includes('.') ? 
                            formData.Colleges[field.key.split('.')[1]] || '' : 
                            formData[field.key] || ''
                          }
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          required={field.required}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((option, optionIndex) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={field.key.includes('.') ? 
                            formData.Colleges[field.key.split('.')[1]] || '' : 
                            formData[field.key] || ''
                          }
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          rows={3}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          required={field.required}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={field.key.includes('.') ? 
                            formData.Colleges[field.key.split('.')[1]] || '' : 
                            formData[field.key] || ''
                          }
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {editingCollege ? 'Update College' : 'Add College'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SingleCollegeCompareForm;