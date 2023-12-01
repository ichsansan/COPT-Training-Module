import { authRoles } from 'app/auth';
import React from 'react';

const SootblowConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/sootblow',
			component: React.lazy(() => import('.'))
		}
	]
};

export default SootblowConfig;
