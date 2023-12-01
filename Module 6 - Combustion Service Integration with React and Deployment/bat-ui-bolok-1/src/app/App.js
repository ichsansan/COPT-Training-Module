import MomentUtils from '@date-io/moment';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import history from '@history';
import {
  createGenerateClassName,
  jssPreset,
  StylesProvider,
} from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { create } from 'jss';
import jssExtend from 'jss-plugin-extend';
import rtl from 'jss-rtl';
import React from 'react';
import Provider from 'react-redux/es/components/Provider';
import { Router } from 'react-router-dom';
import axios from 'axios';
import AppContext from './AppContext';
import { Auth } from './auth';
import routes from './fuse-configs/routesConfig';
import store from './store';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const createHost = require('cross-domain-storage/host');

const jss = create({
  ...jssPreset(),
  plugins: [...jssPreset().plugins, jssExtend(), rtl()],
  insertionPoint: document.getElementById('jss-insertion-point'),
});

const generateClassName = createGenerateClassName();

createHost([
  {
    origin: process.env.REACT_APP_ORIGIN_URL,
    allowedMethods: ['get', 'set', 'remove'],
  },
  {
    origin: process.env.REACT_APP_SOKET_SECURE_URL,
    allowedMethods: ['get', 'set'],
  },
  {
    origin: process.env.REACT_APP_SOKET_PROD_URL,
    allowedMethods: ['get', 'set'],
  },
  {
    origin: process.env.REACT_APP_SOKET_DEV_URL,
    allowedMethods: ['get', 'set'],
  },
  {
    origin: process.env.REACT_APP_GUEST_DEV_URL,
    allowedMethods: ['set', 'get'],
  },
  {
    origin: process.env.REACT_APP_SOKET_URL,
    allowedMethods: ['set', 'get'],
  },
]);

const App = () => {
  return (
    <AppContext.Provider
      value={{
        routes,
      }}
    >
      <StylesProvider jss={jss} generateClassName={generateClassName}>
        <Provider store={store}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Auth>
              <Router history={history}>
                <FuseAuthorization>
                  <FuseTheme>
                    <FuseLayout />
                  </FuseTheme>
                </FuseAuthorization>
              </Router>
            </Auth>
          </MuiPickersUtilsProvider>
        </Provider>
      </StylesProvider>
    </AppContext.Provider>
  );
};

export default App;
