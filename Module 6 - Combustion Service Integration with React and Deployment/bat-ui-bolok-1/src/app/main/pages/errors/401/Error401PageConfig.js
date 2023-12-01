import React from 'react';

const Error401PageConfig = {
	settings: {
        layout: {
			config: {
				navbar: {
					display: false
				},
			}
		}
	},
	routes: [
		{
			path: '/errors/error-401',
			component: React.lazy(() => import('./Error401Page'))
		}
	]
};

export default Error401PageConfig;
