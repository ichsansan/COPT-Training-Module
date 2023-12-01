import { authRoles } from 'app/auth';
import React from 'react';

const SootblowConfig = {
  settings: {
    layout: {
      config: {
        navbar: false,
      },
    },
  },
  auth: authRoles.admin,
  routes: [
    {
      path: '/sootblow-frame',
      component: React.lazy(() => import('../Sootblow')),
    },
  ],
};

export default SootblowConfig;
