import { authRoles } from 'app/auth';
import StaffRoleExample from './StaffRoleExample';

const StaffRoleExampleConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.staff, // ['ADMIN','staff']
	routes: [
		{
			path: '/auth/staff-role-example',
			component: StaffRoleExample
		}
	]
};

export default StaffRoleExampleConfig;
