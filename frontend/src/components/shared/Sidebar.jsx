import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../Spinner';
import { LogOut } from 'lucide-react';

// --- INLINE SVG ICONS ---
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const HomeIcon = (props) => <Icon path="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" {...props} />;
const AboutUsIcon = (props) => <Icon path="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" {...props} />;
const ServicesIcon = (props) => <Icon path="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995a6.427 6.427 0 010 .255c0 .382.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.003-.827c.293-.24.438.613.438.995a6.427 6.427 0 010-.255c0-.382-.145-.755-.438-.995l-1.003-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075.124.072-.044.146-.087.22-.127.331-.183.581-.495.645-.87l.213-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" {...props} />;
const ContactIcon = (props) => <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" {...props} />;
const BlogIcon = (props) => <Icon path="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" {...props} />;
const DefaultIcon = (props) => <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" {...props} />;

const pageIcons = {
  home: HomeIcon,
  'about us': AboutUsIcon,
  services: ServicesIcon,
  contact: ContactIcon,
  blog: BlogIcon,
};

function Sidebar({ isCollapsed, onMouseEnter, onMouseLeave }) {
  const { pages, isInitialLoading, apiError, currentPage, handleSetCurrentPage } = useEditor();
  const { user, logout } = useAuth();

  const renderContent = () => {
    if (isInitialLoading) {
      return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    if (apiError) {
      return <div className="p-4 text-red-300 text-xs bg-red-900 bg-opacity-50 rounded m-2"><strong>Error:</strong><br/> {apiError}</div>;
    }
    
    if (!Array.isArray(pages) || pages.length === 0) {
      return <div className="p-4 text-gray-400 text-xs">No pages found. You can add pages in the admin panel.</div>;
    }

    const filteredPages = pages.filter(page => page.name.toLowerCase() !== 'products');

    return (
      <ul className="py-2">
        {filteredPages.map(page => {
          const pageNameLower = page.name.toLowerCase();
          const IconComponent = pageIcons[pageNameLower] || DefaultIcon;
          
          return (
            <li key={page.id}>
              <button
                title={page.name}
                onClick={() => handleSetCurrentPage(page)}
                className={`w-full flex items-center h-14 px-5 transition-colors capitalize ${currentPage === page.name ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <IconComponent className="w-6 h-6 flex-shrink-0" />
                <span className={`ml-4 transition-opacity whitespace-nowrap duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                  {page.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside
      className="h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out z-50 shadow-lg"
      style={{ width: isCollapsed ? '5rem' : '16rem' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4 flex items-center justify-between h-16 border-b border-gray-800 flex-shrink-0 px-5">
        <h2 className={`text-xl font-bold transition-opacity whitespace-nowrap duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          Pages
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {renderContent()}
      </nav>

      {/* User info and Logout in sidebar bottom */}
      <div className="p-3 border-t border-gray-800 flex-shrink-0">
        <button
          onClick={logout}
          title="Sign out"
          className="w-full flex items-center h-11 px-3 text-red-400 hover:bg-red-950/40 rounded-xl transition-colors text-xs font-semibold"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className={`ml-3 transition-opacity whitespace-nowrap duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
