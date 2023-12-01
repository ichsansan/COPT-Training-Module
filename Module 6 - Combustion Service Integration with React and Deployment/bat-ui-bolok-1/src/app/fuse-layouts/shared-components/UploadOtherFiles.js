/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import { DeleteForever, FileCopyOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { convertDataToArray } from 'helpers';
import Confirmation from './Confirmation';

const useStyles = makeStyles(() => ({
  saveButton: {
    backgroundColor: '#1976d2',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#21619e',
    },
  },
}));

const UploadOtherFiles = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteFile, setDeleteFile] = useState('');
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const existingFilesCount = useMemo(() => 5 - existingFiles.length, [
    existingFiles,
  ]);

  const handleGetExistingFiles = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.get(`/service/bat/sootblow/get-list-files`);
      const data = response.data?.object || [];
      const arrayData = convertDataToArray(data);
      setExistingFiles(arrayData);
    } catch (error) {
      setErrorMessage(
        error?.response?.message ||
          error?.message ||
          'Sorry, something went wrong'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetExistingFiles();
  }, [handleGetExistingFiles]);

  const handleFileChange = (event) => {
    const { files } = event.target;
    setSelectedFiles([...selectedFiles, ...files].slice(0, existingFilesCount));
  };

  const handleCancel = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleUpload = async () => {
    setLoadingPost(true);
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`file-${index + 1}`, file);
    });

    try {
      await axios.post('/service/bat/sootblow/upload-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(
        showMessage({ message: 'Upload successful', variant: 'success' })
      );

      setSelectedFiles([]);
      handleGetExistingFiles();
    } catch (error) {
      dispatch(
        showMessage({
          message: error?.response?.message || 'Error uploading files',
          variant: 'error',
        })
      );
    } finally {
      setLoadingPost(false);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);

    try {
      await axios.delete(`/service/bat/sootblow/del-list-files`, {
        params: {
          name: deleteFile,
        },
      });
      dispatch(
        showMessage({
          message: 'File has successful deleted',
          variant: 'success',
        })
      );
      setOpenConfirmation(false);
      handleGetExistingFiles();
    } catch (error) {
      dispatch(
        showMessage({
          message: error?.response?.message || 'Error deleting file',
          variant: 'error',
        })
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleDownloadOtherFiles = (fileName) => {
    window.open(
      `${process.env.REACT_APP_OTHER_FILES_LINK}/${fileName}?${
        Date.now() + Math.random()
      }`,
      '_blank'
    );
  };

  if (loading) {
    return <LinearProgress color="secondary" />;
  }

  if (errorMessage) {
    return (
      <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 ">
        <Typography gutterBottom>Error</Typography>
        <Typography gutterBottom>
          {errorMessage || 'Sorry, something went wrong try again later!'}
        </Typography>
        <Button onClick={handleGetExistingFiles}>Try Again</Button>
      </div>
    );
  }

  return (
    <section>
      <div style={{ marginBottom: '24px' }}>
        {existingFiles.length > 0 ? (
          <Typography>Existing Files</Typography>
        ) : (
          <Typography>
            There are no files available currently. You can upload them through
            the button below.
          </Typography>
        )}
        {existingFiles.map((file, index) => (
          <Chip
            clickable
            onClick={() => handleDownloadOtherFiles(file[`file-${index + 1}`])}
            key={index}
            label={file[`file-${index + 1}`]}
            onDelete={() => {
              setDeleteFile(file[`file-${index + 1}`]);
              setOpenConfirmation(true);
            }}
            color="primary"
            style={{ margin: '4px' }}
            deleteIcon={<DeleteForever />}
          />
        ))}
      </div>
      <div className="flex flex-col w-full gap-10">
        <input
          accept="*"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button
            disabled={existingFilesCount === 0}
            startIcon={<FileCopyOutlined />}
            variant="contained"
            fullWidth
            component="span"
          >
            Add Files
          </Button>
        </label>
        <Typography gutterBottom>
          {existingFilesCount === 0
            ? 'Please delete the existing files to change or upload the new files'
            : `Max. ${existingFilesCount} files to upload`}
        </Typography>
        <div style={{ marginBottom: '16px' }}>
          {selectedFiles.map((file, index) => (
            <Chip
              key={index}
              label={file.name}
              onDelete={() => handleCancel(index)}
              color="secondary"
              style={{ margin: '4px' }}
              variant="outlined"
            />
          ))}
        </div>
        <Button
          disabled={existingFilesCount === 0 || loadingPost}
          variant="contained"
          color="secondary"
          className={clsx(classes.saveButton, 'text-12 px-6')}
          onClick={handleUpload}
        >
          {loadingPost ? 'Uploading' : 'Upload'}
        </Button>
      </div>

      <Confirmation
        loading={loadingDelete}
        open={openConfirmation}
        title="Confirm to delete"
        contentText={`Confirm to delete this file, ${deleteFile}?`}
        cancelHandler={() => setOpenConfirmation(false)}
        confirmHandler={handleDelete}
      />
    </section>
  );
};

export default UploadOtherFiles;
