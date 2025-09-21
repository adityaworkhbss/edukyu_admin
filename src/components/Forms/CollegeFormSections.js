import { Plus, Trash2 } from 'lucide-react';

// Accreditations Section
export const AccreditationsSection = ({ formData, setFormData, addArrayItem, removeArrayItem, updateArrayItem }) => (
  <div className="bg-yellow-50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Accreditations</h4>
    {formData.university_info.accreditations.map((accreditation, index) => (
      <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={accreditation.name || ''}
              onChange={(e) => updateArrayItem('university_info.accreditations', index, 'name', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              placeholder="NAAC, AICTE, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={accreditation.image || ''}
              onChange={(e) => updateArrayItem('university_info.accreditations', index, 'image', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              placeholder="https://example.com/accreditation.png"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => removeArrayItem('university_info.accreditations', index)}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('university_info.accreditations', { name: '', image: '' })}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Accreditation
    </button>
  </div>
);

// Courses Section
export const CoursesSection = ({ 
  formData, 
  setFormData, 
  addArrayItem, 
  removeArrayItem, 
  updateArrayItem,
  addNestedArrayItem,
  removeNestedArrayItem,
  updateNestedArrayItem
}) => (
  <div className="bg-red-50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Courses</h4>
    {formData.university_info.courses.map((course, index) => (
      <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input
              type="text"
              value={course.name || ''}
              onChange={(e) => updateArrayItem('university_info.courses', index, 'name', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Online MBA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={course.image || ''}
              onChange={(e) => updateArrayItem('university_info.courses', index, 'image', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input
              type="text"
              value={course.duration || ''}
              onChange={(e) => updateArrayItem('university_info.courses', index, 'duration', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="2 years"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={course.type || ''}
              onChange={(e) => updateArrayItem('university_info.courses', index, 'type', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            >
              <option value="">Select Type</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
              <option value="Diploma/Certificate">Diploma/Certificate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Original Fees</label>
            <input
              type="text"
              value={course.fees?.original || ''}
              onChange={(e) => {
                const fees = course.fees || {};
                fees.original = e.target.value;
                updateArrayItem('university_info.courses', index, 'fees', fees);
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="1,69,200"
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
                updateArrayItem('university_info.courses', index, 'fees', fees);
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="1,52,280"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={course.description || ''}
            onChange={(e) => updateArrayItem('university_info.courses', index, 'description', e.target.value)}
            rows={2}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        
        {/* Specializations */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
          {(course.specializations || []).map((spec, specIndex) => (
            <div key={specIndex} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={spec}
                onChange={(e) => updateNestedArrayItem('university_info.courses', index, 'specializations', specIndex, e.target.value)}
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Finance, Marketing, etc."
              />
              <button
                type="button"
                onClick={() => removeNestedArrayItem('university_info.courses', index, 'specializations', specIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addNestedArrayItem('university_info.courses', index, 'specializations', '')}
            className="text-sm text-red-600 hover:text-red-800"
          >
            + Add Specialization
          </button>
        </div>
        
        <button
          type="button"
          onClick={() => removeArrayItem('university_info.courses', index)}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('university_info.courses', {
        name: '', image: '', duration: '', fees: { original: '', discounted: '' },
        description: '', type: '', specializations: []
      })}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Course
    </button>
  </div>
);

// Benefits Section
export const BenefitsSection = ({ formData, addArrayItem, removeArrayItem, updateArrayItem }) => (
  <div className="bg-indigo-50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Benefits</h4>
    {formData.university_info.benefits.map((benefit, index) => (
      <div key={index} className="flex items-center space-x-2 mb-2">
        <textarea
          value={benefit}
          onChange={(e) => updateArrayItem('university_info.benefits', index, null, e.target.value)}
          rows={2}
          className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter benefit description..."
        />
        <button
          type="button"
          onClick={() => removeArrayItem('university_info.benefits', index)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('university_info.benefits', '')}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Benefit
    </button>
  </div>
);

// Degree Section
export const DegreeSection = ({ formData, handleInputChange, addArrayItem, removeArrayItem, updateArrayItem }) => (
  <div className="bg-pink-50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Degree Information</h4>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="university_info.degree.description"
          value={formData.university_info.degree.description}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Certificate Image URL</label>
        <input
          type="url"
          name="university_info.degree.certificate_image"
          value={formData.university_info.degree.certificate_image}
          onChange={handleInputChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
        />
      </div>
      
      {/* Degree Highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
        {formData.university_info.degree.highlights.map((highlight, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={highlight}
              onChange={(e) => updateArrayItem('university_info.degree.highlights', index, null, e.target.value)}
              className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('university_info.degree.highlights', index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('university_info.degree.highlights', '')}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Highlight
        </button>
      </div>
    </div>

    {/* Degree Sample Section */}
    <div className="mt-6 pt-6 border-t">
      <h5 className="text-md font-semibold text-gray-700 mb-3">Degree Sample</h5>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sample Image URL</label>
          <input
            type="url"
            name="university_info.degree_sample.image"
            value={formData.university_info.degree_sample.image}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sample Description</label>
          <textarea
            name="university_info.degree_sample.description"
            value={formData.university_info.degree_sample.description}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>
        
        {/* Degree Sample Highlights */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sample Highlights</label>
          {formData.university_info.degree_sample.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => updateArrayItem('university_info.degree_sample.highlights', index, null, e.target.value)}
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => removeArrayItem('university_info.degree_sample.highlights', index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('university_info.degree_sample.highlights', '')}
            className="text-sm text-pink-600 hover:text-pink-800"
          >
            + Add Sample Highlight
          </button>
        </div>
      </div>
    </div>
  </div>
);