import {
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import { LocalOfferOutlined } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { id: 'tag_name', label: 'Tag Name', minWidth: 100, align: 'left' },
  { id: 'description', label: 'Description', minWidth: 170, align: 'left' },
  { id: 'value', label: 'Value', minWidth: 170, align: 'center' },
  {
    id: 'unit_meas',
    label: 'Unit Measurement',
    minWidth: 100,
    align: 'center',
  },
];

const createRuleData = (tag_name, value, description, unit_meas) => {
  return { tag_name, value, description, unit_meas };
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 360,
    border: '1px solid rgba(81, 81, 81, 1)',
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">
        <code>{children}</code>
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function Detail({ open = false, handleClose }) {
  const classes = useStyles();
  const { data } = useSelector((state) => state.combustionTagDetailReducer);

  const ruleData = data?.tags?.map((item) =>
    createRuleData(item.tag_name, item.value, item.description, item.unit_meas)
  );
  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          <LocalOfferOutlined /> {data?.variable || 'Detail Tag'}
        </DialogTitle>
        <DialogContent dividers>
          <div className="flex items-center flex-wrap gap-8 mb-8">
            <Typography>Rule:</Typography>
            <Typography>
              <pre>
                <code className={`whitespace-pre-line `}>
                  {data?.rule || 'Sorry, there is no rule available'}
                </code>
              </pre>
            </Typography>
          </div>
          <Typography gutterBottom>Tags:</Typography>
          <TableContainer component={Paper} className={classes.container}>
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
                {ruleData && ruleData?.length > 0 ? (
                  ruleData?.map((row) => (
                    <TableRow key={row.tag_name}>
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        className="text-10 xl:text-14 py-10"
                      >
                        {row.tag_name || '-'}
                      </TableCell>
                      <TableCell
                        align="left"
                        className="text-10 xl:text-14 py-10"
                      >
                        {row.description || '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-10"
                      >
                        {row.value ?? '-'}
                      </TableCell>
                      <TableCell
                        align="center"
                        className="text-10 xl:text-14 py-10"
                      >
                        {row.unit_meas || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                      className="text-10 xl:text-14 py-10"
                      colSpan={4}
                    >
                      Sorry, there is no tags available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  );
}
