import { amber, blue, green } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { hideMessage } from 'app/store/fuse/messageSlice';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
	root: {},
	success: {
		backgroundColor: green[600],
		color: '#FFFFFF'
	},
	error: {
		backgroundColor: theme.palette.error.dark,
		color: theme.palette.getContrastText(theme.palette.error.dark)
	},
	info: {
		backgroundColor: blue[600],
		color: '#FFFFFF'
	},
	warning: {
		backgroundColor: amber[900],
		color: '#FFFFFF'
	}
}));

const variantIcon = {
	success: 'check_circle',
	warning: 'warning',
	error: 'error_outline',
	info: 'info'
};

function FuseMessage(props) {
	const dispatch = useDispatch();
	const state = useSelector(({ fuse }) => fuse.message.state);
	const options = useSelector(({ fuse }) => fuse.message.options);

	const classes = useStyles();

	useEffect(() => {
		const timer = setTimeout(() => {
			dispatch(hideMessage());
		}, 3000);
		return () => clearTimeout(timer);
	});

	return (
		<Snackbar
			{...options}
			open={state}
			classes={{
				root: classes.root
			}}
			ContentProps={{
				variant: 'body2',
				headlineMapping: {
					body1: 'div',
					body2: 'div'
				}
			}}
		>
			<SnackbarContent
				className={clsx(classes[options.variant])}
				message={
					<div className="flex items-center text-12 md:text-14 lg:text-16">
						{variantIcon[options.variant] && (
							<Icon fontSize="inherit" color="inherit">
								{variantIcon[options.variant]}
							</Icon>
						)}
						<Typography className="mx-8 text-11 md:text-12 lg:text-14">{options.message}</Typography>
					</div>
				}
				action={[
					<IconButton
						key="close"
						aria-label="Close"
						className=" text-11 md:text-12 lg:text-14"
						color="inherit"
						onClick={() => dispatch(hideMessage())}
					>
						<Icon fontSize="inherit">close</Icon>
					</IconButton>
				]}
			/>
		</Snackbar>
	);
}

export default React.memo(FuseMessage);