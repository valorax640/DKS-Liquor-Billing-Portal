import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layouts/minimalLayout';
import PublicRoute from 'components/PublicRoute'; // ⬅️ updated

const LoginPage = Loadable(lazy(() => import('views/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('views/auth/Register')));

const PagesRoutes = {
  path: '/',
  element: <PublicRoute />, // ⬅️ apply public route guard
  children: [
    {
      path: '/',
      element: <MinimalLayout />,
      children: [
        {
          path: 'auth',
          children: [
            { path: 'login', element: <LoginPage /> },
            { path: 'register', element: <RegisterPage /> }
          ]
        }
      ]
    }
  ]
};

export default PagesRoutes;
