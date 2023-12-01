import { Avatar, Button, Grid, Typography } from '@material-ui/core';
import { CancelOutlined, InsertDriveFile } from '@material-ui/icons';
import { changeUserGuide } from 'app/store/actions';
import { truncateFilename } from 'helpers';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UploadUserGuide = () => {
	const dispatch = useDispatch();

	const userGuideFileRef = useRef(null);

	const userGuideReducer = useSelector(state => state.userGuideReducer);

	const { userGuideFile, postLoading } = userGuideReducer;

	return (
		<>
			<Grid container className="space-y-4" spacing={1}>
				<Grid item xs={12}>
					<section className="flex flex-col-reverse items-center gap-8 w-full">
						<Avatar
							title={userGuideFile?.name ? userGuideFile?.name : 'file'}
							className="rounded-md flex flex-col object-cover bg-center h-128 w-full items-center p-4"
						>
							<InsertDriveFile className="text-white" fontSize="large" />
							{userGuideFile?.name ? (
								<Typography className="text-10 text-white text-center mt-8">
									{truncateFilename(userGuideFile?.name, 20)}
								</Typography>
							) : (
								<Typography className="text-10 text-white text-center mt-8">No file chosen</Typography>
							)}
						</Avatar>
						<input
							disabled={postLoading}
							className="hidden"
							type="file"
							id="attachment"
							accept="application/pdf"
							ref={userGuideFileRef}
							onChange={e =>
								dispatch(
									changeUserGuide({
										...userGuideReducer,
										userGuideFile: e.target.files[0]
									})
								)
							}
						/>
						<Button
							title={userGuideFile ? 'Cancel' : 'Choose User Guide File'}
							disabled={postLoading}
							size="small"
							onClick={() => {
								if (userGuideFile) {
									dispatch(
										changeUserGuide({
											...userGuideReducer,
											userGuideFile: null
										})
									);
								} else {
									userGuideFileRef.current.click();
								}
							}}
							fullWidth
							className="normal-case"
							variant="outlined"
							color="secondary"
							startIcon={userGuideFile ? <CancelOutlined /> : null}
						>
							{userGuideFile ? truncateFilename(userGuideFile?.name, 20) : 'Choose User Guide File'}
						</Button>
					</section>
				</Grid>
			</Grid>
		</>
	);
};

export default UploadUserGuide;
