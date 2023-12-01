import {
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Grid,
	IconButton,
	InputAdornment,
	Switch,
	TextField,
	Typography
} from '@material-ui/core';
import Confirmation from './Confirmation';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack, CancelOutlined, Visibility, VisibilityOff } from '@material-ui/icons';
import { changeProfile, updateUserPassword, updatePhotoProfile } from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import { truncateFilename } from 'helpers';
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
	saveButton: {
		backgroundColor: '#1976d2',
		color: '#FFF',
		'&:hover': {
			backgroundColor: '#21619e'
		}
	},
	dialogPaper: {
		maxHeight: '100vh'
	}
}));

const Profile = ({ closeProfileHandler, showProfile }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [loading, setLoading] = useState(false);

	const [showChangeProfilePicture, setShowChangeProfilePicture] = useState(false);
	const [openConfirmation, setOpenConfirmation] = useState(false);

	const [errorNewPassword, setErrorNewPassword] = useState(false);
	const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

	const newPasswordRef = useRef(null);
	const confirmPasswordRef = useRef(null);
	const photoFileRef = useRef(null);

	const user = useSelector(({ auth }) => auth.user);
	const profileReducer = useSelector(state => state.profileReducer);

	const { photoFile, postLoading } = profileReducer;

	const changePasswordHandler = () => {
		setShowChangePassword(!showChangePassword);
	};

	const showNewPasswordHandler = () => {
		setShowNewPassword(!showNewPassword);
	};

	const showConfirmPasswordHandler = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const updatePasswordHandler = async () => {
		await setLoading(true);
		if (newPassword === '' && confirmPassword === '') {
			await newPasswordRef?.current?.focus();
			await dispatch(
				showMessage({
					message: `New password must be filled`,
					variant: 'error'
				})
			);
			await setLoading(false);
		} else if (newPassword !== confirmPassword) {
			await confirmPasswordRef?.current?.focus();
			await dispatch(
				showMessage({
					message: `Confirm password must be same with new password`,
					variant: 'error'
				})
			);
			await setLoading(false);
		} else if (newPassword.length < 6) {
			await newPasswordRef.current.focus();
			await dispatch(
				showMessage({
					message: `New password must be 6 characters or more`,
					variant: 'error'
				})
			);
			await setLoading(false);
		} else {
			await dispatch(
				updateUserPassword({
					id: user && user.data && user.data.id,
					password: newPassword
				})
			);
			await setLoading(false);
			await dispatch(
				showMessage({
					message: `Password has been updated`,
					variant: 'success'
				})
			);
			await closeProfileHandler();
		}
	};

	const cancelConfirmationHandler = () => {
		setOpenConfirmation(false);
	};

	const confirmConfirmationHandler = () => {
		dispatch(
			changeProfile({
				...profileReducer,
				photoFile: null
			})
		);
		cancelConfirmationHandler();
		setShowChangeProfilePicture(!showChangeProfilePicture);
	};

	const savePhotoProfileHandler = async () => {
		let fileSize = Math.round(photoFile.size / 1024);
		let fileType = photoFile.type;
		let formData = await new FormData();
		if (photoFile) {
			formData.append('file', photoFile, photoFile?.name || '');
		}
		if (parseInt(fileSize) > 2048) {
			dispatch(
				showMessage({
					message: `The maximum file size is 2 MB`,
					variant: 'error'
				})
			);
			dispatch(
				changeProfile({
					...profileReducer,
					photoFile: null
				})
			);
		} else if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
			dispatch(
				changeProfile({
					loadingPost: true
				})
			);
			const responseCallback = await dispatch(updatePhotoProfile({ data: formData }));
			if (responseCallback) {
				cancelConfirmationHandler();
				closeProfileHandler();
			}
		} else {
			dispatch(
				showMessage({
					message: `File must be in .jpeg, jpg, or .png format`,
					variant: 'error'
				})
			);
			dispatch(
				changeProfile({
					...profileReducer,
					photoFile: null
				})
			);
		}
	};

	return (
		<>
			<Dialog open={showProfile} fullWidth aria-labelledby="responsive-dialog-title">
				<div className="flex items-center m-24 justify-between">
					{!showChangeProfilePicture ? (
						<>
							<Typography className="text-16" id="responsive-dialog-title">
								{'Profile'}
							</Typography>
							<Button
								onClick={() => {
									setShowChangePassword(false);
									setShowChangeProfilePicture(true);
								}}
								color="secondary"
								className=" capitalize "
							>
								Change Profile Picture
							</Button>
						</>
					) : (
						<div className="flex items-center gap-8">
							<ArrowBack
								className={postLoading ? 'cursor-default' : 'cursor-pointer'}
								onClick={() =>
									!postLoading
										? photoFile
											? setOpenConfirmation(true)
											: setShowChangeProfilePicture(!showChangeProfilePicture)
										: null
								}
							/>
							<Typography className="text-16" id="responsive-dialog-title">
								{'Change Profile Picture'}
							</Typography>
						</div>
					)}
				</div>
				<DialogContent>
					<Grid container className="space-y-4" spacing={1}>
						{showChangeProfilePicture ? (
							<Grid item xs={12}>
								<section className="flex flex-col items-center gap-8">
									<Avatar
										alt={`${user.data.displayName[0]} photo`.toLocaleUpperCase()}
										src={photoFile ? URL.createObjectURL(photoFile) : `${user?.data?.photoURL}?${Date.now() + Math.random()}`}
										className="rounded-full object-cover bg-center h-128 w-128"
									/>
									<input
										disabled={postLoading}
										className="hidden"
										type="file"
										id="attachment"
										accept="image/png, image/jpeg"
										ref={photoFileRef}
										onChange={e =>
											dispatch(changeProfile({ ...profileReducer, photoFile: e.target.files[0] }))
										}
									/>
									<Button
										title={photoFile ? 'Cancel' : 'Choose Profile Image'}
										disabled={postLoading}
										size="small"
										onClick={() => {
											if (photoFile) {
												dispatch(
													changeProfile({
														...profileReducer,
														photoFile: null
													})
												);
											} else {
												photoFileRef.current.click();
											}
										}}
										className="mt-8 normal-case"
										variant="outlined"
										color="secondary"
										startIcon={photoFile ? <CancelOutlined /> : null}
									>
										{photoFile ? truncateFilename(photoFile?.name, 20) : 'Choose Profile Image'}
									</Button>
								</section>
							</Grid>
						) : (
							<>
								<Grid container alignItems="baseline" item xs={12}>
									<Grid item xs={12} sm={4} md={3} className="text-14 text-light-blue-300">
										Name
									</Grid>
									<Grid item xs={12} sm={8} md={9} className="text-14">
										{user && user.data && user.data.displayName}
									</Grid>
								</Grid>
								<Grid container alignItems="baseline" item xs={12}>
									<Grid item xs={12} sm={4} md={3} className="text-14 text-light-blue-300">
										Email
									</Grid>
									<Grid item xs={12} sm={8} md={9} className="text-14">
										{user && user.data && user.data.email}
									</Grid>
								</Grid>
								<Grid container alignItems="baseline" item xs={12}>
									<Grid item xs={12} sm={4} md={3} className="text-14 text-light-blue-300">
										Role
									</Grid>
									<Grid item xs={12} sm={8} md={9} className="text-14">
										{user && user.role[0]}
									</Grid>
								</Grid>
								<Grid container alignItems="baseline" item xs={12}>
									<Grid item xs={12} className="text-14 flex items-center gap-12">
										Change Password
										<Switch size="small" onClick={changePasswordHandler} />
									</Grid>
								</Grid>
							</>
						)}
						{showChangeProfilePicture
							? null
							: showChangePassword && (
									<>
										<Grid container alignItems="baseline" item xs={12}>
											<Grid item xs={12} md={3} className="text-14 text-light-blue-300">
												New Password
											</Grid>
											<Grid item xs={12} md={9}>
												<TextField
													inputRef={newPasswordRef}
													variant="standard"
													fullWidth
													required
													color="secondary"
													error={errorNewPassword}
													placeholder="Type new password..."
													size="small"
													helperText={
														errorNewPassword && 'Password requires 6 characters minimum'
													}
													onChange={e => {
														const value = e.target.value;
														setTimeout(() => {
															setNewPassword(value);
														}, 1000);

														if (value.length < 6) {
															setErrorNewPassword(true);
														} else if (
															confirmPassword !== value &&
															confirmPassword !== ''
														) {
															setErrorConfirmPassword(true);
															setErrorNewPassword(false);
														} else {
															setErrorConfirmPassword(false);
															setErrorNewPassword(false);
														}
													}}
													type={showNewPassword ? 'text' : 'password'}
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<IconButton
																	aria-label="toggle password visibility"
																	onClick={showNewPasswordHandler}
																	edge="end"
																>
																	{showNewPassword ? (
																		<Visibility />
																	) : (
																		<VisibilityOff />
																	)}
																</IconButton>
															</InputAdornment>
														)
													}}
												/>
											</Grid>
										</Grid>
										<Grid container alignItems="baseline" item xs={12}>
											<Grid item xs={12} md={3} className="text-14 text-light-blue-300">
												Confirm Password
											</Grid>
											<Grid item xs={12} md={9}>
												<TextField
													inputRef={confirmPasswordRef}
													variant="standard"
													fullWidth
													color="secondary"
													required
													error={errorConfirmPassword}
													helperText={
														errorConfirmPassword && 'Confirm password does not match'
													}
													onChange={async e => {
														const value = e.target.value;

														await setConfirmPassword(value);

														if (newPassword === value) {
															setErrorConfirmPassword(false);
														} else {
															await setErrorConfirmPassword(true);
														}
													}}
													placeholder="Confirm your new password..."
													size="small"
													type={showConfirmPassword ? 'text' : 'password'}
													InputProps={{
														endAdornment: (
															<InputAdornment position="end">
																<IconButton
																	aria-label="toggle password visibility"
																	onClick={showConfirmPasswordHandler}
																	edge="end"
																>
																	{showConfirmPassword ? (
																		<Visibility />
																	) : (
																		<VisibilityOff />
																	)}
																</IconButton>
															</InputAdornment>
														)
													}}
												/>
											</Grid>
										</Grid>
									</>
							  )}
					</Grid>
				</DialogContent>
				{showChangeProfilePicture ? (
					<DialogActions className="p-24">
						<Button
							disabled={!photoFile || postLoading}
							onClick={savePhotoProfileHandler}
							variant="contained"
							className={clsx(classes.saveButton, 'text-12 px-6')}
						>
							{postLoading ? 'Saving' : 'Save'}
						</Button>
					</DialogActions>
				) : showChangePassword ? (
					<DialogActions className="p-24">
						<Button
							variant="outlined"
							disabled={loading}
							className="text-12 px-6"
							onClick={closeProfileHandler}
						>
							Cancel
						</Button>

						<Button
							disabled={loading}
							variant="contained"
							autoFocus
							type="submit"
							onClick={updatePasswordHandler}
							className={clsx(classes.saveButton, 'text-12 px-6')}
						>
							{loading ? 'Saving' : 'Save'}
						</Button>
					</DialogActions>
				) : (
					<DialogActions className="p-24">
						<Button onClick={closeProfileHandler} variant="outlined" className="text-12 px-6">
							Close
						</Button>
					</DialogActions>
				)}
				<Confirmation
					open={openConfirmation}
					title={'Cancel to Change Profile Image'}
					contentText={'Confirm to discard chosen image to update your profile image?'}
					cancelHandler={cancelConfirmationHandler}
					confirmHandler={confirmConfirmationHandler}
				/>
			</Dialog>
		</>
	);
};

export default Profile;
