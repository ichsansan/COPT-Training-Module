import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const Confirmation = ({
	open = false,
	title = 'Title',
	contentText = 'Confirmation content...',
	cancelHandler,
	confirmHandler,
	loading = false,
	confirmText = 'Confirm'
}) => {
	return (
		<Dialog fullWidth open={open} aria-labelledby="responsive-dialog-title">
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{contentText}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button disabled={loading} onClick={cancelHandler} variant="outlined" size="small" className="text-12">
					Cancel
				</Button>
				<Button
					onClick={confirmHandler}
					variant="contained"
					autoFocus
					size="small"
					className="text-12"
					color="secondary"
					disabled={loading}
				>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

Confirmation.defaultProps = {
	open: false,
	title: 'Title',
	contentText: 'Confirmation content...',
	confirmText: 'Confirm',
	cancelHandler: () => console.log('Close handler'),
	confirmHandler: () => console.log('Confirm handler'),
	loading: false
};

Confirmation.propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.string,
	confirmText: PropTypes.string,
	contentText: PropTypes.string,
	cancelHandler: PropTypes.func,
	confirmHandler: PropTypes.func,
	loading: PropTypes.bool
};

export default Confirmation;
