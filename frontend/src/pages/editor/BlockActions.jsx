import React from 'react';

// --- Reusable Icon Components ---
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const AddToCartIcon = (props) => <Icon path="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.821-6.831a1.5 1.5 0 00-1.087-1.835H4.832" {...props} />;
const CustomizeIcon = (props) => <Icon path="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995a6.427 6.427 0 010 .255c0 .382.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.003-.827c.293-.24.438-.613-.438.995a6.427 6.427 0 010-.255c0-.382-.145-.755-.438-.995l-1.003-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.331-.183.581-.495-.645-.87l.213-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" {...props} />;


const BlockActions = ({ onAddToCart, onCustomize, isCustomizing }) => {
  return (
    <div className="flex items-center justify-end space-x-3">
      <button
        onClick={onCustomize}
        className={`flex items-center justify-center px-4 py-2 rounded-lg shadow-sm transition-all border ${
          isCustomizing 
            ? 'bg-gray-200 text-gray-800 border-gray-300' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        }`}
        title="Customize this block before adding"
      >
        <CustomizeIcon />
        <span className="ml-2 text-sm font-semibold">{isCustomizing ? 'Close' : 'Customize'}</span>
      </button>
      <button
        onClick={onAddToCart}
        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        title="Quick add and go to next section"
      >
        <AddToCartIcon />
        <span className="ml-2 text-sm font-semibold">Add to Cart</span>
      </button>
    </div>
  );
};

export default BlockActions;
