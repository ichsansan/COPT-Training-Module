/* eslint-disable react/jsx-no-duplicate-props */
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useDebounce } from '@fuse/hooks';
import { Close, Delete, Edit } from '@material-ui/icons';
import TablePaginationAction from 'app/fuse-layouts/shared-components/TablePaginationAction';
import {
  changeUserManagementReducer,
  // getUserManagementDetail,
  getUserManagementList,
  handleDeleteUser,
} from 'app/store/actions/user-management-actions';
import clsx from 'clsx';
import Confirmation from './Confirmation';
import CreateUser from './CreateUser';
import EditUser from './EditUser';

const columns = [
  {
    id: 'fullname',
    label: 'Fullname',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'username',
    label: 'Username',
    minWidth: 170,
    align: 'left',
  },
  { id: 'email', label: 'Email', minWidth: 170, align: 'left' },
  { id: 'roleName', label: 'Role', minWidth: 100, align: 'center' },
  { id: 'id', label: 'Action', minWidth: 100, align: 'center' },
];

const createData = (fullname, username, email, roleName, roleId, id) => {
  return { fullname, username, email, roleName, roleId, id };
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.secondary,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
  },
  saveButton: {
    backgroundColor: '#1976d2',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#21619e',
    },
  },
  root: {
    width: '100%',
    '& .MuiTableCell-stickyHeader': {
      backgroundColor: '#1E2125',
    },
  },
  container: {
    border: '1px solid rgba(81, 81, 81, 1)',
  },
}));

const UserManagement = ({ closeHandler, show }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userManagementReducer = useSelector(
    (state) => state.userManagementReducer
  );
  const {
    page,
    limit,
    total,
    data,
    error,
    loading,
    loadingDelete,
    loadingDetail,
  } = userManagementReducer;

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedName, setSelectedName] = useState('');

  const getUserList = useCallback(() => {
    dispatch(getUserManagementList());
  }, [dispatch]);

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  const handleChangePage = async (event, newPage) => {
    await dispatch(
      changeUserManagementReducer({
        page: newPage,
      })
    );
    await dispatch(getUserManagementList());
  };

  const handleChangeRowsPerPage = async (event) => {
    await dispatch(
      changeUserManagementReducer({
        page: 0,
        limit: event.target.value,
      })
    );
    await dispatch(getUserManagementList());
  };

  const userListData = data?.map((item) =>
    createData(
      item.fullname,
      item.username,
      item.email,
      item.role?.roleName,
      item.role?.roleId,
      item.id
    )
  );

  const handleDelete = async () => {
    const response = await dispatch(handleDeleteUser(selectedId, selectedName));
    if (response) {
      setShowDeleteConfirmation(false);
      dispatch(getUserManagementList());
    }
  };

  const handleUserFilter = useDebounce(async (search) => {
    await dispatch(
      changeUserManagementReducer({
        search,
        page: 0,
      })
    );
    await dispatch(getUserManagementList());
  }, 500);

  return (
    <>
      <Dialog
        maxWidth="xl"
        fullWidth
        open={show}
        aria-labelledby="responsive-dialog-title"
      >
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography
              className="text-16 my-24 mx-16 flex-grow text-left"
              id="responsive-dialog-title"
            >
              User Management
            </Typography>

            <IconButton
              onClick={() => {
                closeHandler();
              }}
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <main className={clsx(classes.root, 'flex flex-col')}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mt-10 mb-20 flex-1">
              <TextField
                onChange={(e) => {
                  handleUserFilter(e.target.value);
                }}
                color="secondary"
                placeholder="Search data..."
                type="search"
              />
              <Button
                onClick={() => setShowCreateUser(true)}
                variant="contained"
                color="secondary"
                size="small"
              >
                Create New user
              </Button>
            </div>
            {loading ? (
              <div className="flex-1 flex-col flex min-h-200 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
                <Typography className="text-12 xl:text-16">Loading</Typography>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col min-h-200 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
                <Typography
                  className="text-center text-12 xl:text-16"
                  color="error"
                >
                  {error || ' Sorry something went wrong, try again later!'}
                </Typography>
              </div>
            ) : userListData?.length === 0 ? (
              <div className="flex-1 flex flex-col min-h-200 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
                <Typography className="text-center text-12 xl:text-16">
                  No Data was Found
                </Typography>
              </div>
            ) : (
              <>
                <TableContainer
                  component={Paper}
                  className={clsx(
                    classes.container,
                    'h-full md:max-h-224 lg:max-h-320 xl:max-h-400 2xl:max-h-640yy'
                  )}
                >
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns?.map((column) => (
                          <StyledTableCell
                            key={column.id}
                            align={column.align}
                            className="text-11 xl:text-16 py-auto text-light-blue-300"
                          >
                            {column.label}
                          </StyledTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userListData?.map((row) => (
                        <StyledTableRow key={row.id}>
                          <TableCell
                            component="th"
                            scope="row"
                            align="left"
                            className="text-10 xl:text-14 py-4"
                          >
                            {row.fullname || '-'}
                          </TableCell>
                          <TableCell
                            align="left"
                            className="text-10 xl:text-14 py-4"
                          >
                            {row.username || '-'}
                          </TableCell>
                          <TableCell
                            align="left"
                            className="text-10 xl:text-14 py-4"
                          >
                            {row.email || '-'}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="text-10 xl:text-14 py-4"
                          >
                            {row.roleName || '-'}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="flex gap-10 justify-center items-center"
                          >
                            <Tooltip title="Edit">
                              <span>
                                <IconButton
                                  disabled={loadingDelete || loadingDetail}
                                  size="small"
                                  onClick={async () => {
                                    await dispatch(
                                      changeUserManagementReducer({
                                        detailData: {
                                          fullname: row.fullname || '',
                                          username: row.username || '',
                                          email: row.email || '',
                                          role: row.roleId || '',
                                          id: row.id,
                                        },
                                      })
                                    );
                                    await setShowEditUser(true);
                                  }}
                                  aria-label="export recommendation data"
                                >
                                  <Edit fontSize="small" color="action" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <span>
                                <IconButton
                                  disabled={loadingDelete || loadingDetail}
                                  size="small"
                                  onClick={async () => {
                                    setSelectedId(row?.id);
                                    setSelectedName(row?.fullname);
                                    setShowDeleteConfirmation(true);
                                  }}
                                  aria-label="export recommendation data"
                                >
                                  <Delete fontSize="small" color="error" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </main>
        </DialogContent>
        <DialogActions>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={total}
            rowsPerPage={limit}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationAction}
          />
        </DialogActions>
        {showCreateUser && (
          <CreateUser
            show={showCreateUser}
            closeHandler={() => setShowCreateUser(false)}
          />
        )}
        {showEditUser && (
          <EditUser
            show={showEditUser}
            closeHandler={() => setShowEditUser(false)}
          />
        )}
        {showDeleteConfirmation && (
          <Confirmation
            confirmText={loadingDelete ? 'Deleting' : 'Delete'}
            loading={loadingDelete}
            open={showDeleteConfirmation}
            title="Warning Delete User Data"
            contentText={`Confirm to delete ${selectedName} data permanently?`}
            cancelHandler={() => setShowDeleteConfirmation(false)}
            confirmHandler={handleDelete}
            confirmColor="error"
          />
        )}
      </Dialog>
    </>
  );
};

export default UserManagement;
