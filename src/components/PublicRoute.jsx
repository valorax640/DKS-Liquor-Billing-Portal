// components/PublicRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('dks_liquor_token');
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
