// src/pages/dashboard/AppContent.jsx (Updated)
import React, { useState, useEffect, useCallback } from 'react';
import EditorLayout from '../editor/EditorLayout.jsx';
// --- THIS IS THE FIX ---
// The paths have been corrected to point directly to the components folder.
import AlertDialog from '../../components/AlertDialog.jsx';
import Spinner from '../../components/Spinner.jsx';

/**
 * @file AppContent.jsx
 * @brief The main content area of the application, acting as a dashboard.
 *
 * This component now fetches all necessary data and passes it down to the
 * new EditorLayout, which controls the three-column UI.
 */
function AppContent() {
  const [allBlocks, setAllBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showAlert = useCallback((message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 3000);
  }, []);

  const forceRefresh = useCallback(() => setRefreshTrigger(t => t + 1), []);

  useEffect(() => {
    const fetchAllBlocks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/get_blocks.php');
        if (!response.ok) {
          throw new Error(`Network response was not ok`);
        }
        const data = await response.json();
        if (data.success) {
          setAllBlocks(data.data);
        } else {
          setError(data.message || "Failed to fetch all blocks");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllBlocks();
  }, [refreshTrigger]);

  if (isLoading && allBlocks.length === 0) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-red-100 flex items-center justify-center text-red-700 p-8">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <EditorLayout
        allBlocks={allBlocks}
        showAlert={showAlert}
        forceRefresh={forceRefresh}
      />
      <AlertDialog message={alertMessage} onClose={() => setAlertMessage(null)} />
    </>
  );
}

export default AppContent;