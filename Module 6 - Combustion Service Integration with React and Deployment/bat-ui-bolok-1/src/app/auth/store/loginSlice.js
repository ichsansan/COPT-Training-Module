import { createSlice } from '@reduxjs/toolkit';
import jwtService from 'app/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { setUserData } from './userSlice';
import { changeEfficiency } from 'app/store/actions';
const TODAY = new Date();
const DATE = new Date();
const YESTERDAY = DATE.setDate(DATE.getDate() - 1);

export const submitLogin = ({ username, password }) => async dispatch => {
	await dispatch(loginRequest());
	return jwtService
		.signInWithEmailAndPassword(username, password)
		.then(user => {
			dispatch(
				setUserData({
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
				})
			);
			dispatch(
				changeEfficiency({
					filterStartDate: YESTERDAY,
					filterEndDate: TODAY,
					previousStartDate: '',
					previousEndDate: ''
				})
			);
			dispatch(
				showMessage({
					message: 'You are successfully logged in',
					variant: 'success'
				})
			);

			return dispatch(loginSuccess());
		})
		.catch(error => {
			if (error.errorlogin) {
				dispatch(
					showMessage({
						message: error.errorlogin,
						variant: 'error'
					})
				);
			}
			dispatch(loginError());

			return false;
		});
};

const initialState = {
	loading: false,
	success: false,
	error: null
};

const loginSlice = createSlice({
	name: 'auth/login',
	initialState,
	reducers: {
		loginRequest: (state, action) => {
			state.loading = true;
		},
		loginSuccess: (state, action) => {
			state.success = true;
			state.loading = false;
		},
		loginError: (state, action) => {
			state.loading = false;
			state.success = false;
			state.error = action.payload;
		}
	},
	extraReducers: {}
});

export const { loginSuccess, loginError, loginRequest } = loginSlice.actions;

export default loginSlice.reducer;
