import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
	root: {
		'& .logo-icon': {
			width: 60,
			height: 60,
			transition: theme.transitions.create(['width', 'height'], {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		},
		'& .react-badge, & .logo-text': {
			transition: theme.transitions.create('opacity', {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.easeInOut
			})
		}
	},
	reactBadge: {
		backgroundColor: '#121212',
		color: '#61DAFB'
	}
}));

const UNIT_NAME = process.env.REACT_APP_UNIT_NAME || 'Unit Name';

function Logo() {
	const classes = useStyles();

	return (
		<div className={clsx(classes.root, 'flex items-center')}>
			<img src="assets/images/logos/logo-pjb.svg" width={'100%'} className="w-88 md:w-128 lg:w-160 hidden sm:block" alt="logo" />
			<Typography className="text-8 md:text-12 xl:text-16 font-bold ml-10 logo-text" color="inherit">
				BOILER AUTO TUNING <br />
				{UNIT_NAME}
			</Typography>
		</div>
	);
}

export default Logo;
