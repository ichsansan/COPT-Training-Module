/* eslint-disable react/jsx-no-duplicate-props */
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  getUserManagementList,
  handleEditUser,
} from 'app/store/actions/user-management-actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import { roleOptions, usernameValidation } from 'helpers';
import React, { useState, useMemo } from 'react';

import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  fullname: yup.string().required("User's fullname must be filled."),
  username: yup
    .string()
    .required("User's username must be filled.")
    .matches(
      usernameValidation,
      'Username can only contain letters and numbers.'
    ),
  email: yup
    .string()
    .email('Email is not valid.')
    .required("User's email must be filled."),
  role: yup.string().required('Role must be choose.'),
});

const useStyles = makeStyles(() => ({
  saveButton: {
    backgroundColor: '#1976d2',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#21619e',
    },
  },
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
  },
}));

const EditUser = ({ closeHandler, show }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { detailData } = useSelector((state) => state.userManagementReducer);

  const { control, formState, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: useMemo(() => detailData, [detailData]),
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const handleEditData = handleSubmit(async (data) => {
    await setLoading(true);

    const response = await dispatch(handleEditUser(data, data.id));
    if (response) {
      await dispatch(
        showMessage({
          message: `User with ID: ${data.id} has been updated`,
          variant: 'success',
        })
      );
      await closeHandler();
      await dispatch(getUserManagementList());
    } else {
      await setLoading(false);
    }
  });

  return (
    <>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={show}
        fullWidth
        aria-labelledby="responsive-dialog-title"
      >
        <div className="flex items-center m-24 justify-between">
          <Typography className="text-16" id="responsive-dialog-title">
            Edit User
          </Typography>
        </div>
        <DialogContent>
          <Grid container className="space-y-4" spacing={2}>
            <>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Fullname
                </Grid>
                <Grid item xs={12} md={9}>
                  <Controller
                    name="fullname"
                    control={control}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <TextField
                        autoFocus
                        onBlur={onBlur}
                        variant="standard"
                        fullWidth
                        required
                        color="secondary"
                        error={!!errors.fullname}
                        helperText={errors?.fullname?.message}
                        placeholder="User's fullname..."
                        size="small"
                        onChange={onChange}
                        value={value}
                        type="text"
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Role
                </Grid>
                <Grid item xs={12} md={9}>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        className="w-full"
                        error={!!errors.role}
                        variant="standard"
                      >
                        <Select fullWidth color="secondary" required {...field}>
                          <MenuItem disabled value="">
                            <em>Select role</em>
                          </MenuItem>
                          {roleOptions.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors?.role?.message}</FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Username
                </Grid>
                <Grid item xs={12} md={9}>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <TextField
                        onBlur={onBlur}
                        variant="standard"
                        fullWidth
                        required
                        color="secondary"
                        error={!!errors.username}
                        helperText={errors?.username?.message}
                        placeholder="User's username..."
                        size="small"
                        onChange={onChange}
                        value={value}
                        type="text"
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Email
                </Grid>
                <Grid item xs={12} md={9}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <TextField
                        onBlur={onBlur}
                        variant="standard"
                        fullWidth
                        required
                        inputProps={{
                          autoComplete: 'email',
                          form: {
                            autoComplete: 'off',
                          },
                        }}
                        color="secondary"
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                        placeholder="User's email..."
                        size="small"
                        onChange={onChange}
                        value={value}
                        type="emaail"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </>
          </Grid>
        </DialogContent>
        <DialogActions className="p-24">
          <Button
            variant="outlined"
            disabled={loading}
            className="text-12 px-6"
            onClick={closeHandler}
          >
            Cancel
          </Button>

          <Button
            disabled={loading}
            variant="contained"
            type="submit"
            onClick={handleEditData}
            className={clsx(classes.saveButton, 'text-12 px-6')}
          >
            {loading ? 'Saving' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditUser;
