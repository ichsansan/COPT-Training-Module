import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { logoutUser } from 'app/auth/store/userSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { changeUserManagementReducer } from 'app/store/actions/user-management-actions';
import Download from './Download';
import Profile from './Profile';
import Upload from './Upload';
import UserManagement from './UserManagement';
import packageJson from '../../../../package.json';

function UserMenu() {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const profileReducer = useSelector((state) => state.profileReducer);

  const { photoFile } = profileReducer;

  const [userMenu, setUserMenu] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showUploadUserGuide, setShowUploadUserGuide] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const showProfileHandler = () => {
    setShowProfile(true);
  };

  const closeProfileHandler = () => {
    setShowProfile(false);
  };

  const showUploadUserGuideHandler = () => {
    setShowUploadUserGuide(true);
  };

  const closeUploadUserGuideHandler = () => {
    setShowUploadUserGuide(false);
  };

  const showDownloadDialogHandler = () => {
    setShowDownloadDialog(true);
  };

  const closeDownloadDialogHandler = () => {
    setShowDownloadDialog(false);
  };

  const showUserManagementHandler = () => {
    setShowUserManagement(true);
  };

  const closeUserManagementHandler = () => {
    setShowUserManagement(false);
    dispatch(
      changeUserManagementReducer({
        search: '',
        data: [],
        sortBy: 'id',
        sortType: 'desc',
        page: 0,
        limit: 100,
        total: 0,
        loading: true,
      })
    );
  };

  return (
    <>
      {showProfile && (
        <Profile
          closeProfileHandler={closeProfileHandler}
          showProfile={showProfile}
        />
      )}
      {showUploadUserGuide && (
        <Upload
          closeHandler={closeUploadUserGuideHandler}
          show={showUploadUserGuide}
        />
      )}
      {showDownloadDialog && (
        <Download
          closeHandler={closeDownloadDialogHandler}
          show={showDownloadDialog}
        />
      )}
      {showUserManagement && (
        <UserManagement
          closeHandler={closeUserManagementHandler}
          show={showUserManagement}
        />
      )}

      <Button
        className="onboard__home-system-settings min-h-40 min-w-40 mx-16 md:mx-0 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography
            component="span"
            className="normal-case font-bold flex xl:text-16"
          >
            {user.data.displayName}
          </Typography>
          <Typography
            className="text-11 xl:text-14 capitalize"
            color="textSecondary"
          >
            {user.role.toString()}
            {(!user.role ||
              (Array.isArray(user.role) && user.role.length === 0)) &&
              'Guest'}
          </Typography>
        </div>

        {photoFile ? (
          <Avatar
            alt={user.data.displayName[0]}
            src={
              photoFile
                ? URL.createObjectURL(photoFile)
                : `${user?.data?.photoURL}?${Date.now() + Math.random()}`
            }
            className="md:mx-4"
          />
        ) : `${user?.data?.photoURL}?${Date.now() + Math.random()}` ? (
          <Avatar
            className="md:mx-4"
            alt={`${user.data.displayName[0]} photo`}
            src={`${user?.data?.photoURL}?${Date.now() + Math.random()}`}
          />
        ) : (
          <Avatar className="md:mx-4">{user.data.displayName[0]}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/login" role="button">
              <ListItemIcon className="min-w-40">
                <Icon>lock</Icon>
              </ListItemIcon>
              <ListItemText primary="Login" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              component={Link}
              to="/home"
              onClick={userMenuClose}
              role="button"
            >
              <ListItemIcon className="min-w-40">
                <Icon>home</Icon>
              </ListItemIcon>
              <ListItemText primary="Home" />
            </MenuItem>
            <MenuItem
              onClick={async () => {
                await showProfileHandler();
                await userMenuClose();
              }}
              role="button"
            >
              <ListItemIcon className="min-w-40">
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            {user?.role && user?.role[0] === 'ADMIN' && (
              <MenuItem onClick={showUserManagementHandler} role="button">
                <ListItemIcon className="min-w-40">
                  <Icon>person_add</Icon>
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </MenuItem>
            )}
            <MenuItem onClick={showUploadUserGuideHandler} role="button">
              <ListItemIcon className="min-w-40">
                <Icon>cloud_upload</Icon>
              </ListItemIcon>
              <ListItemText primary="Upload" />
            </MenuItem>
            <MenuItem
              onClick={async () => {
                await showDownloadDialogHandler();
                await userMenuClose();
              }}
              role="button"
            >
              <ListItemIcon className="min-w-40">
                <Icon>cloud_download</Icon>
              </ListItemIcon>
              <ListItemText primary="Download" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(logoutUser());
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
            <ListItemText
              className="text-left text-8 px-20"
              secondary={`version ${packageJson.version}`}
            />
          </>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;
