import {
  AppBar,
  Dialog,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
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
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    width: '100%',
    '& .MuiTableCell-stickyHeader-313': {
      color: '#fff',
      backgroundColor: '#1E2125',
    },
  },
  container: {
    maxHeight: 360,
  },
}));

const columns = [
  { id: 'user', label: 'Update By', minWidth: 170, align: 'center' },
  { id: 'activity', label: 'Activity', minWidth: 170, align: 'center' },
  { id: 'timestamp', label: 'Date & Time', minWidth: 170, align: 'center' },
];

const createData = (user, activity, timestamp) => {
  return { user, activity, timestamp };
};

const LogActivity = ({ closeLogHandler, showLog }) => {
  const classes = useStyles();

  const logActivityData = [
    {
      id: 1,
      user: 'Engineer',
      activity: 'Update Rule A',
      timestamp: '20/12/2021 10:02',
    },
    {
      id: 2,
      user: 'Engineer',
      activity: 'Update Rule A',
      timestamp: '18/12/2021 08:32',
    },
    {
      id: 3,
      user: 'Engineer',
      activity: 'Update Rule B',
      timestamp: '14/12/2021 16:40',
    },
    {
      id: 4,
      user: 'Engineer',
      activity: 'Update Rule B',
      timestamp: '14/12/2021 13:54',
    },
    {
      id: 5,
      user: 'Engineer',
      activity: 'Update Rule C',
      timestamp: '29/11/2021 15:10',
    },
    {
      id: 6,
      user: 'Engineer',
      activity: 'Update Rule C',
      timestamp: '26/11/2021 11:20',
    },
    {
      id: 7,
      user: 'Engineer',
      activity: 'Update Rule D',
      timestamp: '19/11/2021 08:28',
    },
    {
      id: 8,
      user: 'Engineer',
      activity: 'Update Rule E',
      timestamp: '20/10/2021 13:33',
    },
    {
      id: 9,
      user: 'Engineer',
      activity: 'Update Rule F',
      timestamp: '19/10/2021 14:10',
    },
    {
      id: 10,
      user: 'Engineer',
      activity: 'Update Rule G',
      timestamp: '18/10/2021 18:00',
    },
  ];

  const logData = logActivityData?.map((item) =>
    createData(item.user, item.activity, item.timestamp)
  );

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={showLog}
      aria-labelledby="responsive-dialog-title"
    >
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography
            className="text-16 flex-grow text-left"
            id="responsive-dialog-title"
          >
            Log Activity
          </Typography>
          <IconButton onClick={closeLogHandler}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <div className={classes.root}>
          {logData?.length === 0 ? (
            <div className="flex-1 flex min-h-200 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
              <Typography className="text-center text-12 xl:text-16">
                No Logs Found
              </Typography>
            </div>
          ) : (
            <>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns?.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className="text-11 xl:text-16 py-auto text-light-blue-300"
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logData?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell
                          component="th"
                          scope="row"
                          align="center"
                          className="text-10 xl:text-14 py-4"
                        >
                          {row.user || '-'}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="text-10 xl:text-14 py-4"
                        >
                          {row.activity || '-'}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="text-10 xl:text-14 py-4"
                        >
                          {row.timestamp || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={10}
                rowsPerPage={10}
                page={0}
                onChangePage={() => console.log(1)}
                onChangeRowsPerPage={() => console.log(1)}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogActivity;
