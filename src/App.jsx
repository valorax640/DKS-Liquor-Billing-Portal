import React, { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

// project imports
import ThemeCustomization from './themes';
import router from 'routes';
import SessionLoggedOutDialog from 'components/SessionLogOut';
import { setUnauthorizedHandler } from 'services/apiService';

function App() {
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  useEffect(() => {
    // Register once when app mounts
    setUnauthorizedHandler(() => setShowSessionDialog(true));
  }, []);

  return (
    <ThemeCustomization>
      <RouterProvider router={router} />
      <SessionLoggedOutDialog
        open={showSessionDialog}
        onClose={() => setShowSessionDialog(false)}
      />
    </ThemeCustomization>
  );
}

export default App;
