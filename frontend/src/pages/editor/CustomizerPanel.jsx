import React, { useEffect, useState } from 'react';
import { useEditor } from '../../contexts/EditorContext.jsx';

// --- Reusable Icon Components ---
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);
const PreviewIcon = (props) => <Icon path="M2.036 12.322a1.012 1.012 0 010-.639l4.43-7.087a1.012 1.012 0 011.586 0l4.43 7.087c.23.368.23.882 0 1.25l-4.43 7.087a1.012 1.012 0 01-1.586 0l-4.43-7.087zM12 9a3 3 0 100 6 3 3 0 000-6z" {...props} />;
const AddToCartIcon = (props) => <Icon path="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.821-6.831a1.5 1.5 0 00-1.087-1.835H4.832" {...props} />;

// --- Form Field Definitions ---
const fieldConfig = {
  Header: [
    { name: 'logoUrl', label: 'Logo URL', type: 'text' },
    { name: 'companyName', label: 'Company Name', type: 'text' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
    { name: 'emailAddress', label: 'Email Address', type: 'text' },
    { name: 'services', label: 'Nav Links (comma-separated)', type: 'textarea' },
  ],
  Hero: [
    { name: 'heading', label: 'Heading', type: 'text' },
    { name: 'subheading', label: 'Subheading', type: 'textarea' },
    { name: 'ctaText', label: 'Button Text', type: 'text' },
    { name: 'image', label: 'Background Image URL', type: 'text' },
  ],
};

const InlineCustomizer = () => {
  const { editingBlock, updateTempContent, saveCustomizationAndProceed } = useEditor();
  // Local state to manage form inputs without causing re-renders on every keystroke
  const [localContent, setLocalContent] = useState({});

  useEffect(() => {
    // Sync local state when the block being edited changes
    if (editingBlock) {
      setLocalContent(editingBlock.tempContent);
    }
  }, [editingBlock]);

  // This component will not render if editingBlock is null, so no need for a null check here.
  const { blockDef } = editingBlock;
  const fields = fieldConfig[blockDef.category] || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Special handling for the services array
    const newContent = name === 'services'
      ? { ...localContent, services: value.split(',').map(s => s.trim()) }
      : { ...localContent, [name]: value };
    setLocalContent(newContent);
  };

  const handlePreview = () => {
    // Push the local changes to the global context to update the live preview
    updateTempContent(localContent);
  };

  const handleSave = () => {
    // Ensure the final state is in the context before saving
    updateTempContent(localContent);
    saveCustomizationAndProceed();
  };

  const renderField = (field) => {
    const value = field.name === 'services' && Array.isArray(localContent[field.name])
      ? localContent[field.name].join(', ')
      : localContent[field.name] || '';

    const commonProps = {
      id: field.name, name: field.name, value, onChange: handleInputChange,
      className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
    };

    return (
      <div key={field.name} className="mb-4">
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
        {field.type === 'textarea' ? <textarea {...commonProps} rows={3} /> : <input type={field.type} {...commonProps} />}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 border-x border-b border-gray-200 rounded-b-lg p-6 transition-all duration-500 ease-in-out">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Customize {blockDef.name}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {fields.length > 0 ? fields.map(renderField) : <p>No customizable fields for this block.</p>}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end items-center space-x-3">
        <button onClick={handlePreview} className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <PreviewIcon className="mr-2" />
          Update Preview
        </button>
        <button onClick={handleSave} className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <AddToCartIcon className="mr-2" />
          Add & Proceed
        </button>
      </div>
    </div>
  );
};

export default InlineCustomizer;
