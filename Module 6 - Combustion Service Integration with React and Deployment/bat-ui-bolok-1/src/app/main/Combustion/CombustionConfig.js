import React from 'react';
import { authRoles } from 'app/auth';

const CombustionConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/combustion',
      component: React.lazy(() => import('.')),
    },
  ],
};

export default CombustionConfig;
