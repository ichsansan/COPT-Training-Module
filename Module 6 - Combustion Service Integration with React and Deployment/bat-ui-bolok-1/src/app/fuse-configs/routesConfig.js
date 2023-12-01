import React from 'react';
import FuseUtils from '@fuse/utils';
import CombustionConfig from 'app/main/Combustion/CombustionConfig';
import CombustionFrameConfig from 'app/main/CombustionFrame/CombustionConfig';
import HomeConfig from 'app/main/Home/HomeConfig';
import HomeFrameConfig from 'app/main/HomeFrame/HomeConfig';
import LoginConfig from 'app/main/Login/LoginConfig';
import ProfileConfig from 'app/main/Profile/ProfileConfig';
import SootblowConfig from 'app/main/Sootblow/SootblowConfig';
import SootblowFrameConfig from 'app/main/SootblowFrame/SootblowConfig';
import authRoleExamplesConfigs from 'app/main/auth/authRoleExamplesConfigs';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import pagesConfigs from 'app/main/pages/pagesConfigs';
import { Redirect } from 'react-router-dom';

const routeConfigs = [
  ...pagesConfigs,
  ...authRoleExamplesConfigs,
  HomeConfig,
  HomeFrameConfig,
  ProfileConfig,
  SootblowFrameConfig,
  SootblowConfig,
  CombustionConfig,
  CombustionFrameConfig,
  LogoutConfig,
  LoginConfig,
  LogoutConfig,
];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['ADMIN','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/home" />,
  },
  {
    component: () => <Redirect to="/errors/error-404" />,
  },
];

export default routes;
