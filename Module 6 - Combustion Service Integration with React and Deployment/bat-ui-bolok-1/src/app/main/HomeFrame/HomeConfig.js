import { authRoles } from 'app/auth';
import React from 'react';

const HomeConfig = {
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
      path: '/home-frame',
      component: React.lazy(() => import('../Home')),
    },
  ],
};

export default HomeConfig;
