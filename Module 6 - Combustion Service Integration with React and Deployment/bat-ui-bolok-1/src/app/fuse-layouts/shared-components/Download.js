import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import { convertDataToArray } from 'helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const Download = ({ closeHandler, show }) => {
  const dispatch = useDispatch();

  const [existingFiles, setExistingFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetExistingFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/service/bat/sootblow/get-list-files`);
      const data = response.data?.object || [];
      const arrayData = convertDataToArray(data);
      setExistingFiles(arrayData);
    } catch (error) {
      dispatch(
        showMessage({
          message:
            error?.response?.message ||
            error?.message ||
            'Sorry, something went wrong',
          variant: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    handleGetExistingFiles();
  }, [handleGetExistingFiles]);

  const handleDownloadUserGuide = () => {
    window.open(
      `${process.env.REACT_APP_USER_GUIDE_LINK}?${Date.now() + Math.random()}`,
      '_blank'
    );
  };

  const handleDownloadWorkInstruction = () => {
    window.open(
      `${process.env.REACT_APP_WORK_INSTRUCTION_LINK}?${
        Date.now() + Math.random()
      }`,
      '_blank'
    );
  };

  const handleDownloadOtherFiles = (fileName) => {
    window.open(
      `${process.env.REACT_APP_OTHER_FILES_LINK}/${fileName}?${
        Date.now() + Math.random()
      }`,
      '_blank'
    );
  };

  return (
    <>
      <Dialog open={show} fullWidth aria-labelledby="responsive-dialog-title">
        <div className="flex items-center m-24 justify-between">
          <Typography className="text-16" id="responsive-dialog-title">
            Download Files
          </Typography>
        </div>
        <DialogContent>
          <Grid container spacing={1} alignItems="center">
            {loading ? (
              <Grid item xs={12}>
                <LinearProgress color="secondary" />
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <Button
                    startIcon={<SaveAltIcon />}
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={handleDownloadUserGuide}
                    className="text-12 px-6 capitalize"
                  >
                    Download User Guide
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    startIcon={<SaveAltIcon />}
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={handleDownloadWorkInstruction}
                    className="text-12 px-6 capitalize"
                  >
                    Download Work Instruction
                  </Button>
                </Grid>
                {existingFiles.map((file, index) => (
                  <Grid item xs={12} key={index}>
                    <Button
                      startIcon={<SaveAltIcon />}
                      fullWidth
                      color="secondary"
                      variant="contained"
                      onClick={() =>
                        handleDownloadOtherFiles(file[`file-${index + 1}`])
                      }
                      className="text-12 px-6 capitalize"
                    >
                      {file[`file-${index + 1}`]}
                    </Button>
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions className="p-24">
          <Button
            variant="outlined"
            onClick={closeHandler}
            className="text-12 px-6"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Download;
