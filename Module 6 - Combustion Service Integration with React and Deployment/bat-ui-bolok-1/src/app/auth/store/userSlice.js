import history from '@history';
import _ from '@lodash';
import { createSlice } from '@reduxjs/toolkit';
import jwtService from 'app/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setDefaultSettings, setInitialSettings } from 'app/store/fuse/settingsSlice';

export const setUserData = user => async (dispatch, getState) => {
	/*
		You can redirect the logged-in user to a specific route depending on his role
		 */

	history.location.state = {
		redirectUrl: user.redirectUrl // for example 'apps/academy'
	};

	/*
	Set User Settings
	 */
	dispatch(setDefaultSettings(user.data.settings));

	dispatch(setUser(user));
};

export const updateUserSettings = settings => async (dispatch, getState) => {
	const oldUser = getState().auth.user;
	const user = _.merge({}, oldUser, { data: { settings } });

	dispatch(updateUserData(user));

	return dispatch(setUserData(user));
};

export const updateUserShortcuts = shortcuts => async (dispatch, getState) => {
	const { user } = getState().auth;
	const newUser = {
		...user,
		data: {
			...user.data,
			shortcuts
		}
	};

	dispatch(updateUserData(user));

	return dispatch(setUserData(newUser));
};

export const logoutUser = () => async (dispatch, getState) => {
	const { user } = getState().auth;

	if (!user.role || user.role.length === 0) {
		// is guest
		return null;
	}

	history.push({
		pathname: '/login'
	});

	jwtService.logout();

	dispatch(setInitialSettings());
	dispatch(
		showMessage({
			message: 'You are successfully logged out',
			variant: 'success'
		})
	);

	return dispatch(userLoggedOut());
};

export const updateUserData = user => async (dispatch, getState) => {
	if (!user.role || user.role.length === 0) {
		// is guest
		return;
	}

	jwtService
		.updateUserData(user)
		.then(() => {
			dispatch(showMessage({ message: 'User data saved with api' }));
		})
		.catch(error => {
			dispatch(showMessage({ message: error.response?.data?.message || error.message }));
		});
};

const initialState = {
	role: [], // guest
	data: {
		displayName: 'User',
		photoURL: 'assets/images/avatars/profile.jpg',
		email: 'johndoe@withinpixels.com',
		shortcuts: ['calendar', 'mail', 'contacts', 'todo']
	}
};

const userSlice = createSlice({
	name: 'auth/user',
	initialState,
	reducers: {
		setUser: (state, action) => action.payload,
		userLoggedOut: (state, action) => initialState
	},
	extraReducers: {}
});

export const { setUser, userLoggedOut } = userSlice.actions;

export default userSlice.reducer;
