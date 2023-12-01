import { Avatar, Button, Grid, Typography } from '@material-ui/core';
import { CancelOutlined, InsertDriveFile } from '@material-ui/icons';
import { changeUserGuide } from 'app/store/actions';
import { truncateFilename } from 'helpers';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UploadWorkInstruction = () => {
	const dispatch = useDispatch();

	const workInstructionFileRef = useRef(null);

	const userGuideReducer = useSelector(state => state.userGuideReducer);

	const { workInstructionFile, postLoading } = userGuideReducer;

	return (
		<>
			<Grid container className="space-y-4" spacing={1}>
				<Grid item xs={12}>
					<section className="flex flex-col-reverse items-center gap-8 w-full">
						<Avatar
							title={workInstructionFile?.name ? workInstructionFile?.name : 'file'}
							className="rounded-md flex flex-col object-cover bg-center h-128 w-full items-center p-4"
						>
							<InsertDriveFile className="text-white" fontSize="large" />
							{workInstructionFile?.name ? (
								<Typography className="text-10 text-white text-center mt-8">
									{truncateFilename(workInstructionFile?.name, 20)}
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
							ref={workInstructionFileRef}
							onChange={e =>
								dispatch(
									changeUserGuide({
										...userGuideReducer,
										workInstructionFile: e.target.files[0]
									})
								)
							}
						/>
						<Button
							title={workInstructionFile ? 'Cancel' : 'Choose Work Instruction File'}
							disabled={postLoading}
							size="small"
							onClick={() => {
								if (workInstructionFile) {
									dispatch(
										changeUserGuide({
											...userGuideReducer,
											workInstructionFile: null
										})
									);
								} else {
									workInstructionFileRef.current.click();
								}
							}}
							fullWidth
							className="normal-case"
							variant="outlined"
							color="secondary"
							startIcon={workInstructionFile ? <CancelOutlined /> : null}
						>
							{workInstructionFile ? truncateFilename(workInstructionFile?.name, 20) : 'Choose Work Instruction File'}
						</Button>
					</section>
				</Grid>
			</Grid>
		</>
	);
};

export default UploadWorkInstruction;
