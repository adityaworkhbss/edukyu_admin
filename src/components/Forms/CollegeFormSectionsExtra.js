import { Plus, Trash2 } from 'lucide-react';

// Admission Process Section
export const AdmissionSection = ({ formData, addArrayItem, removeArrayItem, updateArrayItem }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Admission Process</h4>
    {formData.university_info.admission_process.map((step, index) => (
      <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Step Number</label>
            <input
              type="number"
              value={step.step || ''}
              onChange={(e) => updateArrayItem('university_info.admission_process', index, 'step', parseInt(e.target.value))}
              className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 text-sm"
              min="1"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={step.description || ''}
              onChange={(e) => updateArrayItem('university_info.admission_process', index, 'description', e.target.value)}
              rows={2}
              className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 text-sm"
              placeholder="Describe this admission step..."
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
          <input
            type="url"
            value={step.image || ''}
            onChange={(e) => updateArrayItem('university_info.admission_process', index, 'image', e.target.value)}
            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => removeArrayItem('university_info.admission_process', index)}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('university_info.admission_process', { step: formData.university_info.admission_process.length + 1, description: '', image: '' })}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add Admission Step
    </button>
  </div>
);

// Placement Section
export const PlacementSection = ({ formData, handleInputChange, addArrayItem, removeArrayItem, updateArrayItem }) => (
  <div className="bg-orange-50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Placement Information</h4>
    
    {/* Statistics */}
    <div className="mb-6">
      <h5 className="text-md font-semibold text-gray-700 mb-3">Statistics</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Average Package</label>
          <input
            type="text"
            name="university_info.placement.statistics.average_package"
            value={formData.university_info.placement.statistics.average_package}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="Rs 4,76,000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Highest Package</label>
          <input
            type="text"
            name="university_info.placement.statistics.highest_package"
            value={formData.university_info.placement.statistics.highest_package}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="Rs 10,50,000"
          />
        </div>
      </div>
    </div>

    {/* Partners */}
    <div className="mb-6">
      <h5 className="text-md font-semibold text-gray-700 mb-3">Placement Partners (Logo URLs)</h5>
      {formData.university_info.placement.partners.map((partner, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <input
            type="url"
            value={partner}
            onChange={(e) => updateArrayItem('university_info.placement.partners', index, null, e.target.value)}
            className="flex-1 px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="https://example.com/company-logo.png"
          />
          <button
            type="button"
            onClick={() => removeArrayItem('university_info.placement.partners', index)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('university_info.placement.partners', '')}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Partner
      </button>
    </div>

    {/* Benefits */}
    <div>
      <h5 className="text-md font-semibold text-gray-700 mb-3">Placement Benefits</h5>
      {formData.university_info.placement.benefits.map((benefit, index) => (
        <div key={index} className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={benefit}
            onChange={(e) => updateArrayItem('university_info.placement.benefits', index, null, e.target.value)}
            className="flex-1 px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
            placeholder="300+ Hiring Partners"
          />
          <button
            type="button"
            onClick={() => removeArrayItem('university_info.placement.benefits', index)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem('university_info.placement.benefits', '')}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Benefit
      </button>
    </div>
  </div>
);

// FAQs Section
export const FaqsSection = ({ formData, addArrayItem, removeArrayItem, updateArrayItem }) => (
  <div className="bg-teal-50 p-4 rounded-lg">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h4>
    {formData.university_info.faqs.map((faq, index) => (
      <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Question</label>
            <input
              type="text"
              value={faq.question || ''}
              onChange={(e) => updateArrayItem('university_info.faqs', index, 'question', e.target.value)}
              className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
              placeholder="Enter question..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              value={faq.answer || ''}
              onChange={(e) => updateArrayItem('university_info.faqs', index, 'answer', e.target.value)}
              rows={3}
              className="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-sm"
              placeholder="Enter answer..."
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => removeArrayItem('university_info.faqs', index)}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => addArrayItem('university_info.faqs', { question: '', answer: '' })}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add FAQ
    </button>
  </div>
);