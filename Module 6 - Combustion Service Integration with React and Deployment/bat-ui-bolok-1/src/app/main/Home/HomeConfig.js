import { authRoles } from 'app/auth';
import Home from './index';

const HomeConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/home',
			component: Home
		}
	]
};

export default HomeConfig;
