import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  changeUserGuide,
  updateUserGuideFile,
  updateWorkInstructionFile,
} from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Confirmation from './Confirmation';
import UploadUserGuide from './UploadUserGuide';
import UploadWorkInstruction from './UploadWorkInstruction';
import UploadOtherFiles from './UploadOtherFiles';

const useStyles = makeStyles(() => ({
  saveButton: {
    backgroundColor: '#1976d2',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#21619e',
    },
  },
  dialogPaper: {
    maxHeight: '100vh',
  },
}));

const Upload = ({ closeHandler, show }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [uploadMode, setUploadMode] = useState('work-instruction');

  const userGuideReducer = useSelector((state) => state.userGuideReducer);

  const { userGuideFile, workInstructionFile, postLoading } = userGuideReducer;

  const cancelConfirmationHandler = () => {
    setOpenConfirmation(false);
  };

  const saveFileUploadWorkInstructionHandler = async () => {
    const fileSize = Math.round(workInstructionFile.size / 1024);
    const fileType = workInstructionFile.type;
    const formData = await new FormData();
    if (workInstructionFile) {
      formData.append(
        'file',
        workInstructionFile,
        workInstructionFile?.name || ''
      );
    }
    if (+fileSize > 5120) {
      dispatch(
        showMessage({
          message: `The maximum file size is 5 MB`,
          variant: 'error',
        })
      );
      dispatch(
        changeUserGuide({
          ...userGuideReducer,
          workInstructionFile: null,
        })
      );
    } else if (fileType === 'application/pdf') {
      dispatch(
        changeUserGuide({
          loadingPost: true,
        })
      );
      const responseCallback = await dispatch(
        updateWorkInstructionFile({ data: formData })
      );
      if (responseCallback) {
        cancelConfirmationHandler();
        closeHandler();
        dispatch(
          changeUserGuide({
            ...userGuideReducer,
            workInstructionFile: null,
          })
        );
      }
    } else {
      dispatch(
        showMessage({
          message: `File must be in .pdf format`,
          variant: 'error',
        })
      );
      dispatch(
        changeUserGuide({
          ...userGuideReducer,
          workInstructionFile: null,
        })
      );
    }
  };

  const saveFileUploadUserGuideHandler = async () => {
    const fileSize = Math.round(userGuideFile.size / 1024);
    const fileType = userGuideFile.type;
    const formData = await new FormData();
    if (userGuideFile) {
      formData.append('file', userGuideFile, userGuideFile?.name || '');
    }
    if (+fileSize > 5120) {
      dispatch(
        showMessage({
          message: `The maximum file size is 5 MB`,
          variant: 'error',
        })
      );
      dispatch(
        changeUserGuide({
          ...userGuideReducer,
          userGuideFile: null,
        })
      );
    } else if (fileType === 'application/pdf') {
      dispatch(
        changeUserGuide({
          loadingPost: true,
        })
      );
      const responseCallback = await dispatch(
        updateUserGuideFile({ data: formData })
      );
      if (responseCallback) {
        cancelConfirmationHandler();
        closeHandler();
        dispatch(
          changeUserGuide({
            ...userGuideReducer,
            userGuideFile: null,
          })
        );
      }
    } else {
      dispatch(
        showMessage({
          message: `File must be in .pdf format`,
          variant: 'error',
        })
      );
      dispatch(
        changeUserGuide({
          ...userGuideReducer,
          userGuideFile: null,
        })
      );
    }
  };

  return (
    <>
      <Dialog
        open={show}
        fullWidth
        maxWidth={uploadMode === 'others' ? 'md' : 'sm'}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="flex items-center m-24 justify-end sm:justify-between">
          <Typography
            className="text-16 hidden sm:block"
            id="responsive-dialog-title"
          >
            {uploadMode === 'work-instruction'
              ? 'Upload Work Instruction'
              : uploadMode === 'user-guide'
              ? 'Upload User Guide'
              : 'Upload Other Files'}
          </Typography>
          <FormControl style={{ width: 140 }}>
            <InputLabel
              color="secondary"
              id="demo-controlled-open-select-label"
            >
              Module
            </InputLabel>
            <Select
              color="secondary"
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              value={uploadMode}
              onChange={(e) => setUploadMode(e.target.value)}
            >
              <MenuItem value="work-instruction">Work Instruction</MenuItem>
              <MenuItem value="user-guide">User Guide</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
        </div>
        <DialogContent>
          {uploadMode === 'work-instruction' ? (
            <UploadWorkInstruction />
          ) : uploadMode === 'user-guide' ? (
            <UploadUserGuide />
          ) : (
            <UploadOtherFiles />
          )}
        </DialogContent>

        <DialogActions className="p-24">
          <Button
            variant="outlined"
            onClick={() => {
              dispatch(
                changeUserGuide({
                  ...userGuideReducer,
                  userGuideFile: null,
                  workInstructionFile: null,
                  postLoading: false,
                  error: false,
                })
              );
              closeHandler();
            }}
            disabled={postLoading}
            className="text-12 px-6"
          >
            Cancel
          </Button>
          {uploadMode !== 'others' && (
            <Button
              disabled={
                uploadMode === 'work-instruction'
                  ? !workInstructionFile || postLoading
                  : !userGuideFile || postLoading
              }
              onClick={() => setOpenConfirmation(true)}
              variant="contained"
              className={clsx(classes.saveButton, 'text-12 px-6')}
            >
              {postLoading ? 'Saving' : 'Save'}
            </Button>
          )}
        </DialogActions>
        <Confirmation
          loading={postLoading}
          open={openConfirmation}
          title={
            uploadMode === 'work-instruction'
              ? 'Confirm to upload work instruction'
              : 'Confirm to upload user guide'
          }
          contentText={
            uploadMode === 'work-instruction'
              ? 'Confirm to update work instruction file?'
              : 'Confirm to update user guide file?'
          }
          cancelHandler={cancelConfirmationHandler}
          confirmHandler={() => {
            if (uploadMode === 'work-instruction') {
              saveFileUploadWorkInstructionHandler();
            } else {
              saveFileUploadUserGuideHandler();
            }
            setOpenConfirmation(false);
          }}
        />
      </Dialog>
    </>
  );
};

export default Upload;
