'use client';

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const ComprehensiveCompareForm = ({ isOpen, onClose, onSubmit, editingComparison }) => {
  const [formData, setFormData] = useState(() => {
    if (editingComparison) return editingComparison;
    
    return {
      colleges: {} // Will store college data like: {"Sikkim Manipal University": {...}}
    };
  });

  // Deep clone helper for proper state management
  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that at least one college is added
    if (Object.keys(formData.colleges).length === 0) {
      alert('Please add at least one college for comparison');
      return;
    }
    
    onSubmit(formData);
  };

  const addCollege = () => {
    const collegeName = prompt('Enter College/University Name:');
    if (collegeName && collegeName.trim()) {
      const newCollegeData = {
        "Colleges": {
          "text": collegeName.trim(),
          "img": ""
        },
        "Abbreviation": "",
        "Institute Type": "Private",
        "Establishment": "",
        "About": "",
        "Accrediation": "",
        "UGC": "Yes",
        "AICTE": "Yes",
        "DEB": "Yes",
        "Duration": "",
        "Learning Methodolgy": "",
        "Fees": "",
        "Programs": "",
        "Specialisation": "",
        "Review": "",
        "Eligibility": "",
        "Any Issue": "",
        "Our recommendation": "",
        "Website": ""
      };

      setFormData(prev => ({
        ...prev,
        colleges: {
          ...prev.colleges,
          [collegeName.trim()]: newCollegeData
        }
      }));
    }
  };

  const removeCollege = (collegeName) => {
    setFormData(prev => {
      const newColleges = { ...prev.colleges };
      delete newColleges[collegeName];
      return {
        ...prev,
        colleges: newColleges
      };
    });
  };

  const updateCollegeField = (collegeName, field, value) => {
    setFormData(prev => {
      const newData = deepClone(prev);
      if (field === 'text') {
        newData.colleges[collegeName].Colleges.text = value;
      } else if (field === 'img') {
        newData.colleges[collegeName].Colleges.img = value;
      } else {
        newData.colleges[collegeName][field] = value;
      }
      return newData;
    });
  };

  const renameCollege = (oldName, newName) => {
    if (newName && newName.trim() && newName !== oldName) {
      setFormData(prev => {
        const newColleges = { ...prev.colleges };
        newColleges[newName.trim()] = { ...newColleges[oldName] };
        newColleges[newName.trim()].Colleges.text = newName.trim();
        delete newColleges[oldName];
        return {
          ...prev,
          colleges: newColleges
        };
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {editingComparison ? 'Edit Comparison' : 'Create New Comparison'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header with Add College Button */}
          <div className="flex justify-between items-center border-b pb-4">
            <h4 className="text-md font-semibold text-gray-800">
              Colleges in Comparison ({Object.keys(formData.colleges).length})
            </h4>
            <button
              type="button"
              onClick={addCollege}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add College
            </button>
          </div>

          {/* Colleges Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(formData.colleges).map(([collegeName, collegeData]) => (
              <div key={collegeName} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                {/* College Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={collegeData.Colleges.text}
                      onChange={(e) => updateCollegeField(collegeName, 'text', e.target.value)}
                      onBlur={(e) => renameCollege(collegeName, e.target.value)}
                      className="text-lg font-semibold bg-transparent border-none p-0 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                      placeholder="College Name"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCollege(collegeName)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* College Image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">College Image URL</label>
                  <input
                    type="url"
                    value={collegeData.Colleges.img}
                    onChange={(e) => updateCollegeField(collegeName, 'img', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/college-logo.png"
                  />
                </div>

                {/* College Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Abbreviation</label>
                    <input
                      type="text"
                      value={collegeData.Abbreviation}
                      onChange={(e) => updateCollegeField(collegeName, 'Abbreviation', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="SMU"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute Type</label>
                    <select
                      value={collegeData["Institute Type"]}
                      onChange={(e) => updateCollegeField(collegeName, 'Institute Type', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                      <option value="Government">Government</option>
                      <option value="Deemed">Deemed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Establishment Year</label>
                    <input
                      type="text"
                      value={collegeData.Establishment}
                      onChange={(e) => updateCollegeField(collegeName, 'Establishment', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="1995"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation</label>
                    <input
                      type="text"
                      value={collegeData.Accrediation}
                      onChange={(e) => updateCollegeField(collegeName, 'Accrediation', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="NAAC A+, NIRF, UGC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UGC Approved</label>
                    <select
                      value={collegeData.UGC}
                      onChange={(e) => updateCollegeField(collegeName, 'UGC', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">AICTE Approved</label>
                    <select
                      value={collegeData.AICTE}
                      onChange={(e) => updateCollegeField(collegeName, 'AICTE', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DEB Approved</label>
                    <select
                      value={collegeData.DEB}
                      onChange={(e) => updateCollegeField(collegeName, 'DEB', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={collegeData.Duration}
                      onChange={(e) => updateCollegeField(collegeName, 'Duration', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="2-5 years depending on the program"
                    />
                  </div>
                </div>

                {/* Full Width Fields */}
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                    <textarea
                      value={collegeData.About}
                      onChange={(e) => updateCollegeField(collegeName, 'About', e.target.value)}
                      rows={2}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Brief description about the college"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Learning Methodology</label>
                    <input
                      type="text"
                      value={collegeData["Learning Methodolgy"]}
                      onChange={(e) => updateCollegeField(collegeName, 'Learning Methodolgy', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Online and Distance Learning"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
                    <input
                      type="text"
                      value={collegeData.Fees}
                      onChange={(e) => updateCollegeField(collegeName, 'Fees', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Approximately ₹30,000 - ₹1,50,000 per year"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Programs Offered</label>
                    <input
                      type="text"
                      value={collegeData.Programs}
                      onChange={(e) => updateCollegeField(collegeName, 'Programs', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="MBA, MCA, MA, M.Com, BA, B.Com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialisation</label>
                    <input
                      type="text"
                      value={collegeData.Specialisation}
                      onChange={(e) => updateCollegeField(collegeName, 'Specialisation', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Management, IT, Healthcare, Engineering"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                    <textarea
                      value={collegeData.Review}
                      onChange={(e) => updateCollegeField(collegeName, 'Review', e.target.value)}
                      rows={2}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Well-rated for its flexible programs and student support"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                    <textarea
                      value={collegeData.Eligibility}
                      onChange={(e) => updateCollegeField(collegeName, 'Eligibility', e.target.value)}
                      rows={2}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="For Certificate: 10+2, For MBA: Graduation, For BBA: 10+2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Any Issues</label>
                    <textarea
                      value={collegeData["Any Issue"]}
                      onChange={(e) => updateCollegeField(collegeName, 'Any Issue', e.target.value)}
                      rows={2}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Limited access to hands-on lab sessions for certain programs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Our Recommendation</label>
                    <textarea
                      value={collegeData["Our recommendation"]}
                      onChange={(e) => updateCollegeField(collegeName, 'Our recommendation', e.target.value)}
                      rows={2}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Recommended for students seeking flexible learning options with quality education"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={collegeData.Website}
                      onChange={(e) => updateCollegeField(collegeName, 'Website', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="https://smu.onlinemanipal.com/"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {Object.keys(formData.colleges).length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No colleges added</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding colleges to compare.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={addCollege}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First College
                </button>
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
              {editingComparison ? 'Update' : 'Create'} Comparison
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComprehensiveCompareForm;