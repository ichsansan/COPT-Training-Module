import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
require('dotenv').config();
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response?.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/api/auth/register', data).then(response => {
				if (response.data.user) {
					this.setSession(response.data.access_token);
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	signInWithEmailAndPassword = (username, password) => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.REACT_APP_API_URL}/service/bat/auth`, {
					data: {
						username,
						password
					},
					headers: {
						Accept: 'application/json',
						'Access-Control-Allow-Origin': 'Authorization',
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest'
					},
					mode: 'no-cors',
					credentials: true,
					crossdomain: true
				})
				.then(
					response => {
						if (response.data.user) {
							this.setSession(response.data.token);
							resolve(response.data.user);
						} else {
							reject(response.data.message);
						}
					},
					error => {
						return Promise.reject(error.response);
					}
				)
				.catch(error => {
					reject({
						errorlogin: (error && error.data.message) || 'Oops... Something went wrong with server'
					});
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.get(`${process.env.REACT_APP_API_URL}/service/bat/validate/access-token`, {
					headers: {
						Authorization: `Bearer ${this.getAccessToken()}`,
						Accept: 'application/json',
						'Access-Control-Allow-Origin': 'Authorization',
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest'
					},
					mode: 'no-cors',
					credentials: true,
					crossdomain: true
				})
				.then(response => {
					if (response.data.object.user) {
						this.setSession(this.getAccessToken());
						resolve(response.data.object.user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					if (error?.response?.status === 401) {
						reject(new Error('Unregistered user.'));
						window.location.assign(`/errors/error-401`);
						return this.logout();
					}
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = access_token => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}

		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}
		
		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};
}

const instance = new JwtService();

export default instance;