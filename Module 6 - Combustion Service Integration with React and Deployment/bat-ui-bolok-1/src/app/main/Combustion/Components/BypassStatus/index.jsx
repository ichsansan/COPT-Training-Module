import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Build, ExpandMore } from '@material-ui/icons';
import {
  changeCombustion,
  getCombustionBypassStatus,
  getCombustionBypassStatusByID,
  updateCombustionBypassStatusData,
} from 'app/store/actions';
import { showMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontWeight: theme.typography.fontWeightRegular,
  },
  formControl: {
    minWidth: '100%',
  },
  saveButton: {
    backgroundColor: '#1976d2',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#21619e',
    },
  },
  container: {
    maxHeight: 200,
  },
  defaultButton: {
    padding: '0px 8px',
  },
  errorAlert: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.getContrastText(theme.palette.error.dark),
  },
}));

const createBypassStatus = (id, date, zone, remark) => {
  return { id, date, zone, remark };
};

const BypassStatus = ({ expanded, handleChange }) => {
  const classes = useStyles();

  const combustionReducer = useSelector((state) => state.combustionReducer);
  const dispatch = useDispatch();

  const {
    loadingBypassStatus,
    combustionBypassStatusData,
    errorBypassStatus,
    combustionBypassStatusDetailData,
    loadingBypassStatusUpdate,
    loading,
    errorGetDetailBypassStatus,
  } = combustionReducer;

  const [openDialog, setOpenDialog] = useState(false);

  const [remark, setRemark] = useState('');

  const bypassStatusTable = combustionBypassStatusData.map((item) =>
    createBypassStatus(item.byPassId, item.timeStamp, item.zone, item.remark)
  );

  const bypassDetailFetch = async (id) => {
    await dispatch(getCombustionBypassStatusByID(id));
    await setRemark(combustionBypassStatusDetailData?.desc);
  };

  const updateBypassStatusHandler = async (id) => {
    if (remark === '') {
      await dispatch(
        showMessage({
          message: 'Sorry, remark cannot be empty',
          variant: 'error',
        })
      );
    } else {
      await dispatch(
        changeCombustion({
          loadingBypassStatusUpdate: true,
        })
      );
      await dispatch(
        updateCombustionBypassStatusData({
          byPassId: id,
          remark: remark || combustionBypassStatusDetailData?.desc,
        })
      );
      await dispatch(
        changeCombustion({
          loadingBypassStatus: true,
        })
      );
      await handleCloseDialog();
      await dispatch(getCombustionBypassStatus());
    }
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Accordion
        className={
          expanded === 'panel5'
            ? 'max-h-200 md:max-h-full flex-1 w-full overflow-auto'
            : 'flex-initial w-full overflow-hidden'
        }
        id="scrollableDiv"
        expanded={expanded === 'panel5'}
        onChange={handleChange('panel5')}
        square
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel5a-content"
          id="panel5a-header"
          className="w-full"
        >
          <Typography className="text-12 xl:text-16 text-light-blue-300 font-600">
            SB Bypass Status
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="p-0 ">
          {loadingBypassStatus ? (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 mb-8 md:mb-0">
              <Typography className="text-12 xl:text-16">Loading</Typography>
            </div>
          ) : errorBypassStatus ? (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 text-red ">
              <Typography className="text-12 xl:text-16">
                Sorry something went wrong!
              </Typography>
            </div>
          ) : bypassStatusTable.length !== 0 ? (
            <TableContainer className="overflow-auto">
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Date & Time
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Zone
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Remark
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-11 xl:text-16 py-auto text-light-blue-300"
                    >
                      Modify
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {bypassStatusTable.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.date || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.zone || '-'}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="text-10 xl:text-14 py-4"
                      >
                        {row.remark || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="py-4 text-14 xl:text-16"
                      >
                        <IconButton
                          onClick={async () => {
                            await bypassDetailFetch(row.id);
                            await handleClickOpenDialog();
                          }}
                          size="small"
                        >
                          <Build className="text-14 xl:text-16" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="flex-1 flex min-h-96 justify-center items-center py-4 md:p-0 ">
              <Typography className="text-12 xl:text-16">
                No Bypass Status Found
              </Typography>
            </div>
          )}
        </AccordionDetails>
      </Accordion>
      <Dialog
        fullWidth
        open={openDialog}
        maxWidth="sm"
        aria-labelledby="responsive-dialog-title"
      >
        <Typography className="text-16 m-24" id="responsive-dialog-title">
          Modify this bypass status remark?
        </Typography>
        <DialogContent>
          {loading ? (
            <LinearProgress color="secondary" />
          ) : (
            <Grid container spacing={1}>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid item xs={3} className="text-14 text-light-blue-300">
                  Timestamp
                </Grid>
                <Grid item xs={9} className="text-14">
                  {combustionBypassStatusDetailData?.timeStamp || '-'}
                </Grid>
              </Grid>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid item xs={3} className="text-14 text-light-blue-300">
                  Zone
                </Grid>
                <Grid item xs={9} className="text-14">
                  {combustionBypassStatusDetailData?.zone || '-'}
                </Grid>
              </Grid>
              <Grid container alignItems="baseline" item xs={12}>
                <Grid item xs={3} className="text-14 text-light-blue-300">
                  Remark
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="outlined"
                    defaultValue={
                      combustionBypassStatusDetailData?.remark || remark
                    }
                    fullWidth
                    multiline
                    size="small"
                    color="secondary"
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-24">
          {!loadingBypassStatusUpdate && (
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              className="text-12 px-6"
            >
              Cancel
            </Button>
          )}
          {loadingBypassStatusUpdate ? (
            <Button
              disabled
              variant="contained"
              className={clsx('text-12 px-6')}
            >
              Saving
            </Button>
          ) : (
            <Button
              onClick={() =>
                updateBypassStatusHandler(
                  combustionBypassStatusDetailData?.byPassId
                )
              }
              variant="contained"
              autoFocus
              disabled={errorGetDetailBypassStatus || loading}
              className={clsx(classes.saveButton, 'text-12 px-6')}
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BypassStatus;
