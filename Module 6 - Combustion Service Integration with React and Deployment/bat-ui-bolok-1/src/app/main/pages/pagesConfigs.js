import LoginPageConfig from './auth/login/LoginPageConfig';
import Error401PageConfig from './errors/401/Error401PageConfig';
import Error404PageConfig from './errors/404/Error404PageConfig';
import Error500PageConfig from './errors/500/Error500PageConfig';

const pagesConfigs = [LoginPageConfig, Error404PageConfig, Error500PageConfig, Error401PageConfig];

export default pagesConfigs;
