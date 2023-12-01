import React from 'react';
import { authRoles } from 'app/auth';

const ProfileConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/profile',
			component: React.lazy(() => import('.'))
		}
	]
};

export default ProfileConfig;
