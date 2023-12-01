import React from 'react';
import { authRoles } from 'app/auth';

const CombustionConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/combustion-frame',
      component: React.lazy(() => import('../Combustion')),
    },
  ],
};

export default CombustionConfig;
