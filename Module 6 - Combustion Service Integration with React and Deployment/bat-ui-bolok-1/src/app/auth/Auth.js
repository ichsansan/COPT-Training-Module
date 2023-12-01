import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { bindActionCreators } from '@reduxjs/toolkit';
import jwtService from 'app/services/jwtService';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser, setUserData } from './store/userSlice';

class Auth extends Component {
	state = {
		waitAuthCheck: true
	};

	componentDidMount() {
		return Promise.all([
			// Comment the lines which you do not use
			this.jwtCheck()
		]).then(() => {
			this.setState({ waitAuthCheck: false });
		});
	}

	jwtCheck = () =>
		new Promise(resolve => {
			jwtService.on('onAutoLogin', () => {
				// this.props.showMessage({ message: 'Logging in with JWT' });

				/**
				 * Sign in and retrieve user data from Api
				 */
				jwtService
					.signInWithToken()
					.then(user => {
						this.props.setUserData({
							role: [user.role.roleName],
							data: {
								id: user.id,
								displayName: user.fullname,
								email: user.email,
								photoURL: user.imageUrl
								? `${process.env.REACT_APP_API_URL + user.imageUrl}?${Date.now() + Math.random()}`
									: 'assets/images/avatars/profile.jpg',
								settings: {
									layout: {
										style: 'layout2'
									},
									customScrollbars: true,
									theme: {
										main: 'defaultDark',
										navbar: 'defaultDark',
										toolbar: 'defaultDark',
										footer: 'defaultDark'
									}
								},
								shortcuts: []
							}
						});

						resolve();

						// this.props.showMessage({ message: 'Logged in with JWT' });
					})
					.catch(error => {
						this.props.showMessage({ message: error.response?.data?.message || error.message });

						resolve();
					});
			});

			jwtService.on('onAutoLogout', message => {
				if (message) {
					this.props.showMessage({ message });
				}

				this.props.logout();

				resolve();
			});

			jwtService.on('onNoAccessToken', () => {
				resolve();
			});

			jwtService.init();

			return Promise.resolve();
		});

	render() {
		return this.state.waitAuthCheck ? <FuseSplashScreen /> : <>{this.props.children}</>;
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			logout: logoutUser,
			setUserData,
			showMessage,
			hideMessage
		},
		dispatch
	);
}

export default connect(null, mapDispatchToProps)(Auth);
