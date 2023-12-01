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
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
  getUserManagementList,
  handleCreateNewUser,
} from 'app/store/actions/user-management-actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import { passwordValidation, roleOptions, usernameValidation } from 'helpers';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
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
  password: yup
    .string()
    .required('Password must be filled.')
    .min(8, 'Password minimum length is 8 characters.')
    .max(40, 'Password maximum length is 40 characters.')
    .matches(
      passwordValidation,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    ),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password'), null],
      'Your password and confirmation password do not match.'
    ),
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

const CreateUser = ({ closeHandler, show }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const { control, formState, clearErrors, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const updatePasswordHandler = handleSubmit(async (data) => {
    await setLoading(true);

    const response = await dispatch(handleCreateNewUser(data));
    if (response) {
      await dispatch(
        showMessage({
          message: `User has been created`,
          variant: 'success',
        })
      );
      await closeHandler();
      await dispatch(getUserManagementList());
    } else {
      await setLoading(false);
    }
  });

  const showNewPasswordHandler = () => {
    setShowNewPassword(!showNewPassword);
  };

  const showConfirmPasswordHandler = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
            Create New User
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
              <Grid container alignItems="baseline" item xs={12}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  className="text-14 text-light-blue-300"
                >
                  Password
                </Grid>
                <Grid item xs={12} md={9}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <TextField
                        onBlur={onBlur}
                        variant="standard"
                        fullWidth
                        required
                        inputProps={{
                          autoComplete: 'new-password',
                          form: {
                            autoComplete: 'off',
                          },
                        }}
                        color="secondary"
                        error={!!errors.password}
                        helperText={errors?.password?.message}
                        placeholder="Type password..."
                        size="small"
                        onChange={(e) => {
                          clearErrors('confirmPassword');
                          onChange(e);
                        }}
                        value={value}
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
                          ),
                        }}
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
                  Confirm Password
                </Grid>
                <Grid item xs={12} md={9}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field: { onBlur, onChange, value } }) => (
                      <TextField
                        onBlur={onBlur}
                        variant="standard"
                        fullWidth
                        color="secondary"
                        required
                        inputProps={{
                          autoComplete: 'new-password',
                          form: {
                            autoComplete: 'off',
                          },
                        }}
                        error={!!errors.confirmPassword}
                        helperText={errors?.confirmPassword?.message}
                        onChange={onChange}
                        value={value}
                        placeholder="Confirm password..."
                        size="small"
                        type={showConfirmPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle confirm password visibility"
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
                          ),
                        }}
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
            onClick={updatePasswordHandler}
            className={clsx(classes.saveButton, 'text-12 px-6')}
          >
            {loading ? 'Saving' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateUser;
