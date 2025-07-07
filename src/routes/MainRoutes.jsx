import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';
import PrivateRoute from 'components/PrivateRoute'; // ⬅️ updated

const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));
const SamplePage = Loadable(lazy(() => import('views/pages/Billing')));
const UtilsTypography = Loadable(lazy(() => import('views/components/Typography')));

const MainRoutes = {
  path: '/',
  element: <PrivateRoute />, // ⬅️ apply private route guard
  children: [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '', element: <DashboardDefault /> },
        { path: 'dashboard/default', element: <DashboardDefault /> },
        { path: 'sample-page', element: <SamplePage /> },
        {
          path: 'components',
          children: [
            { path: 'typography', element: <UtilsTypography /> }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
